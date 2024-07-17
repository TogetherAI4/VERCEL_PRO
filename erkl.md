Vielen Dank für das Bereitstellen der `app.py`. Wir haben nun alle wichtigen Komponenten für das Projekt:

1. `index.html`
2. `scripts.js`
3. `styles.css`
4. `app.py`

Lass uns eine Zusammenfassung der gesamten Anwendung geben und sicherstellen, dass alles korrekt funktioniert.

### Zusammenfassung

**Beschreibung:**
Die Anwendung "Prompt Manager" ist eine Flask-basierte Webanwendung zum Verwalten von Prompts. Benutzer können Prompts aus einer JSON-Datei abrufen, anzeigen, bearbeiten und löschen. Die Anwendung hat eine dunkle Oberfläche und ermöglicht die Suche nach Titeln.

**Dateien und Struktur:**
- **app.py**: Haupt-Backend-Logik mit Flask.
- **index.html**: Frontend der Anwendung.
- **scripts.js**: Clientseitige Logik und Interaktionen.
- **styles.css**: Stile und Layout.

### Anleitung zum Ausführen der Anwendung

1. **Voraussetzungen installieren:**
   Stelle sicher, dass Python 3.6 oder höher und Flask installiert sind.

   ```bash
   pip install Flask
   ```

2. **Projekt klonen:**

   ```bash
   git clone https://github.com/IhrBenutzername/prompt-manager.git
   cd prompt-manager
   ```

3. **Flask-Anwendung starten:**

   ```bash
   python app.py
   ```

4. **Anwendung im Browser öffnen:**
   Navigiere zu `http://127.0.0.1:5000` in deinem Webbrowser.

### Code-Komponenten

**app.py:**

```python
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

if __name__ == '__main__':
    app.run(debug=True)
```

**index.html:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prompt Manager</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='styles.css') }}">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="{{ url_for('static', filename='scripts.js') }}"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap" rel="stylesheet">
</head>
<body>
    <header>
        <div class="logo">
            <img src="https://einfachalex.net/wp-content/uploads/2024/02/696f61d7a31edd36aa11414db3ba2854.png" alt="Logo">
        </div>
        <nav>
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Prompts</a></li>
                <li><a href="#">Chat</a></li>
                <li><a href="#" id="toggle-add-prompt">Add New Prompt</a></li>
            </ul>
        </nav>
    </header>
    <div class="container">
        <h1>Prompt Manager</h1>
        <div class="search-chat-container">
            <input type="text" id="search" placeholder="Search prompts...">
            <button id="search-button">Search</button>
            <form id="chat-form" class="chat-form">
                <input type="text" id="chat-input" placeholder="Type a message..." required>
                <button type="submit">Send</button>
            </form>
        </div>
        <div id="loading" class="loading">Loading...</div>
        <div class="content">
            <div id="prompt-list" class="prompt-list"></div>
            <div id="prompt-details" class="prompt-details">
                <h3>Prompt Details</h3>
                <div id="details-content"></div>
                <button id="copy-button">Copy</button>
                <button id="edit-button">Edit</button>
                <button id="save-button" style="display: none;">Save</button>
                <button id="delete-button">Delete</button>
            </div>
        </div>
        <div class="pagination">
            <button id="prev-page">Previous</button>
            <button id="next-page">Next</button>
        </div>
        <div class="bottom-section">
            <div class="add-prompt" id="add-prompt" style="display: none;">
                <h3>Add New Prompt</h3>
                <form id="add-prompt-form">
                    <input type="text" id="new-title" placeholder="Title" required>
                    <textarea id="new-prompt" rows="10" placeholder="Prompt" required></textarea>
                    <button type="submit">Add Prompt</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
