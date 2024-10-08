from flask import Flask, request, jsonify
from create_fridge import create_fridge
from delete_fridge import delete_fridge
from get_user_fridges import get_user_fridges
from get_food import get_food


app = Flask(__name__)

@app.route('/fridge', methods=['POST'])
def add_fridge():
    data = request.get_json()
    return create_fridge(data)

@app.route('/fridge/<int:fridge_id>', methods=['DELETE'])
def remove_fridge(fridge_id):
    return delete_fridge(fridge_id)

@app.route('/user/<int:user_id>/fridges', methods=['GET'])
def user_fridges(user_id):
    fridges = get_user_fridges(user_id)
    return {"fridges": fridges}, 200

@app.route('/fridge/<int:fridge_id>', methods=['GET'])
def return_food(fridge_id):
    food = get_food(fridge_id)
    return jsonify(food), 200