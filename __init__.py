from flask import Flask, render_template, url_for,request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from config import credentials
from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, auth
import bcrypt
import mysql.connector
# config is the python file used to store credentials.
# https://spoileralert-4f67c.firebaseapp.com/__/auth/handler

# Initialize Firebase Admin SDK
cred = credentials.Certificate('firebase_conifg.json')
firebase_admin.initialize_app(cred)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']= credentials
# mysql://username:password@localhost/dbname
db=SQLAlchemy(app)