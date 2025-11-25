# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import logging

from app.core.config import settings

# === ALL YOUR ROUTERS ===
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.projects import router as projects_router
from app.api.v1.transactions import router as transactions_router
from app.api.v1.pages import router as pages_router
from app.api.v1.messages import router as messages_router
from app.api.v1.mentors import router as mentors_router
from app.api.v1.contact import router as contact_router
from app.api.v1.success import router as success_router
from app.api.v1.admin import router as admin_router  # ← This one has its own prefix now

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bdr")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("BDR API Starting...")
    yield
    logger.info("BDR API Shutting down...")

app = FastAPI(
    title="BDR - Beyond Degrees Rwanda",
    description="Every RWF 10,000 = 1 Job for Rwandan Youth",
    version="1.0.0",
    lifespan=lifespan
)

# Serve static files (PDFs, etc.)
app.mount("/static", StaticFiles(directory="static"), name="static")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", settings.FRONTEND_URL or "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === ROUTERS — ONLY ONE CHANGE BELOW ===
app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(users_router, prefix="/api/v1/users")
app.include_router(projects_router, prefix="/api/v1/projects")
app.include_router(transactions_router, prefix="/api/v1/transactions")
app.include_router(messages_router, prefix="/api/v1/messages")
app.include_router(pages_router, prefix="/api/v1")
app.include_router(mentors_router, prefix="/api/v1")
app.include_router(contact_router, prefix="/api/v1")
app.include_router(success_router, prefix="/api/v1")

# CRITICAL FIX: admin_router already has prefix="/api/v1/admin" inside it
# → DO NOT add another /api/v1 here!
app.include_router(admin_router)   # ← THIS IS THE ONLY LINE YOU CHANGE

# Root
@app.get("/")
def root():
    return {"message": "BDR Rwanda is LIVE", "founder": "Francis Mutabazi", "status": "victory"}

@app.get("/health")
def health():
    return {"status": "healthy", "nation": "Rwanda Rising"}