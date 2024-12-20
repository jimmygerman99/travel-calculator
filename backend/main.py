from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from api.creditCardList import get_credit_card_list
from pydantic import BaseModel
from typing import List, Dict, Optional
import requests
import json
import os
import pandas as pd
from sqlalchemy.orm import Session
from app.database import engine, Base, get_db
from app.auth import get_password_hash, verify_password, create_access_token
from fastapi.security import OAuth2PasswordRequestForm
from app.dbmodels import User, FlightSearch
from app.schemas import UserCreate, UserOut, LoginRequest, UserBase
from passlib.context import CryptContext
from urllib.parse import urlencode
from serpapi import GoogleSearch
from datetime import datetime
import uuid
Base.metadata.create_all(bind=engine)


# JSON File Paths
JSON_FILE_PATH = "data/countries.json"
JSON_FILE_PATH_AIRPORTS = "data/updated_airports.json"

app = FastAPI()
origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173"
]
# Enable CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    # Adjust based on your frontend URL
    allow_origins=origins,
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


# DATABASE
# --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Create a password context for hashing and verifying passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


@app.post("/register", response_model=UserOut)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return UserOut(
        id=new_user.id,
        first_name=new_user.first_name,
        last_name=new_user.last_name,
        email=new_user.email,
        created_at=new_user.created_at.isoformat()
    )


@app.post("/login")
def login_user(login_request: LoginRequest, db: Session = Depends(get_db)):
    # Query the database for the user by email
    user = db.query(User).filter(User.email == login_request.email).first()
    if not user or not verify_password(login_request.password, user.hashed_password):
        raise HTTPException(
            status_code=400, detail="Incorrect email or password"
        )

    # Create JWT token
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
# ----------------------------------------------------------------------------------------------------------------------------------------------------------


GOOGLE_FLIGHTS_API_KEY = os.getenv(
    "GOOGLE_FLIGHTS_API_KEY", "8fed26d23bdf95ac406ceea9b836c053f4c2ca47c6bee0e8b2f7d47c7efeb331"
)

# Define the data structure for the flight search request


class FlightSearchRequest(BaseModel):
    departure_id: str
    arrival_id: str
    outbound_date: str  # Format: YYYY-MM-DD
    return_date: Optional[str] = None  # Optional for one-way trips
    currency: str = "USD"
    typeID: int
    include_airlines: Optional[str] = None  # Optional list of airlines


@app.get("/search-flights")
async def search_flights(
    departure_id: str,
    arrival_id: str,
    outbound_date: str,
    return_date: Optional[str] = None,
    currency: str = "USD",
    trip_type: int = 2,
    include_airlines: Optional[str] = None,
):
    call_id = uuid.uuid4()
    print(
        f"[DEBUG] API call received at /search-flights (Call ID: {call_id}): {datetime.now()}")

    # Prepare params for the Google Flights API call
    params = {
        "api_key": GOOGLE_FLIGHTS_API_KEY,
        "engine": "google_flights",
        "hl": "en",
        "gl": "us",
        "departure_id": departure_id,
        "arrival_id": arrival_id,
        "outbound_date": outbound_date,
        "currency": currency,
        "type": trip_type,
    }

    if return_date:
        params["return_date"] = return_date

    if include_airlines:
        params["include_airlines"] = include_airlines

    print(
        f"[DEBUG] Parameters being sent to Google Flights API (Call ID: {call_id}): {params}")

    try:
        search = GoogleSearch(params)
        results = search.get_dict()

        # Extract relevant data to simplify response for the front end
        flights_data = []
        for flight in results.get("other_flights", []):
            flight_details = {
                "total_duration": flight.get("total_duration"),
                "price": flight.get("price"),
                "type": flight.get("type"),
                "carbon_emissions": flight.get("carbon_emissions", {}),
                "airline_logo": flight.get("airline_logo"),
                "flights": [
                    {
                        "airline": leg.get("airline"),
                        "flight_number": leg.get("flight_number"),
                        "departure_airport": leg.get("departure_airport", {}).get("name"),
                        "arrival_airport": leg.get("arrival_airport", {}).get("name"),
                        "departure_time": leg.get("departure_airport", {}).get("time"),
                        "arrival_time": leg.get("arrival_airport", {}).get("time"),
                        "duration": leg.get("duration"),
                        "airplane": leg.get("airplane"),
                        "travel_class": leg.get("travel_class"),
                        "legroom": leg.get("legroom"),
                        "extensions": leg.get("extensions", []),
                        "airline_logo": leg.get("airline_logo"),
                    }
                    for leg in flight.get("flights", [])
                ],
            }
            flights_data.append(flight_details)

        response = {"success": True, "flights": flights_data}

        print(
            f"[DEBUG] Returning organized flight data (Call ID: {call_id}): {response}")

        return response

    except Exception as e:
        print(f"[DEBUG] Unexpected error (Call ID: {call_id}): {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")
