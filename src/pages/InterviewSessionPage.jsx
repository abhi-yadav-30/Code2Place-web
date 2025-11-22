import { useEffect, useState } from "react";
import {useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import { Button } from "../components/UIComponents";

const InterviewSessionPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const { userId } = JSON.parse(localStorage.getItem("user"));
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch(
        `//localhost:5000/api/interview/transcription/${sessionId}/user/${userId}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setSession(data.session || null);
    };
    fetchSession();
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


  if (!session)
    return (
      <div className="p-10 text-gray-300 text-center text-xl bg-[#202020] min-h-screen flex items-center justify-center">
        Loading transcription...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#202020] text-white p-8 ">
      <Button className="mb-4" onClick={() => navigate(-1)}>
        Back
      </Button>
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          {/* Main Card */}
          <div className="h-[78vh] bg-[#1a1a1a] border border-gray-700 rounded-2xl shadow-xl p-8 space-y-8 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-emerald-300">
                Interview Transcription
              </h1>

              <div className="flex gap-4">
                <button
                  onClick={downloadTxt}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
                >
                  Download TXT
                </button>

                <button
                  onClick={downloadPDF}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
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
                {session.duration} sec
              </p>
            </div>

            {/* Transcripts */}
            <div className="  overflow-y-auto h-[52vh]">
              <div className="space-y-6  mx-5">
                {session.transcription.map((t, i) => (
                  <div
                    key={i}
                    className="p-6 bg-[#2a2a2a] rounded-xl border border-gray-600 shadow-lg"
                  >
                    <p className="text-xl text-amber-300 font-semibold">
                      Question {i + 1}
                    </p>
                    <p className="text-gray-200 mt-1 text-lg">{t.question}</p>

                    <p className="text-emerald-300 mt-4 font-semibold text-lg">
                      Your Answer
                    </p>
                    <p className="text-gray-300 mt-1 whitespace-pre-line">
                      {t.answer}
                    </p>

                    <p className="text-blue-300 mt-4 font-semibold text-lg">
                      Feedback
                    </p>
                    <p className="text-gray-300 mt-1 whitespace-pre-line">
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
