import sqlite3
import json

def import_json_to_db(json_file):
    conn = None
    try:
        conn = sqlite3.connect('prompts.db')
        conn.execute('PRAGMA journal_mode=WAL;')
        c = conn.cursor()

        with open(json_file, 'r', encoding='utf-8') as f:
            prompts = json.load(f)

        for prompt in prompts:
            c.execute('''
                INSERT INTO prompts (prompt_id, title, prompt)
                VALUES (?, ?, ?)
            ''', (prompt['Prompt ID'], prompt['Titel'], prompt['Prompt']))

        conn.commit()
    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    import_json_to_db('prompts_cleaned_and_corrected.json')
