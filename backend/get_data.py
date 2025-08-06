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

conn.autocommit = True
def view_data(table_name, conn=conn):
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
    cursor = conn.cursor()

    select_query = f"SELECT * FROM {table_name}"

    cursor.execute(select_query)

    rows = cursor.fetchall()

    column_names = [i[0] for i in cursor.description]

    # print(f"\nData from {table_name}:")
    # print(column_names)
    # for row in rows:
    #     print(row)

    cursor.close()
    # print("=====rows=====")
    # print(rows)
    # print()
    return rows

# view_data('User')
# view_data('Fridge')
# view_data('FridgeContent')
# view_data('Recipe')
# view_data('FridgeAccess')
# view_data('Wishlist')
# view_data('WishlistItems')