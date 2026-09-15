import React from 'react';
import { ActiveTab, DisplayMode } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Zap,
  Bell,
  User,
  Monitor,
  Smartphone,
  Sparkles,
  Layers,
  Sun,
  Moon,
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  onUploadClick?: () => void;
  onOpenOfficialReport?: () => void;
  onOpenAiAssistant?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  displayMode,
  setDisplayMode,
  onUploadClick,
  onOpenOfficialReport,
  onOpenAiAssistant,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('upload')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#006948] flex items-center justify-center text-white shadow-sm shadow-emerald-800/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  زینو
                </span>
                <span className="text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-[#006948] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  ENERGY
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                مدیریت و پایش هوشمند مصرف انرژی
              </span>
            </div>
          </div>

          {/* Tariff badge */}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#006948] dark:text-emerald-400 text-[11px] font-semibold border border-emerald-200/60 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006948] dark:bg-emerald-400 animate-pulse"></span>
            تعرفه ۱۴۰۵ توانیر
          </span>
        </div>

        {/* View mode switcher & Actions */}
        <div className="flex items-center gap-2">
          {/* AI Assistant Quick Trigger */}
          {onOpenAiAssistant && (
            <button
              type="button"
              onClick={onOpenAiAssistant}
              title="دستیار هوش مصنوعی زینو (گفتگوی صوتی زنده، چت و رونویسی)"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#006948] to-emerald-600 hover:from-[#005a3e] hover:to-emerald-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
              <span className="hidden sm:inline">دستیار هوشمند</span>
              <span className="sm:hidden">AI</span>
            </button>
          )}

          {/* Global Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'تغییر به حالت روز (روشن)' : 'تغییر به حالت شب (کاهش خستگی چشم)'}
            aria-label={theme === 'dark' ? 'تغییر به حالت روز' : 'تغییر به حالت شب'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span className="text-[11px] font-bold text-amber-300">روز</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span className="text-[11px] font-bold text-slate-700">شب</span>
              </>
            )}
          </button>

          {/* Display mode toggle (Desktop vs Mobile PWA Frame) */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setDisplayMode('desktop-view')}
              title="نمای داشبورد دسکتاپ (مشابه تصویر ۱)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                displayMode === 'desktop-view'
                  ? 'bg-white dark:bg-slate-700 text-[#006948] dark:text-emerald-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">نمای دسکتاپ</span>
            </button>
            <button
              onClick={() => setDisplayMode('mobile-view')}
              title="نمای اپلیکیشن موبایل (مشابه تصاویر ۲ تا ۱۶)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                displayMode === 'mobile-view'
                  ? 'bg-white dark:bg-slate-700 text-[#006948] dark:text-emerald-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">قاب موبایل</span>
            </button>
            <button
              onClick={() => setDisplayMode('responsive')}
              title="نمای تطبیقی کامل (تمام صفحه)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                displayMode === 'responsive'
                  ? 'bg-white dark:bg-slate-700 text-[#006948] dark:text-emerald-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">تمام صفحه</span>
            </button>
          </div>

          {/* Quick Upload Button */}
          {onUploadClick && (
            <button
              onClick={onUploadClick}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#006948] hover:bg-[#00855d] text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
            >
              <span>+</span>
              <span>بارگذاری قبض</span>
            </button>
          )}

          {/* Notifications */}
          <button
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 relative transition-colors"
            title="اعلان‌ها"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          {/* User profile */}
          <div className="flex items-center gap-2 pr-1 border-r border-slate-200 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">علی محمدی</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">کاربر سازمانی</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
