import { useEffect } from "react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { getDomain } from "../utils/helper";

const AIinterviewPage = () => {
  const location = useLocation();
  const { role, jobDesc, round, difficulty } = location.state || {};
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const recorderRef = useRef(null);
  const chunks = useRef([]);

  const [question, setQuestion] = useState("Introduce yourself.");
  const [sessionId, setSessionId] = useState(null);

  const { userId } = JSON.parse(localStorage.getItem("user"));

  const [feedback, setFeedback] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [camera, setCamera] = useState(false);
  const [generatedAns, setGeneratedAns] = useState("");

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const startCamera = async () => {
    const res = await fetch(`${getDomain()}/api/interview/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
      credentials: "include",
    });

    const data = await res.json();
    // toast.error(await JSON.stringify(data));
    if (data?.error) {
      console.log("error : ", data?.error);
      toast.error(data?.error);
      // navigate("/auth");
      return;
    }

    const videoStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    // toast.error(await JSON.stringify(videoStream));
    videoRef.current.srcObject = videoStream;
    videoRef.current.play();

    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    recorderRef.current = new MediaRecorder(audioStream, {
      mimeType: "audio/webm; codecs=opus",
    });
    // console.log("dending ", userId)

    setSessionId(data.sessionId);
    setCamera(true);
  };

  const startRecording = () => {
    try {
      if (!camera) toast.error("need to start camera to start interview ");
      setIsRecording(true);
      const recorder = recorderRef.current;

      recorder.ondataavailable = (e) => chunks.current.push(e.data);

      recorder.onstop = async () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        chunks.current = [];

        const form = new FormData();
        form.append("audio", blob, "recording.webm");

        const res = await fetch(`${getDomain()}/api/interview/transcribe`, {
          method: "POST",
          body: form,
          credentials: "include",
        });

        const data = await res.json();
        if (data?.error) {
          console.log("error : ", data?.error);
          toast.error(data?.error);
          // navigate("/auth");
          return;
        }
        setAnswerText(data.text);

        console.log({
          answer: data.text,
          prvQuestion: question,
          prvAns: generatedAns,
          userId,
          sessionId,
        });

        const aiRes = await fetch(`${getDomain()}/api/interview/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            answer: data.text,
            prvQuestion: question,
            prvAns: generatedAns,
            userId,
            sessionId,
            role,
            round,
            difficulty,
            jobDesc,
          }),
        });

        const ai = await aiRes.json();
        if (ai?.error) {
          console.log("error : ", ai?.error);
          toast.error(ai?.error);
          // navigate("/auth");
          return;
        }

        // if (ai.error) {
        //   console.log("error occured : ", ai.error);
        //   return;
        // }
        setQuestion(ai.nextQuestion);
        setGeneratedAns(ai.correctAnswer);
        setFeedback(ai.shortFeedback);
      };

      recorder.start();
    } catch (err) {
      console.log("err : ", err);
    }
  };

  const endInterview = async () => {
    try {
      // stop recording if currently running
      if (isRecording && recorderRef.current) {
        recorderRef.current.stop();
      }

      const res = await fetch(`${getDomain()}/api/interview/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          interviewDurationInSeconds: recordTime,
          sessionId,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (data?.error) {
        console.log("error : ", data?.error);
        toast.error(data?.error);
        // navigate("/auth");
        return;
      }

      setIsRecording(false);
      setRecordTime(0);
      setFeedback("");
      setAnswerText("");
      setQuestion("Introduce yourself.");
      setGeneratedAns("");
      setSessionId(null);

      // stop camera stream
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }

      setCamera(false);
      // alert("Interview Ended Successfully.");
      toast.success("Interview Ended Successfully.");
      navigate(`/ai-interview/transcription/view/${sessionId}`);
    } catch (err) {
      toast.success("Error occured!");
      console.log("End interview error:", err);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    return recorderRef.current.stop();
  };

  return (
    <div className="h-full bg-[#262626] text-white flex flex-col items-center px-6 py-5">
      <div className=" w-full  h-full overflow-y-auto lg:overflow-hidden max-w-7xl bg-[#1f1f1f] rounded-2xl shadow-lg p-3 ms:p-8 sm:pt-10 border border-gray-700">
        <h1 className="text-xl md:text-3xl font-bold mb-2 sm:mb-6 text-center">
          AI Mock Interview
        </h1>

        <div className="flex flex-col md:flex-row justify-center items-center gap-3 sm:gap-10 lg:gap-52 mb-6">
          <video
            ref={videoRef}
            className="rounded-xl sm:w-full max-w-[200px] sm:max-w-[350px]  sm:h-[220px] bg-black border border-gray-600 shadow-lg transform scale-x-[-1]"
          ></video>

          <div className="h-auto w-full sm:w-[67vh] flex flex-col justify-center items-center">
            <div className="flex flex-wrap justify-center gap-4 mb-2 sm:mb-4 ">
              <button
                onClick={startCamera}
                disabled={camera}
                className="z-70   bg-indigo-700 hover:bg-indigo-600 flex items-center gap-2 px-3 md:px-6 py-2 rounded-xl cursor-pointer
          disabled:opacity-60 disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:text-gray-100 text-sm lg:text-lg"
              >
                Start Camera
              </button>

              <button
                onClick={startRecording}
                disabled={isRecording || !camera}
                className=" text-sm lg:text-lg flex items-center gap-2  text-white px-3 md:px-6 py-2 rounded-xl  transition bg-teal-700 hover:bg-teal-600 cursor-pointer
          disabled:opacity-60 disabled:bg-teal-300 disabled:cursor-not-allowed disabled:text-gray-100"
              >
                Start Answer
              </button>

              <button
                onClick={stopRecording}
                disabled={!isRecording}
                className="text-sm lg:text-lg bg-rose-700 hover:bg-rose-600 flex items-center gap-2 px-3 md:px-6 py-2 rounded-xl cursor-pointer
          disabled:opacity-60 disabled:bg-rose-300 disabled:cursor-not-allowed disabled:text-gray-100"
              >
                Stop Answer
              </button>
            </div>

            <div className="flex flex-row items-center gap-3 justify-between  md:w-full">
              <div className="px-2 md:px-7 flex items-center justify-center gap-4 bg-red-900/20 border border-red-500/40  py-2 rounded-lg shadow-md">
                {isRecording ? (
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                ) : (
                  <i className="fa-solid fa-pause text-red-500"></i>
                )}
                <span className="text-red-300 font-semibold">
                  {" "}
                  {!isRecording ? "Paused" : "Recording"}
                </span>
                <span className="text-red-400 font-mono text-lg">
                  {formatTime(recordTime)}
                </span>
              </div>
              <button
                onClick={endInterview}
                disabled={!camera}
                className=" text-sm md:text-lg bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-3 py-3 md:px-6 md:py-2 rounded-xl font-semibold cursor-pointer text-white border border-gray-500 shadow-md"
              >
                End Interview
              </button>
            </div>
            <span className="italic text-amber-200 mt-2 w-full sm:w-[90%] text-sm sm:text-base">
              NOTE: No need to worry, your video is not recorded or stored
              anywhere. The camera is used only to simulate a real interview
              environment and help boost your confidence.
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-[65%]  sm:max-h-[37vh] overflow-y-auto px-1">
            {feedback && (
              <div>
                <span className="text-xl font-semibold mb-4 text-amber-300 font-serif">
                  Feedback:{" "}
                </span>
                <span className="sm:text-lg md:text-xl font-semibold mb-4 text-gray-200">
                  {feedback}
                </span>
              </div>
            )}

            <span className="text-xl font-semibold mb-4 text-amber-300 font-serif">
              Question:
            </span>
            <span className="text-base sm:text-lg md:text-xl font-semibold mb-4 text-emerald-300">
              {question}
            </span>
          </div>

          <div
            className="bg-[#2c2c2c] p-4 rounded-xl border border-gray-700 shadow-md 
w-full md:w-[34%] md:max-h-[37vh] overflow-y-auto mt-4 md:mt-0 md:ml-3"
          >
            <h3 className="text-lg font-bold  text-gray-200">Your Answer :</h3>
            <p className="text-gray-300 whitespace-pre-line sm:text-lg md:text-xl">
              {answerText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIinterviewPage;
