import { useEffect, useState } from "react";
import {useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import { Button } from "../components/UIComponents";
import { getDomain } from "../utils/helper";

const InterviewSessionPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const { userId } = JSON.parse(localStorage.getItem("user"));
  const [session, setSession] = useState(null);
  const [loading ,setLoading]=useState(true);

  useEffect(() => {
    try{
      setLoading(true);
    const fetchSession = async () => {
      const res = await fetch(
        `${getDomain()}/api/interview/transcription/${sessionId}/user/${userId}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data?.error) {
        console.log("error : ", data?.error);
        toast.error(data?.error);
        // navigate("/auth");
        return;
      }
      setSession(data.session || null);
    };
    fetchSession();
  }catch(err){
    console.log(err)
  }finally{
    setLoading(false);
  }
  }, [sessionId, userId]);

  const downloadTxt = () => {
    if (!session) return;

    let content = `Interview Date: ${new Date(
      session.createdAt
    ).toLocaleString()}\n`;
    content += `Duration: ${session.duration} sec\n\n`;

    session.transcription.forEach((t, idx) => {
      content += `Q${idx + 1}: ${t.question}\n`;
      content += `Answer: ${t.answer}\n`;
      content += `Feedback: ${t.feedback}\n`;
      content += `---------------------------\n`;
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `interview_${sessionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

 

 const downloadPDF = () => {
   if (!session) return;

   const doc = new jsPDF();

   // Title
   doc.setFontSize(18);
   doc.text("Interview Transcription", 14, 20);

   // Meta Section
   doc.setFontSize(12);
   doc.text(`Date: ${new Date(session.createdAt).toLocaleString()}`, 14, 35);
   doc.text(`Duration: ${session.duration} sec`, 14, 45);

   let y = 60;

   session.transcription.forEach((t, idx) => {
     doc.setFontSize(14);
     doc.text(`Question ${idx + 1}`, 14, y);
     y += 8;

     doc.setFontSize(12);
     doc.text(`Q: ${t.question}`, 14, y);
     y += 8;

     const answerLines = doc.splitTextToSize(`Answer: ${t.answer}`, 180);
     doc.text(answerLines, 14, y);
     y += answerLines.length * 7 + 4;

     const feedbackLines = doc.splitTextToSize(`Feedback: ${t.feedback}`, 180);
     doc.text(feedbackLines, 14, y);
     y += feedbackLines.length * 7 + 10;

     // Add new page if content reaches bottom
     if (y > 270) {
       doc.addPage();
       y = 20;
     }
   });

   doc.save(`interview_${sessionId}.pdf`);
 };

 if(loading){
  return (
    <div className="p-10 text-gray-300 text-center text-xl bg-[#202020] min-h-screen flex items-center justify-center">
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-transparent"></div>
      </div>
    </div>
  );
 } else if (!session)
    return (
      <div className="p-10 text-gray-300 text-center text-xl bg-[#202020] min-h-screen flex items-center justify-center">
        transcription not found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#202020] text-white p-3 sm:p-8 ">
      <Button className="mb-4" onClick={() => navigate(-1)}>
        Back
      </Button>
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          {/* Main Card */}
          <div className="h-[78vh] bg-[#1a1a1a] border border-gray-700 rounded-2xl shadow-xl p-4 sm:p-8 space-y-3 sm:space-y-8 overflow-hidden">
            {/* Header */}
            <div className="flex gap-3 sm:gap-0 flex-col sm:flex-row justify-between items-center ">
              <h1 className=" text-xl sm:text-3xl font-bold text-emerald-300">
                Interview Transcription
              </h1>

              <div className="flex gap-4">
                <button
                  onClick={downloadTxt}
                  className=" px-2 sm:px-4 py-2 text-sm sm:text-md bg-gray-700 hover:bg-gray-600 rounded-lg text-white cursor-pointer"
                >
                  Download TXT
                </button>

                <button
                  onClick={downloadPDF}
                  className="px-2 sm:px-4 py-2 text-sm sm:text-md bg-blue-600 hover:bg-blue-500 rounded-lg text-white cursor-pointer"
                >
                  Download PDF
                </button>
              </div>
            </div>

            {/* Meta */}
            <div className="text-gray-300 space-y-1">
              <p>
                <span className="font-semibold text-gray-200">Date:</span>{" "}
                {new Date(session.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Duration:</span>{" "}
                {Number(session.duration)} sec
              </p>
            </div>

            {/* Transcripts */}
            <div className="  overflow-y-auto h-[52vh]">
              <div className="space-y-6  sm:mx-5">
                {session.transcription.map((t, i) => (
                  <div
                    key={i}
                    className="p-6 bg-[#2a2a2a] rounded-xl border border-gray-600 shadow-lg"
                  >
                    <p className=" text-md sm:text-xl text-amber-300 font-semibold">
                      Question {i + 1}
                    </p>
                    <p className="text-gray-200 mt-1 text-sm sm:text-lg">
                      {t.question}
                    </p>

                    <p className="text-emerald-300 mt-4 font-semibold text-md sm:text-xl">
                      Your Answer
                    </p>
                    <p className="text-sm sm:text-lg text-gray-300 mt-1 whitespace-pre-line">
                      {t.answer}
                    </p>

                    <p className="text-blue-300 mt-4 font-semibold text-md sm:text-xl">
                      Feedback
                    </p>
                    <p className="text-sm sm:text-lg text-gray-300 mt-1 whitespace-pre-line">
                      {t.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSessionPage;
