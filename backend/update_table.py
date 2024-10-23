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


def update_data(table_name, set_values, key_column, key_value, conn=conn):
    cursor = conn.cursor()

    # columns = ', '.join(data.keys())
    # placeholders = ', '.join(['%s'] * len(data))
    # values = tuple(data.values())
    set_clause = ', '.join([f"{col}=%s" for col in set_values.keys()])

    insert_query = f"UPDATE {table_name} SET {set_clause} WHERE {key_column} = %s"
    print("insert query")
    print(insert_query)
    print(set_values.values())
    cursor.execute(insert_query, list(set_values.values()) + [key_value])
    conn.commit()
    cursor.close()

# set_value = {
#     'password': 'new_new_password'
# }
# update_data('User', set_value, 'username', 'Test')