import styles from "./RecipeDetails.module.css";

function RecipeDetails({recipe, closeRecipe}) {
    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <div className={styles.header}>
                    <h3>{recipe.recipe_name}</h3>
                    <button onClick={closeRecipe}>X</button>
                </div>
                <p>{recipe.notes}</p>
                <div>
                    <h4>Ingredients</h4>
                    <ol>
                        {recipe.ingredients.map((item, index) => {
                            return (
                                <li key={index}>{item.ingredient_quantity} {item.units} of {item.ingredient_name}</li>
                            );
                        })}
                    </ol>
                </div>
                <div>
                    <h4>Directions</h4>
                    <ol>
                        {recipe.directions.map((item, index) => {
                            return (
                                <li>{item}</li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </div>
    )
}

export default RecipeDetails;