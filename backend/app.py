from flask import Flask, render_template, url_for, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from datetime import datetime
# from config import credentials
from get_data import view_data
from add_to_table import insert_data
from remove_from_table import delete_data
from update_table import update_data
from datetime import datetime
import bcrypt
# config is the python file used to store credentials.


app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI']= credentials
# db=SQLAlchemy(app)

# Define the User model
# class User(db.Model):
#     __tablename__ = 'test1'
#     UserId = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     username = db.Column(db.String(100), nullable=False, unique=True)
#     password_hash=db.Column(db.String(100),nullable=False,unique=True)
#     email = db.Column(db.String(100), nullable=False)
#     CreateAt = db.Column(db.DateTime, nullable=False)


@app.route('/get_credentials', methods=['POST'])
@cross_origin()
def login_credentials():
    print("Data endpoint hit")
    data = request.get_json()
    table_data = view_data('User')
    stored_p = None
    for entry in table_data:
        u, p = entry['username'], entry['password']
        print("=======Username=======")
        print(u)
        print(p)
        if u == data['username']:
            stored_p = p.encode()
            break
    if stored_p == None:
        return jsonify({
            "success": False,
        })
    return jsonify({
        "success": bcrypt.checkpw(data['password'].encode(), stored_p), 
    })


@app.route('/add_credentials', methods=['POST'])
@cross_origin()
def add_account():
    print("Data endpoint hit")
    data = request.get_json()
    table_data = view_data('User')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(data['password'].encode(), salt)

    for u, p, a, d in table_data:
        if u == data['username']:
            return jsonify("Username is not available")
    try:
        insert_data('User', {
            "username": data['username'],
            "password" : hashed_password,
            "fridgeIDs": [],
            "createdAt": datetime.today().strftime('%Y-%m-%d %H:%M:%S')
        })
        return jsonify("Successfully Added")
    except:
        return jsonify("Something went wrong.")


@app.route('/add_fridge', methods=['POST'])
@cross_origin()
def add_fridge():
    print("Data endpoint hit")
    data = request.get_json()
    try:
        fridgeIDs = []
        table_data = view_data('User')
        for entry in table_data:
            if entry['username'] == data['username']:
                fridgeIDs = data['fridgeIDs']

        insert_data('Fridge', {
            'itemIDs': [],
            'username': data['username'],
            'name': data['name'],
            'createdAt': datetime.today().strftime('%Y-%m-%d %H:%M:%S')
        })

        table_data = view_data('Fridge')
        fridgeID = None
        for entry in table_data:
            if entry['username'] == data['username'] and entry['name'] == data['name']:
                fridgeID = entry['fridgeID']
        
        update_data('User', {
            'fridgeIDs': fridgeIDs.append(fridgeID)
        }, 'username=' + data['username'])

        return jsonify({
            'success': True
        })
    except:
        return jsonify({
            'success': False
        })


@app.route('/add_fridge_content', methods=['POST'])
@cross_origin()
def add_fridge_content():
    print("Data endpoint hit")
    data = request.get_json()
    try:
        insert_data('FridgeContent', {
            'fridgeID': data.fridgeID,
            'quantity': data.quantity,
            'unit': data.unit,
            'expirationDate': data.expirationDate,
            'addedBy': data.username,
            'addedAt': datetime.today().strftime('%Y-%m-%d %H:%M:%S'),
            'name': data.name
        })
        return jsonify({
            'success': True
        })
    except:
        return jsonify({
            'success': False
        })



@app.route('/get_fridge_contents', methods=['POST'])
@cross_origin()
def get_fridge_contents():
    print("Data endpoint hit")
    data = request.get_json()
    table_data = view_data('User')
    fridgeIDs = None
    for entry in table_data:
        if data['username'] == entry['username']:
            fridgeIDs = entry['fridgeIDs']
            break
    
    if (fridgeIDs == None):
        return jsonify({
            "success": False
        })
    itemIDs = []
    table_data = view_data('Fridge')
    for fridgeID in fridgeIDs:
        for entry in table_data:
            if entry['fridgeID'] == fridgeID:
                itemIDs.append(entry['itemIDs'])
    
    if itemIDs == []:
        return jsonify({
            "success": False
        })
    
    fridge_contents = []
    table_data = view_data('FridgeContent')
    for itemID in itemIDs:
        for entry in table_data:
            if entry['itemID'] == itemID:
                fridge_contents.append(entry)
        
    if fridge_contents == []:
        return jsonify({
            "success": False
        })
    else:
        return jsonify({
            "success": True,
            "items": fridge_contents
        })


# @app.route('/',methods=['POST','GET'])
# def index(consoleInfo=""):
#     db.create_all()
#     return render_template("index.html",title="User input",consoleInfo=consoleInfo)

# @app.route('/submit',methods=['POST'])
# def submit():
#   username=request.form['username']
#   password_hash=request.form['password_hash']
#   email=request.form['email']

#   current_time = datetime.now()
#   CreateAt=current_time.strftime("%Y-%m-%d %H:%M:%S")

#   new_user = User(username=username,password_hash=password_hash
#                   ,email=email,CreateAt=CreateAt)
#   try:
#     db.session.add(new_user)
#     db.session.commit() 
#     return index(consoleInfo="last input was successful")
#   except:
#      print(f"Either {username} is used or the value entered is illegal.")
#      return index(consoleInfo="last input was not successful")

if __name__=="__main__":
  app.run(debug=True)


    