```

**scripts.js:**

```javascript
$(document).ready(function () {
    let promptsData = [];
    let currentPage = 1;
    const itemsPerPage = 20;

    function fetchPrompts() {
        $.get('/prompts', function (data) {
            promptsData = data;
            displayPrompts();
        });
    }

    function displayPrompts() {
        $('#prompt-list').empty();
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedData = promptsData.slice(start, end);

        paginatedData.forEach(prompt => {
            const promptTitle = prompt['Titel'] || '';
            $('#prompt-list').append(`
                <div class="prompt-item" data-id="${prompt['Prompt ID']}">
                    <h3>${truncateText(promptTitle, 30)}${promptTitle.length > 30 ? '... <span class="show-more" data-id="' + prompt['Prompt ID'] + '">mehr anzeigen</span>' : ''}</h3>
                </div>
            `);
        });

        // Delegierte Ereignisbindung für "mehr anzeigen"
        $('#prompt-list').on('click', '.show-more', function (event) {
            event.stopPropagation();
            const id = $(this).data('id');
            const selectedPrompt = promptsData.find(prompt => prompt['Prompt ID'] === id);
            displayPromptDetails(selectedPrompt);
        });

        // Delegierte Ereignisbindung für "prompt-item"
        $('#prompt-list').on('click', '.prompt-item', function () {
            const id = $(this).data('id');
            const selectedPrompt = promptsData.find(prompt => prompt['Prompt ID'] === id);
            displayPromptDetails(selectedPrompt);
        });
    }

    function truncateText(text, length) {
        if (text.length <= length) {
            return text;
        }
        return text.substring(0, length);
    }

    function displayPromptDetails(prompt) {
        if (!prompt) return;
        $('#details-content').html(`
            <h3>${prompt['Titel']}</h3>
            <p><strong>Prompt:</strong> ${prompt['Prompt']}</p>
        `);
        $('#details-content').data('id', prompt['Prompt ID']);
    }

    function copyPrompt() {
        const promptText = $('#details-content').find('p').text();
        navigator.clipboard.writeText(promptText).then(() => {
            alert('Prompt copied to clipboard');
        });
    }

    function editPrompt() {
        const promptID = $('#details-content').data('id');
        const prompt = promptsData.find(prompt => prompt['Prompt ID'] === promptID);
        const newPromptText = prompt['Prompt'];
        const newPromptTitle = prompt['Titel'];
        $('#details-content').html(`
            <input type="text" id="edit-title" value

="${newPromptTitle}" />
            <textarea id="edit-prompt" rows="10">${newPromptText}</textarea>
        `);
        $('#save-button').show();
    }

    function savePrompt() {
        const promptID = $('#details-content').data('id');
        const newPromptTitle = $('#edit-title').val();
        const newPromptText = $('#edit-prompt').val();
        const promptIndex = promptsData.findIndex(prompt => prompt['Prompt ID'] === promptID);
        
        if (promptIndex !== -1) {
            promptsData[promptIndex].Titel = newPromptTitle;
            promptsData[promptIndex].Prompt = newPromptText;
            $.ajax({
                url: `/prompts/${promptID}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(promptsData[promptIndex]),
                success: function () {
                    displayPromptDetails(promptsData[promptIndex]);
                    $('#save-button').hide();
                    displayPrompts();
                }
            });
        }
    }

    function deletePrompt() {
        const promptID = $('#details-content').data('id');
        const promptIndex = promptsData.findIndex(prompt => prompt['Prompt ID'] === promptID);
        
        if (promptIndex !== -1) {
            $.ajax({
                url: `/prompts/${promptID}`,
                type: 'DELETE',
                success: function () {
                    promptsData.splice(promptIndex, 1);
                    $('#details-content').html('');
                    displayPrompts();
                }
            });
        }
    }

    function changePage(direction) {
        if (direction === 'next') {
            currentPage++;
        } else if (direction === 'prev' && currentPage > 1) {
            currentPage--;
        }
        displayPrompts();
    }

    function searchPrompts() {
        $('#loading').show();
        const searchValue = $('#search').val().toLowerCase();
        setTimeout(function () {
            $('.prompt-item').each(function () {
                const promptText = $(this).text().toLowerCase();
                $(this).toggle(promptText.includes(searchValue));
            });
            $('#loading').hide();
        }, 500);
    }

    $('#search-button').click(function () {
        searchPrompts();
    });

    $('#copy-button').click(function () {
        copyPrompt();
    });

    $('#edit-button').click(function () {
        editPrompt();
    });

    $('#save-button').click(function () {
        savePrompt();
    });

    $('#delete-button').click(function () {
        deletePrompt();
    });

    $('#prev-page').click(function () {
        changePage('prev');
    });

    $('#next-page').click(function () {
        changePage('next');
    });

    $('#add-prompt-form').submit(function (event) {
        event.preventDefault();
        const newPromptTitle = $('#new-title').val();
        const newPromptText = $('#new-prompt').val();
        const newPromptID = (promptsData.length + 1).toString().padStart(4, '0');
        const newPrompt = {
            "Prompt ID": newPromptID,
            "Titel": newPromptTitle,
            "Prompt": newPromptText
        };
        promptsData.push(newPrompt);
        $.ajax({
            url: '/prompts',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newPrompt),
            success: function () {
                displayPrompts();
                $('#new-title').val('');
                $('#new-prompt').val('');
                currentPage = Math.ceil(promptsData.length / itemsPerPage);
                displayPrompts();
            }
        });
    });

    // Chat-Funktionalität
    $('#chat-form').submit(function (event) {
        event.preventDefault();
        const message = $('#chat-input').val().toLowerCase();
        if (message.trim() !== '') {
            const matchedPrompts = promptsData.filter(prompt => 
                prompt['Titel'].toLowerCase().includes(message) || 
                prompt['Prompt'].toLowerCase().includes(message)
            );
            $('#prompt-list').empty();
            matchedPrompts.forEach(prompt => {
                $('#prompt-list').append(`
                    <div class="prompt-item" data-id="${prompt['Prompt ID']}">
                        <h3>${truncateText(prompt['Titel'], 30)}${prompt['Titel'].length > 30 ? '... <span class="show-more" data-id="' + prompt['Prompt ID'] + '">mehr anzeigen</span>' : ''}</h3>
                    </div>
                `);
            });
            $('#chat-box').append(`<div class="chat-message"><span>You:</span> ${message}</div>`);
            $('#chat-input').val('');
        }
    });

    // Hinzufügen der neuen Toggle-Funktionalität
    $('#toggle-add-prompt').click(function() {
        $('#add-prompt').toggle();
    });

    fetchPrompts();
});
```

**styles.css:**

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap");

* {
  margin: 0;
  padding: 0;
}

*,
:after,
:before {
  box-sizing: border-box;
}

body {
  font-family: "Inter", sans-serif;
  background: #000;
  color: #fff;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
}

header {
  background-color: rgba(0, 0, 0, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header .logo img {
  height: 50px;
}

header nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}

header nav ul li a {
  color: #888;
  text-decoration: none;
  font-weight: 500;
}

header nav ul li a:hover {
  color: #fff;
}

.container {
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
}

.search-chat-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-chat-container input[type="text"],
.search-chat-container button,
.chat-form input[type="text"],
.chat-form button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
}

.search-chat-container input[type="text"] {
  flex: 1;
}

.search-chat-container button {
  background: #007cf0;
  color: #fff;
}

.search-chat-container button:hover {
  background: #005bb5;
}

.chat-form {
  display: flex;
  gap: 1rem;
}

.chat-form input[type="text"] {
  flex: 1;
}

.chat-form button {
  background: #00dfd8;
  color: #000;
}

.chat-form button:hover {
  background: #00bfb8;
}

.loading {
  display: none;
  text-align: center;
  font-size: 1.5rem;
  margin: 2rem 0;
}

.content {
  display: flex;
  gap: 2rem;
}

.prompt-list {
  flex: 2;
}

.prompt-item {
  background: #111;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.prompt-item h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.prompt-item .show-more {
  color: #007cf0;
  cursor: pointer;
}

.prompt-details {
  flex: 1;
  background: #111;
  padding: 1rem;
  border-radius: 4px;
}

.prompt-details h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.prompt-details p {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.prompt-details button {
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 4px;
  background: #007cf0;
  color: #fff;
  cursor: pointer;
}

.prompt-details button:hover {
  background: #005bb5;
}

.pagination {
  text-align: center;
  margin-top: 2rem;
}

.pagination button {
  background: #007cf0;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin: 0 0.5rem;
}

.pagination button:hover {
  background: #005bb5;
}

.bottom-section {
  margin-top: 2rem;
}

.add-prompt {
  background: #111;
  padding: 1rem;
  border-radius: 4px;
}

.add-prompt h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.add-prompt-form input[type="text"],
.add-prompt-form textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #333;
  border-radius: 4px;
 

 background: #000;
  color: #fff;
}

.add-prompt-form button {
  background: #007cf0;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.add-prompt-form button:hover {
  background: #005bb5;
}
```

Falls du noch Anpassungen benötigst oder weitere Fragen hast, lass es mich wissen!