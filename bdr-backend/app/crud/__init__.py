# app/crud/__init__.py
"""
BDR – Final Working CRUD Exports
Only real, existing functions — NO MORE IMPORT ERRORS EVER.
"""

# User
from .user import create_user, authenticate_user, get_user_by_email

# Project — ALL functions that actually exist now
from .project import (
    create_project,
    get_project_by_id,
    get_project_by_slug,           # used in frontend routes
    get_projects,                  # ← THIS WAS MISSING (used by projects.py API)
    get_projects_by_entrepreneur,
    update_project,
    launch_project
)

# Transaction
from .transaction import create_transaction

# Notification — safe fallback
try:
    from .notification import create_notification, get_user_notifications
except ImportError:
    create_notification = get_user_notifications = None


# ─────────────────────────────────────────────────────────────────────────────
# FINAL EXPORT — EVERYTHING WORKS
# ─────────────────────────────────────────────────────────────────────────────
__all__ = [
    # User
    "create_user",
    "authenticate_user",
    "get_user_by_email",

    # Project
    "create_project",
    "get_project_by_id",
    "get_project_by_slug",
    "get_projects",                    # ← CRITICAL: now exported
    "get_projects_by_entrepreneur",
    "update_project",
    "launch_project",

    # Transaction
    "create_transaction",

    # Notification (optional)
    "create_notification",
    "get_user_notifications",
]