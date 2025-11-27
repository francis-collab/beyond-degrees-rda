from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base  
from typing import Optional
import enum
import json
from datetime import datetime


class NotificationType(enum.Enum):
    funding_received = "funding_received"
    milestone_reached = "milestone_reached"
    project_launched = "project_launched"
    project_funded = "project_funded"
    project_failed = "project_failed"
    payment_confirmed = "payment_confirmed"
    payment_failed = "payment_failed"
    booking_request = "booking_request"
    system_alert = "system_alert"


class Notification(Base):
    __tablename__ = "notifications"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Content
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(Enum(NotificationType), nullable=False, index=True)

    # Metadata
    data = Column(String, nullable=True)
    is_read = Column(Boolean, default=False)
    is_email_sent = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    read_at = Column(DateTime(timezone=True), nullable=True)

    # Foreign Key
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Relationship
    user = relationship("User", back_populates="notifications")

    # ── REMOVE POSTGRES PARTITIONING ──
    # __table_args__ = {"postgresql_partition_by": "RANGE (created_at)"}

    # Properties
    @property
    def is_unread(self) -> bool:
        return not self.is_read

    @property
    def data_dict(self) -> dict:
        if not self.data:
            return {}
        try:
            return json.loads(self.data)
        except json.JSONDecodeError:
            return {}

    # Methods
    def mark_read(self):
        if not self.is_read:
            self.is_read = True
            self.read_at = datetime.utcnow()

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "message": self.message,
            "type": self.type.value,
            "is_read": self.is_read,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "data": self.data_dict
        }

    # Factory Methods
    @classmethod
    def create_funding_notification(cls, project, amount, jobs, backer_name):
        title = f"New Funding: {jobs} Job(s) Created!"
        message = (
            f"{backer_name} backed your project **{project.title}** with RWF {amount:,}. "
            f"{jobs} job(s) created!"
        )
        data = {"project_id": project.id, "amount": str(amount), "jobs": jobs}
        return cls(title=title, message=message, type=NotificationType.funding_received, data=json.dumps(data))

    @classmethod
    def create_milestone_notification(cls, project, percentage):
        title = f"Milestone: {percentage}% Funded!"
        message = f"Your project **{project.title}** is now {percentage}% funded. Keep going!"
        data = {"project_id": project.id, "percentage": percentage}
        return cls(title=title, message=message, type=NotificationType.milestone_reached, data=json.dumps(data))

    def __repr__(self) -> str:
        return f"<Notification {self.id}: {self.type.value} for User {self.user_id}>"
