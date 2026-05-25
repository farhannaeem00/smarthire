"use client";
import { useEffect, useState } from "react";
import { getCompanyByUser, getCompanyJobs, getCompanyStats, deleteJob } from "@/lib/api";
import { getUser, removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CompanyDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== "company") {
      router.push("/login");
      return;
    }
    setUser(u);
    fetchData(u.id);
  }, []);

  const fetchData = async (userId: string) => {
    try {
      const { data: companyData } = await getCompanyByUser(userId);
      if (!companyData.company) {
        router.push("/signup?role=company");
        return;
      }
      setCompany(companyData.company);

      const [jobsRes, statsRes] = await Promise.all([
        getCompanyJobs(companyData.company.id),
        getCompanyStats(companyData.company.id),
      ]);
      setJobs(jobsRes.data.jobs);
      setStats(statsRes.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJob(jobId);
      setJobs(jobs.filter((j) => j.id !== jobId));
      toast.success("Job deleted");
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  const handleToggleJob = async (jobId: string, isActive: boolean) => {
    try {
      await import("@/lib/api").then(({ updateJob }) =>
        updateJob(jobId, { is_active: !isActive })
      );
      setJobs(jobs.map((j) => j.id === jobId ? { ...j, is_active: !isActive } : j));
      toast.success(`Job ${!isActive ? "activated" : "deactivated"}`);
    } catch (error) {
      toast.error("Failed to update job");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-gray-950/90 backdrop-blur z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">S</div>
          <span className="text-xl font-bold">Smart<span className="text-blue-400">Hire</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{company?.name}</span>
          <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">Company</span>
          <button
            onClick={() => { removeToken(); router.push("/login"); }}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">{company?.name} Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">{company?.industry} • {company?.location}</p>
          </div>
          <Link
            href="/dashboard/company/post-job"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition"
          >
            + Post Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Jobs", value: stats?.total_jobs || 0, icon: "💼" },
            { label: "Total Applications", value: stats?.total_applications || 0, icon: "📝" },
            { label: "Pending Review", value: stats?.pending_applications || 0, icon: "⏳" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="text-4xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
          {["overview", "jobs", "company"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Recent Jobs</h3>
              {jobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">No jobs posted yet</p>
                  <Link
                    href="/dashboard/company/post-job"
                    className="text-blue-400 text-sm hover:underline mt-2 block"
                  >
                    Post your first job
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobs.slice(0, 4).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold">{job.title}</p>
                        <p className="text-xs text-gray-400">{job.location} • {job.job_type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          job.is_active
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}>
                          {job.is_active ? "Active" : "Inactive"}
                        </span>
                        <Link
                          href={`/dashboard/company/jobs/${job.id}/applicants`}
                          className="text-xs text-blue-400 hover:underline"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Company Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Company</span>
                  <span>{company?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Industry</span>
                  <span>{company?.industry || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location</span>
                  <span>{company?.location || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Website</span>
                  <span className="text-blue-400">{company?.website || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Size</span>
                  <span>{company?.size || "—"}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("company")}
                className="mt-4 text-sm text-blue-400 hover:underline"
              >
                Edit Company Info →
              </button>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div>
            {jobs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">💼</p>
                <h3 className="text-xl font-semibold mb-2">No jobs posted yet</h3>
                <p className="text-gray-400 mb-6">Post your first job and start receiving applications</p>
                <Link
                  href="/dashboard/company/post-job"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
                >
                  Post First Job
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{job.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            job.is_active
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}>
                            {job.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400 flex-wrap">
                          <span>📍 {job.location}</span>
                          <span>💼 {job.job_type}</span>
                          {job.salary_max > 0 && (
                            <span className="text-green-400">
                              💰 ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                            </span>
                          )}
                          <span>📅 {new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {job.skills?.slice(0, 4).map((skill: string) => (
                            <span key={skill} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4 shrink-0">
                        <Link
                          href={`/dashboard/company/jobs/${job.id}/applicants`}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition text-center"
                        >
                          View Applicants
                        </Link>
                        <button
                          onClick={() => handleToggleJob(job.id, job.is_active)}
                          className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition"
                        >
                          {job.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Company Tab */}
        {activeTab === "company" && (
          <CompanyEditForm company={company} onUpdate={setCompany} />
        )}
      </div>
    </div>
  );
}

// Company Edit Form Component
function CompanyEditForm({ company, onUpdate }: { company: any; onUpdate: (c: any) => void }) {
  const [name, setName] = useState(company?.name || "");
  const [description, setDescription] = useState(company?.description || "");
  const [website, setWebsite] = useState(company?.website || "");
  const [industry, setIndustry] = useState(company?.industry || "");
  const [size, setSize] = useState(company?.size || "");
  const [location, setLocation] = useState(company?.location || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { updateCompany } = await import("@/lib/api");
      const { data } = await updateCompany(company.id, {
        name, description, website, industry, size, location,
      });
      onUpdate(data.company);
      const { default: toast } = await import("react-hot-toast");
      toast.success("Company updated!");
    } catch (error) {
      const { default: toast } = await import("react-hot-toast");
      toast.error("Failed to update company");
    }
    setSaving(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-2xl">
      <h2 className="font-semibold text-lg mb-6">Edit Company Info</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Company Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            rows={3} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Industry</label>
            <input value={industry} onChange={(e) => setIndustry(e.target.value)}
              placeholder="Technology" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Company Size</label>
            <select value={size} onChange={(e) => setSize(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none">
              <option value="">Select size</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="500+">500+</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)}
              placeholder="Lahore, Pakistan" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Website</label>
            <input value={website} onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourcompany.com" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}