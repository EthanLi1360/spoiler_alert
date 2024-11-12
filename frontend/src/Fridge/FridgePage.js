import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './FridgePage.module.css';
import closedFridge from '../closed_fridge.png';
import openFridge from './open_fridge.png';

const FridgePage = () => {
  const [foods, setFoods] = useState([]);
  const [name, setName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [isInFreezer, setIsInFreezer] = useState(false);
  const [suggestedExpirationTime, setSuggestedExpirationTime] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState('');
  const [queryOption, setQueryOption] = useState('');
  const [isFridgeOpen, setIsFridgeOpen] = useState(false);
  const [foodSearchedName, setFoodSearchedName] = useState('');
  const [foodsSearched, setFoodsSearched] = useState([]);

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

  const toggleFridge = () => {
    setIsFridgeOpen(!isFridgeOpen);
  };

  const addFoodItem = () => {
    const newItem = {
      name,
      expirationDate,
      quantity,
      category,
      isInFreezer,
      id: Date.now(),
    };
    setFoods([...foods, newItem]);
    setName('');
    setExpirationDate('');
    setQuantity('');
    setCategory('');
    setSuggestedExpirationTime('');
    setSuggestedCategory('');
    setIsInFreezer(false);
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

  const deleteFoodItem = (id) => {
    const updatedFoods = foods.filter(food => food.id !== id);
    setFoods(updatedFoods);
    setFoodsSearched(foodsSearched.filter(food => food.id !== id));
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h2 className={styles.header}>My Fridge</h2>

      <div className={styles.sortSection}>
        <span>Sort by:</span>
        <select
          name="sort_foods"
          value={queryOption}
          onChange={(e) => setQueryOption(e.target.value)}
        >
          <option value="" disabled>Select an option</option>
          {['name', 'expirationDate', 'quantity', 'category', 'isInFreezer'].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <button onClick={() => {
          const sortedFoods = [...foods].sort((a, b) =>
            String(a[queryOption]).localeCompare(String(b[queryOption]))
          );
          setFoods(sortedFoods);
        }}>Sort</button>
      </div>

      <div className={styles.fridgeWrapper}>
        <div className={styles.fridgeContainer}>
          <img
            src={isFridgeOpen ? openFridge : closedFridge}
            alt="Fridge"
            className={styles.fridgeImage}
            onClick={toggleFridge}
          />
        </div>
        {isFridgeOpen && (
          <div className={styles.foodGrid}>
            {foods.map((food) => (
              <div key={food.id} className={styles.foodItem}>
                <span>{`${food.name} - ${food.quantity} grams, ${formatDate(food.expirationDate)}`}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isFridgeOpen && (
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
              placeholder="Quantity (grams)"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
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

      <div className={styles.searchBar}>
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
            <li key={food.id} className={styles.foodSearch}>
              <p>Information of {food.name}</p>
              <span>{food.name} -- {food.quantity} grams</span>
              <span>Created at {food.creationDate}</span>
              <span>Expires on: {formatDate(food.expirationDate)}</span>
              <button onClick={() => deleteFoodItem(food.id)}>Delete this food item</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FridgePage;
