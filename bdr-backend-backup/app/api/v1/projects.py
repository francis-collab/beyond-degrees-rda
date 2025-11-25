# app/api/v1/projects.py
from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile, status
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
from slugify import slugify
from datetime import datetime, timedelta
from app.dependencies import get_db, get_current_entrepreneur
from app.models.user import User
from app.models.project import Project, ProjectStatus
from app.schemas.project import ProjectOut, ProjectListOut

router = APIRouter(tags=["projects"])

# ===================== CREATE PROJECT WITH IMAGE + LAUNCH INSTANTLY =====================
@router.post("/upload", response_model=ProjectOut, status_code=201)
async def create_project_with_pdf(
    title: str = Form(...),
    description: str = Form(...),
    funding_goal: int = Form(...),
    business_plan: UploadFile = File(...),
    image: Optional[UploadFile] = File(None),
    launch_now: Optional[bool] = Form(False),  # ← THIS IS THE MAGIC
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_entrepreneur)
):
    if current_user.role != "entrepreneur":
        raise HTTPException(status_code=403, detail="Only entrepreneurs can create projects")

    if not business_plan.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    jobs_to_create = funding_goal // 200000

    # Auto sector
    lower_title = title.lower()
    sector = "Technology & Innovation"
    if any(x in lower_title for x in ["agri", "farm", "food", "crop"]):
        sector = "Agriculture"
    elif any(x in lower_title for x in ["health", "clinic", "med"]):
        sector = "Health"
    elif any(x in lower_title for x in ["edu", "school", "learn"]):
        sector = "Education"
    elif any(x in lower_title for x in ["energy", "solar", "power"]):
        sector = "Renewable Energy"

    # Unique slug
    base_slug = slugify(title)
    slug = base_slug
    counter = 1
    while db.query(Project).filter(Project.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    # Save Business Plan PDF
    os.makedirs("static/uploads/business_plans", exist_ok=True)
    safe_pdf = f"{current_user.id}_{slug}_{business_plan.filename}"
    pdf_path = f"static/uploads/business_plans/{safe_pdf}"
    with open(pdf_path, "wb") as buffer:
        shutil.copyfileobj(business_plan.file, buffer)

    # Save Project Image
    image_url = "/placeholder-project.jpg"
    if image and image.filename:
        ext = image.filename.rsplit('.', 1)[-1].lower()
        if ext not in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
            raise HTTPException(status_code=400, detail="Image must be JPG, PNG, WebP or GIF")
        os.makedirs("static/uploads/projects", exist_ok=True)
        safe_img = f"{current_user.id}_{slug}_cover.{ext}"
        img_path = f"static/uploads/projects/{safe_img}"
        with open(img_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"/{img_path}"

    # ← LAUNCH INSTANTLY IF USER CLICKED "LAUNCH PROJECT"
    project_status = ProjectStatus.active if launch_now else ProjectStatus.draft
    launched_at = datetime.utcnow() if launch_now else None
    ends_at = datetime.utcnow() + timedelta(days=90) if launch_now else None

    project = Project(
        title=title,
        slug=slug,
        description=description,
        sector=sector,
        funding_goal=funding_goal,
        current_funding=0,
        job_goal=jobs_to_create,
        jobs_to_create=jobs_to_create,
        backers_count=0,
        business_plan_pdf=f"/{pdf_path}",
        image_url=image_url,
        entrepreneur_id=current_user.id,
        status=project_status,
        launched_at=launched_at,
        ends_at=ends_at,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


# ===================== LIST ALL PROJECTS =====================
@router.get("/", response_model=List[ProjectListOut])
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()


# ===================== MY PROJECTS =====================
@router.get("/my", response_model=List[ProjectOut])
def get_my_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_entrepreneur)):
    return db.query(Project).filter(Project.entrepreneur_id == current_user.id).all()


# ===================== GET BY SLUG (PUBLIC) =====================
@router.get("/slug/{slug}", response_model=ProjectOut)
def get_project_by_slug(slug: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.slug == slug).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# ===================== GET BY ID (EDIT) =====================
@router.get("/{project_id}", response_model=ProjectOut)
def get_project_by_id(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_entrepreneur)):
    project = db.query(Project).filter(Project.id == project_id, Project.entrepreneur_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or access denied")
    return project


# ===================== UPDATE PROJECT (WITH PDF REPLACEMENT) =====================
@router.put("/{project_id}", response_model=ProjectOut)
async def update_project(
    project_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    funding_goal: Optional[int] = Form(None),
    sector: Optional[str] = Form(None),
    business_plan: Optional[UploadFile] = File(None),
    launch_now: Optional[bool] = Form(False),  # ← Allow launching on update too
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_entrepreneur)
):
    project = db.query(Project).filter(Project.id == project_id, Project.entrepreneur_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if title is not None:
        project.title = title
        base_slug = slugify(title)
        new_slug = base_slug
        counter = 1
        while db.query(Project).filter(Project.slug == new_slug, Project.id != project.id).first():
            new_slug = f"{base_slug}-{counter}"
            counter += 1
        project.slug = new_slug

    if description is not None:
        project.description = description
    if funding_goal is not None:
        project.funding_goal = funding_goal
        project.jobs_to_create = funding_goal // 200000
    if sector is not None:
        project.sector = sector

    # Replace business plan PDF
    if business_plan:
        if not business_plan.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        if project.business_plan_pdf and os.path.exists(project.business_plan_pdf.lstrip('/')):
            os.remove(project.business_plan_pdf.lstrip('/'))
        os.makedirs("static/uploads/business_plans", exist_ok=True)
        safe_pdf = f"{current_user.id}_{project.slug}_{business_plan.filename}"
        pdf_path = f"static/uploads/business_plans/{safe_pdf}"
        with open(pdf_path, "wb") as buffer:
            shutil.copyfileobj(business_plan.file, buffer)
        project.business_plan_pdf = f"/{pdf_path}"

    # ← LAUNCH ON UPDATE TOO
    if launch_now and project.status == ProjectStatus.draft:
        project.status = ProjectStatus.active
        project.launched_at = datetime.utcnow()
        project.ends_at = datetime.utcnow() + timedelta(days=90)

    db.commit()
    db.refresh(project)
    return project


# ===================== DELETE PROJECT =====================
@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_entrepreneur)
):
    project = db.query(Project).filter(Project.id == project_id, Project.entrepreneur_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.business_plan_pdf and os.path.exists(project.business_plan_pdf.lstrip('/')):
        os.remove(project.business_plan_pdf.lstrip('/'))
    if project.image_url and project.image_url != "/placeholder-project.jpg":
        img_path = project.image_url.lstrip('/')
        if os.path.exists(img_path):
            os.remove(img_path)

    db.delete(project)
    db.commit()
    return None