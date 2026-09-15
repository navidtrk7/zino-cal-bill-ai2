import React, { useState } from 'react';
import { Sparkles, Mic, PhoneCall, Bot, MessageSquare } from 'lucide-react';

interface FloatingAiButtonProps {
  onOpen: (tab?: 'chat' | 'live' | 'transcribe') => void;
}

export const FloatingAiButton: React.FC<FloatingAiButtonProps> = ({ onOpen }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 flex flex-col items-start gap-2">
      {/* Quick Action Mini Bar when hovered */}
      {isHovered && (
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <button
            onClick={() => onOpen('live')}
            title="گفتگوی صوتی زنده (Live API)"
            className="p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-600 dark:text-amber-400 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="hidden sm:inline">گفتگوی صوتی</span>
          </button>

          <button
            onClick={() => onOpen('transcribe')}
            title="تبدیل گفتار به متن"
            className="p-2 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/40 text-sky-600 dark:text-sky-400 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">تبدیل صوت</span>
          </button>

          <button
            onClick={() => onOpen('chat')}
            title="چت هوشمند قبض"
            className="p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-[#006948] dark:text-emerald-400 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">چت هوشمند</span>
          </button>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => onOpen('chat')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="دستیار هوشمند انرژی زینو"
        className="group relative flex items-center gap-2.5 px-3.5 py-3 rounded-2xl bg-gradient-to-r from-[#006948] to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer border border-emerald-400/40"
      >
        {/* Pulsing indicator ring */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
        </span>

        <div className="flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-emerald-200 group-hover:rotate-12 transition-transform" />
        </div>

        <div className="text-right leading-none hidden sm:block">
          <span className="text-xs font-black block">دستیار هوش مصنوعی</span>
          <span className="text-[10px] text-emerald-100 font-mono">Gemini Copilot</span>
        </div>
      </button>
    </div>
  );
};
