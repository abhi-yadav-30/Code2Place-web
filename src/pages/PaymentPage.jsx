import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  CreditCard,
  CheckCircle2,
  Shield,
  ArrowLeft,
  Loader2,
  Sparkles,
  Crown,
  Star,
  Copy,
  Check,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setSubscription } from "../store/utilesSlice";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const PLAN_META = {
  monthly: {
    name: "Pro Monthly",
    price: "₹499",
    period: "per month",
    icon: Star,
    color: "from-orange-500 to-rose-500",
    durationText: "30-day subscription",
  },
  annual: {
    name: "Pro Annual",
    price: "₹3,999",
    period: "per year",
    icon: Crown,
    color: "from-yellow-500 to-orange-500",
    durationText: "365-day subscription",
  },
};

const formatCardNumber = (val) => {
  const digits = val.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};

const formatExpiry = (val) => {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
};

export default function PaymentPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan") || "monthly";
  const plan = PLAN_META[planId] || PLAN_META.monthly;
  const PlanIcon = plan.icon;

  const [step, setStep] = useState("form"); // "form" | "processing" | "success"
  const [tab, setTab] = useState("card");
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    upiId: "",
  });
  const [errors, setErrors] = useState({});
  const [txnResult, setTxnResult] = useState(null);

  const handleChange = (field, raw) => {
    let val = raw;
    if (field === "cardNumber") val = formatCardNumber(raw);
    if (field === "expiry") val = formatExpiry(raw);
    if (field === "cvv") val = raw.replace(/\D/g, "").slice(0, 3);
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (tab === "card") {
      if (form.cardNumber.replace(/\s/g, "").length < 16)
        errs.cardNumber = "Enter a valid 16-digit number";
      if (!form.cardName.trim()) errs.cardName = "Cardholder name required";
      const [mm] = (form.expiry || "/").split("/");
      if (form.expiry.length < 5 || parseInt(mm) > 12 || parseInt(mm) < 1)
        errs.expiry = "Invalid expiry";
      if (form.cvv.length < 3) errs.cvv = "Enter 3-digit CVV";
    } else {
      if (!form.upiId.includes("@")) errs.upiId = "Enter valid UPI ID (e.g. name@upi)";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setStep("processing");
    await new Promise((r) => setTimeout(r, 2500));

    try {
      const res = await fetch(`${API}/api/subscription/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Payment failed");
        setStep("form");
        return;
      }

      dispatch(
        setSubscription({
          isPro: true,
          plan: planId,
          subscriptionExpiresAt: data.subscriptionExpiresAt,
        })
      );
      setTxnResult(data);
      setStep("success");
    } catch {
      toast.error("Network error. Please try again.");
      setStep("form");
    }
  };

  const copyTxnId = () => {
    if (!txnResult?.txnId) return;
    navigator.clipboard.writeText(txnResult.txnId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── PROCESSING ────────────────────────────────────────────────────────────
  if (step === "processing") {
    return (
      <div className="h-full bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="text-center space-y-6 w-full max-w-xs">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-white/5" />
            <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-3 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Lock size={28} className="text-orange-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Processing Payment</h2>
            <p className="text-sm text-gray-500 mt-1">Verifying your payment securely…</p>
          </div>
          <div className="space-y-2">
            {["Connecting to gateway", "Authenticating details", "Completing transaction"].map(
              (msg, i) => (
                <motion.div
                  key={msg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.7 }}
                  className="flex items-center gap-2 justify-center text-xs text-gray-600"
                >
                  <Loader2 size={12} className="animate-spin" />
                  {msg}
                </motion.div>
              )
            )}
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-600">
            <Shield size={12} className="text-green-500" />
            256-bit SSL Encrypted
          </div>
        </div>
      </div>
    );
  }

  // ─── SUCCESS ───────────────────────────────────────────────────────────────
  if (step === "success" && txnResult) {
    const expiry = txnResult.subscriptionExpiresAt
      ? new Date(txnResult.subscriptionExpiresAt).toLocaleDateString("en-IN", {
          day: "numeric", month: "long", year: "numeric",
        })
      : "";

    return (
      <div className="h-full bg-[#0a0a0a] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-sm bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 text-center space-y-5"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
            className="mx-auto w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center"
          >
            <CheckCircle2 size={40} className="text-green-500" />
          </motion.div>

          <div>
            <h2 className="text-2xl font-black text-white">Payment Successful!</h2>
            <p className="text-sm text-gray-400 mt-1">
              Welcome to <span className="text-orange-400 font-bold">{plan.name}</span>
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-3 text-left">
            {[
              ["Plan", plan.name],
              ["Amount Paid", `${plan.price} ${plan.period}`],
              ["Valid Until", expiry],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{label}</span>
                <span className="text-xs text-white font-bold">{value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Transaction ID</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white font-mono font-bold">{txnResult.txnId}</span>
                <button onClick={copyTxnId} className="text-gray-500 hover:text-orange-400 transition-colors">
                  {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/AI-Interview")}
            className={`w-full py-4 rounded-xl font-black text-sm text-white bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
          >
            <Sparkles size={16} />
            Go to AI Interview
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── FORM ──────────────────────────────────────────────────────────────────
  return (
    <div className="h-full bg-[#0a0a0a] text-white flex flex-col">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto pb-28 sm:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

          {/* Back + Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/pricing")}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-xl font-black">Complete Payment</h1>
              <p className="text-gray-500 text-xs font-medium">Secure checkout · Code2Place Gateway</p>
            </div>
          </div>

          {/* ── Compact Order Summary (always visible on top) ── */}
          <div className={`flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r ${plan.color} shadow-lg`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <PlanIcon size={18} className="text-white" />
              </div>
              <div>
                <p className="font-black text-white text-sm">{plan.name}</p>
                <p className="text-white/70 text-xs">{plan.durationText}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-white text-xl">{plan.price}</p>
              <p className="text-white/70 text-xs">{plan.period}</p>
            </div>
          </div>

          {/* ── Payment Method Tabs ── */}
          <div className="flex bg-white/5 border border-white/5 p-1 rounded-xl gap-1">
            {["card", "upi"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-black transition-all ${
                  tab === t ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {t === "card" ? "💳 Card" : "📲 UPI"}
              </button>
            ))}
          </div>

          {/* ── Card Form ── */}
          <AnimatePresence mode="wait">
            {tab === "card" ? (
              <motion.div
                key="card-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {/* Live Card Preview */}
                <div
                  className={`relative h-40 sm:h-44 rounded-2xl bg-gradient-to-br ${plan.color} p-5 overflow-hidden shadow-xl`}
                >
                  {/* Circles decoration */}
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full border border-white/10"
                      style={{
                        width: `${120 + i * 60}px`,
                        height: `${120 + i * 60}px`,
                        top: `${-30 - i * 30}px`,
                        right: `${-50 - i * 20}px`,
                      }}
                    />
                  ))}
                  <div className="relative flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-9 h-6 rounded bg-yellow-300/80 shadow" />
                      <Shield size={16} className="text-white/50" />
                    </div>
                    <div>
                      <p className="font-mono text-base sm:text-lg font-bold tracking-widest text-white/90 mb-1">
                        {form.cardNumber || "•••• •••• •••• ••••"}
                      </p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[9px] text-white/50 uppercase tracking-widest">Cardholder</p>
                          <p className="text-xs font-bold text-white uppercase tracking-wide">
                            {form.cardName || "YOUR NAME"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-white/50 uppercase tracking-widest">Expires</p>
                          <p className="text-xs font-bold text-white">{form.expiry || "MM/YY"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Number */}
                <Field label="Card Number" error={errors.cardNumber}>
                  <CreditCard size={15} className="text-gray-500 shrink-0" />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={form.cardNumber}
                    onChange={(e) => handleChange("cardNumber", e.target.value)}
                    className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-700 outline-none min-w-0"
                    maxLength={19}
                  />
                </Field>

                {/* Cardholder Name */}
                <Field label="Cardholder Name" error={errors.cardName}>
                  <input
                    type="text"
                    placeholder="As on card"
                    value={form.cardName}
                    onChange={(e) => handleChange("cardName", e.target.value)}
                    className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-700 outline-none min-w-0"
                  />
                </Field>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Expiry (MM/YY)" error={errors.expiry}>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM / YY"
                      value={form.expiry}
                      onChange={(e) => handleChange("expiry", e.target.value)}
                      className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-700 outline-none min-w-0"
                      maxLength={5}
                    />
                  </Field>
                  <Field label="CVV" error={errors.cvv}>
                    <Lock size={13} className="text-gray-500 shrink-0" />
                    <input
                      type="password"
                      inputMode="numeric"
                      placeholder="•••"
                      value={form.cvv}
                      onChange={(e) => handleChange("cvv", e.target.value)}
                      className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-700 outline-none min-w-0"
                      maxLength={3}
                    />
                  </Field>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="upi-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {/* QR Code placeholder */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col items-center gap-3">
                  <div className="w-36 h-36 bg-white rounded-xl p-3 grid grid-cols-3 gap-1">
                    {[0,2,6,8].map(i => (
                      <React.Fragment key={i}>
                        {[...Array(9)].map((_, j) => (
                          j === i ? (
                            <div key={j} className="bg-gray-900 rounded-sm" />
                          ) : j === 4 ? (
                            <div key={j} className="bg-orange-500 rounded-sm" />
                          ) : [0,2,6,8].includes(j) ? (
                            <div key={j} className="bg-gray-900 rounded-sm" />
                          ) : (
                            <div key={j} className="bg-gray-200 rounded-sm" />
                          )
                        ))}
                      </React.Fragment>
                    ))[0]}
                    {/* Simplified visual QR */}
                    {[...Array(9)].map((_, j) => (
                      <div
                        key={j}
                        className={`rounded-sm aspect-square ${
                          [0,2,6,8].includes(j) ? "bg-gray-900" : j === 4 ? "bg-orange-500" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Scan with PhonePe, GPay, Paytm or any UPI app
                  </p>
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-xs text-gray-600">or enter UPI ID</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                </div>

                <Field label="UPI ID" error={errors.upiId}>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={form.upiId}
                    onChange={(e) => handleChange("upiId", e.target.value)}
                    className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-700 outline-none min-w-0"
                  />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Pay Button (visible on sm+) */}
          <div className="hidden sm:block space-y-3">
            <button
              onClick={handlePay}
              className={`w-full py-4 rounded-xl font-black text-base text-white bg-gradient-to-r ${plan.color} hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg`}
            >
              <Lock size={16} />
              Pay {plan.price} Securely
            </button>
            <div className="flex items-center justify-center gap-5">
              {["🔒 256-bit SSL", "🛡️ PCI DSS", "⚡ Instant Activation"].map((b) => (
                <p key={b} className="text-[11px] text-gray-600 font-medium">{b}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile: Sticky Bottom Pay Button ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/5 p-4 space-y-2 z-50">
        <button
          onClick={handlePay}
          className={`w-full py-4 rounded-xl font-black text-base text-white bg-gradient-to-r ${plan.color} hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg`}
        >
          <Lock size={16} />
          Pay {plan.price} Securely
        </button>
        <div className="flex items-center justify-center gap-4">
          {["🔒 SSL Secured", "🛡️ PCI DSS", "⚡ Instant"].map((b) => (
            <p key={b} className="text-[10px] text-gray-600 font-medium">{b}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Reusable input field wrapper ──────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</label>
    <div
      className={`flex items-center gap-2.5 bg-white/5 border ${
        error ? "border-rose-500/50" : "border-white/10"
      } rounded-xl px-4 py-3 focus-within:border-orange-500/50 transition-colors`}
    >
      {children}
    </div>
    {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
  </div>
);
