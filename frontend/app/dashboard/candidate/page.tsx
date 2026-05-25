"use client";
import { useEffect, useState } from "react";
import { getCandidateApplications } from "@/lib/api";
import { getUser, removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CandidateDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("applications");

  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== "candidate") {
      router.push("/login");
      return;
    }
    setUser(u);
    fetchApplications(u.id);
  }, []);

  const fetchApplications = async (userId: string) => {
    try {
      const { data } = await getCandidateApplications(userId);
      setApplications(data.applications);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: "bg-yellow-500/10 text-yellow-400",
      reviewing: "bg-blue-500/10 text-blue-400",
      shortlisted: "bg-green-500/10 text-green-400",
      rejected: "bg-red-500/10 text-red-400",
      hired: "bg-purple-500/10 text-purple-400",
    };
    return colors[status] || "bg-gray-500/10 text-gray-400";
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const parseQuestions = (questions: any) => {
    if (Array.isArray(questions)) return questions;
    if (typeof questions !== "string" || !questions.trim()) return [];

    try {
      const parsed = JSON.parse(questions);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      try {
        const parsed = JSON.parse(questions.replace(/'/g, '"'));
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
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
          <span className="text-sm text-gray-400">{user?.name}</span>
          <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">Candidate</span>
          <button
            onClick={() => { removeToken(); router.push("/login"); }}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name}! 👋</h1>
            <p className="text-gray-400 text-sm mt-1">Track your job applications</p>
          </div>
          <Link
            href="/jobs"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition"
          >
            Browse Jobs
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Applied", value: applications.length, icon: "📝" },
            { label: "Pending", value: applications.filter(a => a.status === "pending").length, icon: "⏳" },
            { label: "Shortlisted", value: applications.filter(a => a.status === "shortlisted").length, icon: "⭐" },
            { label: "Avg AI Score", value: applications.length > 0 ? Math.round(applications.reduce((acc, a) => acc + a.ai_score, 0) / applications.length) : 0, icon: "🤖" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-xs">{stat.label}</p>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
          {["applications", "profile"].map((tab) => (
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

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div>
            {applications.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">📋</p>
                <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
                <p className="text-gray-400 mb-6">Start applying to jobs to track them here</p>
                <Link
                  href="/jobs"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
                >
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center font-bold text-blue-400 text-lg shrink-0">
                          {app.jobs?.companies?.name?.[0] || "C"}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{app.jobs?.title}</h3>
                          <p className="text-gray-400 text-sm">{app.jobs?.companies?.name}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={`text-xs px-2.5 py-1 rounded-full ${getStatusColor(app.status)}`}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </span>
                            <span className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full">
                              📍 {app.jobs?.location}
                            </span>
                            <span className="text-xs text-gray-500">
                              Applied {new Date(app.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* AI Score */}
                      <div className="text-center shrink-0">
                        <p className={`text-3xl font-bold ${getScoreColor(app.ai_score)}`}>
                          {app.ai_score}
                        </p>
                        <p className="text-xs text-gray-400">AI Score</p>
                      </div>
                    </div>

                    {/* AI Feedback */}
                    {app.ai_feedback && (
                      <div className="mt-4 p-3 bg-gray-800 rounded-xl">
                        <p className="text-xs text-blue-400 font-semibold mb-1">🤖 AI Feedback</p>
                        <p className="text-gray-300 text-sm">{app.ai_feedback}</p>
                      </div>
                    )}

                    {/* Interview Questions */}
                    {app.ai_questions && (
                      <div className="mt-3">
                        <button
                          onClick={() => {
                            const el = document.getElementById(`questions-${app.id}`);
                            if (el) el.classList.toggle("hidden");
                          }}
                          className="text-xs text-blue-400 hover:text-blue-300 transition"
                        >
                          ❓ View Interview Questions
                        </button>
                        <div id={`questions-${app.id}`} className="hidden mt-2 space-y-2">
                          {parseQuestions(app.ai_questions).map((q: string, i: number) => (
                            <div key={i} className="flex gap-2 p-2 bg-gray-800 rounded-lg">
                              <span className="text-blue-400 text-xs font-bold shrink-0">Q{i + 1}.</span>
                              <p className="text-gray-300 text-xs">{q}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-6">Your Profile</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-2xl font-bold text-blue-400">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-xl">{user?.name}</h3>
                <p className="text-gray-400">{user?.email}</p>
                <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">Candidate</span>
              </div>
            </div>
            <Link
              href="/profile"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition"
            >
              Edit Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
