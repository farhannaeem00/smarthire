<div align="center">

![Header](https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=200&section=header&text=SmartHire&fontSize=80&fontAlignY=35&desc=AI-Powered%20Recruitment%20Platform&descAlignY=55&descSize=20&fontColor=ffffff&animation=twinkling)

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=3B82F6&center=true&vCenter=true&width=600&lines=AI-Powered+Resume+Screening;Smart+Candidate+Ranking;Auto+Interview+Questions;Built+with+Next.js+%26+FastAPI" alt="Typing SVG" />

<br/>

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3-F55036?style=for-the-badge&logo=groq&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer](https://img.shields.io/badge/Framer-Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

<br/>

[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/smarthire?style=social)](https://github.com/YOUR_USERNAME/smarthire)
[![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/smarthire?style=social)](https://github.com/YOUR_USERNAME/smarthire)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [AI Pipeline](#-ai-pipeline)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Roadmap](#-roadmap)
- [Author](#-author)

---

## 🚀 Overview

**SmartHire** is a full-stack AI-powered recruitment platform that automates
the entire hiring process. Companies post jobs, candidates apply with their
resume, and our AI instantly screens every resume, scores candidates 0-100,
ranks them by match, and generates custom interview questions.

> Built with **Next.js 14**, **FastAPI**, **Groq (Llama 3.3)**, and
> **Supabase** — completely free APIs, no paid services required.

---

## 🎯 Live Demo

> 🔗 Coming Soon

---

## ✨ Features

<table>
<tr>
<td>

### 👤 Candidate
- Browse & search all jobs
- Filter by type and location
- Apply with resume PDF upload
- Instant AI resume scoring
- View AI feedback + skills gap
- Get custom interview questions
- Track application status
- Candidate dashboard

</td>
<td>

### 🏢 Company / HR
- Company registration
- Post jobs with requirements
- View all applicants per job
- AI-ranked candidate list
- Detailed AI analysis per candidate
- Update application status
- Company profile management
- Hiring analytics dashboard

</td>
</tr>
<tr>
<td>

### 👑 Admin
- Platform overview stats
- Company management
- Verify/unverify companies
- Job listings management
- Delete inappropriate content
- Monitor platform activity

</td>
<td>

### 🤖 AI Features
- Resume text extraction (PDF)
- AI resume scoring (0-100)
- Skills matching analysis
- Candidate ranking by score
- Custom interview questions
- Strengths & weaknesses feedback
- Skills gap identification

</td>
</tr>
</table>

---

## 🤖 AI Pipeline

```
Candidate uploads Resume PDF
          ↓
PyMuPDF + PyPDF2 extracts text
          ↓
Groq (Llama 3.3) reads resume
          ↓
AI compares against job requirements
          ↓
Generates score (0-100)
          ↓
Provides detailed feedback
          ↓
Identifies skills match/gaps
          ↓
Creates 5 custom interview questions
          ↓
All saved to Supabase database
          ↓
Company sees AI-ranked candidates
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 | React Framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Axios | API Calls |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API Framework |
| Groq + Llama 3.3 | AI Analysis (Free) |
| PyMuPDF + PyPDF2 | PDF Text Extraction |
| Supabase Python | Database Client |
| Python Dotenv | Environment Variables |

### Database
| Technology | Purpose |
|---|---|
| Supabase | PostgreSQL Database |
| Supabase Auth | Authentication |
| Supabase Storage | File Storage |

---

## 📁 Project Structure

```
smarthire/
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/              # Login page
│   │   │   └── signup/             # Signup — Candidate or Company
│   │   ├── jobs/
│   │   │   ├── page.tsx            # Jobs board with search/filter
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # Job detail page
│   │   │       └── apply/page.tsx  # Apply + AI analysis result
│   │   ├── dashboard/
│   │   │   ├── candidate/          # Candidate applications dashboard
│   │   │   ├── company/            # Company hiring dashboard
│   │   │   │   ├── post-job/       # Post new job
│   │   │   │   └── jobs/[id]/applicants/ # AI-ranked applicants
│   │   │   └── admin/              # Admin platform dashboard
│   │   └── page.tsx                # Animated landing page
│   ├── lib/
│   │   ├── api.ts                  # All API functions
│   │   └── auth.ts                 # Auth helper functions
│   └── components/                 # Reusable components
│
└── backend/
    ├── main.py                     # FastAPI entry point
    ├── routes/
    │   ├── auth.py                 # Signup + Login
    │   ├── companies.py            # Company CRUD
    │   ├── jobs.py                 # Jobs CRUD + filtering
    │   └── applications.py        # Apply + AI pipeline
    ├── services/
    │   ├── groq_service.py         # Groq AI + resume analysis
    │   └── pdf_service.py          # PDF text extraction
    └── db/
        └── supabase_client.py      # Supabase connection
```

---

## ⚡ Getting Started

### Prerequisites
```bash
node >= 18.0.0
python >= 3.10
git
```

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/smarthire.git
cd smarthire
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate

pip install fastapi uvicorn python-dotenv supabase
pip install groq pdfplumber PyPDF2 python-multipart aiofiles
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Environment Variables
See [Environment Variables](#-environment-variables) section below.

### 5. Run the Application

**Backend:**
```bash
cd backend
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Open in browser
```
http://localhost:3000
```

---

## 🔑 Environment Variables

### `backend/.env`
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

### `frontend/.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Free API Keys:
| Service | Link |
|---|---|
| Groq API | https://console.groq.com |
| Supabase | https://supabase.com |

---

## 📡 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |

### Company Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/companies/create` | Create company |
| GET | `/api/companies/user/{id}` | Get company by user |
| GET | `/api/companies/{id}` | Get company |
| PUT | `/api/companies/{id}` | Update company |
| GET | `/api/companies/` | Get all companies |

### Jobs Routes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs/` | Get all jobs |
| GET | `/api/jobs/{id}` | Get single job |
| POST | `/api/jobs/create` | Create job |
| PUT | `/api/jobs/{id}` | Update job |
| DELETE | `/api/jobs/{id}` | Delete job |
| GET | `/api/jobs/company/{id}` | Get company jobs |

### Applications Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/applications/apply` | Apply + AI analysis |
| GET | `/api/applications/job/{id}` | Get job applicants |
| GET | `/api/applications/candidate/{id}` | Get my applications |
| PUT | `/api/applications/{id}/status` | Update status |

---

## 🗺️ Roadmap

- [x] AI resume screening
- [x] Smart candidate ranking
- [x] Custom interview questions
- [x] 3 role system (Admin/Company/Candidate)
- [x] Jobs board with search & filters
- [x] Company verification system
- [x] Application status tracking
- [ ] Email notifications
- [ ] Resume builder
- [ ] Video interview integration
- [ ] Salary insights
- [ ] Mobile app

---

## 👨‍💻 Author

<div align="center">

### Farhan Naeem

**Full Stack Developer & AI Engineer**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/YOUR_USERNAME)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/YOUR_USERNAME)

</div>

---

![Footer](https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=120&section=footer&animation=twinkling)
