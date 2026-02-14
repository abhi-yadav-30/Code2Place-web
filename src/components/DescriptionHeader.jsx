import React from "react";
import { Info, History } from "lucide-react";

const DescriptionHeader = ({ activeTab, setActiveTab }) => {
  return (
    <div className="h-12 border-b border-white/5 flex items-center bg-[#0d0d0d] px-2">
      <button
        onClick={() => setActiveTab("description")}
        className={`px-6 h-full flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-all ${
          activeTab === "description"
            ? "text-orange-500 border-b-2 border-orange-500 bg-orange-500/5"
            : "text-gray-500 hover:text-gray-300"
        }`}
      >
        <Info size={14} />
        Description
      </button>

      <button
        onClick={() => setActiveTab("submissions")}
        className={`px-6 h-full flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-all ${
          activeTab === "submissions"
            ? "text-orange-500 border-b-2 border-orange-500 bg-orange-500/5"
            : "text-gray-500 hover:text-gray-300"
        }`}
      >
        <History size={14} />
        Submissions
      </button>
    </div>
  );
};

export default DescriptionHeader;
