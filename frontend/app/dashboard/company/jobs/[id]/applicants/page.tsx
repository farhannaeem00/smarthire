"use client";
import { useEffect, useState } from "react";
import { getJobApplications, getJob, updateApplicationStatus } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ApplicantsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [jobRes, appsRes] = await Promise.all([getJob(id as string), getJobApplications(id as string)]);
      setJob(jobRes.data.job);
      setApplications(appsRes.data.applications);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (appId: string, status: string) => {
    try {
      await updateApplicationStatus(appId, status);
      setApplications(applications.map((a) => a.id === appId ? { ...a, status } : a));
      if (selectedApp?.id === appId) setSelectedApp({ ...selectedApp, status });
      toast.success(`Application ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusStyle = (status: string) => {
    const styles: any = {
      pending: "bg-yellow-500/10 text-yellow-400",
      reviewing: "bg-blue-500/10 text-blue-400",
      shortlisted: "bg-emerald-500/10 text-emerald-400",
      rejected: "bg-red-500/10 text-red-400",
      hired: "bg-purple-500/10 text-purple-400",
    };
    return styles[status] || "bg-white/5 text-gray-400";
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E0D] flex items-center justify-center">
        <p className="text-gray-400">Loading applicants...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E0D] text-white">
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/company" className="text-gray-400 hover:text-white">← Dashboard</Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
              <span className="text-black font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-bold">SmartHire</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{job?.title}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {applications.length} applicant{applications.length !== 1 ? "s" : ""} • Ranked by AI Score
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applicants List */}
          <div className="space-y-3">
            {applications.length === 0 ? (
              <div className="text-center py-20 bg-[#111513] border border-white/10 rounded-2xl">
                <p className="text-5xl mb-4">👥</p>
                <h3 className="text-xl font-semibold mb-2">No applicants yet</h3>
                <p className="text-gray-400">Share your job posting to attract candidates</p>
              </div>
            ) : (
              applications.map((app, index) => (
                <div key={app.id} onClick={() => setSelectedApp(app)}
                  className={`bg-[#111513] border rounded-2xl p-5 cursor-pointer transition ${
                    selectedApp?.id === app.id ? "border-emerald-500" : "border-white/10 hover:border-white/20"
                  }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center font-bold text-emerald-400">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Candidate #{app.id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-gray-400">Applied {new Date(app.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getScoreColor(app.ai_score)}`}>{app.ai_score}</p>
                      <p className="text-xs text-gray-400">AI Score</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${getStatusStyle(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    <div className="flex gap-1">
                      {["shortlisted", "rejected", "hired"].map((s) => (
                        <button key={s} onClick={(e) => { e.stopPropagation(); handleStatusUpdate(app.id, s); }}
                          className={`text-xs px-2 py-1 rounded-lg transition ${
                            app.status === s ? getStatusStyle(s) : "bg-white/5 text-gray-400 hover:bg-white/10"
                          }`}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Application Detail */}
          <div>
            {selectedApp ? (
              <div className="bg-[#111513] border border-white/10 rounded-2xl p-6 sticky top-24 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg">Application Details</h2>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${getStatusStyle(selectedApp.status)}`}>
                    {selectedApp.status}
                  </span>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1f2e29" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
                          stroke={selectedApp.ai_score >= 70 ? "#10b981" : selectedApp.ai_score >= 40 ? "#f59e0b" : "#ef4444"}
                          strokeWidth="3" strokeDasharray={`${selectedApp.ai_score}, 100`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{selectedApp.ai_score}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">AI Match Score</p>
                      <p className={`text-sm ${getScoreColor(selectedApp.ai_score)}`}>
                        {selectedApp.ai_score >= 70 ? "Strong Match 🎉" : selectedApp.ai_score >= 40 ? "Good Potential 👍" : "Weak Match ⚠️"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-emerald-400 mb-2">🧠 AI Feedback</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedApp.ai_feedback}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-emerald-400 mb-2">🎯 Skills Analysis</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedApp.ai_skills_match}</p>
                </div>

                {selectedApp.cover_letter && (
                  <div>
                    <p className="text-sm font-semibold text-emerald-400 mb-2">📝 Cover Letter</p>
                    <p className="text-gray-300 text-sm leading-relaxed bg-white/5 rounded-xl p-3">{selectedApp.cover_letter}</p>
                  </div>
                )}

                {selectedApp.ai_questions && (
                  <div>
                    <p className="text-sm font-semibold text-emerald-400 mb-2">❓ AI Interview Questions</p>
                    <div className="space-y-2">
                      {(() => {
                        try {
                          const questions = JSON.parse(selectedApp.ai_questions.replace(/'/g, '"'));
                          return questions.map((q: string, i: number) => (
                            <div key={i} className="flex gap-2 p-2 bg-white/5 rounded-lg">
                              <span className="text-emerald-400 text-xs font-bold shrink-0">Q{i + 1}.</span>
                              <p className="text-gray-300 text-xs">{q}</p>
                            </div>
                          ));
                        } catch { return <p className="text-gray-400 text-xs">Questions unavailable</p>; }
                      })()}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-gray-400 mb-2">Update Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "reviewing", label: "Reviewing", color: "bg-blue-500/10 text-blue-400" },
                      { value: "shortlisted", label: "Shortlist", color: "bg-emerald-500/10 text-emerald-400" },
                      { value: "rejected", label: "Reject", color: "bg-red-500/10 text-red-400" },
                      { value: "hired", label: "Hire! 🎉", color: "bg-purple-500/10 text-purple-400" },
                    ].map((s) => (
                      <button key={s.value} onClick={() => handleStatusUpdate(selectedApp.id, s.value)}
                        className={`py-2 rounded-lg text-sm font-semibold transition ${s.color} ${
                          selectedApp.status === s.value ? "ring-1 ring-current" : ""
                        }`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#111513] border border-white/10 rounded-2xl p-12 text-center">
                <p className="text-4xl mb-3">👈</p>
                <p className="text-gray-400">Select an applicant to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}