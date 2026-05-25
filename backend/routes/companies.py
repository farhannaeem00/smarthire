from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from db.supabase_client import supabase

router = APIRouter()

class CompanyCreate(BaseModel):
    user_id: str
    name: str
    description: str = ""
    website: str = ""
    industry: str = ""
    size: str = ""
    location: str = ""

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    location: Optional[str] = None
    is_verified: Optional[bool] = None

# Create company
@router.post("/create")
async def create_company(data: CompanyCreate):
    try:
        existing = supabase.table("companies").select("*").eq(
            "user_id", data.user_id
        ).execute()
        if existing.data:
            return {"status": "success", "company": existing.data[0]}

        response = supabase.table("companies").insert({
            "user_id": data.user_id,
            "name": data.name,
            "description": data.description,
            "website": data.website,
            "industry": data.industry,
            "size": data.size,
            "location": data.location
        }).execute()
        return {"status": "success", "company": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get company by user
@router.get("/user/{user_id}")
async def get_company_by_user(user_id: str):
    try:
        response = supabase.table("companies").select("*").eq(
            "user_id", user_id
        ).execute()
        if not response.data:
            return {"company": None}
        return {"company": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get company by id
@router.get("/{company_id}")
async def get_company(company_id: str):
    try:
        response = supabase.table("companies").select("*").eq(
            "id", company_id
        ).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Company not found")
        return {"company": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Update company
@router.put("/{company_id}")
async def update_company(company_id: str, data: CompanyUpdate):
    try:
        update_data = {k: v for k, v in data.dict().items() if v is not None}
        response = supabase.table("companies").update(update_data).eq(
            "id", company_id
        ).execute()
        return {"status": "success", "company": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get all companies
@router.get("/")
async def get_all_companies():
    try:
        response = supabase.table("companies").select("*").order(
            "created_at", desc=True
        ).execute()
        return {"companies": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
