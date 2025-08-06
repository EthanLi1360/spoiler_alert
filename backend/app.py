from flask import Flask, render_template, url_for, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from datetime import datetime
# from config import credentials
from get_data import view_data
from add_to_table import insert_data
from remove_from_table import delete_data, delete_data_multiple_columns
from update_table import update_data, update_data_multiple_columns
from create_tables import reset
from datetime import datetime
import bcrypt
import logging
import json
import time
import os
from uuid import uuid4
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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
        view_data('Wishlist')
        view_data('WishlistItems')
        return jsonify({"success" : True})
    except:
        return jsonify({"success" : True})


def current_time_millis():
    return round(time.time() * 1000)


@app.route('/try_token', methods=['GET'])
@cross_origin()
def try_token():
    for entry in view_data('User'):
        if entry['username'] == request.args.get("username"):
            if entry['token'] == request.args.get("token") and \
            current_time_millis() - 4.32e+7 < int(entry['tokenTimestamp']):
                return jsonify({
                    "success": True,
                    "username": entry['username']
                })
            else:
                return jsonify({
                    "success": False
                })
    return jsonify({
        "success": False
    })


@app.route('/try_login', methods=['POST'])
@cross_origin()
def login_credentials():
    print("Try login endpoint endpoint hit")
    data = request.get_json()
    table_data = view_data('User')
    #inputted password
    user_p = None
    #whether hashes match
    matching_p = False
    for entry in table_data:
        u, p, s = entry['username'], entry['password'], entry['salt']
        if u == data['username']:
            user_p = bcrypt.hashpw(data['password'].encode(), s.encode())
            matching_p = user_p == p.encode()
            break
    #user not found or mistmatching password
    if user_p == None or not matching_p:
        return jsonify({
            "success": False,
        })

    # generate token
    # TODO generate new token if timestamp is too old, NOT always!
    new_token = uuid4()
    timestamp = current_time_millis()
    print(timestamp)
    update_data('User', {"token": new_token}, "username", data["username"])
    return jsonify({
        "success": True,
        "token": new_token,
        "timestamp": timestamp
    })


@app.route('/add_credentials', methods=['POST'])
@cross_origin()
def add_account():
    print("Data endpoint hit")
    data = request.get_json()
    table_data = view_data('User')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(data['password'].encode(), salt)
    for entry in table_data:
        u = entry['username']
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
        #delete all contents in this fridge
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
    """
    Add a food item to a fridge with comprehensive input validation.
    Validates quantity, expiration date, and required fields.
    """
    print("Add Fridge Content data endpoint hit")
    data = request.get_json()
    
    # Input validation
    try:
        # Validate required fields
        required_fields = ['fridgeID', 'quantity', 'unit', 'name', 'category', 'username']
        for field in required_fields:
            if field not in data or data[field] is None or str(data[field]).strip() == '':
                return jsonify({
                    'success': False,
                    'error': f'Required field "{field}" is missing or empty'
                }), 400
        
        # Validate quantity is positive number
        try:
            quantity = float(data['quantity'])
            if quantity <= 0:
                return jsonify({
                    'success': False,
                    'error': 'Quantity must be a positive number greater than 0'
                }), 400
        except (ValueError, TypeError):
            return jsonify({
                'success': False,
                'error': 'Quantity must be a valid number'
            }), 400
        
        # Validate unit is not empty
        if not str(data['unit']).strip():
            return jsonify({
                'success': False,
                'error': 'Unit cannot be empty'
            }), 400
        
        # Validate name length
        if len(str(data['name']).strip()) < 2:
            return jsonify({
                'success': False,
                'error': 'Food name must be at least 2 characters long'
            }), 400
        
        # Validate category
        valid_categories = [
            'Dairy Products', 'Fruits', 'Vegetables', 'Meats, Poultry, and Fish',
            'Eggs and Egg Products', 'Condiments, Sauces and Spreads', 'Beverages',
            'Leftovers and Pre-Cooked Meals', 'Other Items'
        ]
        if data['category'] not in valid_categories:
            return jsonify({
                'success': False,
                'error': f'Invalid category. Must be one of: {", ".join(valid_categories)}'
            }), 400
        
        # Validate fridge exists
        confirmed_fridge_ID = None
        fridge_rows = view_data('Fridge')
        for fridge in fridge_rows:
            if fridge['fridgeID'] == data['fridgeID']:
                confirmed_fridge_ID = data['fridgeID']
                break
        
        if confirmed_fridge_ID == None:
            return jsonify({
                'success': False,
                'error': 'Fridge not found with the specified ID'
            }), 404
        
        # Validate expiration date for non-freezer items
        is_in_freezer = data.get('isInFreezer', False)
        if not is_in_freezer and (data.get('expirationDate') is None or str(data.get('expirationDate')).strip() == ''):
            return jsonify({
                'success': False,
                'error': 'Expiration date is required for items not stored in freezer'
            }), 400
        
        # Prepare data for insertion
        posted_data = {
            'fridgeID': confirmed_fridge_ID,
            'quantity': quantity,
            'unit': str(data['unit']).strip(),
            'expirationDate': data.get('expirationDate'),
            'addedBy': str(data['username']).strip(),
            'addedAt': datetime.today().strftime('%Y-%m-%d %H:%M:%S'),
            'name': str(data['name']).strip(),
            'category': data['category'],
            'isInFreezer': 1 if is_in_freezer else 0
        }
        
        insert_data('FridgeContent', posted_data)
        return jsonify({
            'success': True,
            'item': posted_data,
            'message': 'Food item added successfully'
        })
        
    except Exception as e:
        print("EXCEPTION:", str(e))
        logging.exception("Error adding fridge content")
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500


