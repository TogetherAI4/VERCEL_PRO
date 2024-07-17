import sqlite3

def create_database():
    conn = sqlite3.connect('prompts.db')
    c = conn.cursor()

    # Tabelle erstellen
    c.execute('''
        CREATE TABLE IF NOT EXISTS prompts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prompt_id TEXT NOT NULL,
            title TEXT NOT NULL,
            prompt TEXT NOT NULL
        )
    ''')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    create_database()
