# app/api/v1/pages.py
from fastapi import APIRouter
# from sqlalchemy.orm import Session
# from ...dependencies import get_db

router = APIRouter(tags=["Pages"])

# HOME PAGE — exactly what your frontend expects
@router.get("/pages/home")
async def home_page():
    return {
        "hero": {
            "title": "From <span class='text-[#FCD116]'>Degree</span> to <span class='text-[#00A651]'>Jobs</span>",
            "subtitle": "70% of Rwanda is under 35. We turn their ideas into startups — and startups into jobs.",
            "stats": [
                {"icon": "Users", "value": "42+", "label": "Projects Funded"},
                {"icon": "Target", "value": "156", "label": "Jobs Created"},
                {"icon": "Zap", "value": "89", "label": "Youth Mentored"}
            ],
            "cta_back": "Back a Project",
            "cta_launch": "Launch Your Idea"
        },
        "total_projects": 42,
        "funded_projects": 38,
        "jobs_created": 156,
        "youth_mentored": 89
    }

# ABOUT PAGE — 100% matches your design
@router.get("/pages/about")
async def about_page():
    return {
        "hero": {
            "title": "Beyond <span class='text-[#00A1D6]'>Degrees</span>",
            "subtitle": "We don’t wait for degrees. We create jobs — for Rwanda’s 70% youth population.",
            "stats": [
                {"icon": "Users", "value": "70%", "label": "Rwanda Under 35"},
                {"icon": "Target", "value": "2035", "label": "Vision: Job Creators"}
            ]
        },
        "mission": {
            "pillars": [
                {"icon": "Lightbulb", "title": "Idea First", "desc": "No degree required. Just a vision to create jobs.", "color": "#FCD116"},
                {"icon": "Heart", "title": "Community Backed", "desc": "Local + diaspora fund via MoMo, card, or bank.", "color": "#00A1D6"},
                {"icon": "TrendingUp", "title": "Job Focused", "desc": "Every RWF 10,000 = 1 job for Rwandan youth.", "color": "#00A651"}
            ]
        },
        "stats": [
            {"icon": "Users", "value": "100+", "label": "Jobs Created"},
            {"icon": "Target", "value": "42+", "label": "Projects Funded"},
            {"icon": "Globe", "value": "89+", "label": "Youth Mentored"},
            {"icon": "Heart", "value": "RWF 1.2B+", "label": "Raised"}
        ],
        "partners": [
            {"name": "African Leadership University", "logo": "ALU", "color": "#00A1D6", "desc": "Our academic partner. Provides mentorship and innovation labs."},
            {"name": "MTN MoMo", "logo": "MTN", "color": "#FCD116", "desc": "Instant payments. 90% of backers use MoMo."},
            {"name": "Rwandan Diaspora", "logo": "Globe", "color": "#00A651", "desc": "40% of funding comes from Rwandans abroad."}
        ],
        "cta": {
            "title": "Rwanda’s Future Starts Now",
            "subtitle": "Join 10,000+ Rwandans building a job-rich future."
        }
    }

# SUCCESS PAGE — 100% matches your design
@router.get("/pages/success")
async def success_page():
    return {
        "hero": {
            "title": "Rwanda’s Youth Are Winning",
            "subtitle": "Real startups. Real funding. Real jobs. Every RWF 200,000 creates <strong>1 job</strong>."
        },
        "stats": [
            {"icon": "TrendingUp", "value": "RWF 405M+", "label": "Total Funding Raised"},
            {"icon": "Users", "value": "45+", "label": "Jobs Created"},
            {"icon": "Heart", "value": "127", "label": "Backers"}
        ],
        "stories": [
            {
                "id": 1, "name": "Jean Paul", "startup": "GreenTech Rwanda", "funding": "RWF 120M", "jobs": 12,
                "image": "/success/jean.jpg", "quote": "BDR helped me raise RWF 120M in 3 weeks. Now 12 youth have stable jobs.", "date": "2025-02-15"
            },
            {
                "id": 2, "name": "Marie Claire", "startup": "EcoBags Ltd", "funding": "RWF 85M", "jobs": 8,
                "image": "/success/marie.jpg", "quote": "From idea to 8 employees in 6 months. BDR made it possible.", "date": "2025-01-20"
            },
            {
                "id": 3, "name": "Emmanuel", "startup": "SolarKits", "funding": "RWF 200M", "jobs": 25,
                "image": "/success/emmanuel.jpg", "quote": "We now power 500 homes and employ 25 youth. BDR changed everything.", "date": "2024-12-10"
            }
        ]
    }