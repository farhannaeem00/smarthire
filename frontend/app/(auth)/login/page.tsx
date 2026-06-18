"use client";
import { useState } from "react";
import { login } from "@/lib/api";
import { setToken, setUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const { data } = await login({ email, password });
      setToken(data.token);
      setUser(data.user);
      toast.success("Login successful!");

      if (data.user.role === "company") router.push("/dashboard/company");
      else if (data.user.role === "admin") router.push("/dashboard/admin");
      else router.push("/dashboard/candidate");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Login failed");
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
            Hiring intelligence, on your side
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Sign in to access AI-screened candidates, track applications, and manage your hiring pipeline.
          </p>
          <div className="space-y-3">
            {[
              "AI screens every application",
              "Ranked candidate shortlists",
              "Auto-generated interview questions",
              "Track hiring pipeline in real-time",
            ].map((item) => (
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

          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-gray-400 mb-8">Login to your account</p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold py-3.5 rounded-xl transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500 uppercase">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="space-y-3 text-center text-sm">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-semibold">Sign up</Link>
            </p>
            <p className="text-gray-400">
              Looking for jobs?{" "}
              <Link href="/signup?role=candidate" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                Join as Candidate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}