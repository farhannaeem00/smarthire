"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getJobs } from "@/lib/api";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [activeRole, setActiveRole] = useState("company");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await getJobs();
        setJobs((data.jobs || data || []).slice(0, 6));
      } catch (error) {
        console.log(error);
      }
    };
    fetchJobs();
  }, []);

  const stats = [
    { value: "12,000+", label: "Companies Hiring" },
    { value: "850K+", label: "Candidates Screened" },
    { value: "94%", label: "AI Accuracy Rate" },
    { value: "3.2x", label: "Faster Time-to-Hire" },
  ];

  const features = [
    { icon: "🧠", title: "AI Resume Screening", desc: "Every resume is read, scored, and ranked by AI in seconds — not days." },
    { icon: "🎯", title: "Precision Matching", desc: "Match candidates to roles based on skills, experience, and culture fit." },
    { icon: "❓", title: "Auto-Generated Interviews", desc: "AI builds tailored interview questions for every shortlisted candidate." },
    { icon: "📊", title: "Hiring Analytics", desc: "Track pipeline health, time-to-hire, and source quality in real time." },
    { icon: "🛡️", title: "Bias-Free Screening", desc: "Standardized AI evaluation removes unconscious bias from early screening." },
    { icon: "⚡", title: "Instant Shortlists", desc: "Go from 200 applicants to a ranked shortlist of 10 in under a minute." },
  ];

  const steps = [
    { num: "01", title: "Post the role", desc: "Define requirements, skills, and salary band in minutes." },
    { num: "02", title: "AI screens every applicant", desc: "Resumes are parsed, scored, and ranked automatically." },
    { num: "03", title: "Review your shortlist", desc: "See top candidates with AI feedback and suggested questions." },
    { num: "04", title: "Hire with confidence", desc: "Move qualified candidates through your pipeline faster." },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E0D] text-white font-sans">

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-[#0B0E0D]/95 backdrop-blur-sm border-b border-white/5" : ""
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
              <span className="text-black font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-bold tracking-tight">SmartHire</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <Link href="/jobs" className="hover:text-white transition">Browse Jobs</Link>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how-it-works" className="hover:text-white transition">How it Works</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-300 hover:text-white transition px-3 py-1.5">
              Log in
            </Link>
            <Link href="/signup?role=company"
              className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded transition">
              Post a Job
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 uppercase tracking-wider"
          >
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            AI-Powered Hiring Intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
          >
            Hire the best,
            <br />
            <span className="text-emerald-400">not just the fastest</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            SmartHire's AI reads every resume, scores every candidate, and builds
            interview questions — so your team focuses on people, not paperwork.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link href="/signup?role=company"
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-7 py-3.5 rounded-lg transition text-base">
              Start Hiring Free →
            </Link>
            <Link href="/jobs"
              className="border border-white/15 hover:border-white/30 text-gray-200 font-semibold px-7 py-3.5 rounded-lg transition text-base">
              Browse Open Roles
            </Link>
          </motion.div>

          <p className="text-gray-500 text-xs mt-5">
            No credit card required • Free AI screening for your first 5 jobs
          </p>
        </div>

        {/* Role switch preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mt-16 bg-[#111513] border border-white/10 rounded-2xl overflow-hidden"
        >
          <div className="flex border-b border-white/10">
            <button onClick={() => setActiveRole("company")}
              className={`flex-1 py-4 text-sm font-semibold transition ${
                activeRole === "company" ? "text-emerald-400 bg-emerald-500/5 border-b-2 border-emerald-400" : "text-gray-500"
              }`}>
              🏢 For Companies
            </button>
            <button onClick={() => setActiveRole("candidate")}
              className={`flex-1 py-4 text-sm font-semibold transition ${
                activeRole === "candidate" ? "text-emerald-400 bg-emerald-500/5 border-b-2 border-emerald-400" : "text-gray-500"
              }`}>
              👤 For Candidates
            </button>
          </div>

          <div className="p-8">
            {activeRole === "company" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {[
                  { name: "Sarah Ahmed", score: 94, role: "Senior Frontend Engineer" },
                  { name: "Bilal Khan", score: 88, role: "Senior Frontend Engineer" },
                  { name: "Ayesha Raza", score: 76, role: "Senior Frontend Engineer" },
                ].map((c) => (
                  <div key={c.name} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 bg-emerald-500/20 rounded-full flex items-center justify-center text-sm font-bold text-emerald-400">
                        {c.name[0]}
                      </div>
                      <span className={`text-lg font-bold ${c.score >= 90 ? "text-emerald-400" : c.score >= 80 ? "text-yellow-400" : "text-gray-400"}`}>
                        {c.score}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.role}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-left max-w-md mx-auto">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1f2e29" strokeWidth="3" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="87, 100" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">87</div>
                  </div>
                  <div>
                    <p className="font-semibold">Strong Match 🎉</p>
                    <p className="text-xs text-gray-500">Senior Frontend Engineer</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  "Strong React and TypeScript background with relevant production experience. Consider highlighting testing experience in your interview."
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">Process</p>
            <h2 className="text-4xl font-bold">From posting to hire in 4 steps</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.num}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} className="relative">
                <div className="text-5xl font-bold text-emerald-500/20 mb-4">{step.num}</div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-[#0E1110]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl font-bold">Built for hiring teams that move fast</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#111513] border border-white/10 hover:border-emerald-500/30 rounded-2xl p-6 transition">
                <span className="text-3xl block mb-4">{f.icon}</span>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      {jobs.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="flex items-end justify-between mb-10">
              <div>
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">Open Roles</p>
                <h2 className="text-3xl font-bold">Find your next opportunity</h2>
              </div>
              <Link href="/jobs" className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition">
                View All →
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job, i) => (
                <motion.div key={job.id || job._id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}>
                  <Link href={`/jobs/${job.id || job._id}`}>
                    <div className="bg-[#111513] border border-white/10 hover:border-emerald-500/30 rounded-xl p-5 transition">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center font-bold text-emerald-400 text-sm">
                          {job.companies?.name?.[0] || job.company?.name?.[0] || "C"}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{job.title}</p>
                          <p className="text-xs text-gray-500">{job.companies?.name || job.company?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">{job.job_type}</span>
                        <span className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded-full">📍 {job.location}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-6 bg-emerald-500">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Ready to hire smarter?
          </h2>
          <p className="text-black/70 mb-8 text-lg">
            Join 12,000+ companies using SmartHire to screen, score, and shortlist candidates with AI.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup?role=company"
              className="bg-black text-white hover:bg-gray-900 font-bold px-8 py-3.5 rounded-lg transition text-sm">
              Post a Job Free
            </Link>
            <Link href="/signup?role=candidate"
              className="border-2 border-black/20 text-black hover:bg-black/5 font-semibold px-8 py-3.5 rounded-lg transition text-sm">
              Find Jobs
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0E1110] border-t border-white/5 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-emerald-500 rounded flex items-center justify-center">
                  <span className="text-black font-bold text-xs">S</span>
                </div>
                <span className="font-bold text-lg">SmartHire</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 max-w-xs">
                AI-powered hiring intelligence. Screen, score, and shortlist candidates faster than ever.
              </p>
              <p className="text-xs text-gray-600">
                © 2026 SmartHire. Built by <span className="text-emerald-400 font-semibold">Farhan</span>
              </p>
            </div>

            {[
              { title: "For Companies", links: [
                { label: "Post a Job", href: "/signup?role=company" },
                { label: "Browse Plans", href: "/signup?role=company" },
                { label: "Company Login", href: "/login" },
              ]},
              { title: "For Candidates", links: [
                { label: "Browse Jobs", href: "/jobs" },
                { label: "Create Profile", href: "/signup?role=candidate" },
                { label: "Candidate Login", href: "/login" },
              ]},
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-gray-500 hover:text-white text-sm transition">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-6 flex items-center justify-between flex-wrap gap-4">
            <p className="text-xs text-gray-600">Privacy Policy • Terms of Service</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span className="text-xs text-gray-500">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}