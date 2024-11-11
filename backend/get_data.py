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

conn.autocommit = True
def view_data(table_name, conn=conn):
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
    cursor = conn.cursor()

    select_query = f"SELECT * FROM {table_name}"

    cursor.execute(select_query)

    rows = cursor.fetchall()

    column_names = [i[0] for i in cursor.description]

    print(f"\nData from {table_name}:")
    print(column_names)
    for row in rows:
        print(row)

    cursor.close()
    print("=====rows=====")
    print(rows)
    print()
    return rows

view_data('User')
view_data('Fridge')
view_data('FridgeContent')
view_data('Recipe')
view_data('FridgeAccess')