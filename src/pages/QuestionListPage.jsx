import { useEffect, useState } from "react";
import { getDomain } from "../utils/helper";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Code, 
  ChevronRight, 
  Trophy, 
  Zap, 
  Target,
  Filter
} from "lucide-react";
import { Card, CardContent, Button } from "../components/UIComponents";
import toast from "react-hot-toast";

export default function QuestionsListPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${getDomain()}/api/question/questions`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data?.error) {
          toast.error(data?.error);
          return;
        }
        setQuestions(data);
      } catch (error) {
        toast.error("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter(q => 
    q.QueTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyStyles = (level) => {
    if (level === 1) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (level === 2) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };

  const getDifficultyLabel = (level) => {
    if (level === 1) return "Easy";
    if (level === 2) return "Medium";
    return "Hard";
  };

  if (loading) {
    return (
      <div className="h-[92vh] bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Accessing Archives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[92vh] bg-[#0a0a0a] text-white p-4 md:p-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header & Search */}
        <header className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                Placement <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-600">Arena</span>
              </h1>
              <p className="text-gray-400 font-medium max-w-lg">
                Curated list of technical challenges to sharpen your problem-solving skills and master coding assessments.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 text-xs font-bold text-gray-500">
                <Target size={16} className="text-orange-500" />
                {questions.length} Challenges
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-500 group-focus-within:text-orange-500 transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by problem title..."
              className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-16 pr-8 text-lg font-medium focus:outline-none focus:border-orange-500/30 focus:bg-white/[0.07] transition-all placeholder:text-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {/* List */}
        <div className="grid gap-4 pb-20">
          <AnimatePresence mode="popLayout">
            {filteredQuestions.map((q, idx) => (
              <motion.div
                key={q._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Link to={`/questions/${q._id}`}>
                  <Card className="border-white/5 hover:border-orange-500/30 hover:bg-white/[0.02] transition-all duration-300 group rounded-3xl">
                    <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-all">
                          <Code size={24} />
                        </div>
                        <div className="space-y-1">
                          <h2 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors">
                            {q.QueTitle}
                          </h2>
                          <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                            <span className="flex items-center gap-1">
                              <Zap size={12} className="text-amber-500" />
                              Technical Interview
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full md:w-auto md:gap-8">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${getDifficultyStyles(q.difficultyLevel)}`}>
                          {getDifficultyLabel(q.difficultyLevel)}
                        </span>
                        
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-gray-600 group-hover:text-white transition-all transform group-hover:translate-x-2">
                          <ChevronRight size={28} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-dashed border-white/10 space-y-4">
              <Search size={48} className="mx-auto text-gray-700" />
              <p className="text-gray-500 font-medium italic">No challenges found matching your search.</p>
              <Button onClick={() => setSearchQuery("")} variant="ghost" className="text-orange-500 font-bold">Clear Filters</Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
