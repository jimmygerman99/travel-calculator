# main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import requests

app = FastAPI()

origins = [
    "http://localhost:5173",  # Adjust based on your frontend port
]
app.add_middleware(
    CORSMiddleware,
    # Replace with your React frontend URL if different
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ------------------------------------------------------------------------------------------------------------------------------------
# CALCULATES CPP

# Pydantic model for input validation


# ------------------------------------------------------------------------------------------------------------------------------------
# Grabs Credit Card List Dynamically
def get_credit_card_list() -> List[Dict[str, List[str]]]:
    # You can eventually replace this with dynamic fetching (scraping, API calls)
    credit_cards = [
        {
            "section": "American Express",
            "cards": [
                "American Express Platinum",
                "American Express Gold",
                "American Express Green",
                "Hilton Honors American Express",
                "Delta SkyMiles American Express",
            ],
        },
        {
            "section": "Chase",
            "cards": [
                "Chase Sapphire Preferred",
                "Chase Sapphire Reserve",
                "United Explorer Card",
                "IHG Rewards Club Premier",
            ],
        },
        {
            "section": "Citi",
            "cards": [
                "Citi Strata Premier",
                "Citi Prestige",
                "Citi AAdvantage Platinum Select",
            ],
        },
        {
            "section": "Capital One",
            "cards": [
                "Capital One Venture",
                "Capital One VentureOne",
                "Capital One Venture X",
            ],
        },
        # Add more sections for other hotel and travel cards
    ]
    return credit_cards


@app.get("/credit-cards")
async def get_credit_card_list1():
    return get_credit_card_list()


@app.get()
# ------------------------------------------------------------------------------------------------------------------------------------
# Grabs countries
