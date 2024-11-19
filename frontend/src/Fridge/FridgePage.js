import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './FridgePage.module.css';
import closedFridge from '../closed_fridge.png';
import openFridge from './open_fridge.png';

import axios from 'axios';

const FridgePage = () => {
  const [fridge, setFridge] = useState('');

  const [foods, setFoods] = useState([]);
  const [name, setName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('');
  const [isInFreezer, setIsInFreezer] = useState(false);
  const [suggestedExpirationTime, setSuggestedExpirationTime] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState('');
  const [queryOption, setQueryOption] = useState('');
  const [isFridgeOpen, setIsFridgeOpen] = useState(false);
  const [isViewSelected, setIsViewSelected] = useState(false);
  const [isAddSelected, setIsAddSelected] = useState(false);
  const [foodSearchedName, setFoodSearchedName] = useState('');
  const [foodsSearched, setFoodsSearched] = useState([]);

  useEffect(() => {
    const username = localStorage.getItem("username");
    axios.get("http://127.0.0.1:5000/get_fridges?username="+username)
      .then((response) => {
        if (response.data.success) {
          const fridges = response.data.fridges;
          if (fridges.length == 0) {
            axios.post("http://127.0.0.1:5000/add_fridge", {
              username: localStorage.getItem("username"),
              name: "My first fridge"
            }).then(
              axios.get("http://127.0.0.1:5000/get_fridges?username="+username)
              .then((response) => {
                if (response.data.success) {
                  const fridges = response.data.fridges;
                  setFridge(fridges[0]);
                }
              })
              .catch((error) => alert(error))
            );
            } else {
              setFridge(fridges[0]);
            }
        }
      })
  }, []);

  const FridgeCategories = {
    DAIRY: 'Dairy Products',
    FRUITS: 'Fruits',
    VEGETABLES: 'Vegetables',
    MEATS: 'Meats, Poultry, and Fish',
    EGGS: 'Eggs and Egg Products',
    CONDIMENTS_AND_SPREADS: 'Condiments, Sauces and Spreads',
    BEVERAGES: 'Beverages',
    LEFTOVERS_AND_PREPARED: 'Leftovers and Pre-Cooked Meals',
    OTHERS: 'Other Items',
  };

  const toggleFridge = async () => {
    if (!isFridgeOpen) {
      await axios.get("http://127.0.0.1:5000/get_fridge_contents?fridgeID="+fridge.fridgeID)
        .then((response) => {
          if (response.data.success) {
            setFoods(response.data.items);
          } else {
            alert(fridge.name);
          }
        })
    }
    setIsFridgeOpen(!isFridgeOpen);
  };

  const addFoodItem = async () => {
    const response = await axios
      .post("http://127.0.0.1:5000/add_fridge_content", {
        username: localStorage.getItem("username"),
        fridgeID: fridge.fridgeID,
        quantity: quantity,
        unit: unit,
        expirationDate: expirationDate,
        name: name,
        category: category,
        isInFreezer: isInFreezer ? 1 : 0
      });
      
    if (response.data.success) {
      axios.get("http://127.0.0.1:5000/get_fridge_contents?fridgeID="+fridge.fridgeID)
        .then((response) => {
          if (response.data.success) {
            setFoods(response.data.items);
          }
        });

      setName('');
      setExpirationDate('');
      setQuantity('');
      setCategory('');
      setSuggestedExpirationTime('');
      setSuggestedCategory('');
      setIsInFreezer(false);
    }
  };

  const confirmSuggestion = () => {
    if (suggestedExpirationTime) {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + Number(suggestedExpirationTime));
      setExpirationDate(newDate.toISOString().split('T')[0]);
    }
    setCategory(suggestedCategory);
  };

  // Integrate Google Generative AI for suggestion functionality
  useEffect(() => {
    const API_KEY = "AIzaSyBdWGJbElVGJdovFYym4c_WEuTVvr0HQmo";
    const typingDelay = 1500;

    const fetchSuggestions = async () => {
      if (name) {
        try {
          const { GoogleGenerativeAI } = require("@google/generative-ai");
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
                  description: "Select one value from the list",
                },
                expiration_date: {
                  type: "integer",
                },
              },
              required: ["fridge_category", "expiration_date"],
            },
          };

          const chatSession = model.startChat({ generationConfig });
          const result = await chatSession.sendMessage(
            `Give me the category of ${name} as a kind of food, and the number of days before it expires when stored in a regular fridge`
          );
          const json = JSON.parse(result.response.text());
          setSuggestedCategory(json["fridge_category"]);
          setSuggestedExpirationTime(json["expiration_date"]);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestedCategory('');
        setSuggestedExpirationTime('');
      }
    };

    const timer = setTimeout(fetchSuggestions, typingDelay);

    return () => clearTimeout(timer);
  }, [name]);

  const searchFoodItem = () => {
    const results = foods.filter((food) =>
      food.name.toLowerCase().includes(foodSearchedName.toLowerCase())
    );
    setFoodsSearched(results);
  };

  const deleteFoodItem = async (id) => {
    alert(id);
    const response = await axios
      .delete("http://127.0.0.1:5000/delete_fridge_content", {
        data: {
          fridgeID: fridge.fridgeID,
          itemID: id
        }
      })
      .catch((error) => {
        alert(error.message);
        return;
      });
      
    if (response.data.success) {
      axios.get("http://127.0.0.1:5000/get_fridge_contents?fridgeID="+fridge.fridgeID)
        .then((response) => {
          if (response.data.success) {
            setFoods(response.data.items);
          } else {
            alert("oops, items bugged");
          }
        });
    }
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h2 className={styles.header}>{fridge.name}</h2>

      {isViewSelected && <div className={styles.sortSection}>
        <span>Sort by:</span>
        <select
          name="sort_foods"
          value={queryOption}
          onChange={(e) => setQueryOption(e.target.value)}
        >
          <option value="" disabled>Select an option</option>
          {['name', 'expirationDate', 'quantity', 'unit', 'category', 'isInFreezer'].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <button onClick={() => {
          const sortedFoods = [...foods].sort((a, b) =>
            String(a[queryOption]).localeCompare(String(b[queryOption]))
          );
          setFoods(sortedFoods);
        }}>Sort</button>
      </div>}

      <div className={styles.fridgeWrapper}>
        <div className={styles.fridgeContainer}>
          <img
            src={isFridgeOpen ? openFridge : closedFridge}
            alt="Fridge"
            className={styles.fridgeImage}
            onClick={toggleFridge}
          />
        {isFridgeOpen && (
          <>
          <br></br>
          <button onClick={() => {
            setIsAddSelected(!isAddSelected);
          }}>Add</button>
          <br></br>
          <button onClick={() => {
            setIsViewSelected(!isViewSelected);
          }}>View</button>
          </>
        )}
        </div>
        {isFridgeOpen && (
          <div className={styles.foodGrid}>
            {foods.map((food) => (
              <div key={food.itemID} className={styles.foodItem}>
                <span>{`${food.name} - ${food.quantity} ${food.unit}, ${formatDate(food.expirationDate)}`}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAddSelected && (
        <div className={styles.userInput}>
          <div className={styles.inlineForm}>
            <input
              type="text"
              placeholder="Food Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <select name="unit" 
              type="number"
              onChange={(e) => setUnit(e.target.value)}
            >
              <option disabled selected value>--Select an Option--</option>
              <option value="g">Grams</option>
              <option value="kg">Kilograms</option>
              <option value="mL">Mililiters</option>
              <option value="L">Liters</option>
              <option value="tsp">Teaspoons</option>
              <option value="tbsp">Tablespoons</option>
              <option value="c">Cups</option>
              <option value="pt">Pints</option>
              <option value="qt">Quarts</option>
              <option value="gal">Gallons</option>
              <option value="oz">Ounces</option>
              <option value="fl-oz">Fluid ounces</option>
              <option value="lb">Pounds</option>
              <option value="unit(s)">Units</option>
            </select>
            <label>In Freezer?</label>
            <input
              type="checkbox"
              checked={isInFreezer}
              onChange={() => setIsInFreezer(!isInFreezer)}
            />
          </div>

          <div className={styles.inlineForm}>
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>Select category</option>
              {Object.values(FridgeCategories).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              disabled={isInFreezer}
            />
          </div>

          <span>Suggested expiration time in days: {suggestedExpirationTime}</span>
          <span>Suggested category: {suggestedCategory}</span>
          <button onClick={confirmSuggestion}>Confirm Suggestion</button>
          <button onClick={addFoodItem}>Add Food Item</button>
        </div>
      )}

      {isViewSelected && <div className={styles.searchBar}>
        <h3>Search the name of an item to modify</h3>
        <input
          type="text"
          placeholder="Search Food Item"
          value={foodSearchedName}
          onChange={(e) => setFoodSearchedName(e.target.value)}
        />
        <button onClick={searchFoodItem}>Search</button>
        <ul>
          {foodsSearched.map((food) => (
            <li key={food.itemID} className={styles.foodSearch}>
              <p>Information of {food.name}</p>
              <span>{food.name} -- {food.quantity} {food.unit}</span>
              <span>Created at {food.creationDate}</span>
              <span>Expires on: {formatDate(food.expirationDate)}</span>
              <button onClick={() => deleteFoodItem(food.itemID)}>Delete this food item</button>
            </li>
          ))}
        </ul>
      </div>
      }
    </div>
  );
};

export default FridgePage;
