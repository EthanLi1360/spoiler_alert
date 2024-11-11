from collections import defaultdict
from dotenv import load_dotenv
import os
import pymysql
#load environment variables from .env to OS
load_dotenv()

timeout = 10000
conn = pymysql.connect(
  charset="utf8mb4",
  connect_timeout=timeout,
  cursorclass=pymysql.cursors.DictCursor,
  db="defaultdb",
  host="spoiler-alert-spoileralert.d.aivencloud.com",
  read_timeout=timeout,
  port=24887,
  user="avnadmin",
  password=os.environ['AIVEN_PASS'],
  write_timeout=timeout,
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
    'salt': 'VARCHAR(75)'
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
    'name': 'VARCHAR(50) NOT NULL',
    'ingredients': 'TEXT NOT NULL',
    'instructions': 'TEXT NOT NULL',
    'cuisine': 'VARCHAR(50)',
    'dietaryRestrictions': 'VARCHAR(100)',
    'createdBy': 'INT(10) UNSIGNED',
    'createdAt': 'DATE'
}

fridge_access = {
    'username': 'VARCHAR(75) NOT NULL',
    'fridgeID': 'INT(10) UNSIGNED NOT NULL',
    'accessLevel': 'VARCHAR(30) NOT NULL',
    'CONSTRAINT': 'PK_Access PRIMARY KEY (username,fridgeID)'
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

    create_table('User', user)
    create_table('Fridge', fridge)
    create_table('FridgeContent', fridge_content)
    create_table('Recipe', recipe)
    create_table('FridgeAccess', fridge_access)


# if False:
# reset()