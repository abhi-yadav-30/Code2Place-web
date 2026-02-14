import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
  Terminal, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Activity,
  Cpu
} from "lucide-react";

const Console = () => {
  const testcases = useSelector((state) => state.utiles.testCases);
  const isRunning = useSelector((state) => state.utiles.isRunning);
  const isSubmitting = useSelector((state) => state.utiles.isSubmitting);
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(isRunning || isSubmitting);
  }, [isRunning, isSubmitting]);

  return (
    <div className="h-60 border-t border-white/5 bg-[#0a0a0a] text-gray-300 font-mono text-[11px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#0d0d0d] border-b border-white/5">
        <div className="flex items-center gap-3">
          <Terminal size={14} className="text-orange-500" />
          <span className="font-black uppercase tracking-[0.2em] text-gray-500">Output Console</span>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-orange-500">
            <Activity size={12} className="animate-pulse" />
            <span className="animate-pulse">Analyzing...</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {!isLoading && testcases.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-700 space-y-2 italic">
            <Cpu size={24} className="opacity-20" />
            <p>Execute your code to view diagnostics...</p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-3 w-40 bg-white/5 rounded" />
                <div className="h-2 w-full bg-white/[0.02] rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {testcases.map((tc, index) => (
              <div
                key={index}
                className="group relative border-l-2 border-white/5 hover:border-orange-500/20 pl-4 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ChevronRight size={14} className="text-gray-600" />
                    <span className="font-bold text-gray-400 capitalize">
                      Case {index + 1} {tc.isPrivate && "• Security Encryption"}
                    </span>
                  </div>
                  
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    tc.passed 
                      ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/10" 
                      : "text-rose-500 bg-rose-500/10 border-rose-500/10"
                  }`}>
                    {tc.passed ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                    {tc.passed ? "Success" : "Deviation"}
                  </div>
                </div>

                {tc.isPrivate ? (
                  <p className="text-orange-500/50 italic text-[10px]">
                    Confidential validation vector. Result comparison hidden.
                  </p>
                ) : (
                  <div className="space-y-2 overflow-x-auto selection:bg-orange-500/30">
                    {tc.error ? (
                      <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-2">
                        <span className="text-rose-400 font-bold uppercase tracking-widest text-[9px]">Runtime Exception</span>
                        <pre className="text-rose-200/70 whitespace-pre-wrap leading-relaxed">{tc.error}</pre>
                        <p className="text-[9px] text-rose-500/40">Vector: {tc.status}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-1 text-gray-500">
                        <div className="flex gap-4 p-2 bg-white/[0.02] rounded-lg">
                          <span className="w-16 shrink-0 text-white/20 uppercase font-black text-[9px]">Input</span>
                          <span className="text-gray-400 break-all">{JSON.stringify(tc.input)}</span>
                        </div>
                        <div className="flex gap-4 p-2">
                          <span className="w-16 shrink-0 text-white/20 uppercase font-black text-[9px]">Actual</span>
                          <span className={`${tc.passed ? 'text-emerald-500/70' : 'text-rose-500/70'} break-all`}>{JSON.stringify(tc.actual)}</span>
                        </div>
                        <div className="flex gap-4 p-2 bg-white/[0.02] rounded-lg">
                          <span className="w-16 shrink-0 text-white/20 uppercase font-black text-[9px]">Target</span>
                          <span className="text-blue-500/70 break-all">{JSON.stringify(tc.expected)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Console;
