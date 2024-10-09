import { hasFormSubmit } from '@testing-library/user-event/dist/utils';
import React, { useState, useEffect } from 'react';

const FridgePage = () => {
  const [foods, setFoods] = useState([]);
  const [name, setName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [suggestedExpirationTime, setSuggestedExpirationTime] = useState('');
  const [suggestedType, setsuggestedType] = useState('');
  const Category = {
    fruit: "fruit",
    vegetables: "Vegetables",
    meat: "meat",
    dairy: "dairy",
    beverage: "beverage",


  }

  //get suggested info after finish typing
  const typingDelay = 1500;         // Time in milliseconds (1 second)
  useEffect(() => {
    const API_KEY = "AIzaSyAfMibENQ8SWNYIxgIqN2-9NvKtaqdRvQ4"
    async function run() {
      const {
        GoogleGenerativeAI
      } = require("@google/generative-ai");
  
      const genAI = new GoogleGenerativeAI(API_KEY);
    
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });
    
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      };
      const chatSession = model.startChat({
        generationConfig,
        // safetySettings: Adjust safety settings
        // See https://ai.google.dev/gemini-api/docs/safety-settings
        history: [
        ],
      });
      const result = await chatSession.sendMessage("Give me the category of " + name + " as a kind of food, and the number of days (give a single definitive number, as a string) before it expires when stored in a regular fridge");
      console.log(result.response.text());
      const json = JSON.parse(result.response.text());
      const values = [];
      for (let key in json) {
          values.push(json[key]);
      }
      setsuggestedType(values[0]);
      setSuggestedExpirationTime(values[1]);
    }

    if (name) {
        const timer = setTimeout(() => {
            run(); // Call the function after the delay
            }, typingDelay);
        // Cleanup the timer on component unmount or when name changes
        return () => clearTimeout(timer);
    }
}, [name]); // Effect runs whenever 'name' changes


  // add functionality
  const addFoodItem = () => {
    const newItem = {
      name,
      expirationDate,
      quantity,
      id: Date.now() // unique id for each item
    };
    setFoods([...foods, newItem]);
    setName('');
    setExpirationDate('');
    setQuantity('');
  };

  // remove functioncality
  const removeFoodItem = (id) => {
    setFoods(foods.filter(food => food.id !== id));
  };

  //

  // Check if the food is close to expiration (3 days or less)
  const isNearExpiration = (date, threshold = 3) => {
    const expiration = new Date(date);
    const today = new Date();
    const differenceInTime = expiration.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays <= threshold;
  };

  //time-date related helper method
  function formatDateToYYYYMMDD(date) {
    // Extract the year, month, and day from the Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so we add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function displayExpirationDate(food) {
    const today = new Date();
    const expirationDate = new Date(food.expirationDate);
    if (isNearExpiration(food.expirationDate, 7)) {
      return "in " + Math.round((expirationDate.getTime() - today.getTime())/(1000 * 3600 * 24)) + " days";
    } else {
      let date = formatDateToYYYYMMDD(expirationDate);
      return "on " + String(date.slice(0,4) == today.getFullYear() ? date.slice(5) : date);
    }
  }

  function parseSuggestedDays() {
    let date = new Date();
    const re = new RegExp("^.+-.+$");
    let suggestedDays = 0;
    console.log(re.test(suggestedExpirationTime));
    if (re.test(suggestedExpirationTime)) {
      suggestedDays = (Number(suggestedExpirationTime[0]) + Number(suggestedExpirationTime[2]))/2;
    } else {
      suggestedDays = Number(suggestedExpirationTime);
    }
    date.setDate(date.getDate() + suggestedDays);
    return formatDateToYYYYMMDD(date);
  }


  return (
    <div>
      <h1>Fridge Page</h1>

      {/* Add food item form */}
      <div>
        <input 
          type="text" 
          placeholder="Food Name" 
          value={name} 
          onChange={(e) => {
            setName(e.target.value)
        }} 
        />
        <input 
          type="date" 
          value={expirationDate} 
          onChange={(e) => setExpirationDate(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Quantity (grams)" 
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)} 
        />
        <button onClick={addFoodItem}>Add Food Item</button>
      </div>
      <div>
        <p>Suggested expiration time in days: {suggestedExpirationTime}</p>
        <button onClick={() => setExpirationDate(parseSuggestedDays())}>confirm</button>
        <p>Suggested category: {suggestedType}</p>
      </div>

      {/* display */}
      <ul>
        {foods.map((food) => (
          <li key={food.id}>
            <span>{food.name} - {food.quantity} grams (Expires {displayExpirationDate(food)})</span>
            <button onClick={() => removeFoodItem(food.id)}>Remove</button>
            {isNearExpiration(food.expirationDate) && <span>⚠️ Expiring Soon!</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FridgePage;