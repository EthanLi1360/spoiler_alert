import { getCachedBackendUrl } from '../Util';

export async function generate(prompt) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');

  // Fetch API key from backend using dynamic port discovery
  let apiKey;
  try {
    const backendUrl = await getCachedBackendUrl();
    const response = await fetch(`${backendUrl}/get_gemini_api_key`);
    const data = await response.json();

    if (data.success) {
      apiKey = data.api_key;
    } else {
      throw new Error(data.error || 'Failed to get API key');
    }
  } catch (error) {
    console.error('Error fetching Gemini API key:', error);
    throw error;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  const generationConfig = {
    temperature: 1.2,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'application/json',
    responseSchema: {
      type: 'object',
      properties: {
        recipe_name: {
          type: 'string',
        },
        ingredients: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ingredient_name: {
                type: 'string',
              },
              ingredient_quantity: {
                type: 'number',
              },
              notes: {
                type: 'string',
              },
              units: {
                type: 'string',
              },
            },
            required: ['ingredient_name', 'ingredient_quantity'],
          },
        },
        directions: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        notes: {
          type: 'string',
        },
      },
      required: ['recipe_name', 'ingredients', 'directions'],
    },
  };

  const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [],
  });

  let returnValue = null;
  await chatSession
    .sendMessage(prompt)
    .then((result) => {
      const resultText = result.response.text();
      const json = JSON.parse(resultText);
      json.id = Date.now();
      returnValue = json;
    })
    .catch((error) => {
      console.error('Gemini API Error:', error);

      // Check for rate limit errors
      if (
        (error.message && error.message.includes('quota')) ||
        error.message.includes('rate limit') ||
        error.message.includes('429')
      ) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      } else if (error.message && error.message.includes('API key')) {
        throw new Error('INVALID_API_KEY');
      } else {
        throw new Error('API_ERROR');
      }
    });
  return returnValue;
}
