import { useState } from "react";
import { Button } from "../components/UIComponents";
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
  Layers
} from "lucide-react";

const UploadNotesPage = () => {
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState("");
  const [moduleNumber, setModuleNumber] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [errors, setErrors] = useState({
    courseName: "",
    moduleNumber: "",
    file: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    let hasError = false;
    const newErrors = { courseName: "", moduleNumber: "", file: "" };

    if (!courseName.trim()) {
      newErrors.courseName = "Course selection required";
      hasError = true;
    }
    if (!moduleNumber.trim()) {
      newErrors.moduleNumber = "Module selection required";
      hasError = true;
    }
    if (!file) {
      newErrors.file = "PDF document required";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) {
      setIsUploading(false);
      return;
    }

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
    } catch (error) {
      toast.error("Critical uplink failure during upload");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-full bg-[#0a0a0a] text-white p-8 md:p-12 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors font-bold text-xs uppercase tracking-widest mb-10"
        >
          <ChevronLeft size={16} />
          Return
        </button>

        <div className="flex flex-col lg:flex-row gap-20 items-start">
          {/* Info Side */}
          <div className="lg:w-1/2 space-y-8">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">
              Synchronize <span className="text-orange-500">Resources</span>
            </h1>
            <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-lg">
              Contribute to the collective intelligence. Upload technical documents, research papers, or module notes to the global synchronization network.
            </p>
            
            <div className="grid gap-6">
              {[
                { icon: FileText, title: "Standardized Formats", desc: "PDF documentation for maximum cross-platform compatibility." },
                // { icon: CheckCircle2, title: "Verified Assets", desc: "All resources are indexed and verified for academic integrity." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center shrink-0">
                    <item.icon className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-widest text-gray-300">{item.title}</h3>
                    <p className="text-gray-500 text-xs mt-1 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-1/2 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/[0.03] border border-white/10 p-10 md:p-12 rounded-[3.5rem] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="space-y-6">
                  {/* Course Name */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-[0.2em]">
                      <label className="text-gray-500 flex items-center gap-2">
                        <BookOpen size={14} className="text-orange-500" />
                        Target Course
                      </label>
                      {errors.courseName && <span className="text-rose-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.courseName}</span>}
                    </div>
                    <select
                      className={`w-full h-14 bg-black/50 border ${errors.courseName ? "border-rose-500/50" : "border-white/10"} rounded-2xl px-6 text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-all appearance-none cursor-pointer`}
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                    >
                      <option value="">Matrix Identification</option>
                      <option value="Linear Algebra and Probability Theory">Linear Algebra and Probability Theory</option>
                      <option value="ADA/DSA">ADA/DSA</option>
                      <option value="IoT Application Development">IoT Application Development</option>
                      <option value="Microservices Development and Applications">Microservices Development and Applications</option>
                    </select>
                  </div>

                  {/* Module Number */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-[0.2em]">
                      <label className="text-gray-500 flex items-center gap-2">
                        <Layers size={14} className="text-blue-500" />
                        Module Vector
                      </label>
                      {errors.moduleNumber && <span className="text-rose-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.moduleNumber}</span>}
                    </div>
                    <select
                      className={`w-full h-14 bg-black/50 border ${errors.moduleNumber ? "border-rose-500/50" : "border-white/10"} rounded-2xl px-6 text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-all appearance-none cursor-pointer`}
                      value={moduleNumber}
                      onChange={(e) => setModuleNumber(e.target.value)}
                    >
                      <option value="">Select Vector</option>
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>Module {num}</option>
                      ))}
                    </select>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-[0.2em]">
                      <label className="text-gray-500 flex items-center gap-2">
                        <CloudUpload size={14} className="text-emerald-500" />
                        Data Payload
                      </label>
                      {errors.file && <span className="text-rose-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.file}</span>}
                    </div>
                    <label className={`w-full h-32 bg-black/50 border-2 border-dashed ${errors.file ? "border-rose-500/30" : "border-white/10"} rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/30 hover:bg-white/[0.02] transition-all group/file`}>
                      {file ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2 size={32} className="text-emerald-500" />
                          <p className="text-xs font-bold text-gray-400 truncate max-w-[200px]">{file.name}</p>
                        </div>
                      ) : (
                        <>
                          <CloudUpload size={32} className="text-gray-700 group-hover/file:text-orange-500 transition-colors" />
                          <p className="text-xs font-bold text-gray-600 mt-2">Initialize PDF Payload</p>
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
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full h-16 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isUploading ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="inline-block w-5 h-5 border-2 border-black/20 border-t-black rounded-full"
                    />
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      Synchronize Data
                      <CloudUpload size={18} className="group-hover:-translate-y-1 transition-transform" />
                    </span>
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
