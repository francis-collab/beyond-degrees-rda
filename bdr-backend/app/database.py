# app/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# --------------------------------------------
# 1. Detect environment (Vercel or local)
# --------------------------------------------
# If DATABASE_URL is set → use it (PostgreSQL later)
# If not set → fallback to SQLite
# --------------------------------------------

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Fix Vercel Postgres format if needed (postgres:// → postgresql://)
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

else:
    # Running locally OR on Vercel without Postgres
    # Vercel & Serverless ONLY allow writing to /tmp
    if os.getenv("VERCEL"):
        SQLITE_PATH = "/tmp/bdr.db"
    else:
        SQLITE_PATH = "./bdr.db"

    DATABASE_URL = f"sqlite:///{SQLITE_PATH}"

# --------------------------------------------
# 2. Create SQLAlchemy engine
# --------------------------------------------
connect_args = {}

if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,   # Fixes stale connections
)

# --------------------------------------------
# 3. SessionLocal factory
# --------------------------------------------
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# --------------------------------------------
# 4. Base class for ORM models
# --------------------------------------------
Base = declarative_base()
