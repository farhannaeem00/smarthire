import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const signUp = (data: any) => API.post("/api/auth/signup", data);
export const login = (data: any) => API.post("/api/auth/login", data);

// Companies
export const createCompany = (data: any) => API.post("/api/companies/create", data);
export const getCompanyByUser = (userId: string) => API.get(`/api/companies/user/${userId}`);
export const getCompany = (id: string) => API.get(`/api/companies/${id}`);
export const updateCompany = (id: string, data: any) => API.put(`/api/companies/${id}`, data);
export const getAllCompanies = () => API.get("/api/companies/");

// Jobs
export const getJobs = (params?: any) => API.get("/api/jobs/", { params });
export const getJob = (id: string) => API.get(`/api/jobs/${id}`);
export const createJob = (data: any) => API.post("/api/jobs/create", data);
export const updateJob = (id: string, data: any) => API.put(`/api/jobs/${id}`, data);
export const deleteJob = (id: string) => API.delete(`/api/jobs/${id}`);
export const getCompanyJobs = (companyId: string) => API.get(`/api/jobs/company/${companyId}`);

// Applications
export const applyForJob = (data: FormData) => API.post("/api/applications/apply", data, {
  headers: { "Content-Type": "multipart/form-data" },
});
export const getJobApplications = (jobId: string) => API.get(`/api/applications/job/${jobId}`);
export const getCandidateApplications = (candidateId: string) => API.get(`/api/applications/candidate/${candidateId}`);
export const getApplication = (id: string) => API.get(`/api/applications/${id}`);
export const updateApplicationStatus = (id: string, status: string) => API.put(`/api/applications/${id}/status`, { status });
export const getCompanyStats = (companyId: string) => API.get(`/api/applications/stats/${companyId}`);

export default API;