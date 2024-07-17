import sqlite3

def check_database_schema():
    conn = sqlite3.connect('prompts.db')
    c = conn.cursor()

    c.execute("PRAGMA table_info(prompts)")
    schema = c.fetchall()

    for column in schema:
        print(column)

    conn.close()

if __name__ == '__main__':
    check_database_schema()
