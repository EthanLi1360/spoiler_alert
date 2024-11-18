import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from "./Wishlist.module.css";

// Simulated API calls
const dummyAPI = {
    getFridges: async (userID) => {
        return [
            { id: 1, name: "Garage Fridge" },
            { id: 2, name: "Ethan's Fridge" },
            { id: 3, name: "My Fridge" },
            { id: 4, name: "Jeff's Fridge" },
            { id: 5, name: "Adarsh's Fridge" }
        ];
    },
    getWishlist: async (fridgeId) => {
        const lists = {
            1: {
                id: fridgeId,
                name: "Garage List",
                items: [
                    { id: 1, name: "Tools", quantity: 1, unit: "set" },
                    { id: 2, name: "Paint", quantity: 2, unit: "can" }
                ]
            },
            2: {
                id: fridgeId,
                name: "Ethan's List",
                items: [
                    { id: 1, name: "Pizza", quantity: 1, unit: "box" },
                    { id: 2, name: "Soda", quantity: 6, unit: "can" }
                ]
            },
            3: {
                id: fridgeId,
                name: "My List",
                items: [
                    { id: 1, name: "Eggs", quantity: 2, unit: "" },
                    { id: 2, name: "Milk", quantity: 1, unit: "" },
                    { id: 3, name: "Bread", quantity: 1, unit: "loaf" }
                ]
            },
            4: {
                id: fridgeId,
                name: "Jeff's List",
                items: [
                    { id: 1, name: "Chicken", quantity: 2, unit: "lb" },
                    { id: 2, name: "Rice", quantity: 1, unit: "bag" }
                ]
            },
            5: {
                id: fridgeId,
                name: "Adarsh's List",
                items: [
                    { id: 1, name: "Curry", quantity: 1, unit: "container" },
                    { id: 2, name: "Naan", quantity: 4, unit: "piece" }
                ]
            }
        };
        return lists[fridgeId];
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

function Wishlist({userID}) {
    const [fridges, setFridges] = useState([]);
    const [selectedFridge, setSelectedFridge] = useState(null);
    const [wishlist, setWishlist] = useState(null);
    const [checkedItems, setCheckedItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        const fetchFridges = async () => {
            try {
                const fridgeData = await dummyAPI.getFridges(userID);
                setFridges(fridgeData);
                setSelectedFridge(fridgeData[2].id); // Select "My Fridge" by default
            } catch (error) {
                console.error("Error fetching fridges:", error);
            }
        };
        fetchFridges();
    }, [userID]);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (selectedFridge) {
                setLoading(true);
                try {
                    const wishlistData = await dummyAPI.getWishlist(selectedFridge);
                    setWishlist(wishlistData);
                } catch (error) {
                    console.error("Error fetching wishlist:", error);
                }
                setLoading(false);
            }
        };
        fetchWishlist();
    }, [selectedFridge]);

    const handleFridgeSelect = (fridgeId) => {
        setSelectedFridge(fridgeId);
        setCheckedItems({});
    };

    const handleAddItem = () => {
        if (!wishlist) return;

        const newItem = {
            id: Date.now(),
            name: "New Item",
            quantity: 1,
            unit: ""
        };
        setWishlist(prev => ({
            ...prev,
            items: [...prev.items, newItem]
        }));
        setEditingItem(newItem.id);
    };

    const handleItemEdit = (itemId, newName) => {
        setWishlist(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.id === itemId
                    ? { ...item, name: newName }
                    : item
            )
        }));
    };

    const handleCheckItem = (itemId) => {
        setCheckedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleImportRecipe = async () => {
        try {
            const result = await dummyAPI.importRecipe(1, wishlist.id);
            if (result.success) {
                setWishlist(prev => ({
                    ...prev,
                    items: [...prev.items, ...result.items]
                }));
            }
        } catch (error) {
            console.error("Error importing recipe:", error);
        }
    };

    const handleDeleteChecked = () => {
        const checkedItemIds = Object.entries(checkedItems)
            .filter(([_, isChecked]) => isChecked)
            .map(([id]) => parseInt(id));

        if (checkedItemIds.length === 0) return;

        setWishlist(prev => ({
            ...prev,
            items: prev.items.filter(item => !checkedItemIds.includes(item.id))
        }));
        setCheckedItems({});
    };

    const handleKeyPress = (e, itemId) => {
        if (e.key === 'Enter') {
            setEditingItem(null);
        }
    };

    if (loading || !wishlist) {
        return (
            <div className={styles.container}>
                <nav className={styles.navbar}>
                    <div className={styles.logo}>
                        <Link to="/">SpoilerAlert</Link>
                    </div>
                    <div className={styles.navLinks}>
                        <Link to="/fridge">Fridge</Link>
                        <Link to="/recipes">Recipes</Link>
                        <Link to="/wishlist" className={styles.active}>Wishlist</Link>
                    </div>
                </nav>
                <div className={styles.loadingContainer}>
                    <div className={styles.loading}>Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <Link to="/">SpoilerAlert</Link>
                </div>
                <div className={styles.navLinks}>
                    <Link to="/fridge">Fridge</Link>
                    <Link to="/recipes">Recipes</Link>
                    <Link to="/wishlist" className={styles.active}>Wishlist</Link>
                </div>
            </nav>

            <div className={styles.content}>
                <div className={styles.fridgeList}>
                    {fridges.map((fridge) => (
                        <div
                            key={fridge.id}
                            className={`${styles.fridgeItem} ${selectedFridge === fridge.id ? styles.selected : ''}`}
                            onClick={() => handleFridgeSelect(fridge.id)}
                        >
                            {fridge.name}
                        </div>
                    ))}
                </div>

                <div className={styles.wishlistContainer}>
                    <div className={styles.wishlist}>
                        <div className={styles.wishlistHeader}>
                            <h2>{wishlist.name}</h2>
                            {Object.values(checkedItems).some(Boolean) && (
                                <button
                                    className={styles.deleteButton}
                                    onClick={handleDeleteChecked}
                                >
                                    Delete Selected
                                </button>
                            )}
                        </div>
                        <div className={styles.itemList}>
                            {wishlist.items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`${styles.listItem} ${checkedItems[item.id] ? styles.checked : ''}`}
                                >
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={checkedItems[item.id] || false}
                                        onChange={() => handleCheckItem(item.id)}
                                    />
                                    <span className={styles.itemNumber}>{index + 1}.</span>
                                    {editingItem === item.id ? (
                                        <input
                                            type="text"
                                            className={styles.itemInput}
                                            value={item.name}
                                            onChange={(e) => handleItemEdit(item.id, e.target.value)}
                                            onBlur={() => setEditingItem(null)}
                                            onKeyPress={(e) => handleKeyPress(e, item.id)}
                                            autoFocus
                                        />
                                    ) : (
                                        <span
                                            className={styles.itemName}
                                            onDoubleClick={() => setEditingItem(item.id)}
                                        >
                                            {item.name}
                                        </span>
                                    )}
                                    <div className={styles.quantity}>
                                        {item.quantity > 1 && `x${item.quantity}`}
                                        {item.unit && ` ${item.unit}`}
                                    </div>
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
                </div>
            </div>
        </div>
    );
}

export default Wishlist;