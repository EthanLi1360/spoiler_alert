from flask import Flask, render_template, url_for,request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from config import credentials
from flask import Flask, request, jsonify
import bcrypt
import mysql.connector
# config is the python file used to store credentials.


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']= credentials
# mysql://username:password@localhost/dbname
db=SQLAlchemy(app)