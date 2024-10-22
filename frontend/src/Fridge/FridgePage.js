import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './FridgePage.css'

const FridgePage = () => {
  const [foods, setFoods] = useState([]);
  const [name, setName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [quantity, setQuantity] = useState('');

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
        <h1>Fridge Page</h1>
        
        {/* Add food item form */}
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

        {/* display */}
        <ul>
          {foods.map((food) => (
            <li key={food.id}>
              <span>{food.name} - {food.quantity} grams (Expires on: {food.expirationDate})</span>
              <button onClick={() => removeFoodItem(food.id)}>Remove</button>
              {isNearExpiration(food.expirationDate) && <span>⚠️ Expiring Soon!</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FridgePage;
