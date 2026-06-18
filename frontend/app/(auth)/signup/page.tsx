"use client";
import { useState, useEffect } from "react";
import { signUp, createCompany } from "@/lib/api";
import { setToken, setUser } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState("candidate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam) setRole(roleParam);
  }, [searchParams]);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill all required fields");
      return;
    }
    if (role === "company" && !companyName) {
      toast.error("Company name is required");
      return;
    }
    setLoading(true);
    try {
      const { data } = await signUp({ name, email, password, role });
      setToken(data.token || "");
      setUser(data.user);

      if (role === "company") {
        await createCompany({
          user_id: data.user.id,
          name: companyName,
          industry,
          location,
        });
        toast.success("Company account created!");
        router.push("/dashboard/company");
      } else {
        toast.success("Account created successfully!");
        router.push("/dashboard/candidate");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Signup failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0E0D] flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0E1110] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-white">SmartHire</span>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            {role === "company" ? "Start hiring smarter today" : "Find your next opportunity"}
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            {role === "company"
              ? "Post jobs, screen candidates with AI, and build your dream team faster."
              : "Apply to roles and get instant AI feedback on every application."}
          </p>
          <div className="space-y-3">
            {(role === "company" ? [
              "AI screens every applicant automatically",
              "Ranked shortlists in seconds",
              "Free to post your first 5 jobs",
            ] : [
              "Get an AI match score on every application",
              "Receive personalized interview prep",
              "Track all your applications in one place",
            ]).map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center text-xs">✓</span>
                <p className="text-sm font-medium text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-[#0B0E0D]">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-white">SmartHire</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Create account</h2>
          <p className="text-gray-400 mb-6">Join SmartHire today</p>

          {/* Role Toggle */}
          <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => setRole("candidate")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                role === "candidate" ? "bg-emerald-500 text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              👤 Candidate
            </button>
            <button
              onClick={() => setRole("company")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                role === "company" ? "bg-emerald-500 text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              🏢 Company
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">
                {role === "company" ? "Your Name *" : "Full Name *"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Farhan Naeem"
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>

            {role === "company" && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">Company Name *</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Tech Corp"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Technology"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Lahore, Pakistan"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold py-3.5 rounded-xl transition"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          <p className="text-gray-400 text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}