import styles from "./RecipeDetails.module.css";

function RecipeDetails({recipe, closeRecipe}) {
    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <div className={styles.header}>
                    <h3>{recipe.name}</h3>
                    <button onClick={closeRecipe}>X</button>
                </div>
                <p>{recipe.name}</p>
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
                    <h4>Instructions</h4>
                    <ol>
                        {recipe.instructions.map((item, index) => {
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