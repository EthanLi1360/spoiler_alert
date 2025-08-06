import pymysql
from datetime import datetime
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


def insert_data(table_name, data, conn=conn):
    cursor = conn.cursor()

    columns = ', '.join(data.keys())
    placeholders = ', '.join(['%s'] * len(data))
    values = tuple(data.values())

    insert_query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
    print("insert query")
    print(insert_query)
    cursor.execute(insert_query, values)
    conn.commit()
    print("Values")
    print(values)
    try:
        return cursor.lastrowid
    except Exception as e:
        raise(e)
    finally:
      cursor.close()
        

# user_data = {
#     'username': 'Test',
#     'password': 'Test123',
#     'fridgeIDs': ','.join([]),
#     'createdAt': datetime.today().strftime('%Y-%m-%d %H:%M:%S')
# }
# insert_data('User', user_data)