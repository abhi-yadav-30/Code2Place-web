import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  Zap,
  Crown,
  Shield,
  Star,
  ArrowRight,
  Lock,
} from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "",
    tagline: "Get started for free",
    icon: Zap,
    color: "gray",
    borderClass: "border-white/5",
    badgeClass: "bg-white/5 text-gray-400",
    btnClass:
      "bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed",
    isPaid: false,
    features: [
      "Access to coding problems",
      "Basic question solutions",
      "Community resources",
      "Limited submissions (10/day)",
      "No AI Interview access",
    ],
    disabledFeatures: ["AI Mock Interview", "Interview history & feedback"],
  },
  {
    id: "monthly",
    name: "Pro Monthly",
    price: "₹499",
    period: "/ month",
    tagline: "Full access, cancel anytime",
    icon: Star,
    color: "orange",
    borderClass: "border-orange-500/30",
    badgeClass: "bg-orange-500/10 text-orange-400",
    btnClass:
      "bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:from-orange-400 hover:to-rose-400",
    isPaid: true,
    features: [
      "Everything in Free",
      "Unlimited coding submissions",
      "AI Mock Interview (Unlimited sessions)",
      "Real-time voice transcription",
      "Personalized AI feedback",
      "Full interview history",
      "Role & JD-based question tailoring",
    ],
    disabledFeatures: [],
  },
  {
    id: "annual",
    name: "Pro Annual",
    price: "₹3,999",
    period: "/ year",
    tagline: "Save ₹2,000 vs monthly — Best deal",
    icon: Crown,
    color: "yellow",
    popular: true,
    borderClass: "border-yellow-500/40",
    badgeClass: "bg-yellow-500/10 text-yellow-400",
    btnClass:
      "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-400 hover:to-orange-400",
    isPaid: true,
    features: [
      "Everything in Pro Monthly",
      "365 days of full Pro access",
      "Priority support",
      "Early access to new features",
      "Downloadable interview reports",
      "Exclusive practice question sets",
    ],
    disabledFeatures: [],
  },
];

const PricingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-[#0a0a0a] text-white overflow-y-auto relative">
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-rose-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16 space-y-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-black uppercase tracking-widest">
            <Sparkles size={13} />
            Upgrade to Pro
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter leading-tight">
            Unlock Your Full{" "}
            <span className="bg-gradient-to-r from-orange-500 to-rose-600 bg-clip-text text-transparent">
              Interview Potential
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base font-medium">
            The AI Interview feature is a Pro-only benefit. Choose a plan below
            to start practising with real-time AI feedback.
          </p>
        </motion.div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col rounded-2xl border ${plan.borderClass} bg-white/[0.02] p-6 space-y-5 ${
                  plan.popular ? "ring-1 ring-yellow-500/30" : ""
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-[10px] font-black uppercase tracking-widest text-black shadow-lg">
                      <Crown size={10} /> Best Value
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="space-y-2">
                  <div
                    className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-bold ${plan.badgeClass}`}
                  >
                    <Icon size={13} />
                    {plan.name}
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 text-sm font-medium pb-1">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium italic">
                    {plan.tagline}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-gray-300"
                    >
                      <CheckCircle2
                        size={15}
                        className="text-green-500 mt-0.5 shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                  {plan.disabledFeatures.map((f, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-gray-600 line-through"
                    >
                      <Lock size={13} className="mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() =>
                    plan.isPaid && navigate(`/payment?plan=${plan.id}`)
                  }
                  disabled={!plan.isPaid}
                  className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-200 ${plan.btnClass}`}
                >
                  {plan.isPaid ? (
                    <>
                      Get {plan.name} <ArrowRight size={16} />
                    </>
                  ) : (
                    "Current Plan"
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 pt-2"
        >
          {[
            { icon: Shield, text: "256-bit SSL Encryption" },
            { icon: Lock, text: "Secure Payment Gateway" },
            { icon: CheckCircle2, text: "Instant Activation" },
          ].map(({ icon: I, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-xs text-gray-500 font-medium"
            >
              <I size={14} className="text-green-500" />
              {text}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;
