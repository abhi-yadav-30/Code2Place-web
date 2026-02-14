import React from 'react'
import SelectLang from './SelectLang';
import EditorThemeSelect from './EditorThemeSelect';
import { Terminal } from 'lucide-react';

const EditorHead = () => {
  return (
    <div className="h-12 border-b border-white/5 px-6 flex items-center justify-between bg-[#0f0f0f]">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-orange-500/10 rounded flex items-center justify-center">
          <Terminal size={14} className="text-orange-500" />
        </div>
        <span className="text-gray-300 font-black text-xs uppercase tracking-[0.2em]">
          Source Code
        </span>
      </div>

      <div className="flex items-center gap-4">
        <EditorThemeSelect />
        <div className="w-px h-4 bg-white/10" />
        <SelectLang />
      </div>
    </div>
  );
}

export default EditorHead;
