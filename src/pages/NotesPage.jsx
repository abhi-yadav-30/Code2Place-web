import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getDomain } from "../utils/helper.js";
import React from "react";
import {
  FileText,
  ChevronLeft,
  ExternalLink,
  User,
  Calendar,
  Layers,
  Search,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";

export default function NotesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseName, moduleNumber } = location.state || {};

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseName || !moduleNumber) {
      navigate("/resources/view");
      return;
    }
    setLoading(true);
    fetch(
      `${getDomain()}/api/resources/getNotes?courseName=${encodeURIComponent(courseName)}&moduleNumber=${moduleNumber}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.error) toast.error(data?.error);
        setNotes(data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to synchronize resources");
        setLoading(false);
      });
  }, [courseName, moduleNumber, navigate]);

  return (
    <div className="h-full bg-[#0a0a0a] text-white px-4 py-5 md:px-8 md:py-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-10">

        {/* Header */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors font-bold text-xs uppercase tracking-widest self-start"
          >
            <ChevronLeft size={16} />
            Return
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                {courseName}{" "}
                <span className="text-orange-500">Module {moduleNumber}</span>
              </h1>
              <p className="text-gray-500 text-sm font-medium max-w-xl">
                Access curated technical resources and deep-dive notes synchronized for your learning trajectory.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2.5">
                <Layers size={16} className="text-orange-500" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 leading-none">Resources</p>
                  <p className="text-base font-black">{notes.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-52 md:h-64 bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <BookOpen size={22} />
            </div>
            <p className="text-gray-500 font-bold italic">{error}</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="py-24 text-center space-y-4 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
            <Search size={40} className="mx-auto text-gray-800" />
            <div className="space-y-1.5">
              <p className="text-gray-500 font-bold text-base italic">No resources mapped yet.</p>
              <p className="text-xs text-gray-700 uppercase font-black tracking-widest">Check back later</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 pb-10">
            {notes.map((note, idx) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-full bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.05] hover:border-white/20 transition-all duration-400 flex flex-col">

                  {/* Preview */}
                  <div className="h-32 md:h-40 bg-black/40 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
                    <iframe
                      src={note.fileUrl.startsWith("http") ? note.fileUrl : `${getDomain()}${note.fileUrl}`}
                      className="w-full h-full opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none"
                    />
                    <FileText size={40} className="absolute text-orange-500 group-hover:scale-110 transition-transform duration-500 z-20" />
                  </div>

                  {/* Info */}
                  <div className="p-4 md:p-6 space-y-4 flex-1 flex flex-col">
                    <div>
                      <h3 className="text-base font-black tracking-tight line-clamp-2 uppercase">
                        {note.courseName}
                      </h3>
                      <span className="text-gray-600 text-xs font-bold">Module {note.moduleNumber}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-gray-500">
                          <User size={11} className="text-orange-500/50" />
                          <span className="text-[9px] uppercase font-black tracking-widest">Author</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400 truncate">{note.uploadedBy?.name || "System"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Calendar size={11} className="text-orange-500/50" />
                          <span className="text-[9px] uppercase font-black tracking-widest">Synced</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400 truncate">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <a
                        href={note.fileUrl.startsWith("http") ? note.fileUrl : `${getDomain()}${note.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full h-10 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                      >
                        <ExternalLink size={13} />
                        Open Resource
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
