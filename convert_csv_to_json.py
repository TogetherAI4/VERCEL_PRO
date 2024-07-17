import pandas as pd

# Pfad zur CSV-Datei
csv_file_path = 'C:\\Users\\alexa\\Documents\\Bilder\\Neuer Ordner (2)\\promptsccsvalex.csv'

# Laden der CSV-Datei
df = pd.read_csv(csv_file_path)

# Konvertieren in JSON und Speichern in einer Datei
json_file_path = 'C:\\Users\\alexa\\Documents\\Bilder\\Neuer Ordner (2)\\prompts.json'
df.to_json(json_file_path, orient='records', lines=False)

# Anzeigen des konvertierten JSON-Inhalts
with open(json_file_path, 'r') as file:
    json_content = file.read()

print(json_content)
