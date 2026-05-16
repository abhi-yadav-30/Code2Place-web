import { useEffect, useState } from "react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import { Button, Card, CardContent } from "../components/UIComponents";
import { getDomain } from "../utils/helper";
import { 
  FileText, 
  Download, 
  ChevronLeft, 
  Calendar, 
  Clock, 
  Award, 
  MessageSquare, 
  CheckCircle,
  HelpCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const InterviewSessionPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const { userId } = JSON.parse(localStorage.getItem("user")) || {};
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${getDomain()}/api/interview/transcription/${sessionId}/user/${userId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data?.error) {
          toast.error(data?.error);
          return;
        }
        setSession(data.session || null);
      } catch (err) {
        toast.error("Failed to load interview report");
      } finally {
        setLoading(false);
      }
    };
    if (sessionId && userId) fetchSession();
  }, [sessionId, userId]);

  const downloadTxt = () => {
    if (!session) return;
    let content = `INTERVIEW PERFORMANCE REPORT\n`;
    content += `============================\n`;
    content += `Date: ${new Date(session.createdAt).toLocaleString()}\n`;
    content += `Duration: ${session.duration} seconds\n\n`;

    session.transcription.forEach((t, idx) => {
      content += `[QUESTION ${idx + 1}]\n${t.question}\n\n`;
      content += `[YOUR ANSWER]\n${t.answer}\n\n`;
      content += `[AI FEEDBACK]\n${t.feedback}\n`;
      content += `-------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Interview_Report_${sessionId.slice(-6)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    if (!session) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("Performance Report", 20, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`ID: ${sessionId}`, 20, 40);
    doc.text(`Date: ${new Date(session.createdAt).toLocaleString()}`, 20, 45);
    doc.text(`Duration: ${session.duration}s`, 20, 50);

    let y = 70;
    session.transcription.forEach((t, idx) => {
      if (y > 250) { doc.addPage(); y = 30; }
      
      doc.setFontSize(12);
      doc.setTextColor(59, 130, 246); // Blue
      doc.text(`Q${idx + 1}: ${t.question}`, 20, y);
      y += 10;

      const ansLines = doc.splitTextToSize(`Ans: ${t.answer}`, 170);
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(ansLines, 20, y);
      y += (ansLines.length * 5) + 5;

      const feedbackLines = doc.splitTextToSize(`Feedback: ${t.feedback}`, 170);
      doc.setTextColor(16, 185, 129); // Green
      doc.text(feedbackLines, 20, y);
      y += (feedbackLines.length * 5) + 15;
    });

    doc.save(`Interview_Report_${sessionId.slice(-6)}.pdf`);
  };

  if (loading) {
    return (
      <div className="h-[92vh] bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Generating Report...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-[92vh] bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-500">Session report not found.</p>
      </div>
    );
  }

  return (
    <div className="h-[92vh] bg-[#0a0a0a] text-white p-4 md:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white px-0 group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button onClick={downloadTxt} variant="outline" className="flex-1 md:flex-initial border-white/10 text-gray-300 hover:border-white/20 shadow-none">
              <FileText size={18} />
              TXT
            </Button>
            <Button onClick={downloadPDF} className="flex-1 md:flex-initial bg-white text-black hover:bg-gray-200 shadow-none">
              <Download size={18} />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Header Stats */}
        <header className="relative">
          <div className="absolute inset-x-0 -top-20 h-60 bg-orange-500/10 blur-[100px] -z-10 rounded-full" />
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-600">Analysis</span>
            </h1>
            
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 text-sm text-gray-400">
                <Calendar size={16} className="text-orange-500" />
                {new Date(session.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </div>
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 text-sm text-gray-400">
                <Clock size={16} className="text-orange-500" />
                {session.duration} Seconds Duration
              </div>
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 text-sm text-gray-400">
                <Award size={16} className="text-orange-500" />
                {session.transcription.length} Questions Answered
              </div>
            </div>
          </div>
        </header>

        {/* Transcription List */}
        <div className="space-y-6">
          {session.transcription.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-white/5 overflow-hidden group hover:border-orange-500/20 transition-all">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-12 min-h-[300px]">
                    <div className="hidden md:flex md:col-span-1 bg-white/[0.02] items-start justify-center pt-8 border-r border-white/5">
                      <span className="text-2xl font-black text-white/10 group-hover:text-orange-500/20 transition-colors">
                        0{i + 1}
                      </span>
                    </div>

                    <div className="md:col-span-11 p-6 md:p-10 space-y-8">
                      <section className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-500/70">
                          <HelpCircle size={14} />
                          Question
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold leading-tight text-white/90">
                          {t.question}
                        </h3>
                      </section>

                      <section className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-500/70">
                          <MessageSquare size={14} />
                          Your Response
                        </div>
                        <div className="relative">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/50 to-transparent rounded-full" />
                          <p className="pl-6 text-gray-300 leading-relaxed font-medium italic">
                            "{t.answer}"
                          </p>
                        </div>
                      </section>

                      <section className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] space-y-4">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-500">
                          <CheckCircle size={14} />
                          AI Insight
                        </div>
                        <p className="text-emerald-100/80 font-medium leading-relaxed">
                          {t.feedback}
                        </p>
                      </section>

                      {t.generatedAnswer && (
                        <section className="pt-6 border-t border-white/5 space-y-3">
                          <span className="text-xs font-black uppercase tracking-widest text-purple-500/50">Optimal Answer Reference</span>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {t.generatedAnswer}
                          </p>
                        </section>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <section className="pt-10 pb-20 text-center space-y-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />
          <h2 className="text-2xl font-bold">Ready for another round?</h2>
          <Button 
            onClick={() => navigate('/ai-interview')}
            className="px-10 py-4 bg-white text-black hover:bg-gray-200 rounded-full font-black uppercase tracking-widest text-sm shadow-none"
          >
            Start New Session
          </Button>
        </section>

      </div>
    </div>
  );
};

export default InterviewSessionPage;
