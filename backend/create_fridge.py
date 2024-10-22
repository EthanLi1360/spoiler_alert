import sqlite3

def create_fridge(data):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO fridges (name) VALUES (?)', (data['name'],))
    conn.commit()
    conn.close()
    return {"message": "Fridge created successfully"}, 201
