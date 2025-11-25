# bdr-backend/app/api/v1/contact/crud.py
from sqlalchemy.orm import Session
from app.models.contact_message import ContactMessage
from app.api.v1.contact.schemas import ContactMessageCreate

def create_contact_message(db: Session, message: ContactMessageCreate):
    db_message = ContactMessage(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message