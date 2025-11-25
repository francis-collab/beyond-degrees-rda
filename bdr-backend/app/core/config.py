# app/core/config.py — FINAL, SAFE VERSION (keep this exactly)
import os
from pydantic_settings import BaseSettings
from typing import List
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

    MOMO_ENV: str = "sandbox"
    MOMO_API_USER: str = ""
    MOMO_API_KEY: str = ""
    MOMO_SUBSCRIPTION_KEY: str = ""

    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

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