@app.route('/get_fridge_contents', methods=['GET'])
@cross_origin()
def get_fridge_contents():
    print("Get Fridge Content data endpoint hit")
    try:
        print(int(request.args.get('fridgeID')))
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
    

@app.route('/get_fridges', methods=['GET'])
@cross_origin()
def get_user_fridges():
    print("Get Fridges data endpoint hit")
    try:
        username = request.args.get('username')
        fridge_access_data = view_data('FridgeAccess')
        fridge_ids = set()
        for access in fridge_access_data:
            if access['username'] == username:
                fridge_ids.add(access['fridgeID'])

        fridge_data = view_data('Fridge')
        fridges = []
        for fridge in fridge_data:
            if fridge['fridgeID'] in fridge_ids:
                fridges.append(fridge)

        return jsonify({
            'success': True,
            'fridges': fridges
        })
    except:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False,
            'fridgeIDs': []
        })


@app.route('/update_fridge_content', methods=['PATCH'])
@cross_origin()
def update_fridge_content():
    """
    Update an existing food item in a fridge with comprehensive input validation.
    """
    print("Update fridge content data endpoint hit")
    data = request.get_json()
    
    try:
        # Validate required fields for update
        required_fields = ['fridgeID', 'itemID']
        for field in required_fields:
            if field not in data or data[field] is None:
                return jsonify({
                    'success': False,
                    'error': f'Required field "{field}" is missing'
                }), 400
        
        # Validate fridge exists
        fridge_ID = None
        fridge_data = view_data('Fridge')
        for fridge in fridge_data:
            if fridge['fridgeID'] == data['fridgeID']:
                fridge_ID = data['fridgeID']
                break
        
        if fridge_ID == None:
            return jsonify({
                'success': False,
                'error': 'Fridge not found with the specified ID'
            }), 404
        
        # Validate item exists in the fridge
        item_ID = None
        content_data = view_data('FridgeContent')
        content_to_edit = None
        for content in content_data:
            if content['itemID'] == data['itemID']:
                item_ID = data['itemID']
                content_to_edit = content
                break
        
        if item_ID == None or content_to_edit['fridgeID'] != fridge_ID:
            return jsonify({
                'success': False,
                'error': 'Food item not found in the specified fridge'
            }), 404
        
        # Validate and update fields
        if 'name' in data:
            if not str(data['name']).strip() or len(str(data['name']).strip()) < 2:
                return jsonify({
                    'success': False,
                    'error': 'Food name must be at least 2 characters long'
                }), 400
            content_to_edit['name'] = str(data['name']).strip()
        
        if 'quantity' in data:
            try:
                quantity = float(data['quantity'])
                if quantity <= 0:
                    return jsonify({
                        'success': False,
                        'error': 'Quantity must be a positive number greater than 0'
                    }), 400
                content_to_edit['quantity'] = quantity
            except (ValueError, TypeError):
                return jsonify({
                    'success': False,
                    'error': 'Quantity must be a valid number'
                }), 400
        
        if 'unit' in data:
            if not str(data['unit']).strip():
                return jsonify({
                    'success': False,
                    'error': 'Unit cannot be empty'
                }), 400
            content_to_edit['unit'] = str(data['unit']).strip()
        
        if 'category' in data:
            valid_categories = [
                'Dairy Products', 'Fruits', 'Vegetables', 'Meats, Poultry, and Fish',
                'Eggs and Egg Products', 'Condiments, Sauces and Spreads', 'Beverages',
                'Leftovers and Pre-Cooked Meals', 'Other Items'
            ]
            if data['category'] not in valid_categories:
                return jsonify({
                    'success': False,
                    'error': f'Invalid category. Must be one of: {", ".join(valid_categories)}'
                }), 400
            content_to_edit['category'] = data['category']
        
        if 'expirationDate' in data:
            content_to_edit['expirationDate'] = data['expirationDate']
        
        if 'isInFreezer' in data:
            content_to_edit['isInFreezer'] = 1 if data['isInFreezer'] else 0
        
        # Validate expiration date for non-freezer items
        if content_to_edit['isInFreezer'] == 0 and (content_to_edit.get('expirationDate') is None or str(content_to_edit.get('expirationDate')).strip() == ''):
            return jsonify({
                'success': False,
                'error': 'Expiration date is required for items not stored in freezer'
            }), 400
        
        # Update the item in database
        update_data('FridgeContent', content_to_edit, 'ItemID', item_ID)
        
        return jsonify({
            'success': True,
            'item': content_to_edit,
            'message': 'Food item updated successfully'
        })
        
    except Exception as e:
        print("EXCEPTION:", str(e))
        logging.exception("Error updating fridge content")
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500


