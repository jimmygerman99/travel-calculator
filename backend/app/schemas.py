from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    created_at: str

    @staticmethod
    def _convert_datetime_to_str(dt: datetime) -> str:
        return dt.isoformat() if dt else None

    class Config:
        orm_mode = True


# Define the LoginRequest schema for email and password
class LoginRequest(BaseModel):
    email: str
    password: str
