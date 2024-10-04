from Models import *
from . import *

#During password verification
def User_CheckPassword(hashed_password, user_input_password) -> bool:
   return bcrypt.checkpw(user_input_password.encode('utf-8'), hashed_password)

# check the list of fridges that user have access to
def User_CheckFridgeList(self) -> list :
    return

# check all the fridge content of a fridge that the user has access to
def User_CheckFridgesContents(Fridge):
    if Fridge in self.User_Check_fridgeList():
        return Fridge.FridgeContent()
    
# check the list of re that user have access to 
def User_CheckRecipesList(self) -> list:
    return

def User_CheckRecipeIngredients(recipes):
    if Recipe in self.User_Check_fridgeList():
        return Recipe.RecipeIngredients()
    






