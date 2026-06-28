from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from mangum import Mangum

app = FastAPI(title="SmartHire API")

@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    if request.method == "OPTIONS":
        response = JSONResponse(content={}, status_code=200)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS,PATCH"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        return response
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS,PATCH"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    return response

from routes import auth, jobs, companies, applications

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(companies.router, prefix="/api/companies", tags=["Companies"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])

@app.get("/")
def root():
    return {"status": "SmartHire API Running ✅"}

handler = Mangum(app)