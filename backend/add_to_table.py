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
    cursor.close()

