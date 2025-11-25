"""
BDR – CRUD Operations for Notifications
Handles:
- Create notification
- Get user notifications
- Mark as read
- Delete
"""

from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from ..models.notification import Notification, NotificationType
from datetime import datetime


def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    type: NotificationType,
    data: dict = None
) -> Notification:
    """
    Create a new notification for a user.
    """
    notif = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=type,
        data=data
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


def get_user_notifications(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 20,
    unread_only: bool = False
) -> List[Notification]:
    """
    Get notifications for a user.
    """
    query = db.query(Notification).filter(Notification.user_id == user_id)
    if unread_only:
        query = query.filter(Notification.is_read == False)
    return query.order_by(desc(Notification.created_at)).offset(skip).limit(limit).all()


def mark_notification_read(db: Session, notification_id: int, user_id: int) -> bool:
    """
    Mark a notification as read.
    """
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    if not notif:
        return False
    notif.is_read = True
    notif.read_at = datetime.utcnow()
    db.commit()
    return True


def delete_notification(db: Session, notification_id: int, user_id: int) -> bool:
    """
    Delete a notification.
    """
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    if not notif:
        return False
    db.delete(notif)
    db.commit()
    return True