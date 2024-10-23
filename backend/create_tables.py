from collections import defaultdict

import pymysql
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
    # 'email': 'VARCHAR(120)',
    'fridgeIDs': 'TEXT',
    'createdAt': 'DATE'
}

fridge = {
    'fridgeID': 'INT(10) UNSIGNED PRIMARY KEY AUTO_INCREMENT',
    'itemIDs': 'TEXT',
    'username': 'VARCHAR(75)',
    'name': 'VARCHAR(75)',
    'createdAt': 'DATE'
}

fridge_content = {
    'itemID': 'INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY',
    'fridgeID': 'INT(10) UNSIGNED',
    'quantity': 'FLOAT NOT NULL',
    'unit': 'VARCHAR(20) NOT NULL',
    'expirationDate': 'DATE NOT NULL',
    'addedBy': 'INT(10) UNSIGNED',
    'addedAt': 'DATE',
    'name': 'VARCHAR(30)'
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

    create_table('User', user)
    create_table('Fridge', fridge)
    create_table('FridgeContent', fridge_content)
    create_table('Recipe', recipe)


# if False:
# reset()