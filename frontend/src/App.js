import logo from './logo.svg';
import './App.css';
import React from "react"

function App() {
  const [recipeText, setRecipeText] = React.useState("Recipe goes here!");

  async function run() {
    const {
      GoogleGenerativeAI
    } = require("@google/generative-ai");
  
    const apiKey = "ask Ethan for the api key";
    const genAI = new GoogleGenerativeAI(apiKey);
  
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
  
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
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
    setRecipeText(result.response.text());
  }

  return (
    <div className="App">
      <h1>AI sandbox</h1>
      <button onClick={run}>Click me!</button>
      <p>{recipeText}</p>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
