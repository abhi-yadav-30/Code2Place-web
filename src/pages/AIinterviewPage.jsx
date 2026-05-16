import { useEffect, useRef, useState } from "react";
import React from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { getDomain } from "../utils/helper";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  ArrowRight, 
  XCircle, 
  MessageSquare, 
  CheckCircle2, 
  Clock,
  CircleStop,
  PlayCircle,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Button, Card, CardContent } from "../components/UIComponents";

const AIinterviewPage = () => {
  const location = useLocation();
  const { role, jobDesc, round, difficulty } = location.state || {};
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const recorderRef = useRef(null);
  const chunks = useRef([]);

  const [question, setQuestion] = useState("Introduce yourself.");
  const [sessionId, setSessionId] = useState(null);
  const { userId } = JSON.parse(localStorage.getItem("user")) || {};

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
    try {
      const res = await fetch(`${getDomain()}/api/interview/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
        credentials: "include",
      });

      const data = await res.json();
      if (data?.error) {
        toast.error(data?.error);
        return;
      }

      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      videoRef.current.srcObject = videoStream;
      videoRef.current.play();

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      recorderRef.current = new MediaRecorder(audioStream, {
        mimeType: "audio/webm; codecs=opus",
      });

      setSessionId(data.sessionId);
      setCamera(true);
      toast.success("Camera and Audio linked!");
    } catch (err) {
      toast.error("Failed to access camera/mic");
    }
  };

  const startRecording = () => {
    if (!camera) {
      toast.error("Please start camera first");
      return;
    }
    setIsRecording(true);
    const recorder = recorderRef.current;
    recorder.ondataavailable = (e) => chunks.current.push(e.data);

    recorder.onstop = async () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      chunks.current = [];

      const form = new FormData();
      form.append("audio", blob, "recording.webm");

      const loadingToast = toast.loading("Processing your answer...");
      try {
        const res = await fetch(`${getDomain()}/api/interview/transcribe`, {
          method: "POST",
          body: form,
          credentials: "include",
        });

        const data = await res.json();
        if (data?.error) throw new Error(data.error);
        
        setAnswerText(data.text);

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
        if (ai?.error) throw new Error(ai.error);

        setQuestion(ai.nextQuestion);
        setGeneratedAns(ai.correctAnswer);
        setFeedback(ai.shortFeedback);
        toast.success("Next question ready!", { id: loadingToast });
      } catch (err) {
        toast.error(err.message || "Failed to process audio", { id: loadingToast });
      }
    };

    recorder.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recorderRef.current.stop();
  };

  const endInterview = async () => {
    try {
      if (isRecording) stopRecording();

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
        toast.error(data.error);
        return;
      }

      // Cleanup
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }

      toast.success("Session concluded!");
      navigate(`/ai-interview/transcription/view/${sessionId}`);
    } catch (err) {
      toast.error("Cleanup error");
    }
  };

  return (
    <div className="h-full bg-[#0a0a0a] text-white p-4 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2 border-b border-white/5">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span className="w-2 h-8 bg-gradient-to-b from-orange-500 to-rose-600 rounded-full"></span>
              AI Simulator
            </h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{role || "Engineering Role"} • {round || "General"} Round</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`px-4 py-1.5 rounded-xl border transition-all flex items-center gap-2 ${
              isRecording 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' 
                : 'bg-white/5 border-white/10 text-gray-500'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-gray-600'}`}></div>
              <span className="font-mono text-lg font-bold">{formatTime(recordTime)}</span>
            </div>
            <Button variant="ghost" onClick={endInterview} className="text-rose-400 hover:bg-rose-500/10 py-2 text-xs">
              <CircleStop size={16} />
              End Session
            </Button>
          </div>
        </div>

        {/* Main Interface Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Camera and Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative group">
              <video
                ref={videoRef}
                className="w-full aspect-video bg-gray-900 rounded-3xl object-cover border border-white/10 shadow-2xl transition-all group-hover:border-orange-500/30 transform scale-x-[-1]"
              />
              {!camera && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80 rounded-3xl border border-dashed border-white/10 backdrop-blur-sm p-6 text-center">
                  <Camera size={40} className="text-gray-700 mb-4" />
                  <p className="text-gray-500 font-bold mb-6 uppercase tracking-widest text-[10px]">Setup Required</p>
                  <Button onClick={startCamera} className="px-6 py-2.5 text-xs">
                    Initialize Setup
                    <PlayCircle size={16} />
                  </Button>
                </div>
              )}
              
              {/* Overlay Controls */}
              {camera && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 p-1.5 glass rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={startRecording}
                    disabled={isRecording}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      isRecording ? 'bg-gray-700 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    <Mic size={20} />
                  </button>
                  <button 
                    onClick={stopRecording}
                    disabled={!isRecording}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      !isRecording ? 'bg-gray-700 cursor-not-allowed' : 'bg-rose-600 animate-pulse'
                    }`}
                  >
                    <MicOff size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/50">
                <ShieldCheck size={14} />
                Privacy Protocol
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed italic">
                Local preview only. No visual data is recorded or transmitted to our AI systems.
              </p>
            </div>
          </div>

          {/* Right Column: Prompter and Transcript */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Prompter Card */}
            <Card className="border border-white/10 bg-white/[0.01] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                <MessageSquare size={100} />
              </div>
              <CardContent className="p-6 md:p-8 space-y-5">
                <div className="flex items-center gap-2 text-orange-500 font-black uppercase tracking-widest text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                  Active Question
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">
                  {question}
                </h3>
                
                {feedback && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2"
                  >
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-wider">
                      <CheckCircle2 size={14} />
                      AI Insights
                    </div>
                    <p className="text-gray-400 font-medium leading-relaxed text-sm italic">{feedback}</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Transcript Card */}
            <Card className="border border-white/10 bg-white/[0.03]">
              <CardContent className="p-6 md:p-8 space-y-6 flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                     <Zap size={14} className="text-orange-500/50" />
                     Live Transcript
                   </h4>
                   {isRecording && <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping"></span>}
                </div>
                
                <div className="flex-1 overflow-y-auto max-h-[400px]">
                  {answerText ? (
                    <p className="text-lg text-gray-300 font-medium leading-relaxed italic border-l-2 border-orange-500/20 pl-6">
                      {answerText}
                    </p>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-10 py-10">
                      <Mic size={32} />
                      <p className="text-[10px] uppercase tracking-[0.4em] font-black italic">Listening for input...</p>
                    </div>
                  )}
                </div>

                
              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AIinterviewPage;
