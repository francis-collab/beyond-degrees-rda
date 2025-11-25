# app/schemas/__init__.py
"""
BDR – Beyond Degrees Rwanda
Clean, minimal schema exports — MVP working version
Only what exists and is used right now.
"""

# User schemas — minimal but fully working
from .user import UserCreate, UserOut, Token

# Project schemas — keep only what exists and is used
from .project import (
    ProjectCreate,
    ProjectOut,
    ProjectListOut,
)

# Transaction schemas — keep only essentials
from .transaction import (
    TransactionCreate,
    TransactionOut,
    PaymentInitiateResponse,
)

# Notification (if exists, otherwise comment out)
try:
    from .notification import NotificationOut
except ImportError:
    NotificationOut = None  # safe fallback

# ─────────────────────────────────────────────────────────────────────────────
# EXPORT ONLY WHAT WORKS — NO DEAD IMPORTS
# ─────────────────────────────────────────────────────────────────────────────
__all__ = [
    # User
    "UserCreate",
    "UserOut",
    "Token",

    # Project
    "ProjectCreate",
    "ProjectOut",
    "ProjectListOut",

    # Transaction
    "TransactionCreate",
    "TransactionOut",
    "PaymentInitiateResponse",

    # Notification (optional)
    "NotificationOut",
]