import sqlite3

def delete_fridge(fridge_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Check if the fridge exists before trying to delete it
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
