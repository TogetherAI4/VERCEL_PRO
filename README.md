# Prompt Manager

## Beschreibung
Der Prompt Manager ist eine Webanwendung zum Verwalten von Prompts. Die Anwendung verfügt über ein schwarzes Dark-Layout und ermöglicht es Benutzern, Prompts aus einer CSV-Datei abzurufen, anzuzeigen, zu bearbeiten und zu löschen. Die Prompts können nach Titel durchsucht werden und werden in einer Tabelle angezeigt, die per Klick auf den Titel die Details anzeigt.

## Installation

### Voraussetzungen
- Python 3.6 oder höher
- Flask

### Schritte zur Installation
1. Klonen Sie das Repository:
    ```bash
    git clone https://github.com/IhrBenutzername/prompt-manager.git
    ```
2. Wechseln Sie in das Projektverzeichnis:
    ```bash
    cd prompt-manager
    ```
3. Installieren Sie die Abhängigkeiten:
    ```bash
    pip install -r requirements.txt
    ```
4. Starten Sie die Flask-Anwendung:
    ```bash
    python app.py
    ```

## Verwendung
1. Öffnen Sie einen Webbrowser und navigieren Sie zu `http://127.0.0.1:5000`.
2. Verwenden Sie das Suchfeld, um Prompts zu durchsuchen.
3. Klicken Sie auf einen Prompt-Titel, um die Details anzuzeigen.
4. Verwenden Sie die Schaltflächen, um Prompts zu bearbeiten oder zu löschen.

## Dateistruktur

prompt-manager/
│
├── app.py
├── prompts.csv
├── templates/
│ └── index.html
├── static/
│ ├── styles.css
│ └── scripts.js
└── requirements.txt



## Autor
Erstellt von [Ihr Name](https://github.com/IhrBenutzername)

## Lizenz
Dieses Projekt ist lizenziert unter der MIT-Lizenz.
Um die virtuelle Umgebung (`venv`) zu aktivieren, folge diesen Schritten. Beachte, dass die Schritte je nach Betriebssystem leicht unterschiedlich sind.

### Schritte zur Aktivierung der virtuellen Umgebung

1. **Wechsle in dein Projektverzeichnis**:
   Öffne das Terminal (cmd, PowerShell oder Anaconda Prompt) und navigiere in das Verzeichnis deines Projekts. Zum Beispiel:
   ```sh
   cd C:\Users\alexa\Documents\Bilder\Neuer Ordner (2)
   ```

2. **Virtuelle Umgebung erstellen** (falls noch nicht geschehen):
   Falls du die virtuelle Umgebung noch nicht erstellt hast, erstelle sie mit:
   ```sh
   python -m venv venv
   ```

3. **Aktiviere die virtuelle Umgebung**:
   - **Windows (cmd.exe)**:
     ```sh
     venv\Scripts\activate
     ```
   - **Windows (PowerShell)**:
     ```sh
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS/Linux**:
     ```sh
     source venv/bin/activate
     ```

### Deaktivierung der virtuellen Umgebung

Wenn du fertig bist, kannst du die virtuelle Umgebung mit folgendem Befehl deaktivieren:
```sh
deactivate
```

### Beispiel für die Aktivierung und Nutzung der virtuellen Umgebung auf Windows mit cmd.exe

Hier sind alle Schritte zusammengefasst:

```sh
cd C:\Users\alexa\Documents\Bilder\Neuer Ordner (2)
python -m venv venv
venv\Scripts\activate
```

Nach der Aktivierung sollte der Name der virtuellen Umgebung (z.B. `(venv)`) in der Befehlszeile angezeigt werden, was bedeutet, dass du dich jetzt in der virtuellen Umgebung befindest.

### Installation der notwendigen Pakete in der virtuellen Umgebung

Sobald die virtuelle Umgebung aktiviert ist, kannst du die notwendigen Pakete (z.B. Flask) installieren:

```sh
pip install flask
```

Nun kannst du dein `app.py`-Skript in der aktivierten virtuellen Umgebung ausführen:

```sh
python app.py
```

Falls du weitere Fragen hast oder Unterstützung benötigst, lass es mich wissen!