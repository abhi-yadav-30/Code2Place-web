import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/UIComponents.jsx";
import { motion, AnimatePresence } from "framer-motion";
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
  BookOpen
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
    if (!courseName || !moduleNumber) return;

    setLoading(true);
    fetch(
      `${getDomain()}/api/resources/getNotes?courseName=${courseName}&moduleNumber=${moduleNumber}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.error) {
          toast.error(data?.error);
        }
        setNotes(data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to synchronize resources");
        setLoading(false);
      });
  }, [courseName, moduleNumber]);

  return (
    <div className="h-full bg-[#0a0a0a] text-white p-8 md:p-12 overflow-y-auto">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors font-bold text-xs uppercase tracking-widest"
            >
              <ChevronLeft size={16} />
              Return
            </button>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              {courseName} <span className="text-orange-500 block md:inline">Module {moduleNumber}</span>
            </h1>
            <p className="text-gray-500 font-medium max-w-xl">
              Access curated technical resources and deep-dive notes synchronized for your current learning trajectory.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
              <Layers size={20} className="text-orange-500" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-none">Total Resources</p>
                <p className="text-lg font-black">{notes.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-white/5 border border-white/10 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="py-40 text-center space-y-4">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <BookOpen size={24} />
            </div>
            <p className="text-gray-500 font-bold italic">{error}</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="py-40 text-center space-y-4 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
            <Search size={48} className="mx-auto text-gray-800" />
            <div className="space-y-2">
              <p className="text-gray-500 font-bold text-lg italic">No resources mapped yet.</p>
              <p className="text-xs text-gray-700 uppercase font-black tracking-widest">Check back later for synchronization</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {notes.map((note, idx) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-full bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 flex flex-col">
                  
                  {/* Preview/Icon Area */}
                  <div className="h-40 bg-black/40 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
                    <iframe
                      src={`${getDomain()}${note.fileUrl}`}
                      className="w-full h-full opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none"
                    />
                    <FileText size={48} className="absolute text-orange-500 transition-transform duration-500 group-hover:scale-110 z-20" />
                  </div>

                  {/* Content */}
                  <div className="p-8 space-y-6 flex-1 flex flex-col">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black tracking-tight line-clamp-2 uppercase">
                        {note.courseName} <span className="text-gray-600 block text-xs">Module {note.moduleNumber}</span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <User size={12} className="text-orange-500/50" />
                          <span className="text-[10px] uppercase font-black tracking-widest leading-none">Author</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400 truncate">{note.uploadedBy?.name || "System"}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Calendar size={12} className="text-orange-500/50" />
                          <span className="text-[10px] uppercase font-black tracking-widest leading-none">Synced</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400 truncate">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-auto">
                      <a 
                        href={`${getDomain()}${note.fileUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full h-12 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                      >
                        <ExternalLink size={14} />
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
