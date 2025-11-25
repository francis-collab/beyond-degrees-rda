# app/api/v1/mentors.py
from fastapi import APIRouter

router = APIRouter(prefix="/mentors", tags=["Mentors"])

# Frontend expects the array directly, not wrapped in {mentors: [...]}
@router.get("/")
def get_mentors():
    return []   # ← JUST RETURN THE ARRAY