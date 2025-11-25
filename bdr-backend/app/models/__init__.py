# app/models/__init__.py
from .user import User
from .project import Project
from .transaction import Transaction
from .notification import Notification
from .contact_message import ContactMessage  # ← ADD THIS LINE

__all__ = [
    "User",
    "Project",
    "Transaction",
    "Notification",
    "ContactMessage",  # ← ADD THIS TOO
]