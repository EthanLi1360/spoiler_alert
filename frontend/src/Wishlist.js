import { useState, useEffect } from 'react';
import {getUserSavedRecipes, getRecipe, getRecipeIngredients, getFoodItem, getFridgeContents, getUserFridgeAccess, getFridge} from "./Util";
import IngredientSelect from './Components/IngredientSelect';
import ListRecipes from './Components/ListRecipes';
//Add ingredients directly to fridge once purchased
//Organize wishlist by recipes

function Wishlist({userID}) {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [fridgeContents, setFridgeContents] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState();
    
    const handleClick = (item) => {
        setSelectedRecipe(item);
    }
    useEffect(() => {
        setSavedRecipes(getFormattedSavedRecipes(userID));
        setFridgeContents(getFormattedFridgeContents(userID));
    }, []);
    // console.log(fridgeContents);
    // console.log(savedRecipes);
    return (
        <div>
            <ListRecipes savedRecipes={savedRecipes} callback={handleClick}/>
            <IngredientSelect recipe={selectedRecipe} fridgeContents={fridgeContents}/>
        </div>
    )
}

function getFormattedSavedRecipes(userId) {
    let savedRecipes = getUserSavedRecipes(userId);
    let recipes = [];
    savedRecipes.forEach(element => {
        recipes.push(getRecipe(element.recipeID));
    });
    for(let i = 0; i < recipes.length; i++){
        let ingredients = getRecipeIngredients(recipes[i].recipeID);
        for(let j = 0; j < ingredients.length; j++){
            ingredients[j] = {...ingredients[j], "name": getFoodItem(ingredients[j].itemID).name};
        }
        recipes[i] = {...recipes[i], "ingredients" : ingredients};
    }
    return recipes;
}

function getFormattedFridgeContents(userID){
    let userAccessFridges = getUserFridgeAccess(userID);
    let userFridgeContents = [];
    userAccessFridges.forEach((element) => {
        userFridgeContents.push(getFridgeContents(element.fridgeID));
    });
    let formattedItems = [];
    userFridgeContents.forEach((fridgeItems) => {
        fridgeItems.forEach((item) => {
            formattedItems.push({...item, "fridgeName": getFridge(item.fridgeID).name, "itemName": getFoodItem(item.itemID).name});
        });
    });
    return formattedItems;
}

export default Wishlist;