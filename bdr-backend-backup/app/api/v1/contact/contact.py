# bdr-backend/app/api/v1/contact.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.dependencies import get_db  # ← THIS IS YOUR REAL FILE
from app.utils.email import send_contact_email
from app.api.v1.contact.schemas import ContactMessageCreate, ContactMessageInDB
from app.api.v1.contact.crud import create_contact_message

router = APIRouter(prefix="/contact", tags=["Contact"])

@router.post("/", response_model=ContactMessageInDB, status_code=status.HTTP_201_CREATED)
async def submit_contact_form(
    data: ContactMessageCreate,
    db: Session = Depends(get_db)  # ← uses your real get_db
):
    # Save to database
    saved = create_contact_message(db=db, message=data)

    # Send emails (auto-reply + notify Francis)
    try:
        await send_contact_email(
            to_user=data.email,
            user_name=data.name,
            subject=data.subject,
            user_message=data.message
        )
    except Exception as e:
        print(f"Email failed (but message was saved): {e}")

    return saved