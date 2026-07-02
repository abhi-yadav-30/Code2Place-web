import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  History,
  PlayCircle,
  Settings,
  ChevronRight,
  Target,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button, Card, CardContent } from "../components/UIComponents";

const AIInterviewHomePage = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const [role, setRole] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [round, setRound] = useState("Technical");
  const [difficulty, setDifficulty] = useState("medium");
  const [errors, setErrors] = useState({});

  const handleStart = () => {
    if (!role.trim()) {
      setErrors((prev) => ({ ...prev, role: "Role field is mandatory" }));
      return;
    }
    navigate("/ai-interview/practice", {
      state: { role, jobDesc, round, difficulty },
    });
  };

  const steps = [
    { icon: Target, text: "Questions tailored to your target role" },
    { icon: Brain, text: "Real-time AI logic & adaptive questioning" },
    { icon: ShieldCheck, text: "Privacy-focused camera & audio preview" },
    { icon: History, text: "Full session history & expert feedback" },
  ];

  return (
    <div className="h-full bg-[#0a0a0a] text-white overflow-y-auto relative selection:bg-orange-500/30">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-72 h-72 md:w-[500px] md:h-[500px] bg-orange-600/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 md:w-[500px] md:h-[500px] bg-rose-600/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-14 space-y-8 md:space-y-12">

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-black uppercase tracking-widest">
            <Sparkles size={13} />
            Next-Gen Interviewing
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-tight">
            Master Your Next{" "}
            <span className="bg-gradient-to-r from-orange-500 to-rose-600 bg-clip-text text-transparent">
              Interview with AI.
            </span>
          </h1>

          <p className="text-gray-400 text-base md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Practice realistic interviews tailored to your role. Get instant feedback,
            track your progress, and land your dream job.
          </p>
        </motion.div>

        {/* ── How it works card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border border-white/5 bg-white/[0.01]">
            <CardContent className="p-5 md:p-10">
              {/* On mobile: stacked. On md+: side-by-side */}
              <div className="flex flex-col md:grid md:grid-cols-2 md:gap-12 md:items-center gap-8">

                {/* Steps */}
                <div className="space-y-5">
                  <h2 className="text-xl font-black tracking-tight">How it works</h2>
                  <div className="space-y-4">
                    {steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 group">
                        <div className="w-9 h-9 shrink-0 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-orange-500 transition-colors">
                          <step.icon size={18} />
                        </div>
                        <p className="text-gray-400 font-medium group-hover:text-gray-200 transition-colors pt-1.5 text-sm md:text-base">
                          {step.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA box */}
                <div className="relative bg-white/[0.02] p-5 md:p-8 rounded-2xl border border-white/5 overflow-hidden group space-y-4">
                  <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                    <Brain size={120} />
                  </div>
                  <h3 className="text-lg font-black text-white">Ready to start?</h3>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed italic">
                    Configure your session to get the most accurate simulation.
                    Practice HR, Technical, or Managerial rounds.
                  </p>
                  <div className="space-y-2 pt-1">
                    <Button onClick={() => setOpenModal(true)} className="w-full">
                      Start Interview
                      <PlayCircle size={18} />
                    </Button>
                    <button
                      onClick={() => navigate("/ai-interview/transcription")}
                      className="w-full py-2.5 text-xs font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <History size={15} />
                      View Session History
                    </button>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Session Config Modal ── */}
      <AnimatePresence>
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Sheet slides up on mobile, centered card on sm+ */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              className="relative w-full sm:max-w-xl"
            >
              <div className="bg-[#0d0d0d] border border-white/10 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden">
                <div className="p-5 sm:p-8 space-y-5 sm:space-y-7">

                  {/* Modal header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black tracking-tight">Interview Setup</h2>
                      <p className="text-xs text-gray-500 font-medium italic mt-0.5">Configure your AI session</p>
                    </div>
                    <button
                      onClick={() => setOpenModal(false)}
                      className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Fields */}
                  <div className="space-y-4">

                    {/* Role */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex justify-between">
                        Professional Role
                        {errors.role && (
                          <span className="text-rose-500 normal-case tracking-normal font-medium">{errors.role}</span>
                        )}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Frontend Engineer"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-gray-700"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      />
                    </div>

                    {/* Job description */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                        Job Description <span className="normal-case tracking-normal font-normal text-gray-600">(Optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Paste details to personalize questions..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-gray-700 resize-none"
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                      />
                    </div>

                    {/* Round + Intensity — stack on mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Round Type</label>
                        <select
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors font-bold appearance-none cursor-pointer"
                          value={round}
                          onChange={(e) => setRound(e.target.value)}
                        >
                          <option value="Technical" className="bg-[#1a1a1a]">Technical</option>
                          <option value="HR" className="bg-[#1a1a1a]">HR</option>
                          <option value="Managerial" className="bg-[#1a1a1a]">Managerial</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Intensity</label>
                        <select
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors font-bold appearance-none cursor-pointer"
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                        >
                          <option value="easy" className="bg-[#1a1a1a]">Relatively Easy</option>
                          <option value="medium" className="bg-[#1a1a1a]">Standard Pro</option>
                          <option value="hard" className="bg-[#1a1a1a]">Expert Grade</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <Button onClick={handleStart} className="w-full py-3 text-base">
                    Start Session
                    <ChevronRight size={20} />
                  </Button>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIInterviewHomePage;
