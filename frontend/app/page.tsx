"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getJobs } from "@/lib/api";

function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-10 ${className}`}
      animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function TypingText({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    const speed = deleting ? 50 : 100;
    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setTimeout(() => setDeleting(true), 1500);
        return;
      }
      if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
        return;
      }
      setText((t) => deleting ? t.slice(0, -1) : word.slice(0, t.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, index, words]);

  return (
    <span className="text-blue-400">
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-0.5 h-10 bg-blue-400 ml-1 align-middle"
      />
    </span>
  );
}

export default function LandingPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await getJobs();
        setJobs(data.jobs.slice(0, 6));
      } catch (error) {
        console.log(error);
      }
    };
    fetchJobs();
  }, []);

  const features = [
    { icon: "🤖", title: "AI Resume Screening", desc: "Our AI reads every resume and scores candidates against job requirements automatically." },
    { icon: "📊", title: "Smart Ranking", desc: "Candidates are ranked by AI score so you always see the best matches first." },
    { icon: "❓", title: "Interview Questions", desc: "AI generates custom interview questions for each candidate based on their profile." },
    { icon: "⚡", title: "Instant Analysis", desc: "Get AI feedback on every application within seconds of submission." },
    { icon: "🎯", title: "Skills Matching", desc: "AI matches candidate skills against job requirements and shows gaps clearly." },
    { icon: "📈", title: "Hiring Analytics", desc: "Track your hiring pipeline with detailed analytics and insights." },
  ];

  const steps = [
    { number: "01", title: "Post a Job", desc: "Create a job listing with requirements and required skills in minutes." },
    { number: "02", title: "Candidates Apply", desc: "Candidates upload their resume and cover letter to apply instantly." },
    { number: "03", title: "AI Screens All", desc: "Our AI reads every resume, scores candidates, and generates interview questions." },
    { number: "04", title: "Hire the Best", desc: "Review AI-ranked candidates and make smarter hiring decisions faster." },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "bg-gray-950/90 backdrop-blur border-b border-gray-800" : ""
        }`}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">S</div>
          <span className="text-xl font-bold">Smart<span className="text-blue-400">Hire</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <Link href="/jobs" className="hover:text-white transition">Browse Jobs</Link>
          <Link href="/login" className="hover:text-white transition">Login</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition">Login</Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-gray-950 to-gray-950 pointer-events-none" />
        <Orb className="w-96 h-96 bg-blue-600 top-10 -left-20" />
        <Orb className="w-80 h-80 bg-indigo-600 bottom-20 -right-10" />
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm px-4 py-2 rounded-full mb-8"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
            AI-Powered Recruitment Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            Hire Smarter
            <br />
            with <TypingText words={["AI Screening", "Smart Ranking", "Auto Analysis", "Zero Bias"]} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          >
            SmartHire uses AI to screen resumes, rank candidates, and generate
            interview questions — so you can focus on hiring the best talent.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex items-center justify-center gap-4 flex-wrap mb-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/signup?role=company"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition text-lg"
              >
                Post a Job →
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/jobs"
                className="border border-gray-700 hover:border-blue-500 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-xl transition text-lg"
              >
                Browse Jobs
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center gap-8 text-sm text-gray-500"
          >
            {["Free to start", "No credit card", "AI powered"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="text-green-400">✓</span> {t}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-1.5">
            <motion.div
              className="w-1.5 h-2 bg-blue-400 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-gray-800/50">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "10K+", label: "Jobs Posted" },
            { value: "50K+", label: "Candidates" },
            { value: "95%", label: "Accuracy Rate" },
            { value: "3x", label: "Faster Hiring" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-4xl font-extrabold text-blue-400 mb-1">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-blue-400 text-sm font-semibold mb-3 uppercase tracking-widest">How It Works</p>
            <h2 className="text-4xl font-bold">Hire in 4 Simple Steps</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-2xl font-bold text-blue-400 mx-auto mb-4"
                >
                  {step.number}
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-blue-400 text-sm font-semibold mb-3 uppercase tracking-widest">Features</p>
            <h2 className="text-4xl font-bold">Everything You Need to Hire Better</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900 border border-gray-800 hover:border-blue-500/30 rounded-2xl p-6 transition"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-2xl mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      {jobs.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-12"
            >
              <div>
                <p className="text-blue-400 text-sm font-semibold mb-2 uppercase tracking-widest">Latest Jobs</p>
                <h2 className="text-3xl font-bold">Find Your Next Role</h2>
              </div>
              <Link href="/jobs" className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                View All →
              </Link>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Link href={`/jobs/${job.id}`}>
                    <div className="bg-gray-900 border border-gray-800 hover:border-blue-500/30 rounded-2xl p-5 transition">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center font-bold text-blue-400">
                          {job.companies?.name?.[0] || "C"}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{job.title}</p>
                          <p className="text-xs text-gray-400">{job.companies?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">{job.job_type}</span>
                        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">📍 {job.location}</span>
                        {job.salary_max > 0 && (
                          <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full">
                            ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                          </span>
                        )}
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
      <section className="py-24 px-6 relative overflow-hidden">
        <Orb className="w-96 h-96 bg-blue-700 top-0 left-1/2 -translate-x-1/2" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <h2 className="text-5xl font-extrabold mb-6">
            Ready to Hire <span className="text-blue-400">Smarter?</span>
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            Join thousands of companies using SmartHire to find the best talent with AI.
          </p>
          <div className="flex items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/signup?role=company"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition"
              >
                Post a Job Free →
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/signup?role=candidate"
                className="border border-gray-700 hover:border-blue-500 text-gray-300 font-bold px-8 py-4 rounded-xl text-lg transition"
              >
                Find Jobs
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">S</div>
            <span className="font-bold">Smart<span className="text-blue-400">Hire</span></span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 SmartHire. Built with ❤️ by{" "}
            <span className="text-blue-400 font-semibold">Farhan</span>
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/jobs" className="hover:text-white transition">Jobs</Link>
            <Link href="/login" className="hover:text-white transition">Login</Link>
            <Link href="/signup" className="hover:text-white transition">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}