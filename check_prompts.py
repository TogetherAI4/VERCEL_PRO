import sqlite3

def check_prompts():
    conn = sqlite3.connect('prompts.db')
    c = conn.cursor()

    c.execute("SELECT * FROM prompts")
    rows = c.fetchall()

    for row in rows:
        print(row)

    conn.close()

if __name__ == '__main__':
    check_prompts()
