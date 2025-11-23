import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { getDomain } from "../utils/helper";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AllTranscriptionsPage = () => {
  const { userId } = JSON.parse(localStorage.getItem("user"));
  const [sessions, setSessions] = useState([]);
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate()

  // Fetch all interview transcripts of the user
  useEffect(() => {
    try{
      
    
    setLoading(true);
    const fetchSessions = async () => {
      const res = await fetch(
        `${getDomain()}/api/interview/all/${userId}`,
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
      setSessions(data.sessions || []);
      setLoading(false);
    };
    fetchSessions();
  }catch(err){
    console.log(err);
    setLoading(false);
  }
  }, [userId]);

  // Download TXT
  const downloadTxt = (session) => {
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
    a.download = `interview_${session._id}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  // Download PDF (frontend-generated)
  const downloadPDF = (session) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Interview Transcription", 14, 20);

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

      const ansLines = doc.splitTextToSize(`Answer: ${t.answer}`, 180);
      doc.text(ansLines, 14, y);
      y += ansLines.length * 7 + 4;

      const feedLines = doc.splitTextToSize(`Feedback: ${t.feedback}`, 180);
      doc.text(feedLines, 14, y);
      y += feedLines.length * 7 + 10;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`interview_${session._id}.pdf`);
  };

  if(loading){
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-[#202020]">
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-transparent"></div>
        </div>
      </div>
    );
  } else if (!sessions.length)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-[#202020]">
        No interview transcriptions found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#202020] text-white pt-5 sm:p-10">
      <h1 className="text-xl sm:text-4xl font-bold text-emerald-300 mb-2 sm:mb-10 text-center">
        Your Interview Transcriptions
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2  gap-3 sm:gap-8 h-[74vh] overflow-y-auto px-5">
        {sessions.map((session) => (
          <div
            key={session._id}
            className="p-3 sm:p-6 bg-[#1a1a1a] border border-gray-700 rounded-2xl shadow-lg  sm:h-60 "
          >
            {session.createdAt && (
              <h2 className="text-lg sm:text-xl font-bold text-amber-300">
                Interview on {new Date(session.createdAt).toLocaleDateString()}
              </h2>
            )}

            <p className="text-gray-300 mt-2">
              Duration: {Number(session.duration)} sec
            </p>

            <p className="text-gray-400 text-sm mt-1">
              Questions: {session.transcription.length}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-4 mt-2 sm:mt-6">
              <a
                href={`/ai-interview/transcription/view/${session._id}`}
                className=" px-2 sm:px-4 py-1 sm:py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white flex items-center justify-center"
              >
                View
              </a>

              <button
                onClick={() => downloadTxt(session)}
                className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center justify-center"
              >
                Download TXT
              </button>

              <button
                onClick={() => downloadPDF(session)}
                className="px-2 sm:px-4 py-1 sm:py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white flex items-center justify-center"
              >
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTranscriptionsPage;
