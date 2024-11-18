import pandas as pd

# Load the CSV file
csv_file_path = 'airports.csv'
json_file_path = 'airports.json'

# Read the CSV
df = pd.read_csv(csv_file_path)

# Filter out airports that don't have an IATA code
df_filtered = df[df['iata_code'].notna()]

# Select columns of interest (e.g., airport name, country, continent, IATA code, and city)
df_filtered = df_filtered[['name', 'iata_code',
                           'iso_country', 'continent', 'municipality']]

# Rename columns for easier reference in the JSON
df_filtered.rename(columns={
    'name': 'airport_name',
    'iata_code': 'iata',
    'iso_country': 'country',
    'municipality': 'city'
}, inplace=True)

# Convert to JSON and save to file
df_filtered.to_json(json_file_path, orient='records', indent=4)

print("Filtered JSON file has been created.")
