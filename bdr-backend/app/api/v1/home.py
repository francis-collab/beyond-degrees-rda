from fastapi import APIRouter
router = APIRouter(prefix="/home", tags=["Home"])

@router.get("/")
def get_home():
    return {"message": "Use /api/v1/pages/home"}