export function getUserSavedRecipes(userId){
    let userSavedRecipes = [{userId : 1, recipeID : 1, savedAt : Date.now()}]; //api call to return user_saved_recipes objects with matching userID
    return userSavedRecipes;
}

export function getRecipe(recipeId){
    let recipe = {recipeID : 1, "name" : "Scrambled Eggs", "instructions" : "Scramble, then egg.",  "cuisine" : "Global", "dietaryRestrictions" : "eggs", "createdBy" : 1, "createdAt" : Date.now()}; //api call to get recipe with matching userID
    return recipe;
}

export function getRecipeIngredients(recipeID){
    let recipeIngredients = [
        {recipeID: 1, itemID : 1, quantity : 3, unit : "item"}, 
        {recipeID: 1, itemID : 2, quantity : 1, unit : "tablespoon"},
        {recipeID: 1, itemID : 3, quantity : 0.25, unit : "cup"},
        {recipeID: 1, itemID : 4, quantity : 0.33, unit : "cup"}
    ]; //api call to get recipe_ingredients with matching recipeID
    return recipeIngredients;
}

export function getFoodItem(itemID){
    //will just be simple API call

    if(itemID == 1) {
        return {
            "itemID" : 1,
            "name" : "Egg",
            "category" : "poultry",
            "defaultExpirationDays" : 21
        };
    } else if(itemID == 2) {
        return {
            "itemID" : 2,
            "name" : "Salted Butter",
            "category" : "dairy",
            "defaultExpirationDays" : 140
        };
    } else if(itemID == 3) {
        return {
            "itemID" : 3,
            "name" : "Shredded Cheese",
            "category" : "dairy",
            "defaultExpirationDays" : 14
        };
    } else if(itemID == 4) {
        return {
            "itemID" : 4,
            "name" : "1% Milk",
            "category" : "dairy",
            "defaultExpirationDays" : 14
        };
    } else {
        return {
            "itemID" : 0,
            "name" : "0",
            "category" : "0",
            "defaultExpirationDays" : 0
        };
    }
}

export function getUserFridgeAccess(userID){
    return [
        {
        "userID" : 1,
        "fridgeID" : 1,
        "accessLevel" : "owner"
        }
    ]; //api call
}

export function getFridgeContents(fridgeID){
    return [
        {
            "contentID" : 1,
            "fridgeID" : 1,
            "itemID" : 1,
            "quantity" : 1,
            "unit" : "item",
            "expirationDate" : Date.now() + 1.814e+9,
            "addedBy" : 1,
            "addedAt" : Date.now()
        },
        {
            "contentID" : 2,
            "fridgeID" : 1,
            "itemID" : 4,
            "quantity" : 6,
            "unit" : "cup",
            "expirationDate" : Date.now() + 1.814e+9,
            "addedBy" : 1,
            "addedAt" : Date.now()
        }
    ] //api call
}

export function getFridge(fridgeID){
    return {"fridgeID" : 1, "name" : "John's Fridge", "createdAt" : Date.now()}; //api call
}