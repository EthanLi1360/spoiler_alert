import { useState } from "react";
import Navbar from "../Navbar/Navbar";
import FridgeNav from "./FridgeNav";
import RecipeBanners from "./RecipeBanners";
import styles from "./Recipes.module.css";
import { generate } from "./GeminiRecipes";
import { getFoodItem, getFridgeContents } from "../Util";
import RecipeDetails from "./RecipeDetails";

function Recipes() {
    const [generatedRecipes, setGeneratedRecipes] = useState([]);
    const [currentFridge, setCurrentFridge] = useState(null);
    const [AIloading, setAILoading] = useState(false);
    const [recipeSelected, setRecipeSelected] = useState(null);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [viewSaved, setViewSaved] = useState(false);

    const makePrompt = async (existedRecipe, restrictions=null) => {
        let ingredients = await getFridgeContents(1);
        console.log("Ingredients:", ingredients);
      
        let prompt = "Generate me another recipe including but not limited to the following ingredients: ";
        if (ingredients.length > 0) {
            prompt += ingredients[0].name;
        }
        for (let i = 1; i < ingredients.length; i++) {
            prompt += " and " + ingredients[i].name;
        }
      
        if (restrictions != null) {
            prompt += ". But exclude the following:";
            for (const restriction in restrictions) {
                prompt += restriction + " and ";
            }
        }
      
        if (existedRecipe.length != 0) {
            prompt += ". Do not give me these recipes:"
            for (const existed of existedRecipe) {
                prompt += existed["recipe_name"] + " and ";
            }
        }
        
        console.log("Generated Prompt:", prompt);
        return prompt.trim();
    }
    

    const onButtonClick = async () => {
        let temp = [];
        setAILoading(true);
        for (let i = 0; i < 10 && temp.length < 3; i++) {
            const prompt = await makePrompt(temp);
            const result = await generate(prompt);
            if (result != null) {
                temp.push(result);
            }
        }
        setGeneratedRecipes(temp);
        setAILoading(false);
    }

    const replaceRecipe = async (id) => {
        const prompt = makePrompt(generatedRecipes);
        setAILoading(true);
        let newRecipe = await generate(prompt)
        if (newRecipe != null) {
            setGeneratedRecipes((prevRecipes) =>
                prevRecipes.map((recipe) =>
                    recipe.id === id ? newRecipe : recipe
                )
            );
        }
        setAILoading(false);
    }

    const saveRecipe = (recipe) => {
        setSavedRecipes([...savedRecipes, recipe]);
    }

    const removeSavedRecipe = (id) => {
        setSavedRecipes(savedRecipes.filter(recipe => recipe.id !== id));
    }

    const recipeClicked = (recipe) => {
        setRecipeSelected(recipe);
    }

    const closeRecipe = () => {
        setRecipeSelected(null);
    }

    const useRecipe = () => {
        ;
    }

    const toogleViewSaved = () => setViewSaved(!viewSaved)

    return(
        <div className={styles.page}>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.meun}>
                    <FridgeNav setActiveFridge={(e) => setCurrentFridge(e)}/>
                    {currentFridge != null ?
                        <>
                        <button className={styles.menuItem} onClick={onButtonClick}>{AIloading ? "Generating..." : "Generate Recipes"}</button> 
                        <button className={styles.menuItem} onClick={toogleViewSaved}>{viewSaved ? "Choose new Recipes" : "Saved Recipes"}</button>
                        </>
                        : ""
                    }
                </div>
                
                {recipeSelected == null ? 
                (!viewSaved ?
                    (<>
                        {generatedRecipes.length > 0 && !AIloading ?
                            <RecipeBanners recipes={generatedRecipes} recipeClicked={recipeClicked} replaceRecipe={replaceRecipe} saveRecipe={saveRecipe}/> : ""
                        }
                    </>
                    ) : (
                        <div className={styles.savedRecipesList}>
                            {savedRecipes.map((recipe, index) => (
                                <div key={recipe.id || index} className={styles.savedRecipe} onClick={() => recipeClicked(recipe)}>
                                    <div>
                                        <h4>{recipe.recipe_name}</h4>
                                    </div>
                                    <div className={styles.actionButtons}>
                                        <button className={styles.actionButton} onClick={(event) => {
                                            event.stopPropagation();
                                            }} style={{ marginRight: '10px' }}>Use</button>
                                        <button className={styles.actionButton} onClick={(event) => {
                                            event.stopPropagation();
                                            removeSavedRecipe(recipe.id);
                                            }}>Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    <RecipeDetails recipe={recipeSelected} closeRecipe={closeRecipe}/>
                )
            }
            </div>
            
        </div>
    )
}

export default Recipes;