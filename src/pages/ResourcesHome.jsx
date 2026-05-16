import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";
import { 
  CloudUpload, 
  BookOpen, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";

const ResourcesHome = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Sync Resources",
      desc: "Synchronize technical documents and module notes to the global synchronization network.",
      icon: CloudUpload,
      path: "/resources/upload",
      color: "from-orange-500 to-rose-500",
      accent: "text-orange-500"
    },
    {
      title: "Access Vault",
      desc: "Access curated technical resources and deep-dive notes synchronized for your learning curve.",
      icon: BookOpen,
      path: "/resources/view",
      color: "from-blue-500 to-indigo-500",
      accent: "text-blue-500"
    }
  ];

  return (
    <div className="h-full bg-[#0a0a0a] text-white flex flex-col items-center p-8 relative overflow-y-auto">
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl w-full my-auto space-y-20 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-orange-500"
          >
            <ShieldCheck size={14} />
            Academic Resource Protocol
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
          >
            Universal <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-rose-600">Archive.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            A high-performance repository for technical synchronization and academic advancement. Access verified resources or contribute to the network.
          </motion.p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {cards.map((card, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              onClick={() => navigate(card.path)}
              className="group relative p-10 bg-white/[0.03] border border-white/10 rounded-[3rem] text-left hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500"
            >
              <div className="absolute top-10 right-10 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500 text-white">
                <ArrowUpRight size={24} />
              </div>
              
              <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <card.icon size={32} className="text-white" />
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl font-black tracking-tight">{card.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed italic">{card.desc}</p>
              </div>

              <div className="mt-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-white transition-colors">
                Initialize Protocol
                <div className="h-px flex-1 bg-white/10 group-hover:bg-white/30 transition-colors" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-700"
        >
          <div className="flex items-center gap-2">
            <Zap size={14} />
            Instant Synchronization
          </div>
          <div className="flex items-center gap-2 text-white/20">
            <Globe size={14} />
            Global Access
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ResourcesHome;
