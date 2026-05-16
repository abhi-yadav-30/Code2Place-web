import { Button, Card, CardContent } from "../components/UIComponents.jsx";
import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getDomain } from "../utils/helper.js";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  ChevronLeft, 
  Layers, 
  ChevronRight, 
  ArrowRight,
  Bookmark
} from "lucide-react";
import toast from "react-hot-toast";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [hoveredCourse, setHoveredCourse] = useState(null);

  const modules = [1, 2, 3, 4, 5];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${getDomain()}/api/resources/courses`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data?.error) {
          toast.error(data?.error);
          return;
        }
        setCourses(data.courses || []);
      } catch (err) {
        toast.error("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const goToNotes = (course, moduleNumber) => {
    navigate(`/resources/view/notes`, {
      state: { courseName: course, moduleNumber },
    });
  };

  const Skeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-64 bg-white/5 animate-pulse rounded-[2.5rem] border border-white/5"></div>
      ))}
    </div>
  );

  return (
    <div className="h-full bg-[#0a0a0a] text-white p-4 md:p-8 lg:p-12 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white px-0 group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Return
            </Button>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
              Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-600">Modules</span>
            </h1>
            <p className="text-gray-400 font-medium max-w-xl text-lg">
              Select a course and dive into structured modules designed to accelerate your placement preparation.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              <BookOpen size={16} className="text-orange-500" />
              {courses.length} Active Courses Available
            </div>
          </div>
        </div>

        {/* Courses Display */}
        {loading ? (
          <Skeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {courses.map((course, idx) => (
              <motion.div
                key={course}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredCourse(course)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                <Card className="h-full border-white/5 group hover:border-orange-500/20 transition-all duration-500 overflow-hidden relative flex flex-col rounded-[2.5rem]">
                  {/* Background Aura */}
                  <div className={`absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 blur-[60px] rounded-full transition-opacity duration-500 ${hoveredCourse === course ? 'opacity-100' : 'opacity-0'}`} />
                  
                  <CardContent className="p-8 flex-1 flex flex-col space-y-8 relative">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
                        <Layers size={28} className="text-orange-500" />
                      </div>
                      <Bookmark size={20} className="text-white/10 hover:text-orange-500/50 cursor-pointer transition-colors" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black tracking-tight leading-tight">
                        {course}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <div className="flex gap-px">
                          {[1,2,3,4,5].map(s => <div key={s} className="w-1 h-3 bg-orange-500/20 rounded-full overflow-hidden">
                            <div className={`h-full bg-orange-500 transition-all duration-700 ${idx % 3 >= s-3 ? 'w-full' : 'w-0'}`} />
                          </div>)}
                        </div>
                        Structured Path
                      </div>
                    </div>

                    {/* Module Select */}
                    <div className="space-y-3">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/60 mb-2">Available Modules</p>
                       <div className="grid grid-cols-5 gap-2">
                         {modules.map(m => (
                           <button
                             key={m}
                             onClick={() => goToNotes(course, m)}
                             className="aspect-square rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-sm hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all group/mod"
                           >
                             {m}
                             <ChevronRight size={10} className="absolute opacity-0 group-hover/mod:translate-x-4 transition-all" />
                           </button>
                         ))}
                       </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 mt-auto">
                      <button 
                        onClick={() => goToNotes(course, 1)}
                        className="flex items-center gap-2 text-sm font-bold text-gray-400 group-hover:text-white transition-colors"
                      >
                        Begin Module 1
                        <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
