import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faShieldHalved,
  faChartLine,
  faFilePdf,
  faTrophy,
  faCloud,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Card, CardContent } from "../components/UIComponents";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Real Coding Environment",
      desc: "Write, run, and test code with a built-in Monaco editor and real-time judge.",
      icon: faBolt,
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "AI Interview Simulator",
      desc: "Practice HR & technical interviews with instant scoring and feedback.",
      icon: faShieldHalved,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Notes & Study Material",
      desc: "Upload or download high-quality notes and study material easily.",
      icon: faFilePdf,
      color: "from-rose-500 to-pink-500",
    },
    {
      title: "Real-Time Insights",
      desc: "Track everything with live analytics, dashboards, and performance metrics.",
      icon: faChartLine,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Cloud Storage",
      desc: "Secure cloud-based saving so your data is always accessible and backed up.",
      icon: faCloud,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Coding Contests",
      desc: "Participate in contests, rank up, and get detailed performance reports.",
      icon: faTrophy,
      color: "from-purple-500 to-violet-500",
      comingSoon: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="overflow-y-auto h-full scroll-smooth">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden bg-[#0a0a0a]">
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping"></span>
            <span className="text-sm font-medium text-gray-300">The Future of Placement Prep</span>
          </motion.div>

          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tight">
            Level Up Your <br />
            <span className="text-gradient-orange">Engineering Journey</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
            From coding practice to AI-powered interviews, everything you need to master placements in one powerful platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              onClick={() => navigate("/questions")}
              className="group text-lg px-12 py-4"
            >
              Get Started
              <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-12 py-4"
            >
              Explore Features
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-[#0a0a0a] relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">What We Offer</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-rose-600 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="h-full group hover:bg-white/[0.02] transition-colors border-white/5">
                  <CardContent className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl text-white mb-8 shadow-xl group-hover:scale-110 transition-transform`}>
                      <FontAwesomeIcon icon={feature.icon} />
                    </div>
                    {feature.comingSoon && (
                      <span className="mb-4 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold uppercase tracking-wider border border-orange-500/20">
                        Coming Soon
                      </span>
                    )}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-500 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed font-medium">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
