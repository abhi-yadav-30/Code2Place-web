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
  HelpCircle,
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
    let content = `INTERVIEW PERFORMANCE REPORT\n============================\n`;
    content += `Date: ${new Date(session.createdAt).toLocaleString()}\nDuration: ${session.duration} seconds\n\n`;
    session.transcription.forEach((t, idx) => {
      content += `[QUESTION ${idx + 1}]\n${t.question}\n\n[YOUR ANSWER]\n${t.answer}\n\n[AI FEEDBACK]\n${t.feedback}\n-------------------------------------------\n\n`;
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
      doc.setTextColor(59, 130, 246);
      doc.text(`Q${idx + 1}: ${t.question}`, 20, y);
      y += 10;
      const ansLines = doc.splitTextToSize(`Ans: ${t.answer}`, 170);
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(ansLines, 20, y);
      y += (ansLines.length * 5) + 5;
      const feedbackLines = doc.splitTextToSize(`Feedback: ${t.feedback}`, 170);
      doc.setTextColor(16, 185, 129);
      doc.text(feedbackLines, 20, y);
      y += (feedbackLines.length * 5) + 15;
    });
    doc.save(`Interview_Report_${sessionId.slice(-6)}.pdf`);
  };

  if (loading) {
    return (
      <div className="h-full bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Generating Report...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-full bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-500">Session report not found.</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#0a0a0a] text-white overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-5 space-y-6 pb-16">

        {/* ── Top bar: back + downloads ── */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-400 hover:text-white text-sm font-semibold transition-colors"
          >
            <ChevronLeft size={18} />
            Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={downloadTxt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 hover:border-white/30 hover:text-white text-xs font-semibold transition-all"
            >
              <FileText size={14} />
              TXT
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black hover:bg-gray-200 text-xs font-bold transition-all"
            >
              <Download size={14} />
              PDF
            </button>
          </div>
        </div>

        {/* ── Page header ── */}
        <header className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight">
            Interview{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
              Analysis
            </span>
          </h1>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
              <Calendar size={12} className="text-orange-500" />
              {new Date(session.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
              <Clock size={12} className="text-orange-500" />
              {session.duration}s
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
              <Award size={12} className="text-orange-500" />
              {session.transcription.length} Questions
            </span>
          </div>
        </header>

        {/* ── Q&A Cards ── */}
        <div className="space-y-4">
          {session.transcription.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
            >
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">

                {/* Card header: question number */}
                <div className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border-b border-white/5">
                  <span className="text-xs font-black text-orange-500/60 uppercase tracking-widest">
                    Q{i + 1}
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                <div className="p-4 space-y-4">

                  {/* Question */}
                  <div className="space-y-1.5">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-orange-400/80">
                      <HelpCircle size={12} />
                      Question
                    </p>
                    <p className="text-base font-semibold text-white leading-snug">
                      {t.question}
                    </p>
                  </div>

                  {/* Your answer */}
                  <div className="space-y-1.5">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400/80">
                      <MessageSquare size={12} />
                      Your Response
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed pl-3 border-l-2 border-blue-500/30 italic">
                      "{t.answer}"
                    </p>
                  </div>

                  {/* AI Feedback */}
                  <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-3 space-y-1.5">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      <CheckCircle size={12} />
                      AI Insight
                    </p>
                    <p className="text-sm text-emerald-100/80 leading-relaxed">
                      {t.feedback}
                    </p>
                  </div>

                  {/* Optimal Answer */}
                  {t.generatedAnswer && (
                    <div className="pt-3 border-t border-white/5 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-purple-400/60">
                        Optimal Answer Reference
                      </p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {t.generatedAnswer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="pt-4 pb-8 text-center space-y-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <p className="text-lg font-bold">Ready for another round?</p>
          <button
            onClick={() => navigate("/ai-interview")}
            className="px-8 py-2.5 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all"
          >
            Start New Session
          </button>
        </div>

      </div>
    </div>
  );
};

export default InterviewSessionPage;
