# bdr-backend/app/api/v1/contact/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str

class ContactMessageInDB(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    subject: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True