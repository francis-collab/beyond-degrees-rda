# app/core/config.py — FINAL, SAFE VERSION (MoMo optional)
import os
from pydantic_settings import BaseSettings
from typing import List, Optional
from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: str = os.environ.get("DATABASE_URL", "sqlite:///./bdr.db")

    SECRET_KEY: str                    # ← REQUIRED — comes from env
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    FRONTEND_URL: str = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    DEBUG: bool = os.environ.get("DEBUG", "True").lower() == "true"
    JOB_CREATION_RATE: int = 10000

    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str                     # ← REQUIRED — comes from env
    SMTP_PASSWORD: str                 # ← REQUIRED — comes from env
    EMAIL_FROM: str = "francisschooten@gmail.com"
    EMAIL_FROM_NAME: str = "Francis @ Beyond Degrees Rwanda"

    # --- MoMo is optional now ---
    MOMO_ENV: str = "sandbox"
    MOMO_API_USER: Optional[str] = None
    MOMO_API_KEY: Optional[str] = None
    MOMO_SUBSCRIPTION_KEY: Optional[str] = None

    # --- Stripe (optional too) ---
    STRIPE_SECRET_KEY: Optional[str] = ""
    STRIPE_WEBHOOK_SECRET: Optional[str] = ""

    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "allow"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
