import React from "react";
import { useSelector } from "react-redux";
import { 
  FileText, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  ArrowRightCircle
} from "lucide-react";

const Description = ({ question }) => {
  if (!question) {
    return (
      <div className="flex-1 p-10 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Loading Challenge...</p>
      </div>
    );
  }
  
  const language = useSelector((state) => state.utiles.language);

  const getDifficultyColor = (level) => {
    if (level === 1) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/10";
    if (level === 2) return "text-amber-500 bg-amber-500/10 border-amber-500/10";
    return "text-rose-500 bg-rose-500/10 border-rose-500/10";
  };

  const labels = ["", "Easy", "Medium", "Hard"];

  return (
    <div className="flex-1 overflow-auto p-8 text-white leading-relaxed bg-[#0f0f0f] space-y-10 pb-20">
      
      {/* Title & Meta */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-black tracking-tight">{question.QueTitle}</h1>
          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getDifficultyColor(question.difficultyLevel)}`}>
            {labels[question.difficultyLevel]}
          </span>
        </div>
        
        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5 pb-6">
          <div className="flex items-center gap-2">
            <Hash size={14} className="text-orange-500" />
            Problem {question._id?.slice(-4)}
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500" />
            1.2k Solved
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-500/70">
          <FileText size={14} />
          The Challenge
        </div>
        <p className="text-gray-400 font-medium text-lg leading-relaxed whitespace-pre-line">
          {question.QueDescription}
        </p>
      </section>

      {/* I/O Details */}
      <div className="grid gap-10">
        {/* Input Format */}
        {Array.isArray(question?.inputFormat) && question.inputFormat?.length !== 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-500/70">
              <Layers size={14} />
              Input Specification
            </div>
            <ul className="space-y-3">
              {question.inputFormat.map((item, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-500 transition-colors" />
                  <span className="text-gray-400 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            {language.monaco === "java" && (
              <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-3">
                <AlertCircle size={18} className="text-amber-500 shrink-0" />
                <p className="text-xs text-amber-200/50 font-medium">
                  <strong className="text-amber-500 mr-2">Note for Java:</strong>
                  Your main class must be named <code className="text-white bg-white/10 px-1 rounded">Main</code>.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Output Format */}
        {Array.isArray(question?.outputFormat) && question.outputFormat?.length !== 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-500/70">
              <ArrowRightCircle size={14} />
              Expected Output
            </div>
            <ul className="space-y-3">
              {question.outputFormat.map((item, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover:bg-emerald-500 transition-colors" />
                  <span className="text-gray-400 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Constraints */}
        {Array.isArray(question?.constraints) && question.constraints?.length !== 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-rose-500/70">
              <AlertCircle size={14} />
              Constraints
            </div>
            <div className="flex flex-wrap gap-2">
              {question.constraints.map((c, i) => (
                <div key={i} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-xs font-medium text-gray-500 italic">
                  {c}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Examples */}
      {Array.isArray(question?.testCases) && question.testCases?.length !== 0 && (
        <section className="space-y-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/50">
            Case Studies
          </div>
          {question.testCases
            .filter((tc) => !tc.isPrivate)
            .slice(0, 2)
            .map((test, idx) => (
              <div key={idx} className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Example {idx + 1}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-black border border-white/5 rounded-2xl p-4 overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">Input</p>
                    <pre className="text-xs font-mono text-gray-400 overflow-x-auto">{test.input}</pre>
                  </div>
                  <div className="bg-black border border-white/5 rounded-2xl p-4 overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900 mb-2">Output</p>
                    <pre className="text-xs font-mono text-emerald-500/70 overflow-x-auto">{test.expected}</pre>
                  </div>
                </div>
              </div>
            ))}
        </section>
      )}
    </div>
  );
};

export default Description;
