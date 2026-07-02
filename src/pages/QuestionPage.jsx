import React, { useEffect, useState } from "react";
import EditorHead from "../components/EditorHead";
import CodeEditor from "../components/CodeEditor";
import EditorFooter from "../components/EditorFooter";
import DescriptionHeader from "../components/DescriptionHeader";
import Description from "../components/Description";
import Console from "../components/Console";
import { useNavigate, useParams } from "react-router-dom";
import Submissions from "../components/Submissions";
import { getDomain } from "../utils/helper";
import toast from "react-hot-toast";

const QuestionPage = () => {
  const [code, setCode] = useState(
    `// Solve the challenge below \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n `
  );
  const [activeTab, setActiveTab] = useState("description");
  const [mobileView, setMobileView] = useState("content");
  const navigate = useNavigate();

  const { id } = useParams();
  const handleCode = (code) => {
    setCode(code);
  };
  const [question, setQuestion] = useState({});

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(
          `${getDomain()}/api/question/questions/${id}`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (data?.error) {
          toast.error(data?.error);
          return;
        }
        setQuestion(data.data);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };
    fetchQuestion();
  }, [id]);

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#0a0a0a] overflow-hidden relative">
      
      {/* Mobile Toggle Bar */}
      <div className="md:hidden flex bg-[#111] p-1 gap-1 border-b border-white/10 shrink-0 z-20">
        <button 
          onClick={() => setMobileView("content")}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${mobileView === "content" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-500 hover:bg-white/5"}`}
        >
          Problem
        </button>
        <button 
          onClick={() => setMobileView("editor")}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${mobileView === "editor" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-500 hover:bg-white/5"}`}
        >
          Editor
        </button>
      </div>

      {/* LEFT: CONTENT SIDE */}
      <div className={`${mobileView === "content" ? "flex" : "hidden"} md:flex w-full md:w-[45%] h-full flex-col border-r border-white/5 bg-[#0f0f0f]`}>
        <DescriptionHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 overflow-auto">
          {activeTab === "description" ? (
            <Description question={question} />
          ) : (
            <Submissions quesId={id} />
          )}
        </div>
        <Console />
      </div>

      {/* RIGHT: EDITOR SIDE */}
      <div className={`${mobileView === "editor" ? "flex" : "hidden"} md:flex w-full md:w-[55%] h-full flex-col bg-[#111111]`}>
        <EditorHead />
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none z-10" />
          <CodeEditor handleCode={handleCode} code={code} />
        </div>
        <div className="hidden md:block shrink-0">
          <EditorFooter code={code} queId={id} question={question} />
        </div>
      </div>

      {/* Global Mobile Footer */}
      <div className="md:hidden shrink-0 w-full z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <EditorFooter code={code} queId={id} question={question} />
      </div>

    </div>
  );
};

export default QuestionPage;
