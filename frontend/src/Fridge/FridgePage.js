import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './FridgePage.module.css';
import closedFridge from '../closed_fridge.png';
import openFridge from './open_fridge.png';
import { getCachedBackendUrl, clearBackendUrlCache } from '../Util';

import axios from 'axios';
import ShareFridge from '../ShareFridge/ShareFridge';
import Spinner from '../Recipes/Spinner';

const FridgePage = () => {
  const [fridge, setFridge] = useState('');

  const [foods, setFoods] = useState([]);
  const [name, setName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [units, setUnits] = useState('');
  const [category, setCategory] = useState('');
  const [isInFreezer, setIsInFreezer] = useState(false);
  const [suggestedExpirationTime, setSuggestedExpirationTime] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState('');
  const [queryOption, setQueryOption] = useState('');
  const [isFridgeOpen, setIsFridgeOpen] = useState(false);
  const [foodSearchedName, setFoodSearchedName] = useState('');
  const [foodsSearched, setFoodsSearched] = useState([]);
  const [backendUrl, setBackendUrl] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [mode, setMode] = useState("none");

  const [canOpenFridge, setCanOpenFridge] = useState(false);

  // Initialize backend URL on component mount
  useEffect(() => {
    const initBackendUrl = async () => {
      try {
        console.log('Attempting to discover backend URL...');
        // Clear cache to ensure fresh discovery
        clearBackendUrlCache();
        const url = await getCachedBackendUrl();
        console.log('Backend URL discovered:', url);
        setBackendUrl(url);
      } catch (error) {
        console.error('Failed to get backend URL:', error);
        setBackendUrl('http://localhost:5000'); // fallback
      }
    };
    initBackendUrl();
  }, []);

  // useEffect(() => {
  //   const username = localStorage.getItem("username");
  //   axios.get("http://127.0.0.1:5000/get_fridges?username="+username)
  //     .then((response) => {
  //       if (response.data.success) {
  //         const fridges = response.data.fridges;
  //         if (fridges.length == 0) {
  //           axios.post("http://127.0.0.1:5000/add_fridge", {
  //             username: localStorage.getItem("username"),
  //             name: "My first fridge"
  //           }).then(
  //             axios.get("http://127.0.0.1:5000/get_fridges?username="+username)
  //             .then((response) => {
  //               if (response.data.success) {
  //                 const fridges = response.data.fridges;
  //                 setFridge(fridges[0]);
  //                 setCanOpenFridge(true);
  //               }
  //             })
  //             .catch((error) => alert(error))
  //           );
  //           } else {
  //             setFridge(fridges[0]);
  //             setCanOpenFridge(true);
  //           }
  //       }
  //     })
  // }, []);

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
    if (canOpenFridge && backendUrl) {
      if (!isFridgeOpen) {
        try {
          console.log('Making request to:', `${backendUrl}/get_fridge_contents?fridgeID=${fridge.fridgeID}`);
          const response = await axios.get(`${backendUrl}/get_fridge_contents?fridgeID=${fridge.fridgeID}`);
          
          if (response.data.success) {
            setFoods(response.data.items);
          } else {
            alert('Failed to load fridge contents: ' + (response.data.error || 'Unknown error'));
          }
        } catch (error) {
          console.error('Error loading fridge contents:', error);
          alert('Network error loading fridge contents. Please check if the backend is running.');
          return; // Don't toggle fridge state on error
        }
      }
      setIsFridgeOpen(!isFridgeOpen);
    } else if (!backendUrl) {
      alert('Backend URL not yet discovered. Please wait a moment and try again.');
    }
  };

  const addFoodItem = async () => {
    if (!backendUrl) return;
    
    // Frontend validation
    if (!name.trim()) {
      alert('Please enter a food name');
      return;
    }
    
    if (!quantity || parseFloat(quantity) <= 0) {
      alert('Please enter a valid positive quantity');
      return;
    }
    
    if (!units.trim()) {
      alert('Please enter a unit (e.g., lbs, pieces, cups)');
      return;
    }
    
    if (!category) {
      alert('Please select a category');
      return;
    }
    
    if (!isInFreezer && !expirationDate) {
      alert('Please set an expiration date for items not in the freezer');
      return;
    }
    
    try {
      const response = await axios.post(`${backendUrl}/add_fridge_content`, {
        username: localStorage.getItem("username"),
        fridgeID: fridge.fridgeID,
        quantity: parseFloat(quantity),
        unit: units.trim(),
        expirationDate: expirationDate || null, // Ensure proper format or null
        name: name.trim(),
        category: category,
        isInFreezer: isInFreezer ? 1 : 0
      });
      
      if (response.data.success) {
        // Refresh the fridge contents
        const refreshResponse = await axios.get(`${backendUrl}/get_fridge_contents?fridgeID=${fridge.fridgeID}`);
        if (refreshResponse.data.success) {
          setFoods(refreshResponse.data.items);
        }

        // Clear form
        setName('');
        setExpirationDate('');
        setQuantity('');
        setUnits('');
        setCategory('');
        setSuggestedExpirationTime('');
        setSuggestedCategory('');
        setIsInFreezer(false);
        
        // Item added successfully - no alert needed for better UX
      } else {
        alert('Error adding food item: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding food item:', error);
      if (error.response && error.response.data && error.response.data.error) {
        alert('Error: ' + error.response.data.error);
      } else {
        alert('Network error adding food item. Please check your connection.');
      }
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
    const typingDelay = 1500;

    const fetchSuggestions = async () => {
      if (name) {
        try {
          // Fetch API key from backend using dynamic port discovery
          const backendUrl = await getCachedBackendUrl();
          const apiResponse = await fetch(`${backendUrl}/get_gemini_api_key`);
          const apiData = await apiResponse.json();
          
          if (!apiData.success) {
            throw new Error(apiData.error || "Failed to get API key");
          }
          
          const API_KEY = apiData.api_key;
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

  const deleteFoodItem = async (id) => {
    if (!backendUrl) return;
    
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    try {
      const response = await axios.delete(`${backendUrl}/delete_fridge_content`, {
        data: {
          fridgeID: fridge.fridgeID,
          itemID: id
        }
      });
      
      if (response.data.success) {
        // Refresh the fridge contents
        const refreshResponse = await axios.get(`${backendUrl}/get_fridge_contents?fridgeID=${fridge.fridgeID}`);
        if (refreshResponse.data.success) {
          setFoods(refreshResponse.data.items);
        }
        // Item deleted successfully - no alert needed for better UX
      } else {
        alert('Error deleting item: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting food item:', error);
      alert('Network error deleting item. Please check your connection.');
    }
  };

  /**
   * Start editing a food item
   */
  const startEditItem = (item) => {
    setEditingItem(item);
    setName(item.name);
    setQuantity(item.quantity.toString());
    setUnits(item.unit);
    setCategory(item.category);
    setExpirationDate(item.expirationDate ? item.expirationDate.split('T')[0] : '');
    setIsInFreezer(Boolean(item.isInFreezer));
    setMode("edit");
  };

  /**
   * Cancel editing and clear form
   */
  const cancelEdit = () => {
    setEditingItem(null);
    setName('');
    setQuantity('');
    setUnits('');
    setCategory('');
    setExpirationDate('');
    setIsInFreezer(false);
    setSuggestedExpirationTime('');
    setSuggestedCategory('');
    setMode("none");
  };

  /**
   * Update an existing food item
   */
  const updateFoodItem = async () => {
    if (!backendUrl || !editingItem) return;
    
    // Frontend validation
    if (!name.trim()) {
      alert('Please enter a food name');
      return;
    }
    
    if (!quantity || parseFloat(quantity) <= 0) {
      alert('Please enter a valid positive quantity');
      return;
    }
    
    if (!units.trim()) {
      alert('Please enter a unit (e.g., lbs, pieces, cups)');
      return;
    }
    
    if (!category) {
      alert('Please select a category');
      return;
    }
    
    if (!isInFreezer && !expirationDate) {
      alert('Please set an expiration date for items not in the freezer');
      return;
    }
    
    try {
      const response = await axios.patch(`${backendUrl}/update_fridge_content`, {
        fridgeID: fridge.fridgeID,
        itemID: editingItem.itemID,
        quantity: parseFloat(quantity),
        unit: units.trim(),
        expirationDate: expirationDate || null, // Ensure proper format or null
        name: name.trim(),
        category: category,
        isInFreezer: isInFreezer ? 1 : 0
      });
      
      if (response.data.success) {
        // Refresh the fridge contents
        const refreshResponse = await axios.get(`${backendUrl}/get_fridge_contents?fridgeID=${fridge.fridgeID}`);
        if (refreshResponse.data.success) {
          setFoods(refreshResponse.data.items);
        }
        
        // Clear form and exit edit mode
        cancelEdit();
        // Item updated successfully - no alert needed for better UX
      } else {
        alert('Error updating food item: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating food item:', error);
      if (error.response && error.response.data && error.response.data.error) {
        alert('Error: ' + error.response.data.error);
      } else {
        alert('Network error updating food item. Please check your connection.');
      }
    }
  };

  const formatDate = (date) => {
    const dateMillis = Date.parse(date);
    const dateNow = Date.now();
    const dateDiff = dateMillis - dateNow;
    if (dateDiff > 0) {
      const num = Math.ceil(dateDiff / (1000 * 60 * 60 * 24));
      if (num === 1) {
        return "tomorrow";
      } else {
        return "in "+num+" days"
      }
    } else {
      const num = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
      if (num === -1) {
        return "today";
      } else {
        return -num+" days ago"
      }
    }
    // const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    // return new Date(date).toLocaleDateString(undefined, options);
  };

  return (<>
    <Navbar />
    <div className={styles.container}>
      {canOpenFridge ? <div>
        <p className={styles.menuHeader}>{fridge.name}</p>
        <button className={styles.menuItem} onClick={() => {
          if (!backendUrl) return;

          axios.delete(`${backendUrl}/remove_fridge?fridgeID=${fridge.fridgeID}`)
            .then((response) => {
                if (response.data.success) {
                  setCanOpenFridge(false);
                  setIsFridgeOpen(false);
                }
              }
            )
        }}>Delete Fridge</button>
        <button className={styles.menuItem} onClick={() => {
          setCanOpenFridge(false);
          setIsFridgeOpen(false);
        }}>Back</button>
      </div> :
        <Spinner setCurrentFridge={(value) => {
          setFridge(value);
          setCanOpenFridge(true);
        }} />
      }
      <div className={styles.fridgeWrapper}>
        <div className={styles.fridgeContainer}>
          <>
            <img
              src={isFridgeOpen ? openFridge : closedFridge}
              alt="Fridge"
              className={styles.fridgeImage}
              onClick={toggleFridge}
              style={!canOpenFridge ? {opacity: "25%", cursor: "default"} : {}}
            />
            {isFridgeOpen && <>
              <div className={styles.actionButtons}>
                <button 
                  style={{width: "150px"}} 
                  onClick={() => {mode === "add" ? setMode("none") : setMode("add")}}
                  className={mode === "add" ? styles.cancelButton : ""}
                >
                  {mode === "add" ? "Cancel Add" : "Add Item"}
                </button>
                <button style={{width: "150px"}} onClick={() => {mode === "share" ? setMode("none") : setMode("share")}}>
                  {mode === "share" ? "Cancel Share" : "Share Fridge"}
                </button>
              </div>
            </>}
          </>
        </div>
        {isFridgeOpen && (
          <div className={styles.fridgeDetailsContainer}>
            
            {foods.length == 0 ? 
              <div className={styles.emptyFridgeContainer}>
                <p className={styles.emptyFridgeMessage}>Looks like there's nothing in your fridge!</p>
              </div>
            : 
              <div>
                {/* Search and Sort Controls */}
                <div className={styles.controlsSection}>
                  <div className={styles.searchControls}>
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                  <div className={styles.sortControls}>
                    <span>Sort by:</span>
                    <select
                      name="sort_foods"
                      value={queryOption}
                      onChange={(e) => {
                        const selectedOption = e.target.value;
                        setQueryOption(selectedOption);
                        
                        // Auto-sort when option is selected
                        if (selectedOption) {
                          const sortedFoods = [...foods].sort((a, b) => {
                            if (selectedOption === 'quantity') {
                              return a[selectedOption] - b[selectedOption];
                            }
                            if (selectedOption === 'expirationDate') {
                              if (a.isInFreezer && !b.isInFreezer) {
                                return 1;
                              } else if (!a.isInFreezer && b.isInFreezer) {
                                return -1;
                              }
                              return Date.parse(a[selectedOption]) - Date.parse(b[selectedOption]);
                            }
                            if (selectedOption === 'isInFreezer') {
                              if (a.isInFreezer && !b.isInFreezer) {
                                return -1;
                              } else if (!a.isInFreezer && b.isInFreezer) {
                                return 1;
                              }
                              return 0;
                            }
                            return String(a[selectedOption]).localeCompare(String(b[selectedOption]));
                          });
                          setFoods(sortedFoods);
                        }
                      }}
                      className={styles.sortSelect}
                    >
                      <option value="" disabled>Select an option</option>
                      {['name', 'expirationDate', 'quantity', 'category', 'isInFreezer'].map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Food Items Grid */}
                <div className={styles.foodGrid}>
                  {foods
                    .filter(food => 
                      searchTerm === '' || 
                      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      food.category.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((food) => (
                    <div key={food.itemID} className={styles.foodItem} style={
                      food.isInFreezer ? {backgroundColor: "#33f"} : (
                        (Date.parse(food.expirationDate) < Date.now()) ? {backgroundColor: "#a33"} : {}
                      )
                    }>
                      <div className={styles.foodItemHeader}>
                        <span className={styles.foodName}>{`${food.name}`}</span>
                        <div className={styles.foodActions}>
                          <button 
                            onClick={() => startEditItem(food)}
                            className={styles.editButton}
                            title="Edit item"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => deleteFoodItem(food.itemID)}
                            className={styles.deleteButton}
                            title="Delete item"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <span>{`${food.quantity} ${food.unit}`}</span>
                      <span className={styles.foodCategory}>{`${food.category}`}</span>
                      <br />
                      <span className={styles.expirationInfo}>
                        {food.isInFreezer ? "In freezer" : ((Date.parse(food.expirationDate) < Date.now()) ? "Expired" : "Expires")+` ${formatDate(food.expirationDate)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            }

            {mode !== "none" && (
              <div className={styles.dialogContainer}>
                {mode === "share" ? (
                  <ShareFridge activeFridgeID={fridge.fridgeID}/>
                ) : (
                  <div className={styles.userInput}>
                    <h3>{mode === "edit" ? "Edit Food Item" : "Add New Food Item"}</h3>
                    
                    <div className={styles.inlineForm}>
                      <input
                        type="text"
                        placeholder="Food Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.formInput}
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="0.01"
                        step="0.01"
                        className={styles.formInput}
                      />
                      <input
                        type="text"
                        placeholder="Units (e.g., lbs, pieces, cups)"
                        value={units}
                        onChange={(e) => setUnits(e.target.value)}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.inlineForm}>
                      <select
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={styles.formSelect}
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
                        className={styles.formInput}
                        title={isInFreezer ? "Expiration date not required for freezer items" : ""}
                      />
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={isInFreezer}
                          onChange={() => {
                            setIsInFreezer(!isInFreezer);
                            // Clear expiration date when checking "In Freezer" for better UX
                            if (!isInFreezer) {
                              setExpirationDate('');
                            }
                          }}
                        />
                        In Freezer?
                      </label>
                    </div>

                    {mode === "add" && suggestedExpirationTime && (
                      <div className={styles.aiSuggestions}>
                        <div className={styles.aiSuggestionsHeader}>
                          💡 AI Suggestions
                        </div>
                        <div className={styles.aiSuggestionsContent}>
                          <div className={styles.suggestionItem}>
                            <span className={styles.suggestionLabel}>Expiration:</span>
                            <span className={styles.suggestionValue}>{suggestedExpirationTime} days</span>
                          </div>
                          <div className={styles.suggestionItem}>
                            <span className={styles.suggestionLabel}>Category:</span>
                            <span className={styles.suggestionValue}>{suggestedCategory}</span>
                          </div>
                        </div>
                        <div className={styles.suggestionButtonContainer}>
                          <button onClick={confirmSuggestion} className={styles.suggestionButton}>
                            Apply Suggestions
                          </button>
                        </div>
                      </div>
                    )}

                    <div className={styles.formSeparator}></div>

                    <div className={styles.actionButtons}>
                      {mode === "add" ? (
                        <button onClick={addFoodItem} className={styles.primaryButton}>
                          Add Food Item
                        </button>
                      ) : (
                        <>
                          <button onClick={updateFoodItem} className={styles.primaryButton}>
                            Update Item
                          </button>
                          <button onClick={cancelEdit} className={styles.secondaryButton}>
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </>);
};

export default FridgePage;
