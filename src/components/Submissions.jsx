import React, { useEffect, useState } from "react";
import { getDomain } from "../utils/helper";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Cpu, 
  Calendar,
  Layers
} from "lucide-react";
import toast from "react-hot-toast";

const Submissions = ({ quesId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(`${getDomain()}/api/submission/${quesId}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data?.error) {
          toast.error(data?.error);
          return;
        }
        setSubmissions(data.data || []);
      } catch (error) {
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    if (quesId) fetchSubmissions();
  }, [quesId]);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest text-center">Syncing Records...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-2xl tracking-tight">Submission <span className="text-orange-500">History</span></h2>
        <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-gray-500">
          {submissions.length} Total Attempts
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10 space-y-4">
          <Layers size={32} className="mx-auto text-gray-700" />
          <p className="text-gray-500 font-medium italic text-sm">No deployment records found for this challenge.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub, idx) => (
            <motion.div
              key={sub._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group p-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem] hover:bg-white/[0.04] hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  sub.status.verdict === "Accepted" 
                    ? "bg-emerald-500/10 text-emerald-500" 
                    : "bg-rose-500/10 text-rose-500"
                }`}>
                  {sub.status.verdict === "Accepted" ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                </div>
                <div>
                  <h3 className={`font-black uppercase tracking-widest text-xs ${
                    sub.status.verdict === "Accepted" ? "text-emerald-500" : "text-rose-500"
                  }`}>
                    {sub.status.verdict}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-gray-600" />
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full" />
                    <span>{sub.language?.monaco || "Source"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 md:px-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock size={12} className="text-orange-500/50" />
                    <span className="text-sm font-mono font-bold">{sub.runtime ? `${sub.runtime}ms` : "N/A"}</span>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-tighter text-gray-600">Execution</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Cpu size={12} className="text-blue-500/50" />
                    <span className="text-sm font-mono font-bold">{sub.memory ? `${(sub.memory / 1024).toFixed(1)}MB` : "N/A"}</span>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-tighter text-gray-600">Memory</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Submissions;
