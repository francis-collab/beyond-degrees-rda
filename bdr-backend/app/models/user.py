# app/models/user.py

from enum import StrEnum
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

# ✅ Use the NEW global Base
from app.db.base import Base


# --- USER ROLE ENUM ------------------------------------------------------- #
class UserRole(StrEnum):
    BACKER = "backer"
    ENTREPRENEUR = "entrepreneur"
    MENTOR = "mentor"
    ADMIN = "admin"


# --- USER MODEL ----------------------------------------------------------- #
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)

    role = Column(String, nullable=False, default=UserRole.BACKER)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # --- RELATIONSHIPS (unchanged) ---------------------------------------- #
    projects = relationship(
        "Project",
        back_populates="entrepreneur",
        cascade="all, delete-orphan"
    )

    transactions = relationship(
        "Transaction",
        back_populates="backer"
    )

    notifications = relationship(
        "Notification",
        back_populates="user"
    )
