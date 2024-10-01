import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [recipeTitle, setRecipeTitle] = useState("Recipe goes here!");
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [recipeDirections, setRecipeDirections] = useState([]);
  const [recipeNotes, setRecipeNotes] = useState("Recipe goes here!");
  const [recipeText, setRecipeText] = useState("Recipe goes here!");

  async function run() {
    const {
      GoogleGenerativeAI
    } = require("@google/generative-ai");
  
    const apiKey = "ask Ethan for API key";
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

    const result = await chatSession.sendMessage("Please give me a random recipe!");
    console.log(result.response.text());
    const json_obj = JSON.parse(result.response.text());
    setRecipeTitle(json_obj.recipe_name);
    setRecipeIngredients(json_obj.ingredients);
    setRecipeDirections(json_obj.directions);
    setRecipeNotes(json_obj.notes);
    setRecipeText(result.response.text());
  }

  return (
    <div className="App">
      <h1>AI sandbox</h1>
      <button onClick={run}>Click me!</button>
      <h1>{recipeTitle}</h1>
      {recipeIngredients.map(ingredient =>
        <p>{ingredient.ingredient_name} {ingredient.ingredient_quantity} {ingredient.units}</p>
      )}
      <h2>Directions</h2>
      {recipeDirections.map(direction =>
        <p>{direction}</p>
      )}
      <h2>Notes</h2>
      <p>{recipeNotes}</p>
      <h2>Raw JSON</h2>
      <p>{recipeText}</p>
    </div>
  );
}

export default App;
