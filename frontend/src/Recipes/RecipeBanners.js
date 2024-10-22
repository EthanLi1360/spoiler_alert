import styles from "./RecipeBanners.module.css";

function RecipeBanners({recipes}) {
    return (
        <div className={styles.bannerContainer}>
            {
                recipes.map((value, index) => {
                    return(
                        <div key={index} onClick={() => console.log(value)} className={styles.banner}>
                            <h3>{value.recipe_name}</h3>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default RecipeBanners;