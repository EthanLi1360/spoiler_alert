import { useState } from "react";
import Navbar from "../Navbar/Navbar";
import FridgeNav from "./FridgeNav";
import RecipeBanners from "./RecipeBanners";
import styles from "./Recipes.module.css";
import { generate } from "./GeminiRecipes";
import { getFoodItem, getFridgeContents } from "../Util";

function Recipes() {
    const [generatedRecipes, setGeneratedRecipes] = useState([]);
    const [currentFridge, setCurrentFridge] = useState(null);
    const [AIloading, setAILoading] = useState(false);

    const onButtonClick = async () => {
        let ingredients = getFridgeContents(currentFridge.fridgeID);
        let prompt = "Generate me another recipe including but not limited to the following ingredients: ";
        if(ingredients.length > 0){
            prompt += getFoodItem(ingredients[0].contentID).name;
        }
        for(let i = 1; i < ingredients.length; i++) {
            prompt += " and " + getFoodItem(ingredients[i].contentID); 
        }
        let temp = [];
        setAILoading(true);
        for (let i = 0; i < 10 && temp.length < 3; i++) {
            await generate(prompt).then((result) => {
                if (result != null) {
                    temp.push(result);
                }
            });
        }
        setGeneratedRecipes(temp);
        setAILoading(false);
    }

    return(
        <div className={styles.page}>
            <Navbar />
            <div className={styles.container}>
                <FridgeNav setActiveFridge={(e) => setCurrentFridge(e)}/>
                {generatedRecipes.length > 0 && !AIloading ?
                    <RecipeBanners recipes={generatedRecipes}/> :
                    (
                        currentFridge != null ?
                        <button onClick={onButtonClick}>{AIloading ? "Generating..." : "Generate Recipes"}</button> :
                        ""
                    )
                }
            </div>
        </div>
    )
}

export default Recipes;