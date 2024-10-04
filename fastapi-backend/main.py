# main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from cpp_calculator import calculate_cpp

app = FastAPI()

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

credit_cards= [
    {"name": "Card 1", "partner_airlines": ["Airline A", "Airline B"]},
    {"name": "Card 2", "partner_airlines": ["Airline C", "Airline D"]},
    # Add more cards as needed
]

@app.get("/credit-cards")
def get_credit_cards():
    return credit_cards

@app.get("/")
async def read_root():
    return {"message": "CPP Calculator is running"}
