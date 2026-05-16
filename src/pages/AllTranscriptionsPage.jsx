import { useEffect, useState } from "react";
import React from "react";
import jsPDF from "jspdf";
import { getDomain } from "../utils/helper";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Download, 
  FileText, 
  Eye, 
  Sparkles,
  ChevronRight,
  Zap,
  LayoutGrid
} from "lucide-react";
import { Button, Card, CardContent } from "../components/UIComponents";

const AllTranscriptionsPage = () => {
  const { userId } = JSON.parse(localStorage.getItem("user")) || {};
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      toast.error("User not found. Please log in.");
      navigate("/auth");
      return;
    }

    const fetchSessions = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${getDomain()}/api/interview/all/${userId}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data?.error) {
          toast.error(data?.error);
          return;
        }
        setSessions(data.sessions || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch transcriptions");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [userId, navigate]);

  const downloadTxt = (session) => {
    let content = `Interview Date: ${new Date(session.createdAt).toLocaleString()}\n`;
    content += `Duration: ${session.duration} sec\n\n`;

    session.transcription.forEach((t, idx) => {
      content += `Q${idx + 1}: ${t.question}\n`;
      content += `Answer: ${t.answer}\n`;
      content += `Feedback: ${t.feedback}\n`;
      content += `---------------------------\n`;
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview_${session._id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("TXT Downloaded");
  };

  const downloadPDF = (session) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Interview Transcription", 14, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date(session.createdAt).toLocaleString()}`, 14, 35);
    doc.text(`Duration: ${session.duration} sec`, 14, 45);

    let y = 60;
    session.transcription.forEach((t, idx) => {
      doc.setFontSize(14);
      doc.text(`Question ${idx + 1}`, 14, y);
      y += 8;
      doc.setFontSize(12);
      doc.text(`Q: ${t.question}`, 14, y);
      y += 8;
      const ansLines = doc.splitTextToSize(`Answer: ${t.answer}`, 180);
      doc.text(ansLines, 14, y);
      y += ansLines.length * 7 + 4;
      const feedLines = doc.splitTextToSize(`Feedback: ${t.feedback}`, 180);
      doc.text(feedLines, 14, y);
      y += feedLines.length * 7 + 10;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save(`interview_${session._id}.pdf`);
    toast.success("PDF Downloaded");
  };

  if (loading) {
    return (
      <div className="h-full bg-[#0a0a0a] flex items-center justify-center">
        <div className="relative group">
          <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/30 transition-all duration-500 animate-pulse"></div>
          <div className="relative w-16 h-16 border-t-2 border-r-2 border-orange-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!sessions.length) {
    return (
      <div className="h-full bg-[#0a0a0a] flex flex-col items-center justify-center space-y-8 p-10 text-center">
        <div className="w-24 h-24 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-700">
          <History size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">No transcriptions found</h2>
          <p className="text-gray-500 font-medium italic">Start practicing to see your session history here.</p>
        </div>
        <Button onClick={() => navigate("/ai-interview")} className="px-10">
          Go to Simulator
          <ChevronRight size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#0a0a0a] text-white p-4 md:p-8 overflow-y-auto relative selection:bg-orange-500/30">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto space-y-12 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
              Session Archive
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
              Your Interview <span className="bg-gradient-to-r from-orange-500 to-rose-600 bg-clip-text text-transparent">History.</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
              <LayoutGrid size={18} className="text-gray-500" />
              <span className="text-sm font-bold text-gray-300">{sessions.length} Sessions</span>
            </div>
            <Button variant="secondary" onClick={() => navigate("/ai-interview")} className="text-xs py-2.5">
              New Session
              <Sparkles size={16} />
            </Button>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {sessions.map((session, index) => (
              <motion.div
                key={session._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-orange-500/20 transition-all duration-500 group">
                  <CardContent className="p-6 flex flex-col h-full space-y-6">
                    {/* Card Top */}
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/10 to-rose-600/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform duration-500">
                        <MessageSquare size={24} />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-500 tracking-wider">
                          <Calendar size={12} className="text-orange-500/50" />
                          {new Date(session.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-white group-hover:text-orange-500 transition-colors">
                        AI Practice Session
                      </h3>
                      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                        <Zap size={12} />
                        Professional Grade
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                        <span className="text-[8px] font-black uppercase tracking-tighter text-gray-600">Duration</span>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                          <Clock size={12} className="text-orange-500/50" />
                          {Math.floor(session.duration / 60)}m {session.duration % 60}s
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                        <span className="text-[8px] font-black uppercase tracking-tighter text-gray-600">Questions</span>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                          <MessageSquare size={12} className="text-orange-500/50" />
                          {session.transcription.length} Steps
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                      <Button 
                        onClick={() => navigate(`/ai-interview/transcription/view/${session._id}`)}
                        className="w-full py-2.5 text-xs"
                      >
                        Launch Review
                        <Eye size={16} />
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="secondary" 
                          onClick={() => downloadTxt(session)}
                          className="py-2.5 text-[10px]"
                        >
                          <FileText size={14} />
                          TXT
                        </Button>
                        <Button 
                          variant="secondary" 
                          onClick={() => downloadPDF(session)}
                          className="py-2.5 text-[10px]"
                        >
                          <Download size={14} />
                          PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AllTranscriptionsPage;
