"""
BDR – Database Module
SQLAlchemy setup + session + settings
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic_settings import BaseSettings
from typing import List
import json
import os


# ─────────────────────────────────────────────────────────────────────────────
# Settings (Pydantic v2 + .env + JSON LISTS)
# ─────────────────────────────────────────────────────────────────────────────
class Settings(BaseSettings):
    database_url: str = "sqlite:///./bdr.db"
    
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    password_reset_token_expire_minutes: int = 60

    smtp_host: str = "localhost"
    smtp_port: int = 8025
    smtp_user: str = ""
    smtp_password: str = ""
    email_from: str = "no-reply@bdr.rw"
    email_from_name: str = "BDR Rwanda"

    momo_env: str = "sandbox"
    momo_api_user: str
    momo_api_key: str
    momo_subscription_key: str
    momo_callback_url: str

    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_public_key: str = ""

    frontend_url: str = "http://localhost:3000"
    allowed_hosts: List[str] = ["localhost", "127.0.0.1", "api.bdr.rw"]
    debug: bool = True
    log_level: str = "INFO"
    job_creation_rate: int = 10000

    model_config = {
        "extra": "allow",
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
        "json_loads": json.loads
    }


# ─────────────────────────────────────────────────────────────────────────────
# Database Setup
# ─────────────────────────────────────────────────────────────────────────────
def get_settings() -> Settings:
    return Settings()


# Use environment variable if present, otherwise fallback to bdr.db
database_url = os.getenv("DATABASE_URL", get_settings().database_url)

# If using SQLite, set check_same_thread
connect_args = {"check_same_thread": False} if "sqlite" in database_url else {}

engine = create_engine(database_url, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ─────────────────────────────────────────────────────────────────────────────
# Dependency
# ─────────────────────────────────────────────────────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
