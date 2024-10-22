# This holds a list of arrays for different selected destination types. Ex: Continent, City, Country
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
import os

JSON_FILE_PATH = "api/countries.json"


app = FastAPI()
# List of all continents
CONTINENTS = ["Africa", "Antarctica", "Asia", "Europe",
              "North America", "Oceania", "South America"]

# List of all countries
# Im using RestAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add your frontend URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/airports")
# Utility function to get countries from the JSON file
@app.get("/common-countries")
def get_common_country_names():
    if not os.path.exists(JSON_FILE_PATH):
        raise FileNotFoundError("The countries.json file does not exist.")

    # Load the JSON data
    with open(JSON_FILE_PATH, "r", encoding="utf-8") as file:
        data = json.load(file)

    # Sort the countries by the "common" name
    sorted_countries = sorted(
        data, key=lambda country: country["name"]["common"])

    # Extract only the common names of the countries
    country_names = [country["name"]["common"] for country in sorted_countries]

    return country_names


@app.get("/countries")
def get_countries():
    response = requests.get("https://restcountries.com/v3.1/all?fields=name")
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch data"}


# List of all airports
# Test block to check if the get_common_country_names function works
if __name__ == "__main__":
    try:
        # Run the function and print the result to verify
        country_names = get_common_country_names()
        print("Common Country Names Retrieved from countries.json:")
        print(country_names)
    except FileNotFoundError as e:
        print(f"Error: {str(e)}")
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
