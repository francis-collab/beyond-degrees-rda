# app/api/v1/__init__.py
from fastapi import APIRouter
from .auth import router as auth_router
from .projects import router as projects_router
from .transactions import router as transactions_router
from .pages import router as pages_router
from .users import router as users_router
from .messages import router as messages_router

api_router = APIRouter(prefix="/api/v1")

# INCLUDE ALL ROUTERS — THIS WAS MISSING THE AUTH ONE!
api_router.include_router(auth_router)
api_router.include_router(projects_router)
api_router.include_router(transactions_router)
api_router.include_router(pages_router)
api_router.include_router(users_router)
api_router.include_router(messages_router)

# Export for main.py
__all__ = ["api_router"]