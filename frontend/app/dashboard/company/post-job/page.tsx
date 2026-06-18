"use client";
import { useEffect, useState } from "react";
import { createJob, getCompanyByUser } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function PostJobPage() {
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("full-time");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== "company") { router.push("/login"); return; }
    fetchCompany(u.id);
  }, []);

  const fetchCompany = async (userId: string) => {
    try {
      const { data } = await getCompanyByUser(userId);
      setCompany(data.company);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    if (skills.includes(skillInput.trim())) { toast.error("Skill already added"); return; }
    setSkills([...skills, skillInput.trim()]);
    setSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => setSkills(skills.filter((s) => s !== skill));

  const handleSubmit = async () => {
    if (!title || !description || !requirements || !location) {
      toast.error("Please fill all required fields");
      return;
    }
    if (skills.length === 0) { toast.error("Please add at least one required skill"); return; }

    setLoading(true);
    try {
      await createJob({
        company_id: company.id, title, description, requirements, skills, location,
        job_type: jobType, salary_min: parseInt(salaryMin) || 0, salary_max: parseInt(salaryMax) || 0,
      });
      toast.success("Job posted successfully!");
      router.push("/dashboard/company");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to post job");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0E0D] text-white">
      <div className="border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard/company" className="text-gray-400 hover:text-white transition">← Back</Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
            <span className="text-black font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-bold">SmartHire</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
        <p className="text-gray-400 mb-8">Fill in the details to attract the best candidates</p>

        <div className="space-y-6">
          <div className="bg-[#111513] border border-white/10 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Job Title *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Full Stack Developer"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Location *</label>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lahore, Pakistan"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Job Type *</label>
                  <select value={jobType} onChange={(e) => setJobType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none">
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Min Salary ($)</label>
                  <input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} placeholder="50000"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Max Salary ($)</label>
                  <input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} placeholder="100000"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111513] border border-white/10 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Job Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Job Description *</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the role, responsibilities and what a typical day looks like..." rows={5}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 resize-none" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Requirements *</label>
                <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)}
                  placeholder="List the qualifications, experience and education requirements..." rows={5}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-[#111513] border border-white/10 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Required Skills</h2>
            <p className="text-gray-400 text-sm mb-4">AI will use these skills to score candidates automatically</p>
            <div className="flex gap-2 mb-4">
              <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSkill()} placeholder="e.g. React.js"
                className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500" />
              <button onClick={handleAddSkill}
                className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2.5 rounded-lg transition font-semibold">
                Add
              </button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill}
                    className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-sm">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400 transition">✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <p className="text-emerald-300 text-sm font-semibold mb-1">🧠 AI-Powered Screening</p>
            <p className="text-emerald-400/80 text-xs">
              When candidates apply, our AI will automatically read their resume, score it against your requirements and skills, rank all applicants, and generate custom interview questions for each candidate.
            </p>
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-4 rounded-xl transition text-lg">
            {loading ? "Posting Job..." : "Post Job →"}
          </button>
        </div>
      </div>
    </div>
  );
}