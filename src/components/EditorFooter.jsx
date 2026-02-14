import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setIsRunning,
  setIsSubmitting,
  setTestCases,
} from "../store/utilesSlice";
import { DiffLevelToScoreMapping } from "../constants";
import toast from "react-hot-toast";
import { getDomain } from "../utils/helper";
import { Play, Send, Loader2 } from "lucide-react";

const EditorFooter = ({ code, queId, question }) => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.utiles.language);
  const isRunning = useSelector((state) => state.utiles.isRunning);
  const isSubmitting = useSelector((state) => state.utiles.isSubmitting);

  const handleRun = async () => {
    try {
      dispatch(setIsRunning(true));
      if (!code) {
        toast.error("Empty source code!");
        return;
      }
      const res = await fetch(`${getDomain()}/api/question/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          source_code: code,
          language,
          stdin: "",
          queId: queId,
        }),
      });

      const data = await res.json();
      if (data?.error) {
        toast.error(data?.error);
        return;
      }
      dispatch(setTestCases(data));
    } catch (err) {
      toast.error("error while running the code!");
    } finally {
      dispatch(setIsRunning(false));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!code) {
        toast.error("Empty source code!");
        return;
      }
      dispatch(setIsSubmitting(true));
      const { userId } = JSON.parse(localStorage.getItem("user")) || {};
      const res = await fetch(`${getDomain()}/api/question/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          source_code: code,
          language,
          stdin: "",
          queId: queId,
          userId,
          qScore: DiffLevelToScoreMapping[question.difficultyLevel],
        }),
      });

      const data = await res.json();
      if (data?.error) {
        toast.error(data?.error);
        return;
      }
      if (data?.status?.isPassed) {
        toast.success("All test cases passed!");
      } else {
        toast.error(`test cases failed! (${data?.status?.verdict || "Error"})`);
      }
      dispatch(setTestCases(data?.results || []));
    } catch (err) {
      toast.error("Error while submitting the code!");
    } finally {
      dispatch(setIsSubmitting(false));
    }
  };

  return (
    <div className="h-16 bg-[#0d0d0d] border-t border-white/5 flex items-center justify-end gap-4 px-6">
      <button
        onClick={handleRun}
        disabled={isRunning || isSubmitting}
        className="h-10 px-6 rounded-xl border border-white/10 text-gray-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white/5 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isRunning ? (
          <Loader2 size={16} className="animate-spin text-orange-500" />
        ) : (
          <Play size={16} className="text-orange-500 group-hover:scale-110 transition-transform" />
        )}
        {isRunning ? "Running..." : "Run Code"}
      </button>

      <button
        onClick={handleSubmit}
        disabled={isRunning || isSubmitting}
        className="h-10 px-8 rounded-xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed group transition-shadow hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        {isSubmitting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        )}
        {isSubmitting ? "Processing" : "Submit"}
      </button>
    </div>
  );
};

export default EditorFooter;
