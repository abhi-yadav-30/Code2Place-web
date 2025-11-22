import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faShieldHalved,
  faPalette,
  faChartLine,
  faFilePdf,
  faTrophy,
  faCloud,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { getDomain } from "../utils/helper";

const Home = () => {
  const navigate = useNavigate();
  console.log(getDomain());
  return (
    <div className="overflow-y-auto h-[92vh]">
      <section className="w-full bg-[#262626] text-white flex flex-col items-center justify-center px-6 text-center min-h-[84vh] relative overflow-hidden">
        {/* <section className="w-full bg-[#1d1d1d] text-white py-24 px-6 min-h-screen "></section> */}
        <div className="absolute inset-0  opacity-20">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#ff7b00"
              fillOpacity="0.3"
              d="M0,64L48,101.3C96,139,192,213,288,234.7C384,256,480,224,576,181.3C672,139,768,85,864,90.7C960,96,1056,160,1152,170.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L0,320Z"
            ></path>
          </svg>
        </div>
        {/* <div className="absolute inset-0 -z-10 opacity-20">
          <svg viewBox="0 0 600 600" className="w-full h-full">
            <path
              d="M50 300 Q300 100 550 300 T1050 300"
              stroke="#ff7b00"
              strokeWidth="3"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M50 350 Q300 150 550 350 T1050 350"
              stroke="#ff7b00"
              strokeWidth="2"
              fill="none"
              opacity="0.2"
            />
          </svg>
        </div> */}
        <div className="absolute inset-0 -z-20 opacity-25">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#ff7b00"
              fillOpacity="0.3"
              d="M0,64L48,101.3C96,139,192,213,288,234.7C384,256,480,224,576,181.3C672,139,768,85,864,90.7C960,96,1056,160,1152,170.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L0,320Z"
            ></path>
          </svg>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-orange-600 mb-6 leading-tight">
          Level Up Your Engineering Journey
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          From coding practice to AI-powered interviews and curated learning
          resources — Code2Place gives you everything you need to master
          placements in one powerful platform.
        </p>

        <button
          className="
      mt-10
      z-10
      bg-orange-500 
      hover:bg-orange-600 
      text-white 
      px-10 py-3 
      rounded-lg 
      text-xl 
      font-semibold
      transition-all 
      duration-300
      shadow-lg shadow-orange-500/20 cursor-pointer
    "
          onClick={() => navigate("/questions")}
        >
          Get Started
        </button>
      </section>

      <section className="w-full bg-[#1d1d1d] text-white py-24 px-6 min-h-screen">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-orange-500 mb-16">
          What We Offer
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Card 1 */}
          <div className="bg-[#242424] p-10 rounded-xl shadow-lg border border-gray-700">
            <div className="flex justify-center mb-6">
              <div className="bg-[#3a2a20] p-4 rounded-lg text-4xl text-orange-400">
                <FontAwesomeIcon icon={faBolt} />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-orange-400 text-center mb-4">
              Real Coding Environment
            </h3>
            <p className="text-gray-300 text-center">
              Write, run, and test code with a built-in Monaco editor and
              real-time judge.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#242424] p-10 rounded-xl shadow-lg border border-gray-700">
            <div className="flex justify-center mb-6">
              <div className="bg-[#3a2a20] p-4 rounded-lg text-4xl text-orange-400">
                <FontAwesomeIcon icon={faShieldHalved} />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-orange-400 text-center mb-4">
              AI Interview Simulator
            </h3>
            <p className="text-gray-300 text-center">
              Practice HR & technical interviews with instant scoring and
              feedback.
            </p>
          </div>

          <div className="bg-[#242424] p-10 rounded-xl shadow-lg border border-gray-700">
            <div className="flex justify-center mb-6">
              <div className="bg-[#3a2a20] p-4 rounded-lg text-4xl text-orange-400">
                <FontAwesomeIcon icon={faFilePdf} />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-orange-400 text-center mb-4">
              Notes & Study Material
            </h3>
            <p className="text-gray-300 text-center">
              Upload or download high-quality notes and study material.
            </p>
          </div>

          <div className="bg-[#242424] p-10 rounded-xl shadow-lg border border-gray-700">
            <div className="flex justify-center mb-6">
              <div className="bg-[#3a2a20] p-4 rounded-lg text-4xl text-orange-400">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-orange-400 text-center mb-4">
              Real-Time Insights
            </h3>
            <p className="text-gray-300 text-center">
              Track everything with live analytics, dashboards, and performance
              metrics.
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-[#242424] p-10 rounded-xl shadow-lg border border-gray-700">
            <div className="flex justify-center mb-6">
              <div className="bg-[#3a2a20] p-4 rounded-lg text-4xl text-orange-400">
                <FontAwesomeIcon icon={faCloud} />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-orange-400 text-center mb-4">
              Cloud Storage
            </h3>
            <p className="text-gray-300 text-center">
              Secure cloud-based saving so your data is always accessible and
              backed up.
            </p>
          </div>

          {/* Card 4 */}

          {/* Card 5 */}

          {/* Card 6 */}
          <div className="bg-[#242424] p-10 rounded-xl shadow-lg border border-gray-700 relative">
            {/* Coming Soon Badge */}
            <span className="absolute top-3 right-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              Coming Soon
            </span>

            <div className="flex justify-center mb-6">
              <div className="bg-[#3a2a20] p-4 rounded-lg text-4xl text-orange-400">
                <FontAwesomeIcon icon={faTrophy} />
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-orange-400 text-center mb-4">
              Coding Contests
            </h3>

            <p className="text-gray-300 text-center">
              Participate in contests, rank up, and get detailed performance
              reports.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
