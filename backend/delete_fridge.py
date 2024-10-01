import sqlite3

def delete_fridge(fridge_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM fridges WHERE fridgeID = ?', (fridge_id,))
    fridge = cursor.fetchone()
    
    if fridge:
        cursor.execute('DELETE FROM fridges WHERE fridgeID = ?', (fridge_id,))
        conn.commit()
        conn.close()
        return {"message": "Fridge deleted successfully"}, 200
    else:
        conn.close()
        return {"message": "Fridge not found"}, 404
