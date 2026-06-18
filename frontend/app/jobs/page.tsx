"use client";
import { useEffect, useState } from "react";
import { getJobs } from "@/lib/api";
import { getUser, removeToken } from "@/lib/auth";
import Link from "next/link";

export default function JobsPage() {
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [jobType]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await getJobs({ keyword, location, job_type: jobType });
      setJobs(data.jobs || data || []);
      setTotal(data.total || (data.jobs || data || []).length);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleSearch = () => fetchJobs();

  const handleClear = () => {
    setKeyword("");
    setLocation("");
    setJobType("");
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-[#0B0E0D] text-white">
      {/* Navbar */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0B0E0D]/95 backdrop-blur z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
            <span className="text-black font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-bold">SmartHire</span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href={`/dashboard/${user.role}`} className="text-sm text-gray-400 hover:text-white transition">
                Dashboard
              </Link>
              <span className="text-sm text-gray-400">{user.name}</span>
              <button
                onClick={() => { removeToken(); window.location.href = "/login"; }}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-400 hover:text-white">Login</Link>
              <Link href="/signup"
                className="bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold px-4 py-2 rounded transition">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Search Header */}
      <div className="border-b border-white/5 px-6 py-12">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Find Your Next Role</h1>
          <p className="text-gray-400">Browse {total} open positions screened by AI</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-[#111513] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Job title or keyword..."
              className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 text-sm"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Location..."
              className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 text-sm"
            />
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none text-sm"
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
              <option value="internship">Internship</option>
            </select>
            <button
              onClick={handleSearch}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-2.5 rounded-lg transition text-sm"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">
            Showing <span className="text-white font-semibold">{jobs.length}</span> jobs
          </p>
          {(keyword || location || jobType) && (
            <button onClick={handleClear} className="text-sm text-emerald-400 hover:text-emerald-300 transition">
              Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-[#111513] border border-white/10 rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-1/3" />
                    <div className="h-3 bg-white/5 rounded w-1/4" />
                  </div>
                </div>
                <div className="h-3 bg-white/5 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-gray-400 mb-6">Try different keywords or clear filters</p>
            <button onClick={handleClear} className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2.5 rounded-lg transition">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link key={job.id || job._id} href={`/jobs/${job.id || job._id}`}>
                <div className="bg-[#111513] border border-white/10 hover:border-emerald-500/30 rounded-2xl p-6 transition group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center font-bold text-emerald-400 text-lg shrink-0">
                      {job.companies?.name?.[0] || job.company?.name?.[0] || "C"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-emerald-400 transition">{job.title}</h3>
                          <p className="text-gray-400 text-sm mt-0.5">{job.companies?.name || job.company?.name}</p>
                        </div>
                        {job.salary_max > 0 && (
                          <span className="text-emerald-400 font-semibold text-sm shrink-0">
                            ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">{job.description}</p>

                      <div className="flex items-center gap-2 flex-wrap mt-3">
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full">
                          {job.job_type}
                        </span>
                        <span className="text-xs bg-white/5 text-gray-400 px-2.5 py-1 rounded-full">
                          📍 {job.location}
                        </span>
                        {job.skills?.slice(0, 3).map((skill: string) => (
                          <span key={skill} className="text-xs bg-white/5 text-gray-400 px-2.5 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                        {job.skills?.length > 3 && (
                          <span className="text-xs text-gray-500">+{job.skills.length - 3} more</span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-3">
                        Posted {new Date(job.created_at || job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}