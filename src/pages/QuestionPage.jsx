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
  const navigate = useNavigate()

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
    <div className="h-full flex flex-col md:flex-row bg-[#0a0a0a] overflow-hidden">
      
      {/* LEFT: CONTENT SIDE */}
      <div className="w-full md:w-[45%] h-1/2 md:h-full flex flex-col border-r border-white/5 bg-[#0f0f0f]">
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
      <div className="w-full md:w-[55%] h-1/2 md:h-full flex flex-col bg-[#111111]">
        <EditorHead />
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
          <CodeEditor handleCode={handleCode} code={code} />
        </div>
        <EditorFooter code={code} queId={id} question={question} />
      </div>

    </div>
  );
};

export default QuestionPage;
