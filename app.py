from flask import Flask, jsonify, request, render_template
import sqlite3

app = Flask(__name__)

# Datenbankverbindung herstellen
def get_db_connection():
    conn = sqlite3.connect('prompts.db')
    conn.execute('PRAGMA journal_mode=WAL;')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/prompts', methods=['GET'])
def get_prompts():
    conn = get_db_connection()
    prompts = conn.execute('SELECT * FROM prompts').fetchall()
    conn.close()
    return jsonify([dict(prompt) for prompt in prompts])

@app.route('/prompts', methods=['POST'])
def add_prompt():
    new_prompt = request.json
    prompt_id = new_prompt.get('Prompt ID')
    title = new_prompt.get('Titel')
    prompt_text = new_prompt.get('Prompt')

    # Debugging-Informationen hinzufügen
    if not prompt_id or not title or not prompt_text:
        return jsonify({"error": "Missing required fields: prompt_id, title, or prompt"}), 400

    conn = get_db_connection()
    conn.execute('INSERT INTO prompts (prompt_id, title, prompt) VALUES (?, ?, ?)',
                 (prompt_id, title, prompt_text))
    conn.commit()
    conn.close()

    return jsonify(new_prompt), 201


@app.route('/prompts/<int:id>', methods=['PUT'])
def update_prompt(id):
    updated_prompt = request.json
    prompt_id = updated_prompt.get('Prompt ID')
    title = updated_prompt.get('title')  # Stelle sicher, dass der Schlüssel 'title' ist
    prompt_text = updated_prompt.get('prompt')  # Stelle sicher, dass der Schlüssel 'prompt' ist

    if not prompt_id or not title or not prompt_text:
        return jsonify({"error": "prompt_id, title, and prompt are required"}), 400

    conn = get_db_connection()
    conn.execute('UPDATE prompts SET prompt_id = ?, title = ?, prompt = ? WHERE id = ?',
                 (prompt_id, title, prompt_text, id))
    conn.commit()
    conn.close()

    return jsonify(updated_prompt)

@app.route('/prompts/<int:id>', methods=['DELETE'])
def delete_prompt(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM prompts WHERE id = ?', (id,))
    conn.commit()
    conn.close()

    return '', 204

@app.route('/chat')
def chat():
    return render_template('chat.html')

if __name__ == '__main__':
    app.run(debug=True)
