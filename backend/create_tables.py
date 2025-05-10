from collections import defaultdict
import pymysql
from dotenv import load_dotenv
import os

load_dotenv()

# Default connection timeout in seconds
DB_CONNECT_TIMEOUT = int(os.getenv("DB_CONNECT_TIMEOUT", 10))

conn = pymysql.connect(
  charset="utf8mb4",
  connect_timeout=DB_CONNECT_TIMEOUT,
  cursorclass=pymysql.cursors.DictCursor,
  db=os.getenv("DB_NAME"),
  host=os.getenv("DB_HOST"),
  password=os.getenv("DB_PASS"),
  port=int(os.getenv("DB_PORT")),
  read_timeout=DB_CONNECT_TIMEOUT,
  user=os.getenv("DB_USER"),
  write_timeout=DB_CONNECT_TIMEOUT,
)


def create_table(table_name, columns, conn=conn):
    cursor = conn.cursor()

    column_definitions = []

    for column_name, column_type in columns.items():
        if column_type is None:
            column_type = "VARCHAR(50)"
        column_definitions.append(f"{column_name} {column_type}")
    
    columns_string = ", ".join(column_definitions)

    create_table_query = f"""
    CREATE TABLE IF NOT EXISTS {table_name} (
        {columns_string}
    );
    """
    
    cursor.execute(create_table_query)

    conn.commit()
    cursor.close()


user = {
    'username': 'VARCHAR(75) PRIMARY KEY',
    'password': 'VARCHAR(75)',
    'createdAt': 'DATE',
    'salt': 'VARCHAR(75)',
    'token': 'VARCHAR(75)',
}

fridge = {
    'fridgeID': 'INT(10) UNSIGNED PRIMARY KEY AUTO_INCREMENT',
    'name': 'VARCHAR(75)',
    'createdAt': 'DATE'
}

fridge_content = {
    'itemID': 'INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY',
    'fridgeID': 'INT(10) UNSIGNED',
    'quantity': 'FLOAT NOT NULL',
    'unit': 'VARCHAR(20) NOT NULL',
    'expirationDate': 'DATE',
    'addedBy': 'VARCHAR(75)',
    'addedAt': 'DATE',
    'name': 'VARCHAR(30)',
    'category': 'VARCHAR(30)',
    'isInFreezer': 'BOOLEAN DEFAULT 0'

}

recipe = {
    'recipeID': 'INT(10) UNSIGNED PRIMARY KEY AUTO_INCREMENT',
    'fridgeID': 'INT(10) UNSIGNED',
    'name': 'VARCHAR(50) NOT NULL',
    'ingredients': 'TEXT NOT NULL',
    'instructions': 'TEXT NOT NULL',
    'cuisine': 'VARCHAR(50)',
    'dietaryRestrictions': 'VARCHAR(100)',
    'createdBy': 'VARCHAR(75) NOT NULL',
    'createdAt': 'DATE',
}

fridge_access = {
    'username': 'VARCHAR(75) NOT NULL',
    'fridgeID': 'INT(10) UNSIGNED NOT NULL',
    'accessLevel': 'VARCHAR(30) NOT NULL',
    'CONSTRAINT': 'PK_Access PRIMARY KEY (username,fridgeID)'
}

wishlist = {
    'wishlistID': 'INT(10) UNSIGNED PRIMARY KEY AUTO_INCREMENT',
    'name': 'VARCHAR(75)',
    'createdAt': 'DATE',
    'fridgeID': 'INT(10) UNSIGNED'
}

wishlist_item = {
    'itemID': 'INT(10) UNSIGNED PRIMARY KEY AUTO_INCREMENT',
    'wishlistID': 'INT(10) UNSIGNED',
    'name': 'VARCHAR(75)',
    'quantity': 'FLOAT NOT NULL',
    'unit': 'VARCHAR(20) NOT NULL'
}


def remove_table(table_name, conn=conn):
    cursor = conn.cursor()
    drop_query = f"DROP TABLE IF EXISTS {table_name}"
    print(f"Executing query: {drop_query}")
    cursor.execute(drop_query)
    conn.commit()
    print(f"Table {table_name} has been removed (if it existed).")
    cursor.close()

def reset():
    remove_table('User')
    remove_table('Fridge')
    remove_table('FridgeContent')
    remove_table('Recipe')
    remove_table('FridgeAccess')
    remove_table('Wishlist')
    remove_table('WishlistItems')

    create_table('User', user)
    create_table('Fridge', fridge)
    create_table('FridgeContent', fridge_content)
    create_table('Recipe', recipe)
    create_table('FridgeAccess', fridge_access)
    create_table('Wishlist', wishlist)
    create_table('WishlistItems', wishlist_item)

# remove_table('Recipe')
# create_table('Recipe', recipe)

# if False:
# reset()

if __name__ == "__main__":
    create_table('Wishlist', wishlist)
    create_table('WishlistItems', wishlist_item)