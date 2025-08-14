import styles from "./RecipeBanners.module.css";

function RecipeBanners({recipes, recipeClicked, replaceRecipe, saveRecipe, onUseRecipe}) {
    if (!recipes || !Array.isArray(recipes)) {
        return <div>No recipes available</div>;
    }
    
    return (
        <div className={styles.bannerContainer}>
            {
                recipes.map((recipe, index) => {
                    if (!recipe) return null;
                    
                    return(
                        <div key={recipe.id || index} onClick={() => recipeClicked(recipe)} className={styles.banner}>
                            <h3 className={styles.banner_text}>{recipe.recipe_name || "Unnamed Recipe"}</h3>
                            {recipe.ingredients && recipe.ingredients.map((ingredient, idx) => 
                                <p key={idx} className={styles.banner_text}>
                                    {ingredient.ingredient_name || ingredient.name || "Unknown ingredient"}
                                </p>
                            )}
                            <button className={styles.cancelButton} onClick={(event) => { 
                                    event.stopPropagation();
                                    replaceRecipe(recipe.id || index);
                                }}>&#10005;</button>
                            <div className={styles.actionButtons}>
                                <button className={styles.actionButton} onClick={(event) => { 
                                    event.stopPropagation();
                                    onUseRecipe(recipe);
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