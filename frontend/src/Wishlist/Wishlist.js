import { useState, useEffect } from 'react';
import {getUserSavedRecipes, getRecipe, getRecipeIngredients, getFoodItem, getFridgeContents, getUserFridgeAccess, getFridge} from "../Util";
import IngredientSelect from './IngredientSelect';
import ListRecipes from './ListRecipes';
import ShoppingList from './ShoppingList';
import Navbar from '../Navbar/Navbar';
import "./Wishlist.css"
//Add ingredients directly to fridge once purchased
//Organize wishlist by recipes

function Wishlist({userID}) {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [fridgeContents, setFridgeContents] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState();
    const [shoppingList, setShoppingList] = useState([]);
    
    const handleClick = (item) => {
        setSelectedRecipe(item);
    }
    const addToList = (item, quantity, recipe) => {
        setShoppingList((old) => [...old, {...item, "quantity" : quantity, "recipeName" : recipe}]);
        console.log(shoppingList);
    }
    const addToFridge = (item) => {
        console.log("Adding to fridge...");
        console.log(item);
    }
    const saveList = () => {
        console.log("Saving shopping list...");
        console.log(shoppingList);
    }
    useEffect(() => {
        setSavedRecipes(getFormattedSavedRecipes(userID));
        setFridgeContents(getFormattedFridgeContents(userID));
    }, [userID]);
    // console.log(fridgeContents);
    // console.log(savedRecipes);
    return (
        <div className='container'>
            <Navbar />
            <div>
                <ListRecipes savedRecipes={savedRecipes} callback={handleClick} />
                <IngredientSelect recipe={selectedRecipe} fridgeContents={fridgeContents} addToList={addToList} />
                <ShoppingList list={shoppingList} itemAdded={addToFridge} saveList={saveList}/>
            </div>
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