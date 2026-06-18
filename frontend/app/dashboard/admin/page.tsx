"use client";
import { useEffect, useState } from "react";
import { getAllCompanies, getJobs } from "@/lib/api";
import { getUser, removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== "admin") { router.push("/login"); return; }
    setUser(u);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [companiesRes, jobsRes] = await Promise.all([getAllCompanies(), getJobs()]);
      setCompanies(companiesRes.data.companies || companiesRes.data || []);
      setJobs(jobsRes.data.jobs || jobsRes.data || []);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const { deleteJob } = await import("@/lib/api");
      await deleteJob(jobId);
      setJobs(jobs.filter((j) => j.id !== jobId));
      toast.success("Job deleted");
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  const handleVerifyCompany = async (companyId: string, isVerified: boolean) => {
    try {
      const { updateCompany } = await import("@/lib/api");
      await updateCompany(companyId, { is_verified: !isVerified });
      setCompanies(companies.map((c) =>
        c.id === companyId ? { ...c, is_verified: !isVerified } : c
      ));
      toast.success("Company updated");
    } catch (error) {
      toast.error("Failed to update company");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E0D] flex items-center justify-center">
        <p className="text-gray-400">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E0D] text-white">
      {/* Navbar */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0B0E0D]/95 backdrop-blur z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
            <span className="text-black font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-bold">SmartHire</span>
          <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full ml-1">Admin</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user?.name}</span>
          <button
            onClick={() => { removeToken(); router.push("/login"); }}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Companies", value: companies.length, icon: "🏢" },
            { label: "Total Jobs", value: jobs.length, icon: "💼" },
            { label: "Active Jobs", value: jobs.filter((j) => j.is_active).length, icon: "✅" },
            { label: "Industries", value: [...new Set(companies.map((c) => c.industry).filter(Boolean))].length, icon: "🏭" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#111513] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-xs">{stat.label}</p>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/5 pb-4">
          {["overview", "companies", "jobs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${
                activeTab === tab ? "bg-emerald-500 text-black" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#111513] border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Recent Companies</h3>
              {companies.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No companies yet</p>
              ) : (
                <div className="space-y-3">
                  {companies.slice(0, 5).map((company) => (
                    <div key={company.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center font-bold text-emerald-400">
                        {company.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{company.name}</p>
                        <p className="text-xs text-gray-400">{company.industry} • {company.location}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        company.is_verified ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {company.is_verified ? "Verified" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#111513] border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Recent Jobs</h3>
              {jobs.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No jobs yet</p>
              ) : (
                <div className="space-y-3">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold">{job.title}</p>
                        <p className="text-xs text-gray-400">{job.companies?.name} • {job.location}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        job.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                      }`}>
                        {job.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Companies Tab */}
        {activeTab === "companies" && (
          <div className="bg-[#111513] border border-white/10 rounded-2xl overflow-hidden">
            {companies.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🏢</p>
                <p className="text-gray-400">No companies registered yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Industry</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Size</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id} className="border-b border-white/5 last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center font-bold text-emerald-400 text-sm">
                            {company.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{company.name}</p>
                            <p className="text-xs text-gray-400">{company.website || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{company.industry || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{company.location || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{company.size || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          company.is_verified ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
                        }`}>
                          {company.is_verified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleVerifyCompany(company.id, company.is_verified)}
                          className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg transition"
                        >
                          {company.is_verified ? "Unverify" : "Verify"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="bg-[#111513] border border-white/10 rounded-2xl overflow-hidden">
            {jobs.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">💼</p>
                <p className="text-gray-400">No jobs posted yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                    <th className="px-6 py-4">Job</th>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b border-white/5 last:border-0">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm">{job.title}</p>
                        <p className="text-xs text-gray-400">{new Date(job.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{job.companies?.name}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">{job.job_type}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{job.location}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          job.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        }`}>
                          {job.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}