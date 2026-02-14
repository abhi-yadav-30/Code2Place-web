import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { setEditorTheme } from "../store/utilesSlice";

const themes = [
  { label: "Light", value: "vs" },
  { label: "Dark", value: "vs-dark" },
  { label: "Contrast", value: "hc-black" },
];

const EditorThemeSelect = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.utiles.editorTheme);

    const handleThemeChange = (e) => {
      dispatch(setEditorTheme(e.target.value));
    };

    return (
      <div className="relative">
        <select
          value={theme}
          onChange={handleThemeChange}
          className="appearance-none bg-white/5 border border-white/10 text-gray-400 font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl focus:outline-none focus:border-orange-500/50 hover:bg-white/10 hover:text-white transition-all cursor-pointer min-w-[100px] text-center"
        >
          {themes.map((t) => (
            <option
              key={t.value}
              value={t.value}
              className="bg-[#0f0f0f] text-gray-300 py-4"
            >
              {t.label}
            </option>
          ))}
        </select>
      </div>
    );
}

export default EditorThemeSelect;
