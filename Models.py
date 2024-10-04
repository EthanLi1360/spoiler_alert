from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app import db

class User(db.Model):
    __tablename__ = 'users'
    userID = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    createdAt = Column(DateTime, default=datetime.now)

    fridges = relationship('UserFridgeAccess', back_populates='user')
    saved_recipes = relationship('UserSavedRecipes', back_populates='user')
    shopping_list_access = relationship('UserShoppingListAccess', back_populates='user')
    fridge_contents = relationship('FridgeContent', back_populates='added_by_user')
    shopping_list_items = relationship('ShoppingListItem', back_populates='added_by_user')
    created_recipes = relationship('Recipe', back_populates='created_by_user')
    created_shopping_lists = relationship('ShoppingList', back_populates='created_by_user')


class Fridge(db.Model):
    __tablename__ = 'fridges'
    fridgeID = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    createdAt = Column(DateTime, default=datetime.now)

    contents = relationship('FridgeContent', back_populates='fridge')
    users = relationship('UserFridgeAccess', back_populates='fridge')


class UserFridgeAccess(db.Model):
    __tablename__ = 'user_fridge_access'
    userID = Column(Integer, ForeignKey('users.userID'), primary_key=True)
    fridgeID = Column(Integer, ForeignKey('fridges.fridgeID'), primary_key=True)
    accessLevel = Column(String)

    user = relationship('User', back_populates='fridges')
    fridge = relationship('Fridge', back_populates='users')


class FridgeContent(db.Model):
    __tablename__ = 'fridge_contents'
    contentID = Column(Integer, primary_key=True)
    fridgeID = Column(Integer, ForeignKey('fridges.fridgeID'))
    name = Column(String, nullable=False)
    category = Column(String)
    defaultExpirationDays = Column(Integer)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    expirationDate = Column(Date, nullable=False)
    addedBy = Column(Integer, ForeignKey('users.userID'))
    addedAt = Column(DateTime, default=datetime.now)

    fridge = relationship('Fridge', back_populates='contents')
    added_by_user = relationship('User', back_populates='fridge_contents')


class Recipe(db.Model):
    __tablename__ = 'recipes'
    recipeID = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    instructions = Column(Text, nullable=False)
    cuisine = Column(String)
    dietaryRestrictions = Column(String)
    createdBy = Column(Integer, ForeignKey('users.userID'))
    createdAt = Column(DateTime, default=datetime.now)

    ingredients = relationship('RecipeIngredient', back_populates='recipe')
    created_by_user = relationship('User', back_populates='created_recipes')


class RecipeIngredient(db.Model):
    __tablename__ = 'recipe_ingredients'
    recipeID = Column(Integer, ForeignKey('recipes.recipeID'), primary_key=True)
    itemID = Column(Integer, ForeignKey('fridge_contents.contentID'), primary_key=True)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)

    recipe = relationship('Recipe', back_populates='ingredients')
    food_item = relationship('FridgeContent')


class UserSavedRecipes(db.Model):
    __tablename__ = 'user_saved_recipes'
    userID = Column(Integer, ForeignKey('users.userID'), primary_key=True)
    recipeID = Column(Integer, ForeignKey('recipes.recipeID'), primary_key=True)
    savedAt = Column(DateTime, default=datetime.now)

    user = relationship('User', back_populates='saved_recipes')


class ShoppingList(db.Model):
    __tablename__ = 'shopping_lists'
    listID = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    createdBy = Column(Integer, ForeignKey('users.userID'))
    createdAt = Column(DateTime, default=datetime.now)

    items = relationship('ShoppingListItem', back_populates='shopping_list')
    users = relationship('UserShoppingListAccess', back_populates='shopping_list')
    created_by_user = relationship('User', back_populates='created_shopping_lists')


class ShoppingListItem(db.Model):
    __tablename__ = 'shopping_list_items'
    listID = Column(Integer, ForeignKey('shopping_lists.listID'), primary_key=True)
    itemID = Column(Integer, ForeignKey('fridge_contents.contentID'), primary_key=True)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    addedBy = Column(Integer, ForeignKey('users.userID'))
    addedAt = Column(DateTime, default=datetime.now)

    shopping_list = relationship('ShoppingList', back_populates='items')
    food_item = relationship('FridgeContent')
    added_by_user = relationship('User', back_populates='shopping_list_items')


class UserShoppingListAccess(db.Model):
    __tablename__ = 'user_shopping_list_access'
    userID = Column(Integer, ForeignKey('users.userID'), primary_key=True)
    listID = Column(Integer, ForeignKey('shopping_lists.listID'), primary_key=True)
    accessLevel = Column(String, nullable=False)

    user = relationship('User', back_populates='shopping_list_access')
    shopping_list = relationship('ShoppingList', back_populates='users')