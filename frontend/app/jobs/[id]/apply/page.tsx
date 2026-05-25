"use client";
import { useEffect, useState } from "react";
import { getJob, applyForJob } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ApplyPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = getUser();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [aiResult, setAiResult] = useState<any>(null);

  useEffect(() => {
    if (!user || user.role !== "candidate") {
      router.push("/login");
      return;
    }
    fetchJob();
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

  const handleSubmit = async () => {
    if (!resume) {
      toast.error("Please upload your resume PDF");
      return;
    }
    if (!resume.name.endsWith(".pdf")) {
      toast.error("Only PDF files are allowed");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("job_id", id as string);
      formData.append("candidate_id", user.id);
      formData.append("cover_letter", coverLetter);
      formData.append("resume", resume);

      const { data } = await applyForJob(formData);
      setAiResult(data);
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to submit application");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">S</div>
          <span className="text-xl font-bold">Smart<span className="text-blue-400">Hire</span></span>
        </Link>
        <Link href={`/jobs/${id}`} className="text-sm text-gray-400 hover:text-white">← Back to Job</Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* AI Result Screen */}
        {aiResult ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✅</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Application Submitted!</h1>
              <p className="text-gray-400">Here's your AI-powered feedback</p>
            </div>

            {/* AI Score */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4">🤖 AI Resume Score</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#1f2937"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={aiResult.ai_score >= 70 ? "#22c55e" : aiResult.ai_score >= 40 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="3"
                      strokeDasharray={`${aiResult.ai_score}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{aiResult.ai_score}</span>
                  </div>
                </div>
                <div>
                  <p className={`text-xl font-bold ${
                    aiResult.ai_score >= 70 ? "text-green-400" :
                    aiResult.ai_score >= 40 ? "text-yellow-400" : "text-red-400"
                  }`}>
                    {aiResult.ai_score >= 70 ? "Strong Match! 🎉" :
                     aiResult.ai_score >= 40 ? "Good Potential 👍" : "Needs Improvement 📚"}
                  </p>
                  <p className="text-gray-400 text-sm">out of 100</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{aiResult.ai_feedback}</p>
            </div>

            {/* Skills Match */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-3">🎯 Skills Analysis</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{aiResult.ai_skills_match}</p>
            </div>

            {/* Interview Questions */}
            {aiResult.ai_questions?.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-4">❓ Prepare for These Interview Questions</h2>
                <div className="space-y-3">
                  {aiResult.ai_questions.map((q: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-800 rounded-xl">
                      <span className="text-blue-400 font-bold text-sm shrink-0">Q{i + 1}.</span>
                      <p className="text-gray-300 text-sm">{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Link
                href="/dashboard/candidate"
                className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
              >
                View My Applications
              </Link>
              <Link
                href="/jobs"
                className="flex-1 text-center border border-gray-700 hover:border-blue-500 text-gray-300 font-semibold py-3 rounded-xl transition"
              >
                Browse More Jobs
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Job Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center font-bold text-blue-400 text-lg">
                  {job?.companies?.name?.[0]}
                </div>
                <div>
                  <h2 className="font-bold">{job?.title}</h2>
                  <p className="text-sm text-gray-400">{job?.companies?.name} • {job?.location}</p>
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-8">Apply for this Position</h1>

            <div className="space-y-6">
              {/* Resume Upload */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="font-semibold text-lg mb-2">Upload Resume *</h2>
                <p className="text-gray-400 text-sm mb-4">
                  Our AI will analyze your resume and score it against the job requirements.
                </p>
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <p className="text-4xl mb-3">📄</p>
                    <p className="text-gray-400 text-sm">
                      {resume ? (
                        <span className="text-green-400 font-semibold">✓ {resume.name}</span>
                      ) : (
                        "Click to upload your resume PDF"
                      )}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">PDF files only</p>
                  </label>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="font-semibold text-lg mb-2">Cover Letter</h2>
                <p className="text-gray-400 text-sm mb-4">Optional but recommended</p>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the employer why you're a great fit for this role..."
                  rows={5}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 resize-none text-sm"
                />
              </div>

              {/* AI Info Box */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-blue-300 text-sm font-semibold mb-1">🤖 AI Powered Application</p>
                <p className="text-blue-400/80 text-xs">
                  After submitting, our AI will instantly analyze your resume,
                  give you a match score, identify skills gaps, and generate
                  personalized interview questions to help you prepare.
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition text-lg"
              >
                {submitting ? "🤖 AI is analyzing your resume..." : "Submit Application →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}