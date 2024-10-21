import { useState } from 'react';
import PropTypes from 'prop-types';

function RecipeGenerationPage({ selectedIngredients }) {
    const [ingredientMode, setIngredientMode] = useState('individual');
    const [cuisine, setCuisine] = useState('');
    const [dietaryRestriction, setDietaryRestriction] = useState('');

    const cuisines = [
        'Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese', 'French', 'Thai',
        'Greek', 'Spanish', 'Korean', 'Vietnamese', 'American', 'Mediterranean'
    ];

    const dietaryRestrictions = [
        'None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
        'Nut-Free', 'Kosher', 'Halal', 'Low-Carb', 'Keto'
    ];

    return (
        <div className="recipe-generation-page">
            <h1>Generate Recipes</h1>

            <div>
                <h2>Selected Ingredients:</h2>
                <ul>
                    {selectedIngredients.map((item) => (
                        <li key={item.id}>
                            {item.ingredient}: {item.selectedQuantity} {item.unit}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <label htmlFor="ingredient-mode">Ingredient Mode: </label>
                <select
                    id="ingredient-mode"
                    value={ingredientMode}
                    onChange={(e) => setIngredientMode(e.target.value)}
                >
                    <option value="individual">Use Only My Ingredients</option>
                    <option value="shared">Include Shared Ingredients</option>
                </select>
            </div>

            <div>
                <label htmlFor="cuisine">Cuisine: </label>
                <select
                    id="cuisine"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                >
                    <option value="">Any Cuisine</option>
                    {cuisines.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="dietary-restriction">Dietary Restriction: </label>
                <select
                    id="dietary-restriction"
                    value={dietaryRestriction}
                    onChange={(e) => setDietaryRestriction(e.target.value)}
                >
                    {dietaryRestrictions.map((restriction) => (
                        <option key={restriction} value={restriction}>{restriction}</option>
                    ))}
                </select>
            </div>

            <button onClick={() => console.log('Generate recipes with:', { ingredientMode, cuisine, dietaryRestriction })}>
                Generate Recipes
            </button>
        </div>
    );
}

RecipeGenerationPage.propTypes = {
    selectedIngredients: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            ingredient: PropTypes.string.isRequired,
            selectedQuantity: PropTypes.number.isRequired,
            unit: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default RecipeGenerationPage;