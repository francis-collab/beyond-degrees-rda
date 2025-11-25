# bdr-backend/app/models/contact_message.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, func
from app.database import Base  # ← This is correct

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(50), nullable=True)
    subject = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # ← THIS IS THE LINE YOU ADDED — NOW WITH PROPER IMPORT
    is_read = Column(Boolean, default=False, nullable=False)