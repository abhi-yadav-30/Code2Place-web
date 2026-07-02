import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";
import {
  CloudUpload,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Globe,
} from "lucide-react";

const ResourcesHome = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Sync Resources",
      desc: "Synchronize technical documents and module notes to the global network.",
      icon: CloudUpload,
      path: "/resources/upload",
      color: "from-orange-500 to-rose-500",
    },
    {
      title: "Access Vault",
      desc: "Access curated technical resources and deep-dive notes for your learning curve.",
      icon: BookOpen,
      path: "/resources/view",
      color: "from-blue-500 to-indigo-500",
    },
  ];

  return (
    <div className="h-full bg-[#0a0a0a] text-white overflow-y-auto relative">
      {/* Background blobs */}
      <div className="absolute top-1/4 -left-20 w-60 h-60 md:w-80 md:h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-60 h-60 md:w-80 md:h-80 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16 space-y-10 md:space-y-16 relative z-10">

        {/* Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-orange-500"
          >
            <ShieldCheck size={13} />
            Academic Resource Protocol
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none"
          >
            Universal{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-rose-600">
              Archive.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-gray-500 text-sm md:text-lg font-medium leading-relaxed"
          >
            A high-performance repository for technical synchronization and academic advancement.
            Access verified resources or contribute to the network.
          </motion.p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
          {cards.map((card, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              onClick={() => navigate(card.path)}
              className="group relative p-6 md:p-10 bg-white/[0.03] border border-white/10 rounded-3xl md:rounded-[3rem] text-left hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500"
            >
              <div className="absolute top-5 right-5 md:top-8 md:right-8 w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-400 text-white">
                <ArrowUpRight size={18} />
              </div>

              <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${card.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <card.icon size={24} className="text-white" />
              </div>

              <div className="space-y-2 md:space-y-3">
                <h3 className="text-xl md:text-3xl font-black tracking-tight">{card.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{card.desc}</p>
              </div>

              <div className="mt-5 md:mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-white transition-colors">
                Initialize Protocol
                <div className="h-px flex-1 bg-white/10 group-hover:bg-white/30 transition-colors" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-6 md:gap-12 text-[10px] font-black uppercase tracking-widest text-gray-700"
        >
          <div className="flex items-center gap-2">
            <Zap size={13} />
            Instant Synchronization
          </div>
          <div className="flex items-center gap-2 text-white/20">
            <Globe size={13} />
            Global Access
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ResourcesHome;
