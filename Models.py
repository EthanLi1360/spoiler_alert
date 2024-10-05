from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from flask import Flask, render_template, url_for,request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from config import credentials
from flask import Flask, request, jsonify
import bcrypt
import mysql.connector

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']= credentials
# mysql://username:password@localhost/dbname
db=SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    userID = Column(Integer, primary_key=True)
    username = Column(String(200), unique=True, nullable=False)
    password_hash = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    createdAt = Column(DateTime, default=datetime.now)

    fridges = relationship('UserFridgeAccess', back_populates='user')
    recipes_access = relationship('UserRecipesAccess', back_populates='user')
    fridge_contents = relationship('FridgeContents', back_populates='added_by_user')
    created_recipes = relationship('Recipes', back_populates='created_by_user')


class Fridge(db.Model):
    __tablename__ = 'fridges'
    fridgeID = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    createdAt = Column(DateTime, default=datetime.now)

    contents = relationship('FridgeContents', back_populates='fridge')
    users = relationship('UserFridgeAccess', back_populates='fridge')


class UserFridgeAccess(db.Model):
    __tablename__ = 'user_fridge_access'
    userID = Column(Integer, ForeignKey('users.userID'), primary_key=True)
    fridgeID = Column(Integer, ForeignKey('fridges.fridgeID'), primary_key=True)
    accessLevel = Column(String(200))

    user = relationship('User', back_populates='fridges')
    fridge = relationship('Fridge', back_populates='users')


class FridgeContents(db.Model):
    __tablename__ = 'fridge_contents'
    contentID = Column(Integer, primary_key=True)
    fridgeID = Column(Integer, ForeignKey('fridges.fridgeID'))
    name = Column(String(200), nullable=False)
    category = Column(String(200))
    defaultExpirationDays = Column(Integer)
    quantity = Column(Float, nullable=False)
    unit = Column(String(200), nullable=False)
    expirationDate = Column(Date, nullable=False)
    addedBy = Column(Integer, ForeignKey('users.userID'))
    addedAt = Column(DateTime, default=datetime.now)

    fridge = relationship('Fridge', back_populates='contents')
    added_by_user = relationship('User', back_populates='fridge_contents')


class Recipes(db.Model):
    __tablename__ = 'recipes'
    recipeID = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    instructions = Column(Text, nullable=False)
    cuisine = Column(String(200))
    dietaryRestrictions = Column(String(200))
    createdBy = Column(Integer, ForeignKey('users.userID'))
    createdAt = Column(DateTime, default=datetime.now)

    ingredients = relationship('RecipeIngredients', back_populates='recipes')
    created_by_user = relationship('User', back_populates='created_recipes')


class RecipeIngredients(db.Model):
    __tablename__ = 'recipe_ingredients'
    recipeID = Column(Integer, ForeignKey('recipes.recipeID'), primary_key=True)
    itemID = Column(Integer, ForeignKey('fridge_contents.contentID'))
    quantity = Column(Float, nullable=False)
    unit = Column(String(200), nullable=False)

    recipes = relationship('Recipes', back_populates='ingredients')
    food_item = relationship('FridgeContents')


class UserRecipesAccess(db.Model):
    __tablename__ = 'user_recipes_access'
    userID = Column(Integer, ForeignKey('users.userID'), primary_key=True)
    recipeID = Column(Integer, ForeignKey('recipes.recipeID'), primary_key=True)
    accessLevel = Column(String(200), nullable=False)
    savedAt = Column(DateTime, default=datetime.now)

    user = relationship('User', back_populates='recipes_access')
    recipes = relationship('Recipes')