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


def update_data(table_name, set_values, condition, conn=conn):
    cursor = conn.cursor()

    # columns = ', '.join(data.keys())
    # placeholders = ', '.join(['%s'] * len(data))
    # values = tuple(data.values())

    insert_query = f"UPDATE {table_name} SET {set_values} WHERE {condition}"
    print("insert query")
    print(insert_query)
    cursor.execute(insert_query, list(set_values.values()))
    conn.commit()
    cursor.close()

