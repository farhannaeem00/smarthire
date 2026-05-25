from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.supabase_client import supabase

router = APIRouter()

class SignUpRequest(BaseModel):
    email: str
    password: str
    name: str
    role: str = "candidate"

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
async def signup(data: SignUpRequest):
    try:
        response = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password,
            "options": {
                "data": {
                    "name": data.name,
                    "role": data.role
                }
            }
        })
        if response.user:
            # Auto login after signup
            login_response = supabase.auth.sign_in_with_password({
                "email": data.email,
                "password": data.password
            })
            return {
                "status": "success",
                "user": {
                    "id": response.user.id,
                    "email": response.user.email,
                    "name": data.name,
                    "role": data.role
                },
                "token": login_response.session.access_token if login_response.session else ""
            }
        raise HTTPException(status_code=400, detail="Signup failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login(data: LoginRequest):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })
        if response.user:
            return {
                "status": "success",
                "user": {
                    "id": response.user.id,
                    "email": response.user.email,
                    "name": response.user.user_metadata.get("name", ""),
                    "role": response.user.user_metadata.get("role", "candidate")
                },
                "token": response.session.access_token
            }
        raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
