"""
BDR – Notification Schemas
Pydantic models for user notifications
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    type: str  # "project_update", "payment_success", "mentor_match", etc.
    is_read: bool = False
    created_at: datetime
    user_id: int
    related_project_id: Optional[int] = None
    related_transaction_id: Optional[int] = None

    class Config:
        from_attributes = True