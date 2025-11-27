# app/models/project.py

from sqlalchemy import (
    Column, Integer, String, Text, DECIMAL, DateTime, Enum,
    ForeignKey, func
)
from sqlalchemy.orm import relationship, validates
from sqlalchemy.exc import IntegrityError
from typing import Optional
from datetime import datetime, timedelta
import enum

# ✅ Use the new unified Base
from app.db.base import Base


class ProjectStatus(enum.Enum):
    draft = "draft"
    active = "active"      # ← FIXED MISSING VALUE
    funded = "funded"
    failed = "failed"
    verified = "verified"


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    slug = Column(String(220), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    sector = Column(String(100), nullable=False)
    funding_goal = Column(DECIMAL(14, 2), nullable=False)
    current_funding = Column(DECIMAL(14, 2), default=0.00)
    job_goal = Column(Integer, nullable=False)
    jobs_to_create = Column(Integer, nullable=False)
    backers_count = Column(Integer, default=0, nullable=False)
    image_url = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    business_plan_pdf = Column(String(500), nullable=True)

    status = Column(Enum(ProjectStatus), default=ProjectStatus.draft, nullable=False)
    launched_at = Column(DateTime(timezone=True), nullable=True)
    ends_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    entrepreneur_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    entrepreneur = relationship(
        "User",
        back_populates="projects"
    )

    transactions = relationship(
        "Transaction",
        back_populates="project",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    @validates("funding_goal")
    def validate_funding_goal(self, key, value):
        if float(value) <= 0:
            raise ValueError("Funding goal must be positive")
        return value

    @property
    def progress_percentage(self) -> float:
        if float(self.funding_goal) == 0:
            return 0.0
        return round((float(self.current_funding) / float(self.funding_goal)) * 100, 2)

    @property
    def days_remaining(self) -> Optional[int]:
        if not self.ends_at:
            return None
        delta = self.ends_at - datetime.utcnow()
        return max(0, delta.days)

    def launch(self):
        """Launch the project and automatically start a 90-day campaign."""
        if self.status != ProjectStatus.draft:
            raise ValueError("Only draft projects can be launched")
        self.status = ProjectStatus.active
        self.launched_at = datetime.utcnow()
        self.ends_at = self.launched_at + timedelta(days=90)
