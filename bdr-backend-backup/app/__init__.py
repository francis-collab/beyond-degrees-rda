"""
BDR – Beyond Degrees Rwanda
FastAPI Backend Root Package

This file marks the `app` directory as a Python package.
It allows imports like:
    from app import main
    from app.models import User
    from app.api.v1 import auth

No code is needed here — just presence.
"""

# Explicitly expose key modules at package level (optional but clean)
# from .main import app
# from .database import SessionLocal, Base

__version__ = "1.0.0"
__all__ = [
    "main",
    "database",
    "models",
    "schemas",
    "crud",
    "api",
    "utils",
    "dependencies"
]