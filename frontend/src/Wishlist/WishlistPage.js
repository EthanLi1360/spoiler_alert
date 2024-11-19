import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from "./Wishlist.module.css";

import Navbar from "../Navbar/Navbar"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function Wishlist({ wishlist, deleteWishlist }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [editingItem, setEditingItem] = useState(null);
    const [tempName, setTempName] = useState("");
    const [tempQuantity, setTempQuantity] = useState(null);
    const [tempUnits, setTempUnits] = useState("");

    const refreshWishlist = async () => {
        axios.get("http://127.0.0.1:5000/get_wishlist_items?wishlistID="+wishlist.wishlistID)
            .then((response) => {
                if (response.data.success) {
                    setWishlistItems(response.data.items)
                }
            });
    }

    useEffect(() => {
        refreshWishlist();
    }, [wishlist])

    const handleAddItem = () => {
        const newItem = {
            "wishlistID": wishlist.wishlistID,
            "name": "New Item",
            "quantity": 1,
            "unit": ""
        };
        axios.post("http://127.0.0.1:5000/add_wishlist_item", newItem)
            .then((response) => {
                if (response.data.success) {
                    refreshWishlist();
                    //.then(setEditingItem(wishlistItems[wishlistItems.length - 1].itemID));
                }
            });
        // const newItem = {
        //     id: Date.now(),
        //     name: "New Item",
        //     quantity: 1,
        //     unit: ""
        // };
        // setWishlist(prev => ({
        //     ...prev,
        //     items: [...prev.items, newItem]
        // }));
    };

    const changeEditingItem = (item) => {
        if (item == null) {
            const obj = {
                "wishlistID": wishlist.wishlistID,
                "itemID": editingItem,
                "name": tempName
            }
            if (tempQuantity != null) {
                obj.quantity = tempQuantity;
            }
            if (tempUnits != null) {
                obj.unit = tempUnits;
            }
            axios.patch("http://127.0.0.1:5000/update_wishlist_item", obj).then((response) => {
                if (response.data.success) {
                    refreshWishlist();
                    setEditingItem(null);
                }
            })
        } else {
            setEditingItem(item.itemID);
            setTempName(item.name);
            setTempQuantity(item.quantity);
            setTempUnits(item.unit);
        }
    }

    // const handleItemEdit = (itemId, newName) => {
    //     setTempName(newName);
    // };

    const handleCheckItem = (itemId) => {
        setCheckedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleImportRecipe = async () => {
        // try {
        //     const result = await api.importRecipe(1, wishlist.id);
        //     if (result.success) {
        //         setWishlist(prev => ({
        //             ...prev,
        //             items: [...prev.items, ...result.items]
        //         }));
        //     }
        // } catch (error) {
        //     console.error("Error importing recipe:", error);
        // }
    };

    const handleDeleteChecked = async () => {
        const checkedItemIds = Object.entries(checkedItems)
            .filter(([_, isChecked]) => isChecked)
            .map(([id]) => parseInt(id));

        if (checkedItemIds.length === 0) return;
        for (const itemID of checkedItemIds) {
            await axios.delete("http://127.0.0.1:5000/delete_wishlist_item?wishlistID="+wishlist.wishlistID+"&itemID="+itemID);
        }
        refreshWishlist();
        // setWishlist(prev => ({
        //     ...prev,
        //     items: prev.items.filter(item => !checkedItemIds.includes(item.id))
        // }));
        setCheckedItems({});
    };

    const handleKeyPress = (e, itemId) => {
        if (e.key === 'Enter') {
            changeEditingItem(null);
        }
    };

    return (
        <div className={styles.wishlist}>
            <div className={styles.wishlistHeader}>
                <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                    <h2 style={{marginRight: '10px'}}>{wishlist.name}</h2>
                    <div style={{flex: 1}}/>
                    {(Object.values(checkedItems).some(Boolean)) ? (
                        <button
                            className={styles.deleteButton}
                            onClick={handleDeleteChecked}
                        >
                            Delete Selected
                        </button>
                    ) : <DeleteIcon style={{color: "red", cursor: "pointer"}} onClick={() => {deleteWishlist(wishlist.wishlistID)}} />}
                </div>
            </div>
            <div className={styles.itemList}>
                {wishlistItems.map((item, index) => (
                    <div
                        key={item.itemID}
                        className={`${styles.listItem} ${checkedItems[item.itemID] ? styles.checked : ''}`}
                    >
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={checkedItems[item.itemID] || false}
                            onChange={() => handleCheckItem(item.itemID)}
                        />
                        <span className={styles.itemNumber}>{index + 1}.</span>
                        {editingItem === item.itemID ? (
                            <div style={{display: "flex"}}>
                                <input
                                    type="text"
                                    placeholder='Name'
                                    className={styles.itemInput}
                                    value={tempName}
                                    onChange={(e) => {setTempName(e.target.value)}}
                                    // onBlur={() => changeEditingItem(null)}
                                    onKeyPress={(e) => handleKeyPress(e, item.itemID)}
                                    autoFocus
                                />
                                <input
                                    type='number'
                                    placeholder='#'
                                    className={styles.unitInput}
                                    value={tempQuantity}
                                    onChange={(e) => {setTempQuantity(e.target.value)}}
                                    // onBlur={() => changeEditingItem(null)}
                                    onKeyPress={(e) => handleKeyPress(e, item.itemID)}
                                    autoFocus
                                />
                                <input
                                    type="text"
                                    placeholder='units'
                                    className={styles.unitInput}
                                    value={tempUnits}
                                    onChange={(e) => {setTempUnits(e.target.value)}}
                                    // onBlur={() => changeEditingItem(null)}
                                    onKeyPress={(e) => handleKeyPress(e, item.itemID)}
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <>
                                <span
                                    className={styles.itemName}
                                    onDoubleClick={() => changeEditingItem(item)}
                                >
                                    {item.name}
                                </span>
                                <div className={styles.quantity}>
                                    {item.quantity > 1 && `x${item.quantity}`}
                                    {item.unit && ` ${item.unit}`}
                                </div>
                            </>
                        )}
                    </div>
                ))}
                <div
                    className={styles.addItemButton}
                    onClick={handleAddItem}
                >
                    add list item
                </div>
            </div>
            <button
                className={styles.importButton}
                onClick={handleImportRecipe}
            >
                Import from Recipe
            </button>
        </div>
    );
}

// Simulated API calls
const api = {
    getWishlists: async (fridgeId) => {

        // const lists = {
        //     1: {
        //         id: fridgeId,
        //         name: "Garage List",
        //         items: [
        //             { id: 1, name: "Tools", quantity: 1, unit: "set" },
        //             { id: 2, name: "Paint", quantity: 2, unit: "can" }
        //         ]
        //     },
        //     2: {
        //         id: fridgeId,
        //         name: "Ethan's List",
        //         items: [
        //             { id: 1, name: "Pizza", quantity: 1, unit: "box" },
        //             { id: 2, name: "Soda", quantity: 6, unit: "can" }
        //         ]
        //     },
        //     3: {
        //         id: fridgeId,
        //         name: "My List",
        //         items: [
        //             { id: 1, name: "Eggs", quantity: 2, unit: "" },
        //             { id: 2, name: "Milk", quantity: 1, unit: "" },
        //             { id: 3, name: "Bread", quantity: 1, unit: "loaf" }
        //         ]
        //     },
        //     4: {
        //         id: fridgeId,
        //         name: "Jeff's List",
        //         items: [
        //             { id: 1, name: "Chicken", quantity: 2, unit: "lb" },
        //             { id: 2, name: "Rice", quantity: 1, unit: "bag" }
        //         ]
        //     },
        //     5: {
        //         id: fridgeId,
        //         name: "Adarsh's List",
        //         items: [
        //             { id: 1, name: "Curry", quantity: 1, unit: "container" },
        //             { id: 2, name: "Naan", quantity: 4, unit: "piece" }
        //         ]
        //     }
        // };
        // return lists[fridgeId];
    },
    importRecipe: async (recipeId, wishlistId) => {
        return {
            success: true,
            items: [
                { id: 11, name: "Pasta", quantity: 1, unit: "pkg" },
                { id: 12, name: "Tomato Sauce", quantity: 1, unit: "jar" },
                { id: 13, name: "Ground Beef", quantity: 1, unit: "lb" }
            ]
        };
    }
};

function WishlistPage() {
    const [fridges, setFridges] = useState([]);
    const [selectedFridge, setSelectedFridge] = useState(null);
    const [wishlists, setWishlists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newWishlistName, setNewWishlistName] = useState("");

    useEffect(() => {
        const fetchFridges = async () => {
            try {
                const username = localStorage.getItem('username');
                axios.get("http://127.0.0.1:5000/get_fridges?username="+username)
                    .then((response) => {
                        if (response.data.success) {
                            setFridges(response.data.fridges);
                            setSelectedFridge(response.data.fridges[0].fridgeID); // Select "My Fridge" by default
                        }
                    });
            } catch (error) {
                console.error("Error fetching fridges:", error);
            }
        };
        fetchFridges();
    }, []);

    const fetchWishlists = async () => {
        if (selectedFridge) {
            setLoading(true);
            try {
                axios.get("http://127.0.0.1:5000/get_wishlists?fridgeID="+selectedFridge)
                    .then((response) => {
                        if (response.data.success) {
                            const wishlistIDList = response.data.wishlists;
                            setWishlists(wishlistIDList);
                        }
                    });
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlists();
    }, [selectedFridge]);

    const handleFridgeSelect = (fridgeId) => {
        setSelectedFridge(fridgeId);
        // setCheckedItems({});
    };

    const addNewWishlist = () => {
        axios.post("http://127.0.0.1:5000/create_wishlist", {
            fridgeID: selectedFridge,
            name: newWishlistName
        }).then((response) => {
            if (response.data.success) {
                fetchWishlists();
                setNewWishlistName("");
            }
        })
    }

    const deleteWishlist = (wishlistID) => {
        axios.delete("http://127.0.0.1:5000/delete_wishlist?wishlistID="+wishlistID+"&fridgeID="+selectedFridge)
            .then((response) => {
                if (response.data.success) {
                    fetchWishlists();
                }
            });
    }

    if (loading || !wishlists) {
        return (
            <div className={styles.container}>
                <Navbar />
                <div className={styles.loadingContainer}>
                    <div className={styles.loading}>Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.content}>
                <div className={styles.fridgeList}>
                    {fridges.map((fridge) => (
                        <div
                            key={fridge.fridgeID}
                            className={`${styles.fridgeItem} ${selectedFridge === fridge.fridgeID ? styles.selected : ''}`}
                            onClick={() => handleFridgeSelect(fridge.fridgeID)}
                        >
                            {fridge.name}
                        </div>
                    ))}
                </div>

                <div className={styles.wishlistContainer}>
                    {wishlists.map((wishlist) => {
                        return <Wishlist wishlist={wishlist} deleteWishlist={deleteWishlist} />
                    })}
                    <div className={styles.newWishlistButton}>
                        <input
                            placeholder='Enter name of new wishlist...'
                            value={newWishlistName}
                            onChange={(e) => {
                                setNewWishlistName(e.target.value);
                            }}
                        />
                        <button style={{width: "97.5%"}} onClick={addNewWishlist}>Add new wishlist</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WishlistPage;