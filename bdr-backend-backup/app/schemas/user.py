# app/schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    name: Optional[str] = None  # Frontend sends "name"
    role: str = "backer"        # DEFAULT TO BACKER IF NOT SENT

    model_config = {"populate_by_name": True}

    def __init__(__pydantic_self__, **data):
        # Copy "name" → "full_name" if present
        if "name" in data and data["name"]:
            data["full_name"] = data["name"]
        super().__init__(**data)


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    is_active: bool = True
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: Optional[int] = None
    user: UserOut