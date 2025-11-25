# app/api/v1/success.py
from fastapi import APIRouter

router = APIRouter(prefix="/success", tags=["Success Stories"])


@router.get("/")
def get_success_stories():
    return {
        "stories": [
            {
                "id": 1,
                "title": "Coffee Roastery in Musanze",
                "jobs_created": 12,
                "raised_rwf": 8_400_000,
                "entrepreneur": "Jean Paul",
                "image": "/success1.jpg",
                "quote": "BDR turned my idea into 12 real jobs for youth in my village."
            },
            {
                "id": 2,
                "title": "Tech Training Hub – Kigali",
                "jobs_created": 8,
                "raised_rwf": 6_200_000,
                "entrepreneur": "Aline U.",
                "image": "/success2.jpg",
                "quote": "We now employ 8 young developers full-time thanks to BDR backers."
            }
        ]
    }