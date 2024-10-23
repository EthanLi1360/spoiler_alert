import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './FridgePage.css';
import closedFridge from './closed_fridge.png';
import openFridge from './open_fridge.png';

const FridgePage = () => {
  const [foods, setFoods] = useState([]);
  const [name, setName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isFridgeOpen, setIsFridgeOpen] = useState(false); // tracking if fridge is open or closed

  // Toggle fridge state
  const toggleFridge = () => {
    setIsFridgeOpen(!isFridgeOpen);
  };

  // add food functionality
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

  // remove food item functionality
  const removeFoodItem = (id) => {
    setFoods(foods.filter(food => food.id !== id));
  };

  // Check if the food is close to expiration (3 days or less)
  const isNearExpiration = (date) => {
    const expiration = new Date(date);
    const today = new Date();
    const differenceInTime = expiration.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays <= 3;
  };

  return (
    <div className='container'>
      <Navbar />
      <div>
        <h1>My Fridge</h1>

        {/* Toggle between closed and open fridge */}
        <div className="fridge-container">
          <img
            src={isFridgeOpen ? openFridge : closedFridge}
            alt="Fridge"
            className="fridge-image"
            onClick={toggleFridge}
          />

          {/* If the fridge is open, show the grid of food items */}
          {isFridgeOpen && (
            <div className="food-items">
              {foods.map((food) => (
                <div key={food.id} className="food-item">
                  <span>{food.name}</span>
                  <span>{food.quantity} grams</span>
                  <span>Expires on: {food.expirationDate}</span>
                  {isNearExpiration(food.expirationDate) && <span>⚠️ Expiring Soon!</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Show the form only when the fridge is open */}
        {isFridgeOpen && (
          <div>
            <input
              type="text"
              placeholder="Food Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
        )}
      </div>
    </div>
  );
};

export default FridgePage;
