# app/schemas/project.py
"""
BDR – Project Schemas (Pydantic v2 + FastAPI 2025 READY)
FIXED: image_url + business_plan_pdf not showing in API responses
"""

from pydantic import BaseModel, Field, computed_field
from typing import Optional, List
from datetime import datetime, timezone

from fastapi import UploadFile, File

from .user import UserOut
from .transaction import TransactionOut


class ProjectBase(BaseModel):
    title: str = Field(..., max_length=200)
    description: str = Field(..., max_length=500)
    detailed_description: Optional[str] = None
    sector: str
    funding_goal: int = Field(..., ge=100000)
    jobs_to_create: int = Field(..., ge=0)

    # FIX: ensure frontend receives images
    image_url: Optional[str] = None

    # FIX: ensure PDF + video appear when creating project
    video_url: Optional[str] = None
    business_plan_pdf: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    detailed_description: Optional[str] = None
    sector: Optional[str] = None
    funding_goal: Optional[int] = None
    jobs_to_create: Optional[int] = None

    # FIX: allow replacement of image
    image_url: Optional[str] = None

    # FIX: allow replacement of video
    video_url: Optional[str] = None

    # FIX: allow replacement of PDF
    business_plan: Optional[UploadFile] = File(None)
    business_plan_pdf: Optional[str] = None


class ProjectListOut(BaseModel):
    id: int
    title: str
    slug: str
    sector: str
    funding_goal: int
    current_funding: int
    jobs_to_create: int
    backers_count: int = 0
    status: str
    image_url: Optional[str] = None
    ends_at: Optional[datetime] = None

    @computed_field(alias="progress_percentage", return_type=float)
    @property
    def progress_percentage(self) -> float:
        if self.funding_goal == 0:
            return 0.0
        return round((self.current_funding / self.funding_goal) * 100, 2)

    @computed_field(return_type=int)
    @property
    def jobs_created(self) -> int:
        return self.current_funding // 200000

    @computed_field(return_type=Optional[int])
    @property
    def days_remaining(self) -> Optional[int]:
        if not self.ends_at:
            return None
        ends_at_utc = (
            self.ends_at if self.ends_at.tzinfo else self.ends_at.replace(tzinfo=timezone.utc)
        )
        delta = ends_at_utc - datetime.now(timezone.utc)
        return max(0, delta.days)

    class Config:
        from_attributes = True
        populate_by_name = True


class ProjectOut(BaseModel):
    id: int
    title: str
    slug: str
    description: str
    detailed_description: Optional[str] = None
    sector: str
    funding_goal: int
    current_funding: int
    jobs_to_create: int
    backers_count: int = 0
    status: str
    created_at: datetime
    launched_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None

    # FIX: ensure frontend receives image + PDF + video
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    business_plan_pdf: Optional[str] = None

    entrepreneur: UserOut
    transactions: List[TransactionOut] = []

    @computed_field(alias="progress_percentage", return_type=float)
    @property
    def progress_percentage(self) -> float:
        if self.funding_goal == 0:
            return 0.0
        return round((self.current_funding / self.funding_goal) * 100, 2)

    @computed_field(return_type=int)
    @property
    def jobs_created(self) -> int:
        return self.current_funding // 200000

    @computed_field(return_type=Optional[int])
    @property
    def days_remaining(self) -> Optional[int]:
        if not self.ends_at:
            return None
        ends_at_utc = (
            self.ends_at if self.ends_at.tzinfo else self.ends_at.replace(tzinfo=timezone.utc)
        )
        delta = ends_at_utc - datetime.now(timezone.utc)
        return max(0, delta.days)

    class Config:
        from_attributes = True
        populate_by_name = True


class ProjectStats(BaseModel):
    total_projects: int
    total_funded: int
    total_jobs_created: int
    total_raised_rwf: int


class ProjectLaunch(BaseModel):
    launch_now: bool = Field(..., description="Set to true to launch the project immediately")
