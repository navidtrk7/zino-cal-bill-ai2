import React from 'react';
import { ActiveTab, DisplayMode } from '../types';
import {
  Zap,
  Bell,
  User,
  Monitor,
  Smartphone,
  Sparkles,
  Layers,
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  onUploadClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  displayMode,
  setDisplayMode,
  onUploadClick,
}) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-2.5">
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
                <span className="text-lg font-black text-slate-900 tracking-tight">
                  زینو
                </span>
                <span className="text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-[#006948] border border-emerald-200">
                  ENERGY
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                مدیریت و پایش هوشمند مصرف انرژی
              </span>
            </div>
          </div>

          {/* Tariff badge */}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[#006948] text-[11px] font-semibold border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006948] animate-pulse"></span>
            تعرفه ۱۴۰۵ توانیر
          </span>
        </div>

        {/* View mode switcher & Actions */}
        <div className="flex items-center gap-2">
          {/* Display mode toggle (Desktop vs Mobile PWA Frame) */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setDisplayMode('desktop-view')}
              title="نمای داشبورد دسکتاپ (مشابه تصویر ۱)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                displayMode === 'desktop-view'
                  ? 'bg-white text-[#006948] shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
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
                  ? 'bg-white text-[#006948] shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
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
                  ? 'bg-white text-[#006948] shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">تمام صفحه</span>
            </button>
          </div>

          {/* Quick Upload Button */}
          <button
            onClick={onUploadClick}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#006948] hover:bg-[#00855d] text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
          >
            <span>+</span>
            <span>بارگذاری قبض</span>
          </button>

          {/* Notifications */}
          <button
            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 relative transition-colors"
            title="اعلان‌ها"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
          </button>

          {/* User profile */}
          <div className="flex items-center gap-2 pr-1 border-r border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800">علی محمدی</span>
              <span className="text-[10px] text-slate-500">کاربر سازمانی</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
