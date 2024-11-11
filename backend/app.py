from flask import Flask, render_template, url_for, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from datetime import datetime
# from config import credentials
from get_data import view_data
from add_to_table import insert_data
from remove_from_table import delete_data
from update_table import update_data
from create_tables import reset
from datetime import datetime
import bcrypt
import logging


app = Flask(__name__)

#resets all db values when endpoint is reached
@app.route('/RESET', methods=['DELETE'])
@cross_origin()
def RESET():
    try:
        reset()
        return jsonify({"success" : True})
    except:
        return jsonify({"success": False})

#prints all db values to console when endpoint is reached
@app.route('/GET_DATA', methods=['GET'])
@cross_origin()
def GET_DATA():
    try:
        view_data('User')
        view_data('Fridge')
        view_data('FridgeContent')
        view_data('Recipe')
        view_data('FridgeAccess')
        return jsonify({"success" : True})
    except:
        return jsonify({"success" : True})


@app.route('/try_login', methods=['POST'])
@cross_origin()
def login_credentials():
    print("Try login endpoint endpoint hit")
    data = request.get_json()
    table_data = view_data('User')
    user_p = None
    matching_p = False
    for entry in table_data:
        u, p, s = entry['username'], entry['password'], entry['salt']
        if u == data['username']:
            user_p = bcrypt.hashpw(data['password'].encode(), s.encode())
            matching_p = user_p == p.encode()
            break
    if user_p == None or not matching_p:
        return jsonify({
            "success": False,
        })
    return jsonify({
        "success": True, 
    })


@app.route('/add_credentials', methods=['POST'])
@cross_origin()
def add_account():
    print("Data endpoint hit")
    data = request.get_json()
    table_data = view_data('User')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(data['password'].encode(), salt)

    for u, p, d in table_data:
        if u == data['username']:
            return jsonify({
                "success": False,
                "message": "Username is not available"
            })
    try:
        insert_data('User', {
            "username": data['username'],
            "password" : hashed_password,
            "createdAt": datetime.today().strftime('%Y-%m-%d %H:%M:%S'),
            "salt": salt
        })
        return jsonify({
                "success": True,
                "message": "User successfully added"
            })
    except:
        return jsonify({
                "success": False,
                "message": "Something went wrong"
            })


@app.route('/add_fridge', methods=['POST'])
@cross_origin()
def add_fridge():
    print("Add fridge data endpoint hit")
    data = request.get_json()
    try:
        date = datetime.today()
        fridgeID = insert_data('Fridge', {
            'name': data['name'],
            'createdAt': date
        })
        insert_data('FridgeAccess', {
            'username': data['username'],
            'fridgeID': fridgeID,
            'accessLevel': 'ADMIN'
        })
        
        return jsonify({
            'success': True
        })
    except Exception:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False
        })


@app.route('/remove_fridge', methods=['DELETE'])
@cross_origin()
def delete_fridge():
    print("Remove Fridge data endpoint hit")
    try:
        fridgeID = request.args.get('fridgeID')
        #update all users with access to this fridge to no longer have access
        # fridge_access_data = view_data('FridgeAccess')
        # for access in fridge_access_data:
        #     if str(access['fridgeID']) == int(fridgeID):
        #         usernames.append(access['username'])
        # user_data = view_data('User')
        # for username in usernames:
        #     fridgeIDs = []
        #     for user in user_data:
        #         if user['username'] == username:
        #             fridgeIDs = user['fridgeIDs'].split(',')
        #             fridgeIDs.remove(fridgeID)
        #     strIds = ','.join(fridgeIDs)
        #     update_data('User', {
        #         'fridgeIDs': strIds
        #     }, 'username', username)
        #delete all fridge contents
        thisFridgeContents = get_fridge_contents_with_id(int(fridgeID))
        for item in thisFridgeContents:
            delete_data('FridgeContent', item['itemID'], 'itemID')
        #delete all fridgeaccess rows for this fridge
        delete_data('FridgeAccess', int(fridgeID), 'fridgeID')
        #delete fridge
        delete_data('Fridge', fridgeID, 'fridgeID')

        return jsonify({
            'success': True
        })
    except:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False
        })
    

@app.route('/add_fridge_content', methods=['POST'])
@cross_origin()
def add_fridge_content():
    print("Add Fridge Content data endpoint hit")
    data = request.get_json()
    try:
        fridgeID = None
        table_data = view_data('User')
        for entry in table_data:
            if data['username'] == entry['username']:
                fridgeIDs = entry['fridgeIDs'].split(',')
                fridgeID = int(fridgeIDs[fridgeIDs.index(str(data['fridgeID']))])
        posted_data = {
            'fridgeID': fridgeID,
            'quantity': data['quantity'],
            'unit': data['unit'],
            'expirationDate': data['expirationDate'],
            'addedBy': data['username'],
            'addedAt': datetime.today().strftime('%Y-%m-%d %H:%M:%S'),
            'name': data['name'],
            'category': data['category']

        }
        insert_data('FridgeContent', posted_data)
        return jsonify({
            'success': True,
            'item': posted_data
        })
    except:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False,
            'item': {}
        })


@app.route('/get_fridge_contents', methods=['GET'])
@cross_origin()
def get_fridge_contents():
    print("Get Fridge Content data endpoint hit")
    try:
        toReturn = get_fridge_contents_with_id(int(request.args.get('fridgeID')))
        return jsonify({
            'success': True,
            'items': toReturn
        })
    except:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False,
            'items': []
        })
    

#HELPER METHOD
def get_fridge_contents_with_id(id):
    fridge_content = view_data('FridgeContent')
    toReturn = []
    for content in fridge_content:
        if content['fridgeID'] == id:
            toReturn.append(content)
    return toReturn




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


    