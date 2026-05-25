from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, jobs, companies, applications

app = FastAPI(title="SmartHire API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(companies.router, prefix="/api/companies", tags=["Companies"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])

@app.get("/")
def root():
    return {"status": "SmartHire API Running ✅"}