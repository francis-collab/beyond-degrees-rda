# app/api/v1/messages.py
from fastapi import APIRouter, Depends
from app.dependencies import get_current_user

router = APIRouter()

@router.get("/")
def get_messages(user = Depends(get_current_user)):
    return [
        {
            "id": 1,
            "from": "BDR Team",
            "subject": "Welcome to BDR!",
            "message": "Your account has been created successfully.",
            "sent_at": "2025-04-05T10:00:00Z",
            "read": False
        }
    ]