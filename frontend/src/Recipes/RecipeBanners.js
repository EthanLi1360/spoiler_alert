import styles from "./RecipeBanners.module.css";

function RecipeBanners({recipes, recipeClicked, replaceRecipe, saveRecipe}) {
    return (
        <div className={styles.bannerContainer}>
            {
                recipes.map((recipe) => {
                    return(
                        <div key={recipe.id} onClick={() => recipeClicked(recipe)} className={styles.banner}>
                            <h3 className={styles.banner_text}>{recipe.recipe_name}</h3>
                            {recipe.ingredients.map((ingredient) => 
                                <p className={styles.banner_text}>{ingredient.ingredient_name}</p>
                            )}
                            <button className={styles.cancelButton} onClick={(event) => { 
                                    event.stopPropagation();
                                    replaceRecipe(recipe.id);
                                }}>&#10005;</button>
                            <div className={styles.actionButtons}>
                                <button className={styles.actionButton} onClick={(event) => { 
                                    event.stopPropagation();
                                    
                                }}>Use</button>
                                <button className={styles.actionButton} onClick={(event) => { 
                                    event.stopPropagation();
                                    saveRecipe(recipe)
                                }}>Save</button>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default RecipeBanners;