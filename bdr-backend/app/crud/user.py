# app/crud/user.py
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.security import get_password_hash, verify_password
from sqlalchemy.exc import IntegrityError


def create_user(db: Session, user_in: UserCreate):
    # Ensure full_name is NEVER null — fallback to email or "User"
    full_name = (user_in.full_name or user_in.name or user_in.email.split("@")[0] or "User").strip()

    hashed = get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        full_name=full_name,
        role=user_in.role,
        hashed_password=hashed,
        is_active=True
    )
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError as e:
        db.rollback()
        if "UNIQUE constraint failed: users.email" in str(e):
            raise ValueError("Email already registered")
        raise ValueError("User creation failed")


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user