@app.route('/delete_fridge_content', methods=['DELETE'])
@cross_origin()
def delete_fridge_content():
    print("Delete fridge content data endpoint hit")
    try:
        data = request.get_json()
        fridge_ID = None
        fridge_data = view_data('Fridge')
        for fridge in fridge_data:
            if fridge['fridgeID'] == data['fridgeID']:
                fridge_ID = data['fridgeID']
        if fridge_ID == None:
            raise Exception('No Fridge with inputted ID')
        item_ID = None
        content_data = view_data('FridgeContent')
        for content in content_data:
            if content['itemID'] == data['itemID']:
                item_ID = data['itemID']
                if content['fridgeID'] != fridge_ID:
                    raise Exception('Content not in Fridge with inputted Fridge ID')
        if item_ID == None:
            raise Exception('No Fridge Content with inputted ID')
        delete_data('FridgeContent', item_ID, 'ItemID')
        return jsonify({
            'success': True
        })
    except:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False
        })
    
@app.route('/update_fridge_access', methods=['PATCH'])
@cross_origin()
def update_fridge_access():
    print("Update fridge access data endpoint hit")
    try:
        data = request.get_json()
        access_data = view_data('FridgeAccess')
        access_to_edit = {}
        for access in access_data:
            if access['username'] == data['username'] and access['fridgeID'] == data['fridgeID']:
                access_to_edit = access
        access_to_edit['accessLevel'] = data['accessLevel']
        update_data_multiple_columns('FridgeAccess', access_to_edit, ['username', 'fridgeID'], [data['username'], data['fridgeID']])
        return jsonify({
                'success': True
            })
    except:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False
        })
 

@app.route('/remove_fridge_access', methods=['DELETE'])
@cross_origin()
def remove_fridge_access():
    print("Remove fridge access data endpoint hit")
    try:
        data = request.get_json()
        username, fridgeID = data['username'], data['fridgeID']
        delete_data_multiple_columns('FridgeAccess', [username, fridgeID], ['username', 'fridgeID'])
        return jsonify({
                'success': True
            })
    except:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False
        })
    

@app.route('/add_fridge_access', methods=['POST'])
@cross_origin()
def add_fridge_access():
    print("Add fridge access data endpoint hit")
    try:
        data = request.get_json()
        username, fridgeID, accessLevel = data['username'], data['fridgeID'], data['accessLevel']
        fridges_data = view_data('Fridge')
        fridge_found = False
        for fridge in fridges_data:
            if fridge['fridgeID'] == fridgeID:
                fridge_found = True
                break
        if not fridge_found:
            raise Exception("No fridge with inputted ID")
        insert_data('FridgeAccess', {
            'username': username,
            'fridgeID': fridgeID,
            'accessLevel': accessLevel
        })
        return jsonify({
                'success': True
            })
    except:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False
        })
        
#HELPER METHOD
def get_fridge_contents_with_id(id):
    fridge_content = view_data('FridgeContent')
    toReturn = []
    for content in fridge_content:
        if content['fridgeID'] == id:
            toReturn.append(content)
    return toReturn



