import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getDomain } from "../utils/helper";
import { motion } from "framer-motion";
import {
  CloudUpload,
  ChevronLeft,
  FileText,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Layers,
} from "lucide-react";

const UploadNotesPage = () => {
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState("");
  const [moduleNumber, setModuleNumber] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({ courseName: "", moduleNumber: "", file: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    let hasError = false;
    const newErrors = { courseName: "", moduleNumber: "", file: "" };
    if (!courseName.trim()) { newErrors.courseName = "Course required"; hasError = true; }
    if (!moduleNumber.trim()) { newErrors.moduleNumber = "Module required"; hasError = true; }
    if (!file) { newErrors.file = "PDF required"; hasError = true; }
    setErrors(newErrors);
    if (hasError) { setIsUploading(false); return; }

    try {
      const formData = new FormData();
      formData.append("courseName", courseName);
      formData.append("moduleNumber", moduleNumber);
      formData.append("file", file);

      const response = await fetch(`${getDomain()}/api/resources/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.error) {
        toast.error(data?.error || "Synchronization failed");
        return;
      }
      toast.success("Resource successfully synchronized!");
      setCourseName("");
      setModuleNumber("");
      setFile(null);
      setErrors({ courseName: "", moduleNumber: "", file: "" });
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-full bg-[#0a0a0a] text-white px-4 py-5 md:px-10 md:py-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-10">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <ChevronLeft size={16} />
          Return
        </button>

        {/* Two-column layout stacked on mobile */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">

          {/* Info Side */}
          <div className="w-full lg:w-1/2 space-y-5">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-tight">
              Synchronize <span className="text-orange-500">Resources</span>
            </h1>
            <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed">
              Contribute to the collective intelligence. Upload technical documents, research papers,
              or module notes to the global synchronization network.
            </p>

            <div className="flex gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="text-orange-500" size={20} />
              </div>
              <div>
                <h3 className="font-black text-xs uppercase tracking-widest text-gray-300">Standardized Formats</h3>
                <p className="text-gray-500 text-xs mt-0.5 font-medium">PDF documentation for maximum cross-platform compatibility.</p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/[0.03] border border-white/10 p-5 md:p-8 rounded-3xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">

                {/* Course */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                    <label className="text-gray-500 flex items-center gap-1.5">
                      <BookOpen size={12} className="text-orange-500" />
                      Target Course
                    </label>
                    {errors.courseName && (
                      <span className="text-rose-500 flex items-center gap-1 normal-case tracking-normal font-medium text-xs">
                        <AlertCircle size={11} /> {errors.courseName}
                      </span>
                    )}
                  </div>
                  <select
                    className={`w-full h-12 bg-black/50 border ${errors.courseName ? "border-rose-500/50" : "border-white/10"} rounded-xl px-4 text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-all appearance-none cursor-pointer`}
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                  >
                    <option value="" disabled>Select Course</option>
                    <option value="Linear Algebra and Probability Theory">Linear Algebra and Probability Theory</option>
                    <option value="ADA/DSA">ADA/DSA</option>
                    <option value="IoT Application Development">IoT Application Development</option>
                    <option value="Microservices Development and Applications">Microservices Development and Applications</option>
                  </select>
                </div>

                {/* Module */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                    <label className="text-gray-500 flex items-center gap-1.5">
                      <Layers size={12} className="text-blue-500" />
                      Module Vector
                    </label>
                    {errors.moduleNumber && (
                      <span className="text-rose-500 flex items-center gap-1 normal-case tracking-normal font-medium text-xs">
                        <AlertCircle size={11} /> {errors.moduleNumber}
                      </span>
                    )}
                  </div>
                  <select
                    className={`w-full h-12 bg-black/50 border ${errors.moduleNumber ? "border-rose-500/50" : "border-white/10"} rounded-xl px-4 text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-all appearance-none cursor-pointer`}
                    value={moduleNumber}
                    onChange={(e) => setModuleNumber(e.target.value)}
                  >
                    <option value="" disabled>Select Module</option>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>Module {num}</option>
                    ))}
                  </select>
                </div>

                {/* File */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                    <label className="text-gray-500 flex items-center gap-1.5">
                      <CloudUpload size={12} className="text-emerald-500" />
                      PDF File
                    </label>
                    {errors.file && (
                      <span className="text-rose-500 flex items-center gap-1 normal-case tracking-normal font-medium text-xs">
                        <AlertCircle size={11} /> {errors.file}
                      </span>
                    )}
                  </div>
                  <label
                    className={`w-full h-28 bg-black/50 border-2 border-dashed ${errors.file ? "border-rose-500/30" : "border-white/10"} rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/30 hover:bg-white/[0.02] transition-all group/file`}
                  >
                    {file ? (
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 size={28} className="text-emerald-500" />
                        <p className="text-xs font-bold text-gray-400 truncate max-w-[200px]">{file.name}</p>
                      </div>
                    ) : (
                      <>
                        <CloudUpload size={28} className="text-gray-700 group-hover/file:text-orange-500 transition-colors" />
                        <p className="text-xs font-bold text-gray-600 mt-1.5">Tap to upload PDF</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full h-12 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full"
                    />
                  ) : (
                    <>
                      Synchronize Data
                      <CloudUpload size={16} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadNotesPage;
