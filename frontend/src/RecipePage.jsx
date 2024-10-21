import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RecipePage() {
    const [fridgeData, setFridgeData] = useState([]);
    const [tempSelectedIngredients, setTempSelectedIngredients] = useState({});
    const [submittedIngredients, setSubmittedIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const dummyFridgeData = [
            { id: 1, ingredient: 'Milk', expirationDate: '2024-10-22', quantity: 1000, unit: 'ml' },
            { id: 2, ingredient: 'Eggs', expirationDate: '2024-10-24', quantity: 12, unit: 'pcs' },
            { id: 3, ingredient: 'Tomatoes', expirationDate: '2024-10-23', quantity: 500, unit: 'g' },
            { id: 4, ingredient: 'Lettuce', expirationDate: '2024-10-25', quantity: 1, unit: 'head' },
            { id: 5, ingredient: 'Cheese', expirationDate: '2024-10-21', quantity: 200, unit: 'g' }
        ];

        const sortedFridgeData = dummyFridgeData.sort((a, b) =>
            new Date(a.expirationDate) - new Date(b.expirationDate)
        );

        setFridgeData(sortedFridgeData);
    }, []);

    const handleIngredientSelect = (id) => {
        setTempSelectedIngredients(prev => {
            const newSelected = { ...prev };
            if (newSelected[id]) {
                delete newSelected[id];
            } else {
                const ingredient = fridgeData.find(item => item.id === id);
                newSelected[id] = {
                    ...ingredient,
                    selectedQuantity: ingredient.quantity
                };
            }
            return newSelected;
        });
    };

    const handleQuantityChange = (id, value) => {
        setTempSelectedIngredients(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                selectedQuantity: Math.min(parseFloat(value) || 0, prev[id].quantity)
            }
        }));
    };

    const handleSubmit = () => {
        const selectedItems = Object.values(tempSelectedIngredients);
        setSubmittedIngredients(selectedItems);

        setFridgeData(prevFridgeData =>
            prevFridgeData.map(item => {
                const selectedItem = tempSelectedIngredients[item.id];
                if (selectedItem) {
                    return {
                        ...item,
                        quantity: item.quantity - selectedItem.selectedQuantity
                    };
                }
                return item;
            })
        );
    };

    const handleReset = () => {
        setTempSelectedIngredients({});
        setSubmittedIngredients([]);
        setSearchTerm('');
    };

    const handleGenerateRecipes = () => {
        const selectedItems = Object.values(tempSelectedIngredients);
        navigate('/generate-recipes', { state: { selectedIngredients: selectedItems } });
    };

    const filteredFridgeData = fridgeData.filter(item =>
        item.ingredient.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="recipe-page">
            <h1>Recipe Page</h1>
            <h2>Select Ingredients for Recipe</h2>
            <input
                type="text"
                placeholder="Search ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table>
                <thead>
                <tr>
                    <th>Select</th>
                    <th>Ingredient</th>
                    <th>Expiration Date</th>
                    <th>Available Quantity</th>
                    <th>Quantity for Recipe</th>
                </tr>
                </thead>
                <tbody>
                {filteredFridgeData.map((item) => (
                    <tr key={item.id}>
                        <td>
                            <input
                                type="checkbox"
                                checked={!!tempSelectedIngredients[item.id]}
                                onChange={() => handleIngredientSelect(item.id)}
                            />
                        </td>
                        <td>{item.ingredient}</td>
                        <td>{item.expirationDate}</td>
                        <td>{item.quantity} {item.unit}</td>
                        <td>
                            <input
                                type="number"
                                min="0"
                                max={item.quantity}
                                value={tempSelectedIngredients[item.id]?.selectedQuantity || ''}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                disabled={!tempSelectedIngredients[item.id]}
                            />
                            {item.unit}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button onClick={handleSubmit}>Submit Selected Ingredients</button>
            <button onClick={handleReset}>Reset</button>
            <button onClick={handleGenerateRecipes}>Generate Recipes</button>

            <h2>Submitted Ingredients</h2>
            <ul>
                {submittedIngredients.map((item) => (
                    <li key={item.id}>
                        {item.ingredient}: {item.selectedQuantity} {item.unit}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RecipePage;