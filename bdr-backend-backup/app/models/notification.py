"""
BDR – Beyond Degrees Rwanda
Notification Model

Delivers real-time updates to users:
- Entrepreneurs: Funding milestones, project status
- Backers: Payment confirmations, job impact
- Mentors: Booking requests

Aligned with:
- UML Class Diagram: Notification → User
- SRS: Real-time Updates, Email + In-App
- Use Case: Receive Update, View Dashboard
- Activity Diagram: Webhook → Notification → Email
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Enum, ForeignKey, func
from sqlalchemy.orm import relationship
from ..database import Base
from typing import Optional
import enum
from datetime import datetime


# ─────────────────────────────────────────────────────────────────────────────
# Notification Type Enum
# ─────────────────────────────────────────────────────────────────────────────
class NotificationType(enum.Enum):
    """Categorizes notifications for filtering and UI."""
    funding_received = "funding_received"        # Backer funded project
    milestone_reached = "milestone_reached"      # 25%, 50%, 75%, 100%
    project_launched = "project_launched"        # Entrepreneur launched
    project_funded = "project_funded"            # Goal reached
    project_failed = "project_failed"            # 30 days, underfunded
    payment_confirmed = "payment_confirmed"      # MoMo success
    payment_failed = "payment_failed"            # MoMo declined
    booking_request = "booking_request"          # Mentor session
    system_alert = "system_alert"                # Maintenance, policy


# ─────────────────────────────────────────────────────────────────────────────
# Notification Model
# ─────────────────────────────────────────────────────────────────────────────
class Notification(Base):
    __tablename__ = "notifications"

    # ── Primary Key ──
    id = Column(Integer, primary_key=True, index=True)

    # ── Content ──
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(Enum(NotificationType), nullable=False, index=True)

    # ── Metadata ──
    data = Column(String, nullable=True)  # JSON string for links, IDs
    is_read = Column(Boolean, default=False)
    is_email_sent = Column(Boolean, default=False)

    # ── Timestamps ──
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    read_at = Column(DateTime(timezone=True), nullable=True)

    # ── Foreign Key ──
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # ── Relationship ──
    user = relationship("User", back_populates="notifications")

    # ── Indexes for Performance ──
    __table_args__ = (
        # Fast unread count per user
        {"postgresql_partition_by": "RANGE (created_at)"}  # Optional: for large scale
    )

    # ── Properties ──
    @property
    def is_unread(self) -> bool:
        return not self.is_read

    @property
    def data_dict(self) -> dict:
        """Parse JSON data field safely."""
        import json
        if not self.data:
            return {}
        try:
            return json.loads(self.data)
        except json.JSONDecodeError:
            return {}

    # ── Methods ──
    def mark_read(self):
        """Mark notification as read."""
        if not self.is_read:
            self.is_read = True
            self.read_at = datetime.utcnow()

    def to_dict(self) -> dict:
        """Serialize for API response."""
        return {
            "id": self.id,
            "title": self.title,
            "message": self.message,
            "type": self.type.value,
            "is_read": self.is_read,
            "created_at": self.created_at.isoformat(),
            "data": self.data_dict
        }

    @classmethod
    def create_funding_notification(cls, project, amount, jobs, backer_name):
        """Factory: Funding received."""
        title = f"New Funding: {jobs} Job(s) Created!"
        message = f"{backer_name} backed your project **{project.title}** with RWF {amount:,}. {jobs} job(s) created!"
        data = {"project_id": project.id, "amount": str(amount), "jobs": jobs}
        return cls(
            title=title,
            message=message,
            type=NotificationType.funding_received,
            data=json.dumps(data)
        )

    @classmethod
    def create_milestone_notification(cls, project, percentage):
        """Factory: 25%, 50%, etc."""
        title = f"Milestone: {percentage}% Funded!"
        message = f"Your project **{project.title}** is now {percentage}% funded. Keep going!"
        data = {"project_id": project.id, "percentage": percentage}
        return cls(
            title=title,
            message=message,
            type=NotificationType.milestone_reached,
            data=json.dumps(data)
        )

    def __repr__(self) -> str:
        return f"<Notification {self.id}: {self.type.value} for User {self.user_id}>"