# main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from api.cpp_calculator import calculate_cpp
from api.creditCardList import get_credit_card_list
from api.destinationType import CONTINENTS
from typing import List, Dict
import requests

app = FastAPI()

origins = [
    "http://localhost:5173",  # Adjust based on your frontend port
]
# ------------------------------------------------------------------------------------------------------------------------------------
# CALCULATES CPP

# Pydantic model for input validation


class RedemptionRequest(BaseModel):
    price: float
    points: float


@app.post("/calculate_cpp/")
async def calculate_redemption(request: RedemptionRequest):
    try:
        cpp = calculate_cpp(request.price, request.points)
        return {"cpp": cpp, "message": f"The Cents Per Point (CPP) is {cpp:.2f}"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# A test route to ensure the server is running


@app.get("/")
async def read_root():
    return {"message": "CPP Calculator is running"}


# ------------------------------------------------------------------------------------------------------------------------------------
# Grabs Credit Card List Dynamically


@app.get("/api/credit-cards", response_model=List[Dict[str, List[str]]])
async def get_credit_card_list():
    return get_credit_card_list()

# ------------------------------------------------------------------------------------------------------------------------------------
# Grabs countries


@app.get("/api/continents")
def get_continents():
    return CONTINENTS