@app.route('/save_recipe', methods=['POST'])
@cross_origin()
def save_recipe():
    print("Save Recipe data endpoint hit")
    try:
        data = request.get_json()
        print(data)
        fridgeID = int(data['fridgeID'])
        recipe_data = data['recipe']
        date = datetime.today()
        recipe_data['ingredients'] = json.dumps(recipe_data['ingredients'])
        recipe_data['instructions'] = json.dumps(recipe_data['instructions'])
        recipe_data['dietaryRestrictions'] = json.dumps(recipe_data['dietaryRestrictions'])
        new_recipe = {
            'fridgeID': fridgeID,
            'name': recipe_data['name'],
            'ingredients': recipe_data['ingredients'],
            'instructions': recipe_data['instructions'],
            'createdBy': recipe_data['createdBy'],
            'createdAt': date,
            'dietaryRestrictions': recipe_data['dietaryRestrictions'],
            'cuisine': recipe_data['cuisine']
        }

        recipeID = insert_data('Recipe', new_recipe)
        return jsonify({
            'recipeID': recipeID,
            'success': True
        })
    except Exception:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False
        })

@app.route('/view_saved_recipes', methods=['GET'])
@cross_origin()
def view_saved_recipes():
    print("View saved recipes data endpoint hit")
    try:
        fridgeID = request.args.get('fridgeID')
        recipes = get_table_content_with_key('Recipe', 'fridgeID', int(fridgeID))
        formatted_recipes = []
        for recipe in recipes:
            formatted_recipe = {
                "name": recipe["name"],
                "recipeID": recipe["recipeID"],
                "instructions": json.loads(recipe["instructions"]),
                "cuisine": recipe["cuisine"],
                "dietaryRestrictions": json.loads(recipe["dietaryRestrictions"]),
                "createdBy": recipe["createdBy"],
                "createdAt": recipe["createdAt"],
                "ingredients": json.loads(recipe["ingredients"])
            }
            formatted_recipes.append(formatted_recipe)
        return jsonify({
            'success': True,
            'recipes': formatted_recipes
        })
    except:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False,
            'recipes': []
        })   


@app.route('/delete_recipe', methods=['DELETE'])
@cross_origin()
def delete_recipe():
    try:
        fridgeID = request.args.get('fridgeID')
        recipeID = request.args.get('recipeID')
        delete_data_multiple_columns('Recipe', [fridgeID, recipeID], ['fridgeID', 'recipeID'])
        return jsonify({
                'success': True
            })
    except:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False
        })

@app.route('/create_wishlist', methods=['POST'])
@cross_origin()
def create_wishlist():
    try:
        date = datetime.today()
        data = request.get_json()
        fridgeID = data['fridgeID']
        name = data['name']
        wishlistID = insert_data('Wishlist', {
            'fridgeID': fridgeID,
            'name': name,
            'createdAt': date
        })
        return jsonify({
            'success': True,
            'wishlistID': wishlistID
        })
    except Exception:
        logging.exception("error_log")
        return jsonify({
            'success': False
        })
@app.route('/get_wishlists', methods=['GET'])
@cross_origin()
def get_wishlists():
    try:
        fridgeID = request.args.get('fridgeID')
        wishlists = get_table_content_with_key('Wishlist', 'fridgeID', int(fridgeID))
        temp = []
        for wishlist in wishlists:
            temp.append(wishlist)
        return jsonify({
            'success': True,
            'wishlists': temp
        })
    except Exception:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False
        }) 
    
@app.route('/delete_wishlist', methods=['DELETE'])
@cross_origin()
def delete_wishlist():
    try:
        fridgeID = request.args.get('fridgeID')
        wishlistID = request.args.get('wishlistID')
        print(fridgeID)
        print(wishlistID)
        delete_data_multiple_columns('Wishlist', [fridgeID, wishlistID], ['fridgeID', 'wishlistID'])
        return jsonify({
            'success': True
        })
    except:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False
        })

@app.route('/add_wishlist_item', methods=['POST'])
@cross_origin()
def add_wishlist_item():
    try:
        data = request.get_json()
        wishlistID = data['wishlistID']
        name = data['name']
        quantity = data['quantity']
        unit = data['unit']
        itemID = insert_data('WishlistItems', {
            'wishlistID': wishlistID,
            'name': name,
            'quantity': quantity,
            'unit': unit
        })
        itemToReturn = {
            'name': name,
            'quantity': quantity,
            'unit': unit,
            'itemID': itemID
        }
        return jsonify({
            'success': True,
            'item': itemToReturn
        })
    except Exception:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False,
            'item': {}
        })   

@app.route('/get_wishlist_items', methods=['GET'])
@cross_origin()
def get_wishlist_item():
    try:
        wishlistID = request.args.get('wishlistID')
        items = get_table_content_with_key('WishlistItems','wishlistID',int(wishlistID))
        formatted_items = []
        for item in items:
            formatted_item = {
                'name': item['name'],
                'quantity': item['quantity'],
                'unit': item['unit'],
                'itemID': item['itemID']
            }
            formatted_items.append(formatted_item)
        return jsonify({
            'success': True,
            'items': formatted_items
        })
    except:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False,
            'items': []
        })   

