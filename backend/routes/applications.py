from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
from db.supabase_client import supabase
from services.groq_service import analyze_resume
from services.pdf_service import extract_text_from_pdf
import shutil
import os

router = APIRouter()

# Apply for a job
@router.post("/apply")
async def apply_for_job(
    job_id: str = Form(...),
    candidate_id: str = Form(...),
    cover_letter: str = Form(""),
    resume: UploadFile = File(...)
):
    try:
        # Check if already applied
        existing = supabase.table("applications").select("*").eq(
            "job_id", job_id
        ).eq("candidate_id", candidate_id).execute()

        if existing.data:
            raise HTTPException(
                status_code=400,
                detail="You have already applied for this job"
            )

        # Save resume temporarily
        # Save resume to /tmp (Vercel allows /tmp only)
        temp_path = f"/tmp/temp_{resume.filename}"
        with open(temp_path, "wb") as f:
            shutil.copyfileobj(resume.file, f)

        # Extract text from resume
        resume_text = extract_text_from_pdf(temp_path)
        os.remove(temp_path)

        if not resume_text:
            resume_text = "Resume uploaded but text could not be extracted. Please evaluate manually."

        # Get job details for AI analysis
        job_response = supabase.table("jobs").select("*").eq(
            "id", job_id
        ).execute()

        if not job_response.data:
            raise HTTPException(status_code=404, detail="Job not found")

        job = job_response.data[0]

        # Run AI analysis
        ai_result = analyze_resume(
            resume_text=resume_text,
            job_title=job["title"],
            job_requirements=job["requirements"],
            job_skills=job["skills"]
        )

        # Save application
        application = supabase.table("applications").insert({
            "job_id": job_id,
            "candidate_id": candidate_id,
            "cover_letter": cover_letter,
            "resume_url": resume.filename,
            "ai_score": ai_result.get("score", 0),
            "ai_feedback": ai_result.get("feedback", ""),
            "ai_questions": str(ai_result.get("questions", [])),
            "ai_skills_match": ai_result.get("skills_match", ""),
            "status": "pending"
        }).execute()

        return {
            "status": "success",
            "application": application.data[0],
            "ai_score": ai_result.get("score", 0),
            "ai_feedback": ai_result.get("feedback", ""),
            "ai_questions": ai_result.get("questions", []),
            "ai_skills_match": ai_result.get("skills_match", "")
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Get applications for a job (company view)
@router.get("/job/{job_id}")
async def get_job_applications(job_id: str):
    try:
        response = supabase.table("applications").select("*").eq(
            "job_id", job_id
        ).order("ai_score", desc=True).execute()
        return {"applications": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Get applications by candidate
@router.get("/candidate/{candidate_id}")
async def get_candidate_applications(candidate_id: str):
    try:
        response = supabase.table("applications").select(
            "*, jobs(title, location, job_type, companies(name, logo))"
        ).eq("candidate_id", candidate_id).order(
            "created_at", desc=True
        ).execute()
        return {"applications": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Get single application
@router.get("/{application_id}")
async def get_application(application_id: str):
    try:
        response = supabase.table("applications").select("*").eq(
            "id", application_id
        ).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Application not found")
        return {"application": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Update application status
@router.put("/{application_id}/status")
async def update_application_status(application_id: str, data: dict):
    try:
        response = supabase.table("applications").update({
            "status": data.get("status")
        }).eq("id", application_id).execute()
        return {"status": "success", "application": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Get application stats for company
@router.get("/stats/{company_id}")
async def get_company_stats(company_id: str):
    try:
        # Get all jobs for company
        jobs = supabase.table("jobs").select("id").eq(
            "company_id", company_id
        ).execute()

        job_ids = [j["id"] for j in jobs.data]
        total_jobs = len(job_ids)
        total_applications = 0
        pending_applications = 0

        for job_id in job_ids:
            apps = supabase.table("applications").select("*").eq(
                "job_id", job_id
            ).execute()
            total_applications += len(apps.data)
            pending_applications += len([
                a for a in apps.data if a["status"] == "pending"
            ])

        return {
            "total_jobs": total_jobs,
            "total_applications": total_applications,
            "pending_applications": pending_applications,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
