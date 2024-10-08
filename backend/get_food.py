import sqlite3

def get_food(fridge_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM fridges WHERE fridgeID = ?', (fridge_id,))
    fridge = cursor.fetchone()

    if fridge:
        cursor.execute('SELECT itemID, quantity, expirationDate FROM fridge_contents WHERE fridgeID = ?', (fridge_id, ))
        food_items = cursor.fetchall()
        conn.close()

        if food_items:
            return [{"itemID": item[0], "quantity": item[1], "expirationDate": item[2]} for item in food_items]
        else:
            return {"message": "No food items found in this fridge"}, 404
    else:
        conn.close()
        return {"message": "Fridge not found"}, 404
    
