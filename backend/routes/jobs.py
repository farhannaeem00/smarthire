from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from db.supabase_client import supabase

router = APIRouter()

class JobCreate(BaseModel):
    company_id: str
    title: str
    description: str
    requirements: str
    skills: List[str] = []
    location: str = ""
    job_type: str = "full-time"
    salary_min: int = 0
    salary_max: int = 0

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    skills: Optional[List[str]] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    is_active: Optional[bool] = None

# Create job
@router.post("/create")
async def create_job(data: JobCreate):
    try:
        response = supabase.table("jobs").insert({
            "company_id": data.company_id,
            "title": data.title,
            "description": data.description,
            "requirements": data.requirements,
            "skills": data.skills,
            "location": data.location,
            "job_type": data.job_type,
            "salary_min": data.salary_min,
            "salary_max": data.salary_max
        }).execute()
        return {"status": "success", "job": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get all active jobs
@router.get("/")
async def get_jobs(keyword: str = "", location: str = "", job_type: str = ""):
    try:
        query = supabase.table("jobs").select(
            "*, companies(name, logo, location, industry)"
        ).eq("is_active", True)

        response = query.order("created_at", desc=True).execute()
        jobs = response.data

        # Filter by keyword
        if keyword:
            jobs = [j for j in jobs if
                keyword.lower() in j["title"].lower() or
                keyword.lower() in j["description"].lower()
            ]

        # Filter by location
        if location:
            jobs = [j for j in jobs if
                location.lower() in j["location"].lower()
            ]

        # Filter by job type
        if job_type:
            jobs = [j for j in jobs if j["job_type"] == job_type]

        # Ensure skills is always a list
        for job in jobs:
            if isinstance(job.get("skills"), str):
                job["skills"] = [s.strip() for s in job["skills"].split(",") if s.strip()]
            elif job.get("skills") is None:
                job["skills"] = []

        return {"jobs": jobs, "total": len(jobs)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get single job
@router.get("/{job_id}")
async def get_job(job_id: str):
    try:
        response = supabase.table("jobs").select(
            "*, companies(name, logo, location, industry, website, description)"
        ).eq("id", job_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"job": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get jobs by company
@router.get("/company/{company_id}")
async def get_company_jobs(company_id: str):
    try:
        response = supabase.table("jobs").select("*").eq(
            "company_id", company_id
        ).order("created_at", desc=True).execute()
        return {"jobs": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Update job
@router.put("/{job_id}")
async def update_job(job_id: str, data: JobUpdate):
    try:
        update_data = {k: v for k, v in data.dict().items() if v is not None}
        response = supabase.table("jobs").update(update_data).eq(
            "id", job_id
        ).execute()
        return {"status": "success", "job": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Delete job
@router.delete("/{job_id}")
async def delete_job(job_id: str):
    try:
        supabase.table("jobs").delete().eq("id", job_id).execute()
        return {"status": "success", "message": "Job deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
