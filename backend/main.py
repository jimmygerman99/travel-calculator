from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.creditCardList import get_credit_card_list
from pydantic import BaseModel
from typing import List, Dict
import requests
import json
import os
import pandas as pd

# JSON File Paths
JSON_FILE_PATH = "api/countries.json"
JSON_FILE_PATH_AIRPORTS = "api/airports.json"

app = FastAPI()

# Enable CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    # Adjust based on your frontend URL
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# List of all continents
CONTINENTS = ["Africa", "Antarctica", "Asia", "Europe",
              "North America", "Oceania", "South America"]

# -------------------------------------------------------------------------------------------------------------------------------------------------------------

# API TO GET ALL CREDITCARDS
# Credit Card API Endpoint


class CreditCard(BaseModel):
    section: str
    cards: List[str]


@app.get("/credit-cards", response_model=List[CreditCard])
async def get_credit_card_list1() -> List[CreditCard]:
    try:
        credit_cards = get_credit_card_list()
        if not credit_cards:
            raise HTTPException(
                status_code=404, detail="No credit cards found."
            )
        return credit_cards

    except FileNotFoundError:
        raise HTTPException(
            status_code=500,
            detail="The file containing credit card information could not be found."
        )
    except ValueError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Data error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )

# -------------------------------------------------------------------------------------------------------------------------------------------------------------
# Endpoint to get all airports with relevant details (continent, country, airport name, IATA code)


# Endpoint to get all airports with relevant details (airport_name, iata_code, country, continent, city)
@app.get("/airports-summary")
def get_airports_summary():
    if not os.path.exists(JSON_FILE_PATH_AIRPORTS):
        raise HTTPException(
            status_code=500, detail="The airports.json file does not exist."
        )

    # Load the JSON data
    try:
        with open(JSON_FILE_PATH_AIRPORTS, "r", encoding="utf-8") as file:
            data = json.load(file)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An error occurred while loading the file: {str(e)}"
        )

    # Extract and organize the relevant details: airport_name, iata_code, country, continent, city
    summary_list = [
        {
            "airport_name": airport.get("airport_name"),
            "iata_code": airport.get("iata"),
            "country": airport.get("country"),
            "continent": airport.get("continent"),
            "city": airport.get("city")
        }
        for airport in data
    ]

    return summary_list


# -------------------------------------------------------------------------------------------------------------------------------------------------------------
# Endpoint to get common countries from the JSON. ALWAYS USE THIS


@app.get("/common-countries")
def get_common_country_names():
    if not os.path.exists(JSON_FILE_PATH):
        raise HTTPException(
            status_code=500, detail="The countries.json file does not exist."
        )

    # Load the JSON data
    with open(JSON_FILE_PATH, "r", encoding="utf-8") as file:
        data = json.load(file)

    # Sort the countries by the "common" name
    sorted_countries = sorted(
        data, key=lambda country: country["name"]["common"]
    )

    # Extract only the common names of the countries
    country_names = [country["name"]["common"] for country in sorted_countries]

    return country_names

# -------------------------------------------------------------------------------------------------------------------------------------------------------------
# Endpoint to get countries using the REST API. THIS IS CALLING IT from the api


@app.get("/countries")
def get_countries():
    response = requests.get("https://restcountries.com/v3.1/all?fields=name")
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch data"}

# -------------------------------------------------------------------------------------------------------------------------------------------------------------
