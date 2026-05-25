"use client";
import { useEffect, useState } from "react";
import { getJob } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
 const [user, setUser] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
  setUser(getUser());
}, [id]);

  const fetchJob = async () => {
    try {
      const { data } = await getJob(id as string);
      setJob(data.job);
    } catch (error) {
      toast.error("Job not found");
      router.push("/jobs");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading job...</p>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-gray-950/90 backdrop-blur z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">S</div>
          <span className="text-xl font-bold">Smart<span className="text-blue-400">Hire</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/jobs" className="text-sm text-gray-400 hover:text-white">← Jobs</Link>
          {user ? (
            <Link href={`/dashboard/${user.role}`} className="text-sm text-gray-400 hover:text-white">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="text-sm text-gray-400 hover:text-white">Login</Link>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center font-bold text-blue-400 text-2xl shrink-0">
                  {job.companies?.name?.[0] || "C"}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
                  <p className="text-blue-400 font-semibold">{job.companies?.name}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-xs bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full">
                      {job.job_type}
                    </span>
                    <span className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full">
                      📍 {job.location}
                    </span>
                    {job.salary_max > 0 && (
                      <span className="text-xs bg-green-500/10 text-green-400 px-2.5 py-1 rounded-full">
                        💰 ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      📅 {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              {user?.role === "candidate" ? (
                <Link
                  href={`/jobs/${id}/apply`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
                >
                  Apply Now →
                </Link>
              ) : !user ? (
                <Link
                  href="/login"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
                >
                  Login to Apply
                </Link>
              ) : null}
            </div>

            {/* Description */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4">Job Description</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4">Requirements</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {job.requirements}
              </p>
            </div>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Company Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4">About Company</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center font-bold text-blue-400 text-lg">
                  {job.companies?.name?.[0]}
                </div>
                <div>
                  <p className="font-semibold">{job.companies?.name}</p>
                  <p className="text-xs text-gray-400">{job.companies?.industry}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {job.companies?.description || "No description available."}
              </p>
              {job.companies?.website && (
                <a
                  href={job.companies.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-sm hover:underline"
                >
                  🌐 Visit Website
                </a>
              )}
            </div>

            {/* Job Summary */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4">Job Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="capitalize">{job.job_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location</span>
                  <span>{job.location}</span>
                </div>
                {job.salary_max > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Salary</span>
                    <span className="text-green-400">
                      ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Posted</span>
                  <span>{new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Apply CTA */}
            {user?.role === "candidate" && (
              <Link
                href={`/jobs/${id}/apply`}
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
              >
                Apply for this Job →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}