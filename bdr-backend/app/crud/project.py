# app/crud/project.py
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import json
import logging

from ..models.project import Project
from ..schemas.project import ProjectCreate, ProjectUpdate
from ..models.user import User
from ..models.notification import Notification
from ..utils.security import calculate_jobs_created
from ..utils.email import send_email

logger = logging.getLogger(__name__)

# CREATE PROJECT
def create_project(db: Session, project_in: ProjectCreate, entrepreneur_id: int) -> Project:
    job_goal = calculate_jobs_created(int(project_in.funding_goal))
    
    db_project = Project(
        title=project_in.title,
        slug=project_in.title.lower().replace(" ", "-")[:200],
        description=project_in.description,
        detailed_description=getattr(project_in, "detailed_description", "") or "",
        sector=project_in.sector,
        funding_goal=project_in.funding_goal,
        job_goal=job_goal,
        image_url=project_in.image_url,
        video_url=getattr(project_in, "video_url", "") or "",
        entrepreneur_id=entrepreneur_id,
        status="draft"
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)

    notif = Notification(
        user_id=entrepreneur_id,
        title="Project Created!",
        message=f"Your project **{db_project.title}** is ready to edit and launch.",
        type="info",
        data=json.dumps({"project_id": db_project.id})
    )
    db.add(notif)
    db.commit()
    return db_project

# GET PROJECT BY ID
def get_project_by_id(db: Session, project_id: int) -> Optional[Project]:
    return db.query(Project).filter(Project.id == project_id).first()

# GET PROJECT BY SLUG
def get_project_by_slug(db: Session, slug: str) -> Optional[Project]:
    return db.query(Project).filter(Project.slug == slug).first()

# GET ALL PROJECTS (with filters) — THIS WAS MISSING
def get_projects(
    db: Session,
    sector: Optional[str] = None,
    status: Optional[str] = None,
    entrepreneur_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 20
) -> List[Project]:
    query = db.query(Project)
    if sector:
        query = query.filter(Project.sector.ilike(f"%{sector}%"))
    if status:
        query = query.filter(Project.status == status)
    if entrepreneur_id:
        query = query.filter(Project.entrepreneur_id == entrepreneur_id)
    return query.offset(skip).limit(limit).all()

# GET PROJECTS BY ENTREPRENEUR
def get_projects_by_entrepreneur(db: Session, entrepreneur_id: int) -> List[Project]:
    return db.query(Project).filter(Project.entrepreneur_id == entrepreneur_id).all()

# UPDATE PROJECT (DRAFT ONLY)
def update_project(db: Session, project_id: int, project_in: ProjectUpdate, entrepreneur_id: int) -> Optional[Project]:
    db_project = get_project_by_id(db, project_id)
    if not db_project or db_project.entrepreneur_id != entrepreneur_id or db_project.status != "draft":
        return None

    update_data = project_in.dict(exclude_unset=True)
    if "funding_goal" in update_data:
        update_data["job_goal"] = calculate_jobs_created(int(update_data["funding_goal"]))

    for field, value in update_data.items():
        if value is not None:
            setattr(db_project, field, value)
    db_project.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_project)
    return db_project

# LAUNCH PROJECT
def launch_project(db: Session, project_id: int, entrepreneur_id: int) -> Optional[Project]:
    db_project = get_project_by_id(db, project_id)
    if not db_project or db_project.entrepreneur_id != entrepreneur_id or db_project.status != "draft":
        return None

    db_project.status = "live"
    db_project.launched_at = datetime.utcnow()
    db_project.ends_at = db_project.launched_at + timedelta(days=30)
    db.commit()
    db.refresh(db_project)

    notif = Notification(
        user_id=entrepreneur_id,
        title="Project Launched!",
        message=f"**{db_project.title}** is now live!",
        type="success",
        data=json.dumps({"project_id": db_project.id})
    )
    db.add(notif)
    db.commit()

    try:
        send_email(
            to=db_project.entrepreneur.email,
            subject=f"Your project {db_project.title} is LIVE!",
            template_name="project_launched.html",
            context={"project": db_project}
        )
    except:
        pass  # never crash

    return db_project