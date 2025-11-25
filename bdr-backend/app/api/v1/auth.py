# app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, Response, Header
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Dict, Any
from pydantic import BaseModel
import logging
from ...dependencies import get_db, get_current_user
from ...core.config import settings
from ...schemas.user import UserCreate, UserOut, Token
from ...crud.user import create_user, authenticate_user
from ...utils.security import create_access_token, create_refresh_token, verify_token, blacklist_token
from ...models.user import User

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Authentication"])

# ========================
# REGISTER — FINAL FIXED VERSION
# ========================
@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # ALLOWED ROLES: entrepreneur and admin (backer removed as per your request)
    # ADMIN ONLY FOR FRANCIS
    if user_in.role not in ["entrepreneur", "admin"]:
        raise HTTPException(status_code=400, detail="Role must be entrepreneur or admin")

    # SECURITY: ONLY francisschooten@gmail.com CAN REGISTER AS ADMIN
    if user_in.role == "admin" and user_in.email.lower() != "francisschooten@gmail.com":
        raise HTTPException(
            status_code=403,
            detail="Only the founder (francisschooten@gmail.com) can register as admin"
        )

    try:
        db_user = create_user(db=db, user_in=user_in)
        logger.info(f"New user registered: {db_user.email} ({db_user.role})")
        return db_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# NEW: Pydantic model for clean JSON login
class LoginCredentials(BaseModel):
    email: str
    password: str


# LOGIN — UNCHANGED & PERFECT
@router.post("/login", response_model=Token)
def login(credentials: LoginCredentials, db: Session = Depends(get_db)):
    user = authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    logger.info(f"User logged in: {user.email} ({user.role})")
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": UserOut.from_orm(user) if hasattr(UserOut, "from_orm") else UserOut(**user.__dict__)
    }


# REFRESH — UNCHANGED
@router.post("/refresh", response_model=Token)
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    payload = verify_token(refresh_token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    new_access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {
        "access_token": new_access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": UserOut.from_orm(user) if hasattr(UserOut, "from_orm") else UserOut(**user.__dict__)
    }


# ME — UNCHANGED
@router.get("/me", response_model=UserOut)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


# LOGOUT — UNCHANGED
@router.post("/logout")
def logout(
    response: Response,
    authorization: str = Header(None, alias="Authorization")
):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        blacklist_token(token)
    return {"detail": "Successfully logged out"}