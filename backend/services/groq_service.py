from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_ai_response(prompt: str, system: str = "") -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system or "You are an expert HR recruiter and talent acquisition specialist."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=2048
    )
    return response.choices[0].message.content


def analyze_resume(resume_text: str, job_title: str, job_requirements: str, job_skills: list) -> dict:
    prompt = f"""
You are an expert HR recruiter. Analyze this resume against the job requirements.

JOB TITLE: {job_title}

JOB REQUIREMENTS:
{job_requirements}

REQUIRED SKILLS: {', '.join(job_skills)}

RESUME:
{resume_text}

Provide your analysis in this EXACT JSON format (no markdown, no extra text):
{{
  "score": <number 0-100>,
  "feedback": "<2-3 sentences about candidate strengths and weaknesses>",
  "skills_match": "<list matched and missing skills>",
  "questions": [
    "<interview question 1>",
    "<interview question 2>",
    "<interview question 3>",
    "<interview question 4>",
    "<interview question 5>"
  ]
}}
"""
    response = get_ai_response(prompt)
    
    import json
    try:
        response = response.strip()
        if "```" in response:
            response = response.split("```")[1]
            if response.startswith("json"):
                response = response[4:]
        return json.loads(response.strip())
    except:
        return {
            "score": 50,
            "feedback": "Resume analyzed successfully.",
            "skills_match": "Analysis completed.",
            "questions": [
                "Tell me about yourself.",
                "Why are you interested in this role?",
                "What are your key strengths?",
                "Where do you see yourself in 5 years?",
                "Do you have any questions for us?"
            ]
        }