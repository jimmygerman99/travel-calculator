import pandas as pd

# Path to the CSV and JSON files
CSV_FILE_PATH = "airports.csv"  # Update this path if needed
# The existing JSON file in your project folder
JSON_FILE_PATH = "airports.json"

# Load the CSV file into a DataFrame
df = pd.read_csv(CSV_FILE_PATH)

# List of columns of interest
columns_of_interest = [
    'name',           # Airport name
    'iso_country',    # Country
    'continent',      # Continent
    'iata_code',      # IATA code
    'ident',          # Airport identifier (use as ICAO alternative)
    'latitude_deg',   # Latitude
    'longitude_deg'   # Longitude
]

# Only keep the relevant columns
df_filtered = df[columns_of_interest]

# Rename columns to have a consistent, readable JSON structure
df_filtered = df_filtered.rename(columns={
    'name': 'airport_name',
    'iso_country': 'country',
    'continent': 'continent',
    'iata_code': 'iata',
    'ident': 'icao',  # Use 'ident' as the ICAO identifier in the JSON
    'latitude_deg': 'latitude',
    'longitude_deg': 'longitude'
})

# Convert the DataFrame to JSON format and save it to the JSON file
df_filtered.to_json(JSON_FILE_PATH, orient='records', indent=4)

print(f"JSON file '{JSON_FILE_PATH}' has been created successfully!")
