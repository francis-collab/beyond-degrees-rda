# main.py — FINAL PRODUCTION VERSION
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import logging
import os

# ✅ NEW: Auto-create tables (important for SQLite on Render)
from app.database import init_db

from app.core.config import settings

# === ROUTERS ===
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.projects import router as projects_router
from app.api.v1.transactions import router as transactions_router
from app.api.v1.pages import router as pages_router
from app.api.v1.messages import router as messages_router
from app.api.v1.mentors import router as mentors_router
from app.api.v1.contact import router as contact_router
from app.api.v1.success import router as success_router
from app.api.v1.admin import router as admin_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bdr")

# ✅ NEW: Initialize DB tables for first-time setup
init_db()

# ✅ NEW: Ensure upload directories exist at startup
os.makedirs("static/uploads/projects", exist_ok=True)
os.makedirs("static/uploads/business_plans", exist_ok=True)
os.makedirs("static/uploads/users", exist_ok=True)  # in case user profile images exist

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

# Static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# PRODUCTION CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://beyond-degrees-rda.vercel.app",
        "https://beyond-degrees-rda.onrender.com",
        "https://beyonddegrees.rw",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTES
app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(users_router, prefix="/api/v1/users")
app.include_router(projects_router, prefix="/api/v1/projects")
app.include_router(transactions_router, prefix="/api/v1/transactions")
app.include_router(messages_router, prefix="/api/v1/messages")
app.include_router(pages_router, prefix="/api/v1")
app.include_router(mentors_router, prefix="/api/v1")
app.include_router(contact_router, prefix="/api/v1")
app.include_router(success_router, prefix="/api/v1")
app.include_router(admin_router)

@app.get("/")
def root():
    return {"message": "BDR Rwanda is LIVE", "founder": "Francis Mutabazi", "status": "victory"}

@app.get("/health")
def health():
    return {"status": "healthy", "nation": "Rwanda Rising"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
