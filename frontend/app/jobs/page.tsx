"use client";
import { useEffect, useState } from "react";
import { getJobs } from "@/lib/api";
import { getUser, removeToken } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function JobsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  useEffect(() => {
    fetchJobs();
  }, [jobType]);

  useEffect(() => {
  setUser(getUser());
}, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await getJobs({ keyword, location, job_type: jobType });
      setJobs(data.jobs);
      setTotal(data.total);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetchJobs();
  };

  const handleClear = () => {
    setKeyword("");
    setLocation("");
    setJobType("");
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-gray-950/90 backdrop-blur z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">S</div>
          <span className="text-xl font-bold">Smart<span className="text-blue-400">Hire</span></span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href={`/dashboard/${user.role}`}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Dashboard
              </Link>
              <span className="text-sm text-gray-400">{user.name}</span>
              <button
                onClick={() => {
                  removeToken();
                  window.location.href = "/login";
                }}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-400 hover:text-white">Login</Link>
              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Search Header */}
      <div className="bg-gradient-to-b from-blue-950/30 to-gray-950 px-6 py-12">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Find Your Dream Job</h1>
          <p className="text-gray-400">Browse {total} open positions from top companies</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Job title or keyword..."
              className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 text-sm"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Location..."
              className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 text-sm"
            />
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none text-sm"
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition text-sm"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">
            Showing <span className="text-white font-semibold">{jobs.length}</span> jobs
          </p>
          {(keyword || location || jobType) && (
            <button
              onClick={handleClear}
              className="text-sm text-blue-400 hover:text-blue-300 transition"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-1/3" />
                    <div className="h-3 bg-gray-800 rounded w-1/4" />
                  </div>
                </div>
                <div className="h-3 bg-gray-800 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-gray-400 mb-6">Try different keywords or clear filters</p>
            <button
              onClick={handleClear}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <div className="bg-gray-900 border border-gray-800 hover:border-blue-500/30 rounded-2xl p-6 transition group">
                  <div className="flex items-start gap-4">
                    {/* Company Logo */}
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center font-bold text-blue-400 text-lg shrink-0">
                      {job.companies?.name?.[0] || "C"}
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-blue-400 transition">
                            {job.title}
                          </h3>
                          <p className="text-gray-400 text-sm mt-0.5 flex items-center gap-1">
                            {job.companies?.name}
                            {job.companies?.is_verified && (
                              <span className="text-blue-400 text-xs">✓ Verified</span>
                            )}
                          </p>
                        </div>
                        {job.salary_max > 0 && (
                          <span className="text-green-400 font-semibold text-sm shrink-0">
                            ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap mt-3">
                        <span className="text-xs bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full">
                          {job.job_type}
                        </span>
                        <span className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full">
                          📍 {job.location}
                        </span>
                        {(Array.isArray(job.skills) ? job.skills : []).slice(0, 3).map((skill: string) => (
                          <span key={skill} className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                        {job.skills?.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{job.skills.length - 3} more
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-3">
                        Posted {new Date(job.created_at).toLocaleDateString()}
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
