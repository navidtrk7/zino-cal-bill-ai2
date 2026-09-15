import React, { useState } from 'react';
import { BillData } from '../types';
import { historicalPeriods } from '../data/mockData';
import {
  Calendar,
  ArrowDownLeft,
  AlertTriangle,
  Lightbulb,
  FileDown,
  ExternalLink,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  CheckCircle2,
  Building,
  Zap,
  Sparkles,
} from 'lucide-react';

interface DashboardViewProps {
  bill: BillData;
  onViewBillDetails: (periodName: string) => void;
  onViewSolutions: () => void;
  onViewForecast?: () => void;
  onAddNewBill: () => void;
  onOpenPdfReport: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  bill,
  onViewBillDetails,
  onViewSolutions,
  onViewForecast,
  onAddNewBill,
  onOpenPdfReport,
}) => {
  const [selectedRange, setSelectedRange] = useState<'3-months' | '6-months' | 'yearly'>('6-months');

  // 6-month chart data
  const monthsData = [
    { name: 'فروردین', low: 120, mid: 95, high: 50, cost: 890, totalKwh: 265 },
    { name: 'اردیبهشت', low: 135, mid: 100, high: 55, cost: 980, totalKwh: 290 },
    { name: 'خرداد', low: 140, mid: 110, high: 65, cost: 1150, totalKwh: 315 },
    { name: 'تیر', low: 180, mid: 150, high: 110, cost: 1680, totalKwh: 440 },
    { name: 'مرداد', low: 165, mid: 135, high: 90, cost: 1420, totalKwh: 390 },
    { name: 'شهریور', low: 155, mid: 120, high: 75, cost: 1280, totalKwh: 350, current: true },
  ];

  const maxKwh = 500;

  return (
    <div className="w-full max-w-xl mx-auto py-2 px-3 sm:px-4 space-y-4">
      {/* Property Header & Sub-selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-[#006948] border border-emerald-200 shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900">
                  {bill.title}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#006948] text-[10px] font-bold border border-emerald-200">
                  اشتراک دیماندی فعال
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                شناسه قبض: {bill.subscriptionNumber} • تعرفه {bill.tariffType}
              </span>
            </div>
          </div>
        </div>

        {/* Time Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setSelectedRange('3-months')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all text-center ${
              selectedRange === '3-months'
                ? 'bg-white text-[#006948] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ۳ دوره اخیر
          </button>
          <button
            onClick={() => setSelectedRange('6-months')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all text-center ${
              selectedRange === '6-months'
                ? 'bg-white text-[#006948] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ۶ ماهه نخست ۱۴۰۳
          </button>
          <button
            onClick={() => setSelectedRange('yearly')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all text-center ${
              selectedRange === 'yearly'
                ? 'bg-white text-[#006948] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            مقایسه سالانه (۱۴۰۲ - ۱۴۰۳)
          </button>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100">
          <div className="text-center p-2 rounded-xl bg-slate-50">
            <span className="text-[11px] text-slate-500 block">میانگین ماهانه</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className="font-mono font-black text-slate-800 text-xs sm:text-sm">
                ۱,۳۴۰,۰۰۰
              </span>
              <span className="text-[10px] text-emerald-700 font-mono">↓۴.۰٪</span>
            </div>
          </div>

          <div className="text-center p-2 rounded-xl bg-amber-50/70 border border-amber-100">
            <span className="text-[11px] text-amber-800 block">ضریب توان (Cos φ)</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className="font-mono font-black text-amber-900 text-xs sm:text-sm">
                ۰.۸۱
              </span>
              <span className="text-[10px] text-amber-700">نیاز خازن</span>
            </div>
          </div>

          <div className="text-center p-2 rounded-xl bg-red-50/70 border border-red-100">
            <span className="text-[11px] text-red-800 block">جریمه راکتیو کل</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className="font-mono font-black text-red-700 text-xs sm:text-sm">
                ۱,۶۵۰,۰۰۰
              </span>
              <span className="text-[10px] text-red-600 font-bold">۱۰۰٪ حذف</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Month Stacked Consumption & Cost Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#006948]" />
              <span>روند مصرف و بهای ۶ دوره</span>
            </h2>
            <span className="text-[11px] text-slate-400">
              تفکیک مصرف ۳ زمانه بر حسب کیلووات‌ساعت
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#006948] text-[10px] font-bold border border-emerald-200">
            شهریور: جاری
          </span>
        </div>

        {/* Visual Stacked Bar Chart */}
        <div className="relative pt-6 pb-2">
          {/* Y Axis Guide Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30 text-[9px] font-mono text-slate-400">
            <div className="border-b border-dashed border-slate-300 w-full flex justify-end">۵۰۰ kWh</div>
            <div className="border-b border-dashed border-slate-300 w-full flex justify-end">۳۵۰ kWh</div>
            <div className="border-b border-dashed border-slate-300 w-full flex justify-end">۲۰۰ kWh</div>
            <div className="border-b border-slate-200 w-full flex justify-end">۰</div>
          </div>

          {/* Bars */}
          <div className="relative z-10 flex items-end justify-between h-48 px-2">
            {monthsData.map((m, idx) => {
              const lowH = (m.low / maxKwh) * 160;
              const midH = (m.mid / maxKwh) * 160;
              const highH = (m.high / maxKwh) * 160;
              const totalH = lowH + midH + highH;

              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded font-mono pointer-events-none z-20">
                    {m.totalKwh} kWh • {m.cost.toLocaleString('fa-IR')} ت
                  </div>

                  {/* Stacked bar column */}
                  <div className="w-6 sm:w-8 flex flex-col justify-end rounded-t-md overflow-hidden bg-slate-100 transition-all group-hover:scale-105">
                    {/* High peak */}
                    <div
                      style={{ height: `${highH}px` }}
                      className="w-full bg-amber-500"
                      title={`اوج‌بار: ${m.high} kWh`}
                    />
                    {/* Mid peak */}
                    <div
                      style={{ height: `${midH}px` }}
                      className="w-full bg-emerald-500"
                      title={`میان‌بار: ${m.mid} kWh`}
                    />
                    {/* Low peak */}
                    <div
                      style={{ height: `${lowH}px` }}
                      className="w-full bg-[#006948]"
                      title={`کم‌باری: ${m.low} kWh`}
                    />
                  </div>

                  {/* Month label */}
                  <span
                    className={`text-[10px] font-medium mt-1 ${
                      m.current ? 'font-bold text-[#006948]' : 'text-slate-500'
                    }`}
                  >
                    {m.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-3 border-t border-slate-100 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#006948]"></span>
            کم‌باری
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500"></span>
            میان‌باری
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500"></span>
            اوج‌بار
          </span>
          <span className="flex items-center gap-1 mr-2 text-slate-800 font-bold">
            <span className="w-4 h-0.5 bg-slate-800"></span>
            مبلغ کل (تومان)
          </span>
        </div>
      </div>

      {/* Two Periods Direct Comparison Card (شهریور vs مرداد) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#006948]" />
            <span>مقایسه مستقیم دو دوره</span>
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
            ۱۲٪ کاهش هزینه
          </span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
          {/* Header Row */}
          <div className="grid grid-cols-2 bg-slate-50 py-2.5 px-3 text-slate-700 font-bold text-center">
            <div className="flex items-center justify-center gap-1 text-[#006948]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>دوره مبنا (جاری): شهریور ۱۴۰۳</span>
            </div>
            <div className="text-slate-600">دوره مقایسه: مرداد ۱۴۰۳</div>
          </div>

          {/* Row: Days & Daily consumption */}
          <div className="grid grid-cols-2 py-2.5 px-3 text-center">
            <div>
              <span className="text-slate-500 block text-[10px]">روزهای دوره / مصرف روزانه</span>
              <span className="font-mono font-bold text-slate-800 mt-0.5 block">
                ۳۲ روز (۱۰.۹ kWh/d)
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">روزهای دوره / مصرف روزانه</span>
              <span className="font-mono font-medium text-slate-600 mt-0.5 block">
                ۳۰ روز (۱۲.۴ kWh/d)
              </span>
            </div>
          </div>

          {/* Row: Reactive penalty */}
          <div className="grid grid-cols-2 py-2.5 px-3 text-center bg-red-50/30">
            <div>
              <span className="text-red-700 block text-[10px] font-medium">جریمه راکتیو توان</span>
              <span className="font-mono font-bold text-red-700 mt-0.5 block">
                ۳۲۵,۰۰۰ تومان
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">جریمه راکتیو توان</span>
              <span className="font-mono font-medium text-slate-600 mt-0.5 block">
                ۴۱۰,۰۰۰ تومان
              </span>
            </div>
          </div>

          {/* Row: Final bill amount */}
          <div className="grid grid-cols-2 py-2.5 px-3 text-center bg-slate-50/50">
            <div>
              <span className="text-slate-500 block text-[10px]">بهای نهایی قبض</span>
              <span className="font-mono font-black text-[#006948] text-sm mt-0.5 block">
                ۱,۲۸۰,۰۰۰ تومان
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">بهای نهایی قبض</span>
              <span className="font-mono font-semibold text-slate-600 text-sm mt-0.5 block">
                ۱,۴۲۰,۰۰۰ تومان
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Zino Smart Audit Recommendation Callout */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-[#006948] text-white shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="flex-1 text-right">
          <h3 className="text-xs font-bold text-emerald-950 mb-1">
            پیشنهاد هوشمند ممیزی زینو
          </h3>
          <p className="text-xs text-emerald-900 leading-relaxed">
            تحلیل ۶ ماهه نشان می‌دهد نصب بانک خازنی هوشمند زینو می‌توانست مانع
            اتلاف <strong>۲.۴ میلیون تومان</strong> در این دوره‌ها شود.
          </p>
          <button
            onClick={onViewSolutions}
            className="mt-2 text-xs font-bold text-[#006948] hover:text-emerald-900 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>مشاهده راهکار پیشنهادی و استعلام تجهیزات</span>
            <span>←</span>
          </button>
        </div>
      </div>

      {/* Future Bill Forecast Card */}
      {onViewForecast && (
        <div className="bg-white border-2 border-emerald-500/40 hover:border-emerald-600 rounded-2xl p-4 sm:p-5 shadow-xs transition-all text-right flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006948] flex items-center justify-center border border-emerald-200 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  پیش‌بینی هوشمند قبض دوره آینده (مهر ۱۴۰۳)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#006948] text-[10px] font-bold border border-emerald-200">
                  ماژول جدید
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                محاسبه پیش‌بینانه مبلغ صورتحساب بر اساس تغییر فصل و شبیه‌سازی سود خالص حذف جریمه توان راکتیو.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onViewForecast}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <span>مشاهده پیش‌بینی</span>
            <ArrowDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Bill Archive List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900">
            لیست آرشیو قبوض
          </h2>
          <span className="text-[11px] text-slate-400">۴ دوره ثبت‌شده</span>
        </div>

        <div className="space-y-2.5">
          {historicalPeriods.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50/50 hover:bg-white transition-all text-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      item.statusColor === 'critical'
                        ? 'bg-red-500'
                        : item.statusColor === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                  />
                  <span className="font-bold text-slate-800">
                    {item.periodName}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono">
                  دوره {item.days} روزه
                </span>
              </div>

              <div className="flex items-center justify-between my-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">مبلغ پرداختی:</span>
                  <span className="font-mono font-black text-slate-900 text-sm">
                    {item.totalAmount.toLocaleString('fa-IR')}{' '}
                    <span className="text-[10px] text-slate-500 font-normal">تومان</span>
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    item.statusColor === 'critical'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : item.statusColor === 'warning'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {item.statusTag}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 mt-2">
                <button
                  type="button"
                  onClick={onOpenPdfReport}
                  className="flex-1 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>دانلود PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => onViewBillDetails(item.periodName)}
                  className="flex-1 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#006948] font-bold flex items-center justify-center gap-1.5 transition-colors border border-emerald-200/60 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>مشاهده گزارش تحلیلی</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add new bill button */}
        <button
          type="button"
          onClick={onAddNewBill}
          className="w-full mt-3 h-10 rounded-xl border border-dashed border-emerald-600/60 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 text-[#006948] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>افزودن و اسکن قبض دوره جدید</span>
        </button>
      </div>
    </div>
  );
};
