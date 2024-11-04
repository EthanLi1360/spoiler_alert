import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './FridgePage.css';
import closedFridge from './closed_fridge.png';
import openFridge from './open_fridge.png';

const FridgePage = () => {
  const [food, setFood] = useState({
    CreateDate: Date.now(), // the created Date of the food.
    name: "",
    expirationDate: "",
    quantity: "",
  });
  const [foods, setFoods] = useState([]);
  const [name, setName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isFridgeOpen, setIsFridgeOpen] = useState(false); // tracking if fridge is open or closed

  // Searching functionalities
  const [foodSearchedName, setfoodSearchedName] = useState("");
  const [foodsSearched, setFoodsSearched] = useState([]);

  // Toggle fridge state
  const toggleFridge = () => {
    setIsFridgeOpen(!isFridgeOpen);
  };

  // add food functionality
  const addFoodItem = () => {
    setFood({ CreateDate: Date.now(), ...food });
    if (foods.length == 0) {
      setFoods([...foods, food]);
      alert(
        `Successfully added ${food.name} of ${food.quantity}! ${
          isNearExpiration ? "Near Expiration !" : ""
        }`
      );
    }
    for (let i = 0; i < foods.length; i++) {
      if (food.name == foods[i].name) {
        foods[i].quantity = Number(foods[i].quantity) + Number(food.quantity);
        alert(
          `You have already added ${food.name}, you now have ${foods[i].quantity} amount of ${food.name}`
        );
        break;
      } else {
        setFoods([...foods, food]);
        alert(
          `Successfully added ${food.name} of ${food.quantity}! ${
            isNearExpiration ? "Near Expiration !" : ""
          }`
        );
      }
    }
  };

  // remove food item functionality
  const removeFoodItem = (id) => {
    setFoods(foods.filter(food => food.id !== id));
  };

  const removeFoodItemByCreateDate = () => {
    setFoods(foods.filter((f) => f.CreateDate !== food.CreateDate));
    setFoodsSearched(foodsSearched.filter((f) => f.name !== foodSearchedName));
  };

  const removeFoodItemByName = (name) => {
    setFoods(foods.filter((food) => food.name == name));
  };

  const SearchFoodItem = () => {
    let temp = foods.find((food) => food.name === foodSearchedName);
    console.log(temp);
    if (temp) {
      setFoodsSearched([...foodsSearched, {
        CreateDate: temp.CreateDate, // the created Date of the food.
        name: temp.name,
        expirationDate: temp.expirationDate,
        quantity: temp.quantity,
      }]);
    }
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
          <>
            <div>
              <input
                type="text"
                placeholder="Food Name"
                value={food.name}
                onChange={(e) => setFood({ ...food, name: e.target.value })}
              />
              <input
                type="date"
                value={food.expirationDate}
                onChange={(e) =>
                  setFood({ ...food, expirationDate: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Quantity (grams)"
                value={food.quantity}
                onChange={(e) => setFood({ ...food, quantity: e.target.value })}
              />
              <button onClick={addFoodItem}>Add Food Item</button>
            </div>

            <div className="modifyItems">
              <h3>Search the name of an item to modify</h3>
              <input
                type="text"
                onChange={(e) => setfoodSearchedName(e.target.value)}
              />
              <button onClick={SearchFoodItem}> Search</button>
              {/*pop up the foodSearched*/}
              <ul>
                {foodsSearched.map((foodSearched) => (
                  <li key={foodSearched.CreateDate} className="foodSearch">
                    <p>Information of {foodSearched.name}</p>
                    <span>
                      {foodSearched.name} -- {foodSearched.quantity} grams
                    </span>
                    <span>
                      {foodSearched.name} -- Created at {foodSearched.CreateDate}
                    </span>
                    <span>
                      {foodSearched.name} -- Expires on:{" "}
                      {foodSearched.expirationDate}
                    </span>
                    <button
                      onClick={() =>
                        removeFoodItemByCreateDate(foodSearched.CreateDate)
                      }
                    >
                      Delete this food item
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FridgePage;
