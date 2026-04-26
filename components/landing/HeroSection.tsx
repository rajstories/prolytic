"use client";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, TrendingUp } from "lucide-react";

interface HeroSectionProps {
  onOpenModal?: () => void;
}

const part1Words = ["Stop", "Guessing", "What", "Goes", "Viral."];
const part2Words = ["Know", "Before", "You", "Post."];
const barHeights = [65, 80, 55, 90, 70, 85];

export default function HeroSection({ onOpenModal }: HeroSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-24 pb-16">
      {/* Gradient mesh blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, #7c3aed, transparent 70%)",
            opacity: 0.14,
            filter: "blur(80px)",
            top: "-15%",
            left: "-10%",
          }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          style={{
            position: "absolute",
            width: 800,
            height: 800,
            borderRadius: "50%",
            background: "radial-gradient(circle, #2563eb, transparent 70%)",
            opacity: 0.12,
            filter: "blur(80px)",
            top: "20%",
            right: "-15%",
          }}
          animate={{ x: [0, -25, 10, 0], y: [0, 20, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          style={{
            position: "absolute",
            width: 650,
            height: 650,
            borderRadius: "50%",
            background: "radial-gradient(circle, #0d9488, transparent 70%)",
            opacity: 0.15,
            filter: "blur(80px)",
            bottom: "-10%",
            left: "30%",
          }}
          animate={{ x: [0, 15, -30, 0], y: [0, -25, 10, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-display text-4xl md:text-6xl font-black text-[#0f172a] tracking-tighter leading-[1.15] mb-6">
              <span className="block">
                {part1Words.map((word, i) => (
                  <motion.span
                    key={`p1-${i}`}
                    className="inline-block mr-[0.28em]"
                    initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: i * 0.08,
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="block text-[#2563eb]">
                {part2Words.map((word, i) => (
                  <motion.span
                    key={`p2-${i}`}
                    className="inline-block mr-[0.28em]"
                    initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: (part1Words.length + i) * 0.08,
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h1>

            <motion.p
              className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto md:mx-0 mb-10 leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.8 }}
            >
              The AI workspace that predicts retention, simulates your audience, and turns
              content creation from gambling into strategy.
            </motion.p>

            <motion.div
              className="flex flex-col items-center md:items-start gap-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 1.1 }}
            >
              <button
                onClick={() => navigate("/onboarding")}
                className="px-10 py-4 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-lg rounded-xl transition-all shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 active:scale-95"
              >
                Build Your First Viral Clip →
              </button>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm font-medium text-slate-400">
                <span className="flex items-center gap-2">
                  <div className="bg-green-100 p-0.5 rounded-full">
                    <CheckCircle2 size={14} className="text-green-600" />
                  </div>
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <div className="bg-green-100 p-0.5 rounded-full">
                    <CheckCircle2 size={14} className="text-green-600" />
                  </div>
                  14-day free trial
                </span>
              </div>
            </motion.div>
          </div>

          {/* Floating product mockup */}
          <div className="flex-1 w-full flex justify-center md:justify-end">
            <motion.div
              className="w-full"
              style={{ maxWidth: 420 }}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            >
              <motion.div
                animate={{ y: [10, -10] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              >
                {/* Browser frame */}
                <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xl overflow-hidden">
                  {/* Top bar */}
                  <div className="bg-[#f8fafc] px-4 py-3 flex items-center gap-2 border-b border-[#e2e8f0]">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                    <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                    <div className="flex-1 ml-3 bg-white border border-[#e2e8f0] rounded-md px-3 py-1">
                      <span className="text-xs text-slate-400 font-mono">prolytic.ai/dashboard</span>
                    </div>
                  </div>

                  {/* Dashboard content */}
                  <div className="p-4 space-y-3 bg-white">
                    {/* Viral Score */}
                    <div className="bg-slate-50 rounded-xl p-4 flex items-end justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Viral Score
                        </p>
                        <p className="text-5xl font-black text-[#0f172a] leading-none">94</p>
                      </div>
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
                        High Potential
                      </span>
                    </div>

                    {/* Retention bar chart */}
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Retention Curve
                      </p>
                      <div className="flex items-end gap-1.5 h-16">
                        {barHeights.map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-sm"
                            style={{
                              height: `${h}%`,
                              backgroundColor: "#2563eb",
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Predicted Reach */}
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <TrendingUp size={16} className="text-[#2563eb]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Predicted Reach
                        </p>
                        <p className="text-sm font-bold text-[#0f172a]">2.4M estimated views</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
