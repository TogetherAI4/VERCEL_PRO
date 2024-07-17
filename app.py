from flask import Flask, jsonify, request, render_template
import json
import os

app = Flask(__name__)

# Pfad zur JSON-Datei
json_file_path = os.path.join(os.path.dirname(__file__), 'prompts_cleaned_and_corrected.json')

# JSON-Datei laden
with open(json_file_path, 'r', encoding='utf-8') as file:
    prompts_json = json.load(file)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/prompts', methods=['GET'])
def get_prompts():
    return jsonify(prompts_json)

@app.route('/prompts', methods=['POST'])
def add_prompt():
    new_prompt = request.json
    global prompts_json
    prompts_json.append(new_prompt)
    with open(json_file_path, 'w', encoding='utf-8') as file:
        json.dump(prompts_json, file, indent=4, ensure_ascii=False)
    return jsonify(new_prompt), 201

@app.route('/prompts/<string:id>', methods=['PUT'])
def update_prompt(id):
    updated_prompt = request.json
    global prompts_json
    for i, prompt in enumerate(prompts_json):
        if prompt['Prompt ID'] == id:
            prompts_json[i] = updated_prompt
            break
    with open(json_file_path, 'w', encoding='utf-8') as file:
        json.dump(prompts_json, file, indent=4, ensure_ascii=False)
    return jsonify(updated_prompt)

@app.route('/prompts/<string:id>', methods=['DELETE'])
def delete_prompt(id):
    global prompts_json
    prompts_json = [prompt for prompt in prompts_json if prompt['Prompt ID'] != id]
    with open(json_file_path, 'w', encoding='utf-8') as file:
        json.dump(prompts_json, file, indent=4, ensure_ascii=False)
    return '', 204

@app.route('/chat')
def chat():
    return render_template('chat.html')

if __name__ == '__main__':
    app.run(debug=True)
