export async function generate(prompt) {
    const {
      GoogleGenerativeAI
    } = require("@google/generative-ai");
  
    const apiKey = "GENERATEKEY";
    const genAI = new GoogleGenerativeAI(apiKey);
  
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
  
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          recipe_name: {
            type: "string"
          },
          ingredients: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ingredient_name: {
                  type: "string"
                },
                ingredient_quantity: {
                  type: "number"
                },
                notes: {
                  type: "string"
                },
                units: {
                  type: "string"
                }
              },
              required: [
                "ingredient_name",
                "ingredient_quantity"
              ]
            }
          },
          directions: {
            type: "array",
            items: {
              type: "string"
            }
          },
          notes: {
            type: "string"
          }
        },
        required: [
          "recipe_name",
          "ingredients",
          "directions"
        ]
      },
    };

    const chatSession = model.startChat({
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
      ],
    });

    const result = await chatSession.sendMessage(prompt);
    const json_obj = JSON.parse(result.response.text());
    return json_obj;
  }