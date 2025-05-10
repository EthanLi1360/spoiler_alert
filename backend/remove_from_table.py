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

def delete_data(table_name, key, key_column, conn=conn):
    cursor = conn.cursor()

    # key_column = list(key.keys())[0]
    # key_value = key[key_column]

    delete_query = f"DELETE FROM {table_name} WHERE {key_column} = %s"
    print("delete query")
    print(delete_query)

    cursor.execute(delete_query, (key,))
    conn.commit()

    print(f"Deleted rows with {key_column} = {key}")
    cursor.close()

def delete_data_multiple_columns(table_name, keys, key_columns, conn=conn):
    cursor = conn.cursor()
    equals_arr = []
    for i in range(len(key_columns)):
        equals_arr.append(f"{key_columns[i]} = %s ")
    where_clause = f"WHERE " + 'AND '.join(equals_arr)
    delete_query = f"DELETE FROM {table_name} {where_clause}"
    print(delete_query)
    cursor.execute(delete_query, keys)
    conn.commit()
    cursor.close()