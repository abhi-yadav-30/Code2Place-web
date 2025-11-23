import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AIInterviewHomePage = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const [role, setRole] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [round, setRound] = useState("HR");
  const [difficulty, setDifficulty] = useState("easy");
  const [errors, setErrors] = useState({});

  const handleStart = () => {
    if (!role.trim()) {
      setErrors((prev) => ({ ...prev, role: "Role field is mandatory" }));
      return;
    } else {
      setErrors((prev) => ({ ...prev, role: "" }));
    }

    navigate("/ai-interview/practice", {
      state: { role, jobDesc, round, difficulty },
    });
  };

  return (
    <div
      className="h-[94vh] relative overflow-y-auto bg-[#262626] bg-linear-to-br
    from-[#0f0f0f]
    via-[#1a1a1a]
    to-orange-500/60"
    >
      {/* SUBTLE CLASSIC GRADIENT BACKGROUND */}
     

      {/* FADE v1 – soft dark overlay for classic look */}
      {/* <div className="absolute inset-0 bg-[#262626]/60"></div> */}

      {/* CONTENT */}
      <div className="relative z-10">
        <div className="max-w-3xl mx-auto mt-10 px-4 text-white">
      
          <h1 className="text-3xl font-bold text-center mb-6">
            AI Mock Interview
          </h1>

          <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>

            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              <li>
                This AI interview simulates a real-world interview experience.
              </li>
              <li>Questions are based on your role & difficulty level.</li>
              <li>Your responses will be recorded, analyzed, and saved.</li>
              <li>You will get detailed feedback after each answer.</li>
              <li>Full transcription is stored for future reference.</li>
              <li>
                Your video is not recorded — it's only shown to boost your
                confidence.
              </li>
            </ul>

           
            <button
              onClick={() => setOpenModal(true)}
              className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition cursor-pointer"
            >
              Start Interview
            </button>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate("/ai-interview/transcription")}
              className="mb-20 py-2 px-4 bg-green-600 hover:bg-gray-600 rounded-lg text-sm font-medium transition cursor-pointer"
            >
              View All Transcriptions
            </button>
          </div>

     
          {openModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center px-4">
              <div className="bg-[#1e1e1e] p-6 rounded-xl w-full max-w-lg border border-gray-700 shadow-xl">
                <h2 className="text-xl font-semibold mb-4">Interview Setup</h2>

             
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm mb-1">
                      Role <span className="text-red-400">*</span>
                    </label>
                    {errors.role && (
                      <span className="text-red-400 text-xs">
                        {errors.role}
                      </span>
                    )}
                  </div>

                  <input
                    type="text"
                    className="w-full p-2 rounded bg-[#2c2c2c] border border-gray-600 mb-4"
                    placeholder="e.g. Frontend Developer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
           
                <label className="block text-sm mb-1">
                  Job Description (optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full p-2 rounded bg-[#2c2c2c] border border-gray-600 mb-4"
                  placeholder="Paste job description..."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />

        
                <label className="block text-sm mb-1">Round</label>
                <select
                  className="w-full p-2 rounded bg-[#2c2c2c] border border-gray-600 mb-4"
                  value={round}
                  onChange={(e) => setRound(e.target.value)}
                >
                  <option value="HR">HR</option>
                  <option value="Technical">Technical</option>
                  <option value="Managerial">Managerial</option>
                </select>

             
                <label className="block text-sm mb-1">Difficulty</label>
                <select
                  className="w-full p-2 rounded bg-[#2c2c2c] border border-gray-600 mb-4"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

        
                <div className="flex justify-between mt-5">
                  <button
                    onClick={() => setOpenModal(false)}
                    className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleStart}
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition cursor-pointer"
                  >
                    Start Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInterviewHomePage;
