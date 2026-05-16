import { useDispatch } from "react-redux";
import { setLanguage } from "../store/utilesSlice";
import React from "react";

export function getDSALanguages() {
  return [
    { label: "JavaScript", value: JSON.stringify({ monaco: "javascript", judge: 63 }) },
    { label: "Python", value: JSON.stringify({ monaco: "python", judge: 71 }) },
    { label: "C++", value: JSON.stringify({ monaco: "cpp", judge: 105 }) },
    { label: "C", value: JSON.stringify({ monaco: "c", judge: 104 }) },
    { label: "Java", value: JSON.stringify({ monaco: "java", judge: 91 }) },
    { label: "Go", value: JSON.stringify({ monaco: "go", judge: 60 }) },
    { label: "C#", value: JSON.stringify({ monaco: "csharp", judge: 51 }) },
    { label: "Rust", value: JSON.stringify({ monaco: "rust", judge: 73 }) },
  ];
}

export default function SelectLang() {
  const dispatch = useDispatch();
  const languages = getDSALanguages();

  const handleChange = (e) => {
    const value = JSON.parse(e.target.value);
    dispatch(setLanguage(value));
  };

  return (
    <div className="relative group">
      <select
        onChange={handleChange}
        className="appearance-none bg-white/5 border border-white/10 text-gray-400 font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl focus:outline-none focus:border-orange-500/50 hover:bg-white/10 hover:text-white transition-all cursor-pointer min-w-[120px] text-center"
      >
        {languages.map((lang, idx) => (
          <option key={idx} value={lang.value} className="bg-[#0f0f0f] text-gray-300 py-4">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
