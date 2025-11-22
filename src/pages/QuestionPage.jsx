import React, { useEffect, useState } from "react";
import EditorHead from "../components/EditorHead";
import CodeEditor from "../components/CodeEditor";
import EditorFooter from "../components/EditorFooter";
import DescriptionHeader from "../components/DescriptionHeader";
import Description from "../components/Description";
import Console from "../components/Console";
import { useParams } from "react-router-dom";
import Submissions from "../components/Submissions";
import { getDomain } from "../utils/helper";

const QuestionPage = () => {
  const [code, setCode] = useState(
    `// Write your code \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n `
  );
  const [activeTab, setActiveTab] = useState("description");

  const { id } = useParams();
  const handleCode = (code) => {
    setCode(code);
  };
  const [question, setQuestion] = useState({});

  useEffect(() => {
    const func = async () => {
      try {
        const response = await fetch(
         `${getDomain()}/api/question/questions/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!response.ok) {
          console.log("error: ", data.msg);
          return;
        }

        setQuestion(data.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    func();
  }, []);
 return (
   <div className="w-full h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-[#7f7f7f]">
     {/* LEFT CODE EDITOR */}
     <div className="w-full md:w-1/2 h-[50vh] md:h-full flex flex-col border-b md:border-b-0 md:border-r border-gray-300">
       <EditorHead />

       {/* Editor scrollable */}
       <div className="flex-1 overflow-hidden">
         <CodeEditor handleCode={handleCode} code={code} />
       </div>

       {/* Footer */}
       <EditorFooter code={code} queId={id} question={question} />
     </div>

     {/* RIGHT SIDE */}
     <div className="w-full md:w-1/2 h-[50vh] md:h-full flex flex-col">
       <DescriptionHeader activeTab={activeTab} setActiveTab={setActiveTab} />

       {/* Scrollable description */}
       <div className="flex-1 overflow-auto bg-[#262626]">
         {activeTab === "description" ? (
           <Description question={question} />
         ) : (
           <Submissions quesId={id} />
         )}
       </div>

       <Console />
     </div>
   </div>
 );

};

export default QuestionPage;
