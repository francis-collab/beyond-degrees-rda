# app/models/user.py
from enum import StrEnum
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


# THIS IS THE ONLY NEW THING — YOUR USER ROLES AS A CLEAN ENUM
class UserRole(StrEnum):
    BACKER = "backer"
    ENTREPRENEUR = "entrepreneur"
    MENTOR = "mentor"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)

    # NOW USING THE ENUM — CLEAN & SAFE
    role = Column(String, nullable=False, default=UserRole.BACKER)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships — everything stays exactly as before
    projects = relationship("Project", back_populates="entrepreneur", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="backer")
    notifications = relationship("Notification", back_populates="user")