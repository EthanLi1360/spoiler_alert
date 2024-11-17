import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './FridgePage.module.css';
import closedFridge from '../closed_fridge.png';
import openFridge from './open_fridge.png';
import {
  getFridgeContents,
  addFridgeContent,
  updateFridgeContent,
  deleteFridgeContent,
} from '../api/axios';

const FridgePage = ({ fridgeID }) => {
  const [foods, setFoods] = useState([]);
  const [name, setName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [isInFreezer, setIsInFreezer] = useState(false);
  const [isFridgeOpen, setIsFridgeOpen] = useState(false);
  const [foodSearchedName, setFoodSearchedName] = useState('');
  const [foodsSearched, setFoodsSearched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchFridgeContents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getFridgeContents(fridgeID);
        if (response.success) {
          setFoods(response.items);
        } else {
          setError('Failed to fetch fridge contents');
        }
      } catch (err) {
        setError('An error occurred while fetching fridge contents');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFridgeContents();
  }, [fridgeID]);

  const toggleFridge = () => {
    setIsFridgeOpen(!isFridgeOpen);
  };

  const addFoodItem = async () => {
    const newItem = {
      fridgeID,
      name,
      expirationDate,
      quantity: parseInt(quantity),
      unit: 'grams',
      category,
      isInFreezer,
      username: 'current-user', // Replace with actual username
      addedAt: new Date().toISOString()
    };

    const response = await addFridgeContent(newItem);
    if (response.success) {
      setFoods([...foods, response.item]);
      // Reset form
      setName('');
      setExpirationDate('');
      setQuantity('');
      setCategory('');
      setIsInFreezer(false);
    } else {
      alert('Failed to add food item');
    }
  };

  const updateFoodItem = async (foodID, updatedItem) => {
    const response = await updateFridgeContent({ ...updatedItem, fridgeID, itemID: foodID });
    if (response.success) {
      setFoods(
          foods.map((food) => (food.id === foodID ? { ...food, ...updatedItem } : food))
      );
    } else {
      console.error('Failed to update food item');
    }
  };

  const deleteFoodItem = async (itemID) => {
    const response = await deleteFridgeContent(itemID, fridgeID);
    if (response.success) {
      setFoods(foods.filter(food => food.itemID !== itemID));
      setFoodsSearched(foodsSearched.filter(food => food.itemID !== itemID));
    } else {
      alert('Failed to delete food item');
    }
  };

  const searchFoodItem = () => {
    const results = foods.filter((food) =>
        food.name.toLowerCase().includes(foodSearchedName.toLowerCase())
    );
    setFoodsSearched(results);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
      <div className={styles.container}>
        <Navbar />
        <h2 className={styles.header}>My Fridge</h2>

        {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
              <button onClick={() => setError(null)}>Dismiss</button>
            </div>
        )}

        <div className={styles.fridgeWrapper}>
          <div className={styles.fridgeContainer}>
            <img
                src={isFridgeOpen ? openFridge : closedFridge}
                alt="Fridge"
                className={styles.fridgeImage}
                onClick={toggleFridge}
            />
          </div>

          {isLoading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading fridge contents...</p>
              </div>
          ) : (
              isFridgeOpen && (
                  <div className={styles.foodGrid}>
                    {foods.length === 0 ? (
                        <p className={styles.emptyMessage}>Your fridge is empty!</p>
                    ) : (
                        foods.map((food) => (
                            <div key={food.id} className={styles.foodItem}>
                  <span>
                    {`${food.name} - ${food.quantity} grams, ${formatDate(
                        food.expirationDate
                    )}`}
                  </span>
                              <button
                                  onClick={() => deleteFoodItem(food.id)}
                                  disabled={isLoading}
                              >
                                Delete
                              </button>
                            </div>
                        ))
                    )}
                  </div>
              )
          )}
        </div>

        {isFridgeOpen && (
            <div className={styles.userInput}>
              <input
                  type="text"
                  placeholder="Food Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
              />
              <input
                  type="number"
                  placeholder="Quantity (grams)"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  disabled={isLoading}
              />
              <label>
                In Freezer?{' '}
                <input
                    type="checkbox"
                    checked={isInFreezer}
                    onChange={() => setIsInFreezer(!isInFreezer)}
                    disabled={isLoading}
                />
              </label>
              <select
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isLoading}
              >
                <option value="" disabled>
                  Select category
                </option>
                {Object.values(FridgeCategories).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                ))}
              </select>
              <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  disabled={isLoading}
              />
              <button
                  onClick={addFoodItem}
                  disabled={isLoading || !name || !quantity || !category}
              >
                {isLoading ? 'Adding...' : 'Add Food Item'}
              </button>
            </div>
        )}

        <div className={styles.searchBar}>
          <h3>Search for a food item</h3>
          <input
              type="text"
              placeholder="Search Food Item"
              value={foodSearchedName}
              onChange={(e) => setFoodSearchedName(e.target.value)}
              disabled={isLoading}
          />
          <button
              onClick={searchFoodItem}
              disabled={isLoading || !foodSearchedName}
          >
            Search
          </button>
          {foodsSearched.length > 0 && (
              <ul>
                {foodsSearched.map((food) => (
                    <li key={food.id}>
                      <span>{`${food.name} - ${food.quantity} grams`}</span>
                      <span>Expires on: {formatDate(food.expirationDate)}</span>
                      <button
                          onClick={() => deleteFoodItem(food.id)}
                          disabled={isLoading}
                      >
                        Delete
                      </button>
                    </li>
                ))}
              </ul>
          )}
        </div>
      </div>
  );
};

export default FridgePage;
