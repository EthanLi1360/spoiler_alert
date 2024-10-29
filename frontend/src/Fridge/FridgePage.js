import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./FridgePage.css";

const FridgePage = () => {
  const [food, setFood] = useState({
    CreateDate: Date.now(), // the created Date of the food.
    name: "",
    expirationDate: "",
    quantity: "",
  });
  const [foods, setFoods] = useState([]);
  // Searching functionalities
  const [foodSearchedName, setfoodSearchedName] = useState("");
  const [foodsSearched, setFoodsSearched] = useState([]);

  // add functionality
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
        foods[i].quantity += food.quantity;
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

  // remove functioncality
  const removeFoodItemByCreateDate = () => {
    setFoods(foods.filter((f) => f.CreateDate !== food.CreateDate));
    setFoodsSearched(foodsSearched.filter((f) => f.name !== foodSearchedName));
  };

  const removeFoodItemByName = (name) => {
    setFoods(foods.filter((food) => food.name == name));
  };

  // Check if the food is close to expiration (3 days or less)
  const isNearExpiration = (date) => {
    const expiration = new Date(date);
    const today = new Date();
    const differenceInTime = expiration.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays <= 3;
  };


  // Search the food item in foods and store it in the foodSearched
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

  return (
    <div className="container">
      <Navbar />
      <div>
        <h1>Fridge Page</h1>
        {/* Add food item form */}
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
          <button className="addfood" onClick={addFoodItem}>Add Food Item</button>
        </div>

        {/*search*/}
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
        {/* display */}
        <ul>
          {foods.map((food) => (
            <li key={food.CreateDate}>
              <p>{food.name}</p>
              <span>
                {food.name} - {food.quantity} grams (Expires on:
                {food.expirationDate})
              </span>
              <span>
                {isNearExpiration(food.expirationDate)
                  ? "⚠️ Expiring Soon!"
                  : ""}
              </span>
              <button
                onClick={() => removeFoodItemByCreateDate(food.CreateDate)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FridgePage;
