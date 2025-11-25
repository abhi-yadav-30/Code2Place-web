import { useEffect, useState } from "react";
import { getDomain } from "../utils/helper";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function QuestionsListPage() {
  const [questions, setQuestions] = useState([]);
  const [loading , setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        // console.log(getDomain());
        const res = await fetch(`${getDomain()}/api/question/questions`, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        // console.log("resposnce : ", res);
        const data = await res.json();
        if (data?.error) {
          console.log("error : ", data?.error);
          toast.error(data?.error);
          // navigate("/auth");
          return;
        }
        // console.log("resposnce : ", data);
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
      
    };

    fetchQuestions();
  }, []);

  const getDifficultyBadge = (level) => {
    if (level === 1)
      return (
        <span className="px-2 py-1 rounded-full bg-green-600 text-xs">
          Easy
        </span>
      );
    if (level === 2)
      return (
        <span className="px-2 py-1 rounded-full bg-yellow-600 text-xs">
          Medium
        </span>
      );
    return (
      <span className="px-2 py-1 rounded-full bg-red-600 text-xs">Hard</span>
    );
  };

  if(loading){
    return (
      <div className="h-full bg-[#2b2b2b] text-white p-6 overflow-y-scroll ">
        <h1 className="text-2xl font-semibold mb-5">All Questions</h1>
        <div className="flex justify-center items-center h-full">
          <div className="w-16 h-16 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-[#2b2b2b] text-white p-6 overflow-y-scroll">
      <h1 className="text-2xl font-semibold mb-5">All Questions</h1>

      <div className="space-y-4">
        {questions.map((q) => (
          <a
            href={`/questions/${q._id}`}
            key={q._id}
            className="block  bg-[#212121d8] p-4 rounded-lg border border-gray-700 hover:bg-[#171717] transition hover:text-blue-400"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium ">{q.QueTitle}</h2>
              <span className="text-white">
                {getDifficultyBadge(q.difficultyLevel)}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
