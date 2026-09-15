import React from 'react';
import { BillData } from '../types';
import {
  TrendingDown,
  TrendingUp,
  Leaf,
  Coins,
  Zap,
  AlertTriangle,
  ArrowLeft,
  Building,
  Sparkles,
  ShieldAlert,
  Clock,
  FileSpreadsheet,
} from 'lucide-react';

interface ReportsRoiViewProps {
  bill: BillData;
  onViewSolutions: () => void;
  onViewAudit: () => void;
}

export const ReportsRoiView: React.FC<ReportsRoiViewProps> = ({
  bill,
  onViewSolutions,
  onViewAudit,
}) => {
  // Cos phi calculations for circular gauge
  const gaugeRadius = 46;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const cosValue = bill.cosPhi;
  // 0 to 1 mapping
  const strokeDashoffset = gaugeCircumference - cosValue * gaugeCircumference;

  return (
    <div className="w-full max-w-xl mx-auto py-2 px-3 sm:px-4 space-y-4">
      {/* Property & Identity Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-[#006948] border border-emerald-200 shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900">
                  {bill.title}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#006948] text-[11px] font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  فعال
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {bill.tariffType} • شناسه پرونده: {bill.subscriptionNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Technical Specs Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-medium">
            نوع انشعاب: <span className="font-bold text-slate-800">{bill.connectionType}</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-medium">
            دیماند قراردادی: <span className="font-bold text-slate-800 font-mono">{bill.contractedDemand}</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-medium">
            سطح ولتاژ: <span className="font-bold text-slate-800">{bill.voltageLevel}</span>
          </div>
        </div>
      </div>

      {/* 3 KPI Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* KPI 1: Savings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 text-center shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-600">صرفه‌جویی</span>
            <span className="inline-flex items-center text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
              <TrendingDown className="w-2.5 h-2.5 ml-0.5 inline" />
              ۲۴٪
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006948] mx-auto flex items-center justify-center my-1">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-sm sm:text-base font-mono font-black text-slate-900 leading-tight">
              {bill.savingsOpportunity.toLocaleString('fa-IR')}
            </span>
            <span className="text-[10px] text-slate-400">تومان</span>
          </div>
        </div>

        {/* KPI 2: Monthly Cost */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 text-center shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-600">هزینه دوره</span>
            <span className="inline-flex items-center text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
              <TrendingDown className="w-2.5 h-2.5 ml-0.5 inline" />
              ۱۲٪
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006948] mx-auto flex items-center justify-center my-1">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-sm sm:text-base font-mono font-black text-slate-900 leading-tight">
              {bill.totalAmount.toLocaleString('fa-IR')}
            </span>
            <span className="text-[10px] text-slate-400">تومان</span>
          </div>
        </div>

        {/* KPI 3: Total Consumption */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 text-center shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-600">مصرف کل</span>
            <span className="inline-flex items-center text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
              <TrendingUp className="w-2.5 h-2.5 ml-0.5 inline" />
              ۷٪
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 mx-auto flex items-center justify-center my-1">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-sm sm:text-base font-mono font-black text-slate-900 leading-tight">
              {bill.activeEnergyTotal.toLocaleString('fa-IR')}
            </span>
            <span className="text-[10px] text-slate-400">کیلووات‌ساعت</span>
          </div>
        </div>
      </div>

      {/* تفکیک مصرف دوره‌ای (3-Tier Consumption Bar) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#006948]"></div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900">
              تفکیک مصرف دوره‌ای
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-mono font-medium">
            دوره {bill.periodDays} روزه
          </span>
        </div>

        {/* Segmented color bar */}
        <div className="w-full h-4 rounded-xl overflow-hidden flex gap-0.5 bg-slate-100 p-0.5 mb-3">
          <div
            className="h-full bg-[#006948] rounded-r-lg transition-all"
            style={{ width: '45%' }}
            title="کم‌باری: ۴۵٪"
          />
          <div
            className="h-full bg-emerald-400 transition-all"
            style={{ width: '20%' }}
            title="میان‌بار: ۲۰٪"
          />
          <div
            className="h-full bg-amber-600 rounded-l-lg transition-all"
            style={{ width: '35%' }}
            title="اوج‌بار: ۳۵٪"
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs pb-3 border-b border-slate-100">
          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1 text-slate-600 font-medium text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#006948]"></span>
              کم‌باری (۴۵٪)
            </span>
            <span className="font-mono font-bold text-slate-800 text-xs mt-0.5">
              ۱۵۸ kWh
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1 text-slate-600 font-medium text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              میان‌باری (۲۰٪)
            </span>
            <span className="font-mono font-bold text-slate-800 text-xs mt-0.5">
              ۷۰ kWh
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1 text-amber-800 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              اوج‌بار (۳۵٪)
            </span>
            <span className="font-mono font-black text-amber-700 text-xs mt-0.5">
              ۱۲۲ kWh
            </span>
          </div>
        </div>

        {/* Warning callout */}
        <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-2 text-amber-900 text-xs leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            سهم اوج‌بار بیش از حد مجاز الگوی تجاری است و مشمول تعرفه ضریب ۲.۵
            برابری گردیده است.
          </span>
        </div>
      </div>

      {/* ضریب توان (Cos φ) & جریمه توان راکتیو */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>ضریب توان (Cos φ)</span>
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold">
            مشمول جریمه راکتیو
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* 2D Circular Gauge */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={gaugeRadius}
                stroke="#fee2e2"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r={gaugeRadius}
                stroke="#dc2626"
                strokeWidth="8"
                strokeDasharray={gaugeCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-mono font-black text-red-700 leading-none">
                ۰.۷۸
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                حد مجاز: ۰.۹۰
              </span>
            </div>
          </div>

          <div className="text-right">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
              جریمه توان راکتیو
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              به دلیل عدم استفاده از بانک خازنی مناسب، شرکت توزیع برق ماهانه هزینه
              مازاد به عنوان «بهای انرژی راکتیو» از اشتراک شما کسر می‌کند.
            </p>
            <button
              onClick={onViewAudit}
              className="mt-2 text-[11px] text-[#006948] hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>مشاهده ممیزی بارهای القایی موتورخانه</span>
              <ArrowLeft className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* عارضه‌یابی و آنالیز هزینه‌ها */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900">
            عارضه‌یابی و آنالیز هزینه‌ها
          </h2>
          <span className="text-[11px] text-slate-400">واحد: تومان</span>
        </div>

        <div className="space-y-2.5">
          {/* Row 1: Reactive penalty */}
          <div className="p-3 rounded-xl bg-red-50/70 border border-red-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-red-900">
                  جریمه توان راکتیو (تلفات)
                </span>
                <span className="text-[10px] text-red-600 font-medium">
                  قابلیت حذف ۱۰۰٪ با بانک خازنی
                </span>
              </div>
            </div>
            <div className="text-left font-mono font-black text-red-700 text-sm">
              {bill.reactivePenalty.toLocaleString('fa-IR')}
            </div>
          </div>

          {/* Row 2: Peak hours cost */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-amber-900">
                  بهای مصرف ساعات اوج بار
                </span>
                <span className="text-[10px] text-amber-700 font-medium">
                  نرخ تصاعدی ویژه پیک تابستان
                </span>
              </div>
            </div>
            <div className="text-left font-mono font-black text-amber-800 text-sm">
              {bill.peakHoursCost.toLocaleString('fa-IR')}
            </div>
          </div>

          {/* Row 3: Base energy cost */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800">
                  بهای انرژی پایه و ترانزیت
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  ساعات عادی و کم‌باری شبکه
                </span>
              </div>
            </div>
            <div className="text-left font-mono font-black text-slate-800 text-sm">
              {bill.baseEnergyCost.toLocaleString('fa-IR')}
            </div>
          </div>
        </div>
      </div>

      {/* Green Energy Banner */}
      <div className="bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white text-[#006948] flex items-center justify-center border border-emerald-100 shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <span className="text-[10px] text-emerald-800 font-bold block">
            راهکار هوشمند زینو
          </span>
          <h3 className="text-xs sm:text-sm font-black text-emerald-950">
            آینده روشن‌تر با انرژی سبز
          </h3>
          <p className="text-[11px] text-emerald-800 mt-0.5">
            نصب بانک خازنی اتوماتیک هوشمند زینو، هزینه راکتیو شما را از دوره آینده
            صفر می‌کند.
          </p>
        </div>
      </div>

      {/* CTA Button to Solutions */}
      <button
        type="button"
        onClick={onViewSolutions}
        className="w-full h-12 bg-[#006948] hover:bg-[#00855d] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-sm cursor-pointer"
      >
        <span>مشاهده راهکار پیشنهادی زینو و ROI</span>
        <ArrowLeft className="w-4 h-4" />
      </button>
    </div>
  );
};
