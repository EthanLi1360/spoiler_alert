import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import './FridgePage.css'

const FridgePage = () => {
  const [foods, setFoods] = useState([]);
  const [name, setName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('')
  const [isInFreezer, setIsInFreezer] = useState(false)
  const [suggestedExpirationTime, setSuggestedExpirationTime] = useState('');
  const [suggestedCategory, setsuggestedCategory] = useState('');
  const [queryOption, setqueryOption] = useState('');
  const FridgeCategories = Object.freeze({
    DAIRY: "Dairy Products",
    FRUITS: "Fruits",
    VEGETABLES: "Vegetables",
    MEATS: "Meats, Poultry, and Fish",
    EGGS: "Eggs and Egg Products",
    CONDIMENTS_AND_SPREADS: "Condiments, Sauces and Spreads",
    BEVERAGES: "Beverages",
    LEFTOVERS_AND_PREPARED: "Leftovers and Pre-Cooked Meals",
    OTHERS: "Other Items"
  });
  const food_attribute = ['name', 'expirationDate', 'quantity', 'category', 'isInFreezer', 'id']
  

  // add functionality
  const addFoodItem = () => {
    const newItem = {
      name,
      expirationDate,
      quantity,
      category,
      isInFreezer,
      id: Date.now() // unique id for each item
    };
    setFoods([...foods, newItem]);
    setName('');
    setExpirationDate('');
    setQuantity('');
    setCategory('');
    setSuggestedExpirationTime('');
    setsuggestedCategory('');
    setIsInFreezer(false);
  };

  // remove functioncality
  const removeFoodItem = (id) => {
    setFoods(foods.filter(food => food.id !== id));
  };

  //take food in or out of the freezer
  const toogleFreezer = (id) => {
    const food = foods.find(food => food.id == id);
    food.isInFreezer = !food.isInFreezer;
    setFoods(foods.filter(food => true));
  }

  //get suggested info after finish typing
  const typingDelay = 1500;         // Time in milliseconds (1 second)
  useEffect(() => {
    const API_KEY = "AIzaSyBdWGJbElVGJdovFYym4c_WEuTVvr0HQmo"
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
        responseSchema: {
          type: "object",
          properties: {
            fridge_category: {
              type: "string",
              enum: Object.values(FridgeCategories),
              description: "Select one value from the list"
            },
            expiration_date: {
              type: "integer"
            }
          },
          required: [
            "fridge_category",
            "expiration_date"
          ]
        }
      };
      const chatSession = model.startChat({
        generationConfig,
        // safetySettings: Adjust safety settings
        // See https://ai.google.dev/gemini-api/docs/safety-settings
        history: [
        ],
      });
      const result = await chatSession.sendMessage("Give me the category of " + name + " as a kind of food, and the number of days before it expires when stored in a regular fridge");
      console.log(result.response.text());
      const json = JSON.parse(result.response.text());
      setsuggestedCategory(json["fridge_category"]);
      setSuggestedExpirationTime(json["expiration_date"]);
    }

    if (name) {
        const timer = setTimeout(() => {
            run(); // Call the function after the delay
            }, typingDelay);
        // Cleanup the timer on component unmount or when name changes
        return () => clearTimeout(timer);
    }
}, [name]); // Effect runs whenever 'name' changes

// Check if the food is close to expiration (3 days or less)
const isNearExpiration = (date, threshold = 3) => {
  const expiration = new Date(date);
  const today = new Date();
  const differenceInTime = expiration.getTime() - today.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return differenceInDays <= threshold;
};

//followings are some time-date related helper methods
function formatDateToYYYYMMDD(date) {
  // Extract the year, month, and day from the Date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so we add 1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function displayExpirationDate(food) {
  if (food.isInFreezer) {
    return "In Freezer";
  } else {
    const today = new Date();
    const expirationDate = new Date(food.expirationDate);
    if (isNearExpiration(food.expirationDate, 7)) {
      return "Expires in " + Math.round((expirationDate.getTime() - today.getTime())/(1000 * 3600 * 24)) + " days";
    } else {
      let date = formatDateToYYYYMMDD(expirationDate);
      return "Expires on: " + String(date.slice(0,4) == today.getFullYear() ? date.slice(5) : date);
    }
  }
}

function dateAfterSuggested() {
  let date = new Date();
  date.setDate(date.getDate() + Number(suggestedExpirationTime));
  return formatDateToYYYYMMDD(date);
}

  return (
    <div className='container'>
      <Navbar />
      <div>
        <h1>Fridge Page</h1>
        
        {/* Add food item form */}
        <div class="user_input">
          <input 
            type="text" 
            placeholder="Food Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
          />
          <div class='inputbox'>
            <input 
              type="date" 
              value={expirationDate} 
              onChange={(e) => setExpirationDate(e.target.value)}
              disabled={isInFreezer}
            />
            <span>Suggested expiration time in days: {suggestedExpirationTime}</span>
            <input
              type="checkbox"
              checked={isInFreezer}
              onClick={() => setIsInFreezer(!isInFreezer)}
            />Put in Freezer
          </div>
          <input 
            type="number" 
            placeholder="Quantity (grams)" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
          />
          <div class='inputbox'>
            <select name="category" id="category" onChange={(e) => setCategory(e.target.value)} value={category}>
            <option value="" disabled>Select an option</option>
            {Object.values(FridgeCategories).map((option) => (
              <option value={option}>{option}</option>
            ))}
            </select>
            <span>Suggested category: {suggestedCategory}</span>
          </div>
          <br></br>
          <button onClick={() => {
          setExpirationDate(dateAfterSuggested())
          setCategory(suggestedCategory)
          }}>Confirm Suggestion</button>
          <button onClick={addFoodItem}>Add Food Item</button>
        </div>

        {/* display */}
        <div class='search_bar'>
          <span style={{color: "white"}}>Display fridge according to</span>
          <select name="sort_foods" id="sort_foods" value={queryOption} onChange={(e) => {setqueryOption(e.target.value)}} >
              <option value="" disabled>Select an option</option>
              {food_attribute.map((option) => (
                <option value={option}>{option}</option>
              ))}
          </select>
          <button onClick={() => {
            foods.sort((a,b) => String(a[queryOption]).localeCompare(String(b[queryOption])));
            setFoods(foods.filter(food => true));
            }}>Sort</button>
          <button >Search</button>
        </div>
        
        <ul>
          {foods.map((food) => (
            <li key={food.id}>
              <span>{food.name} - {food.quantity} grams ({displayExpirationDate(food)})</span>
              <button onClick={() => removeFoodItem(food.id)}>Remove</button>
              <button onClick={() => toogleFreezer(food.id)}>{food.isInFreezer ? "Take out of Freezer" : "Put in Freezer"}</button>
              {!food.isInFreezer && isNearExpiration(food.expirationDate) && <span>⚠️ Expiring Soon!</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FridgePage;
