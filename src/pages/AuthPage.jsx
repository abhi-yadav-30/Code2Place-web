import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getDomain } from "../utils/helper";
import {
  validateEmail,
  validatePassword,
  sanitizeText,
} from "../utils/validation";
import { GoogleLogin } from "@react-oauth/google";
import { Button, Card, CardContent } from "../components/UIComponents";
import { User, Mail, Lock, LogIn, UserPlus, KeyRound, RefreshCw, ArrowLeft, ChevronRight } from "lucide-react";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showOTPStep, setShowOTPStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(form.email)) {
      setError("Please use a valid email from a supported domain (Gmail, Yahoo, Outlook, or RVCE).");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${getDomain()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (data?.unverified) {
        setVerificationEmail(form.email);
        setShowOTPStep(true);
        toast.error("Email not verified. Please check your inbox for OTP.");
        setLoading(false);
        return;
      }

      if (data?.error) {
        toast.error(data?.error);
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError(data.msg || "Login failed");
        setLoading(false);
        return;
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Welcome back!");
      navigate("/questions");
    } catch (err) {
      toast.error("Login failed");
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    const name = sanitizeText(form.name);
    const username = sanitizeText(form.username);

    if (!name || name.length < 3) return setError("Name must be at least 3 characters.");
    if (!username || username.length < 3) return setError("Username must be at least 3 characters.");
    if (!validateEmail(form.email)) return setError("Please use a supported email domain (Gmail, Yahoo, Outlook, or RVCE).");
    if (!validatePassword(form.password)) return setError("Password too weak.");

    setLoading(true);
    try {
      const res = await fetch(`${getDomain()}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (data?.error) {
        toast.error(data?.error);
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError(data.msg || "Registration failed");
        setLoading(false);
        return;
      }
      setVerificationEmail(form.email);
      setShowOTPStep(true);
      toast.success("OTP sent to your email!");
    } catch (err) {
      toast.error("Registration failed");
      setError("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${getDomain()}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: verificationEmail, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Email verified! You can now login.");
        setShowOTPStep(false);
        setOtp("");
        setIsLogin(true);
      } else {
        toast.error(data.msg || "Verification failed");
      }
    } catch (err) {
      toast.error("Verification failed");
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    setLoading(true);
    try {
      const res = await fetch(`${getDomain()}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: verificationEmail }),
      });
      if (res.ok) {
        toast.success("OTP resent!");
        setTimer(60);
      } else {
        const data = await res.json();
        toast.error(data.msg || "Failed to resend");
      }
    } catch (err) {
      toast.error("Failed to resend");
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 py-12 relative overflow-y-auto">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/5 to-rose-600/5 -z-10"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-600/10 rounded-full blur-[100px]"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <Card className="border border-white/10 shadow-2xl">
          <CardContent className="p-10">
            <AnimatePresence mode="wait">
              {!showOTPStep ? (
                <motion.div
                  key="form-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="text-4xl font-black text-white text-center mb-2 tracking-tight">
                    {isLogin ? "Welcome Back" : "Join Code2Place"}
                  </h2>
                  <p className="text-gray-400 text-center mb-8 font-medium">
                    {isLogin ? "Securely login to your account" : "Start your journey today"}
                  </p>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl mb-6 text-sm font-semibold text-center"
                    >
                      {error}
                    </motion.div>
                  )}

                  <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">
                    <AnimatePresence mode="wait">
                      {!isLogin && (
                        <motion.div
                          key="register-fields"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-5"
                        >
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                            <input
                              name="name"
                              type="text"
                              placeholder="Full Name"
                              value={form.name}
                              onChange={handleChange}
                              className="w-full pl-12 pr-4 py-4 bg-white/5 text-white rounded-xl border border-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                            />
                          </div>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                            <input
                              name="username"
                              type="text"
                              placeholder="Username"
                              value={form.username}
                              onChange={handleChange}
                              className="w-full pl-12 pr-4 py-4 bg-white/5 text-white rounded-xl border border-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                      <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 text-white rounded-xl border border-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                      <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 text-white rounded-xl border border-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                      />
                    </div>

                    <Button
                      disabled={loading}
                      className="w-full py-4 text-lg"
                    >
                      {loading ? "Processing..." : isLogin ? "Login Now" : "Create Account"}
                      {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                    </Button>
                  </form>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-[#111] text-gray-500 font-bold uppercase tracking-wider">Or continue with</span>
                    </div>
                  </div>

                  <div className="flex justify-center mb-8">
                    <GoogleLogin
                      onSuccess={async (response) => {
                        const res = await fetch(`${getDomain()}/api/auth/google`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                          body: JSON.stringify({ credential: response.credential }),
                        });
                        const data = await res.json();
                        if (res.ok) {
                          toast.success("Welcome with Google!");
                          localStorage.setItem("user", JSON.stringify(data.user));
                          navigate("/questions");
                        } else {
                          toast.error(data.msg);
                        }
                      }}
                      shape="pill"
                      theme="filled_black"
                      size="large"
                      onError={() => toast.error("Google Login Failed")}
                    />
                  </div>

                  <p className="text-gray-400 text-sm text-center font-medium">
                    {isLogin ? "New to Code2Place?" : "Already have an account?"}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-orange-500 ml-2 font-bold hover:underline"
                    >
                      {isLogin ? "Sign Up Free" : "Login Here"}
                    </button>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <button 
                    onClick={() => setShowOTPStep(false)}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                  >
                    <ArrowLeft size={16} />
                    Back to Form
                  </button>

                  <div className="text-center space-y-2">
                    <h2 className="text-4xl font-black text-white tracking-tight">Verify Email</h2>
                    <p className="text-gray-400 font-medium">
                      We sent a 6-digit code to <br />
                      <span className="text-orange-500 font-bold">{verificationEmail}</span>
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div className="relative group">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-12 pr-4 py-5 bg-white/5 text-white rounded-xl border border-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-black text-2xl tracking-[0.5em] text-center placeholder:tracking-normal placeholder:text-lg placeholder:font-medium"
                      />
                    </div>

                    <Button
                      disabled={loading || otp.length !== 6}
                      className="w-full py-4 text-lg"
                    >
                      {loading ? "Verifying..." : "Verify & Continue"}
                      <ChevronRight size={20} />
                    </Button>
                  </form>

                  <div className="text-center">
                    <button
                      disabled={timer > 0 || loading}
                      onClick={handleResendOTP}
                      className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white disabled:opacity-50 transition-colors"
                    >
                      <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                      {timer > 0 ? `Resend OTP in ${timer}s` : "Resend Verification Code"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPage;
