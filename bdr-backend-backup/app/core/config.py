# app/core/config.py
from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./bdr.db"

    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # App
    FRONTEND_URL: str = "http://localhost:3000"
    JOB_CREATION_RATE: int = 10000
    DEBUG: bool = True

    # Email (dev defaults)
    SMTP_HOST: str = "localhost"
    SMTP_PORT: int = 8025
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "no-reply@bdr.rw"
    EMAIL_FROM_NAME: str = "BDR Rwanda"

    # MoMo
    MOMO_ENV: str = "sandbox"
    MOMO_API_USER: str = ""
    MOMO_API_KEY: str = ""
    MOMO_SUBSCRIPTION_KEY: str = ""

    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

    # Misc
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "api.bdr.rw"]
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "allow"  # Allows unknown env vars without crashing


@lru_cache()
def get_settings() -> Settings:
    return Settings()


# This is safe to use everywhere
settings = get_settings()