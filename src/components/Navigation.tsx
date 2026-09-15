import React from 'react';
import { ActiveTab } from '../types';
import {
  ScanLine,
  TrendingDown,
  Lightbulb,
  FileText,
  LayoutDashboard,
  Cpu,
} from 'lucide-react';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMobileShell?: boolean;
}

export const MobileTabBar: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    {
      id: 'ocr-result' as ActiveTab,
      label: 'تحلیل قبض',
      icon: ScanLine,
      badge: null,
    },
    {
      id: 'reports-roi' as ActiveTab,
      label: 'گزارش و ROI',
      icon: TrendingDown,
      badge: null,
    },
    {
      id: 'solutions' as ActiveTab,
      label: 'راهکارها',
      icon: Lightbulb,
      badge: 'ویژه',
    },
    {
      id: 'audit' as ActiveTab,
      label: 'ممیزی بارها',
      icon: Cpu,
      badge: null,
    },
    {
      id: 'official-report' as ActiveTab,
      label: 'سند رسمی',
      icon: FileText,
      badge: null,
    },
  ];

  return (
    <nav className="w-full bg-white border-t border-slate-200 py-1.5 px-2 flex items-center justify-around z-30 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative min-w-[56px] ${
              isActive
                ? 'text-[#006948] font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            {isActive && (
              <span className="absolute -top-1.5 w-6 h-0.5 bg-[#006948] rounded-full" />
            )}
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                }`}
              />
              {tab.badge && (
                <span className="absolute -top-1 -right-2 text-[8px] bg-amber-500 text-white px-1 rounded-full font-bold">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 whitespace-nowrap">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export const DesktopSidebar: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navItems = [
    {
      id: 'upload' as ActiveTab,
      label: 'بارگذاری و اسکن قبض',
      icon: ScanLine,
      desc: 'ورود تصویر یا PDF قبض برق',
    },
    {
      id: 'ocr-result' as ActiveTab,
      label: 'تحلیل اولیه قبض (OCR)',
      icon: LayoutDashboard,
      desc: 'استخراج هوشمند مقادیر و ارقام',
    },
    {
      id: 'reports-roi' as ActiveTab,
      label: 'گزارش و عارضه‌یابی تفکیکی',
      icon: TrendingDown,
      desc: 'جریمه راکتیو و بهای پیک بار',
    },
    {
      id: 'dashboard' as ActiveTab,
      label: 'داشبورد ادوار و آرشیو قبوض',
      icon: LayoutDashboard,
      desc: 'روند ۶ دوره و مقایسه مستقیم',
    },
    {
      id: 'solutions' as ActiveTab,
      label: 'راهکارها و شبیه‌سازی ROI',
      icon: Lightbulb,
      desc: 'بانک خازنی، BESS و برآورد سود',
    },
    {
      id: 'audit' as ActiveTab,
      label: 'ممیزی موتورخانه و بارهای القایی',
      icon: Cpu,
      desc: 'پایش چیلرها، بوسترپمپ و آسانسور',
    },
    {
      id: 'official-report' as ActiveTab,
      label: 'سند رسمی و گزارش تحلیلی PDF',
      icon: FileText,
      desc: 'نسخه ممهور و تاییدیه مهندسی',
    },
  ];

  return (
    <aside className="w-64 bg-white border-l border-slate-200 flex flex-col p-4 shrink-0">
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
        منوی سامانه‌های تحلیلی زینو
      </div>
      <div className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-start gap-3 p-2.5 rounded-xl text-right transition-all group ${
                isActive
                  ? 'bg-emerald-50 text-[#006948] font-bold border border-emerald-200/70 shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg mt-0.5 transition-colors ${
                  isActive
                    ? 'bg-[#006948] text-white'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold leading-snug">
                  {item.label}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-500 mt-0.5">
                  {item.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-200">
        <div className="bg-emerald-50/70 rounded-xl p-3 border border-emerald-200/60">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>دپارتمان ممیزی فنی زینو</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            محاسبات منطبق با آخرین الگوریتم ابلاغی تعرفه شرکت توانیر.
          </p>
          <div className="mt-2 text-[10px] font-mono font-medium text-emerald-700">
            تلفن هماهنگی: ۰۲۱-۸۸۷۸۵۹۵۶
          </div>
        </div>
      </div>
    </aside>
  );
};
