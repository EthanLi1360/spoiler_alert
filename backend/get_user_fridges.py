import sqlite3

def get_user_fridges(user_id):
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row  # Enable access to columns by name
    cursor = conn.cursor()

    # Query to retrieve all fridges for the specified user
    cursor.execute('''
        SELECT fridges.*
        FROM fridges
        JOIN user_fridge_access ON fridges.fridgeID = user_fridge_access.fridgeID
        WHERE user_fridge_access.userID = ?
    ''', (user_id,))

    fridges = cursor.fetchall()  # Fetch all results
    conn.close()

    return [dict(fridge) for fridge in fridges]  # Convert Row objects to dictionaries
