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
  X
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
    <div className="h-full bg-[#0a0a0a] text-white p-4 md:p-8 overflow-y-auto relative selection:bg-orange-500/30">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-600/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-12 py-10">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles size={14} />
            Next-Gen Interviewing
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight">
            Master Your Next <br />
            <span className="bg-gradient-to-r from-orange-500 to-rose-600 bg-clip-text text-transparent">Interview with AI.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Practice realistic interviews tailored to your role. Get instant feedback, 
            track your progress, and land your dream job.
          </p>
        </motion.div>

        {/* Instructions Card */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
        >
          <Card className="border border-white/5 bg-white/[0.01]">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <h2 className="text-2xl font-black tracking-tight">How it works</h2>
                  <div className="space-y-6">
                    {steps.map((step, idx) => (
                      <div key={idx} className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-orange-500 transition-colors shrink-0">
                          <step.icon size={20} />
                        </div>
                        <p className="text-gray-400 font-medium group-hover:text-gray-200 transition-colors pt-2">{step.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                    <Brain size={160} />
                  </div>
                  <h3 className="text-xl font-black text-white">Ready to start?</h3>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed italic">
                    Configure your session parameters to get the most accurate simulation possible. 
                    You can practice HR, Technical, or Managerial rounds.
                  </p>
                  <div className="pt-4 space-y-3">
                    <Button onClick={() => setOpenModal(true)} className="w-full">
                      Start Interview
                      <PlayCircle size={20} />
                    </Button>
                    <button 
                      onClick={() => navigate("/ai-interview/transcription")}
                      className="w-full py-3 text-xs font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <History size={16} />
                      View Session History
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Modern Modal Overlay */}
      <AnimatePresence>
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            ></motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl"
            >
              <Card className="border border-white/10 shadow-2xl bg-[#0d0d0d]">
                <CardContent className="p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">Interview Setup</h2>
                      <p className="text-sm text-gray-500 font-medium italic mt-1">Configure your AI session</p>
                    </div>
                    <button 
                      onClick={() => setOpenModal(false)}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex justify-between">
                        Professional Role
                        {errors.role && <span className="text-rose-500 normal-case tracking-normal">{errors.role}</span>}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Frontend Engineer"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-orange-500/50 transition-colors font-medium placeholder:text-gray-700"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Job Description (Optional)</label>
                      <textarea
                        rows={3}
                        placeholder="Paste details to personalize questions..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-orange-500/50 transition-colors font-medium placeholder:text-gray-700 resize-none"
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Round Type</label>
                        <select
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-orange-500/50 transition-colors font-bold appearance-none cursor-pointer"
                          value={round}
                          onChange={(e) => setRound(e.target.value)}
                        >
                          <option value="Technical" className="bg-[#1a1a1a] text-white">Technical</option>
                          <option value="HR" className="bg-[#1a1a1a] text-white">HR</option>
                          <option value="Managerial" className="bg-[#1a1a1a] text-white">Managerial</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Intensity</label>
                        <select
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-orange-500/50 transition-colors font-bold appearance-none cursor-pointer"
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                        >
                          <option value="easy" className="bg-[#1a1a1a] text-white">Relatively Easy</option>
                          <option value="medium" className="bg-[#1a1a1a] text-white">Standard Pro</option>
                          <option value="hard" className="bg-[#1a1a1a] text-white">Expert Grade</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleStart} className="w-full py-4 text-lg">
                      Start Session
                      <ChevronRight size={24} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default AIInterviewHomePage;