@app.route('/update_wishlist_item', methods=['PATCH'])
@cross_origin()
def update_wishlist_item():
    print("Update wishlist item endpoint hit")
    try:
        data = request.get_json()
        print(data)
        wishlistID = None
        wishlist_data = view_data('Wishlist')
        for wishlist in wishlist_data:
            if wishlist['wishlistID'] == data['wishlistID']:
                wishlistID = data['wishlistID']
                break
        if wishlistID == None:
            raise Exception("No Wishlist with inputted ID")
        itemID = None
        content_data = view_data('WishlistItems')
        content_to_edit = None
        for content in content_data:
            if content['itemID'] == data['itemID']:
                itemID = data['itemID']
                content_to_edit = content
                break
        if itemID == None or content_to_edit['wishlistID'] != wishlistID:
            raise Exception('No item in the wishlist with the inputted ID')
        if 'name' in data:
            content_to_edit['name'] = data['name']
        if 'quantity' in data:
            content_to_edit['quantity'] = data['quantity']
        if 'unit' in data:
            content_to_edit['unit'] = data['unit']
        print(wishlistID)
        print(itemID)
        print(content_to_edit)
        update_data('WishlistItems', content_to_edit, 'itemID', itemID)
        return jsonify({
            'success': True,
            'item': content_to_edit
        })  
    except:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False,
            'item': {}
        })
    
@app.route('/delete_wishlist_item', methods=['DELETE'])
@cross_origin()
def delete_wishlist_item():
    try:
        wishlistID = request.args.get('wishlistID')
        itemID = request.args.get('itemID')
        print(wishlistID)
        print(itemID)
        delete_data_multiple_columns('WishlistItems', [wishlistID, itemID], ['wishlistID', 'itemID'])
        return jsonify({
                'success': True
            })
    except:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False
        })
@app.route('/add_all_recipe_ingredients_to_wishlist', methods=['POST'])
@cross_origin()
def add_all_recipe_ingredients_to_wishlist():
    try:
        data = request.get_json()
        recipeID = data['recipeID']
        wishlistID = None
        recipe_data = view_data('Recipe')
        ingredients = None
        wishlist_data = view_data('Wishlist')
        for wishlist in wishlist_data:
            if wishlist['wishlistID'] == data['wishlistID']:
                wishlistID = data['wishlistID']
                break
        if wishlistID == None:
            raise Exception("No Wishlist with inputted ID")
        for recipe in recipe_data:
            if recipe['recipeID'] == recipeID:
                ingredients = recipe['ingredients']
                break
        if ingredients == None:
            raise Exception("No ingredients found with the inputted recipe id")
        ingredients = json.loads(ingredients)

        for ingredient in ingredients:
            item = add_wishlist_item_helper(wishlistID,ingredient['name'],ingredient['quantity'],ingredient['unit'])

        return jsonify({
                'success': True,
                'wishlistID': wishlistID
            })
    except:
        print("EXCEPTION")
        logging.exception("error_log")
        return jsonify({
            'success': False
        })
    
#HELPER METHOD FOR ADD ITEM TO WISHLIST
def add_wishlist_item_helper(wishlistID, name, quantity, unit):
    try:
        itemID = insert_data('WishlistItems', {
            'wishlistID': wishlistID,
            'name': name,
            'quantity': quantity,
            'unit': unit
        })
        return {
            'name': name,
            'quantity': quantity,
            'unit': unit,
            'itemID': itemID
        }
    except Exception as e:
        print("EXCEPTION")
        logging.exception("error_log")
        raise e
#HELPER METHOD
def get_table_content_with_key(table, key, id):
    contents = view_data(table)
    print('contents')
    print(contents)
    toReturn = []
    for content in contents:
        if content[key] == id:
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

@app.route('/get_gemini_api_key', methods=['GET'])
@cross_origin()
def get_gemini_api_key():
    """
    Endpoint to provide the Gemini API key to authenticated frontend requests.
    This centralizes API key management and keeps sensitive keys in the backend.
    """
    try:
        # Get the API key from environment variables
        api_key = os.getenv("GEMINI_API_KEY")
        
        if not api_key:
            return jsonify({
                "success": False,
                "error": "Gemini API key not configured"
            }), 500
            
        return jsonify({
            "success": True,
            "api_key": api_key
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__=="__main__":
  app.run(debug=True, port=5001)


    