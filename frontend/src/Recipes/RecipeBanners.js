import styles from "./RecipeBanners.module.css";

function RecipeBanners({recipes}) {
    return (
        <div className={styles.bannerContainer}>
            {
                recipes.map((value, index) => {
                    return(
                        <div key={index} onClick={() => console.log(value)} className={styles.banner}>
                            <h3 className={styles.banner_text}>{value.recipe_name}</h3>
                            {value.ingredients.map((ingredient) => 
                                <p className={styles.banner_text}>{ingredient.ingredient_name}</p>
                            )}
                        </div>
                    );
                })
            }
        </div>
    );
}

export default RecipeBanners;