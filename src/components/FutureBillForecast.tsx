import React, { useState, useMemo } from 'react';
import { BillData } from '../types';
import {
  TrendingDown,
  TrendingUp,
  Zap,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  Sparkles,
  DollarSign,
  Sun,
  Snowflake,
  Wind,
  Layers,
  FileSpreadsheet,
  Building,
  Clock,
  Check,
} from 'lucide-react';

interface FutureBillForecastProps {
  bill: BillData;
  onViewSolutions: () => void;
  onViewAudit: () => void;
  onOpenReport: () => void;
}

export const FutureBillForecast: React.FC<FutureBillForecastProps> = ({
  bill,
  onViewSolutions,
  onViewAudit,
  onOpenReport,
}) => {
  // Target month selection
  const [targetMonth, setTargetMonth] = useState<'mehr' | 'aban' | 'azar'>('mehr');

  // Seasonal preset selection
  const [seasonalPreset, setSeasonalPreset] = useState<'autumn-mild' | 'late-heat' | 'early-cold' | 'custom'>('autumn-mild');
  const [customTrendPercent, setCustomTrendPercent] = useState<number>(-22);

  // Power factor & reactive penalty strategy
  const [strategy, setStrategy] = useState<'status-quo' | 'zino-capacitor' | 'zino-full'>('zino-capacitor');

  // Peak shift slider (0 to 30% shift from peak to off-peak)
  const [peakShiftPercent, setPeakShiftPercent] = useState<number>(15);

  // Determine active trend percent based on preset
  const activeTrendPercent = useMemo(() => {
    switch (seasonalPreset) {
      case 'autumn-mild':
        return targetMonth === 'mehr' ? -22 : targetMonth === 'aban' ? -28 : -20;
      case 'late-heat':
        return targetMonth === 'mehr' ? -8 : targetMonth === 'aban' ? -18 : -15;
      case 'early-cold':
        return targetMonth === 'mehr' ? -35 : targetMonth === 'aban' ? -32 : -18;
      case 'custom':
        return customTrendPercent;
    }
  }, [seasonalPreset, targetMonth, customTrendPercent]);

  // Target month display text
  const targetMonthLabel = useMemo(() => {
    switch (targetMonth) {
      case 'mehr':
        return 'مهر ۱۴۰۳ (دوره ۷)';
      case 'aban':
        return 'آبان ۱۴۰۳ (دوره ۸)';
      case 'azar':
        return 'آذر ۱۴۰۳ (دوره ۹)';
    }
  }, [targetMonth]);

  // Calculations for Forecast:
  // Baseline figures from current bill
  const currentTotal = bill.totalAmount;
  const currentReactive = bill.reactivePenalty;
  const currentBase = bill.baseEnergyCost;
  const currentPeak = bill.peakHoursCost;
  const currentTax = bill.taxAndDuties;
  const currentKwh = bill.activeEnergyTotal;
  const currentCosPhi = bill.cosPhi;

  // 1. Scenario: Status Quo (بدون مداخله - ادامه وضع موجود)
  const statusQuo = useMemo(() => {
    // Energy changes by seasonal trend
    const energyRatio = 1 + activeTrendPercent / 100;
    const projectedKwh = Math.round(currentKwh * energyRatio);

    // In autumn (mehr), summer peak coefficient is removed (reduction of ~15% on peak rate)
    const seasonalPeakDiscount = targetMonth === 'mehr' || targetMonth === 'aban' || targetMonth === 'azar' ? 0.85 : 1.0;
    const projectedBase = Math.round(currentBase * energyRatio);
    const projectedPeak = Math.round(currentPeak * energyRatio * seasonalPeakDiscount);

    // Reactive penalty: Cos phi remains low (0.78), reactive load tracks base equipment
    // Slightly reduced proportional to chillers, but penalty persists
    const reactiveRatio = Math.max(0.7, energyRatio);
    const projectedReactive = Math.round(currentReactive * reactiveRatio);

    // Tax and duties (standard ~12% in Tavanir bills)
    const subtotal = projectedBase + projectedPeak + projectedReactive;
    const projectedTax = Math.round(subtotal * 0.125);
    const total = subtotal + projectedTax;

    return {
      kwh: projectedKwh,
      cosPhi: currentCosPhi,
      baseCost: projectedBase,
      peakCost: projectedPeak,
      reactiveCost: projectedReactive,
      taxCost: projectedTax,
      totalAmount: total,
    };
  }, [activeTrendPercent, targetMonth, currentKwh, currentBase, currentPeak, currentReactive, currentCosPhi]);

  // 2. Scenario: Zino Optimization (بانک خازنی هوشمند و مدیریت بار)
  const zinoOptimized = useMemo(() => {
    const energyRatio = 1 + activeTrendPercent / 100;
    let projectedKwh = Math.round(currentKwh * energyRatio);

    const seasonalPeakDiscount = 0.85;
    let projectedBase = Math.round(currentBase * energyRatio);
    let projectedPeak = Math.round(currentPeak * energyRatio * seasonalPeakDiscount);

    // Reactive penalty is ELIMINATED (100% saved) because Cos phi >= 0.95
    const projectedReactive = 0;
    const projectedCosPhi = 0.96;

    // Additional peak load shift if full optimization package is selected
    if (strategy === 'zino-full') {
      const shiftFactor = peakShiftPercent / 100;
      // Shift peak to low peak saves difference in tariffs
      const peakSaving = Math.round(projectedPeak * shiftFactor * 0.45);
      projectedPeak = Math.max(0, projectedPeak - peakSaving);
      // Small efficiency improvement from power factor correction reduces line losses by 2%
      projectedBase = Math.round(projectedBase * 0.98);
      projectedKwh = Math.round(projectedKwh * 0.98);
    }

    const subtotal = projectedBase + projectedPeak + projectedReactive;
    const projectedTax = Math.round(subtotal * 0.125);
    const total = subtotal + projectedTax;

    return {
      kwh: projectedKwh,
      cosPhi: projectedCosPhi,
      baseCost: projectedBase,
      peakCost: projectedPeak,
      reactiveCost: projectedReactive,
      taxCost: projectedTax,
      totalAmount: total,
    };
  }, [activeTrendPercent, strategy, peakShiftPercent, currentKwh, currentBase, currentPeak]);

  // Active projection depending on user's selected strategy
  const activeProjection = strategy === 'status-quo' ? statusQuo : zinoOptimized;

  // Comparison metrics vs current bill
  const deltaVsCurrent = activeProjection.totalAmount - currentTotal;
  const deltaPercent = Math.round((deltaVsCurrent / currentTotal) * 100);

  // Direct savings between status quo and zino in next month
  const nextMonthZinoSaving = statusQuo.totalAmount - zinoOptimized.totalAmount;
  const nextMonthReactiveElimination = statusQuo.reactiveCost;

  // Annualized cumulative reactive penalty loss if no action is taken
  const annualizedReactiveLoss = currentReactive * 12;

  return (
    <div className="w-full max-w-xl mx-auto py-2 px-3 sm:px-4 space-y-4">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-[#006948] border border-emerald-200 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900">
                  پیش‌بینی هوشمند صورتحساب دوره آینده
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                برآورد بر مبنای روند اقلیمی فصلی و الگوریتم جریمه توان راکتیو توانیر
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#006948] text-[11px] font-bold border border-emerald-200/70 shrink-0">
            {targetMonthLabel}
          </span>
        </div>

        {/* Target Month Selector Pills */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
            دوره هدف پیش‌بینی:
          </span>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs flex-1 max-w-xs justify-end">
            <button
              onClick={() => setTargetMonth('mehr')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                targetMonth === 'mehr'
                  ? 'bg-white text-[#006948] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              مهر ۱۴۰۳
            </button>
            <button
              onClick={() => setTargetMonth('aban')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                targetMonth === 'aban'
                  ? 'bg-white text-[#006948] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              آبان ۱۴۰۳
            </button>
            <button
              onClick={() => setTargetMonth('azar')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                targetMonth === 'azar'
                  ? 'bg-white text-[#006948] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              آذر ۱۴۰۳
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Highlight KPI Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* KPI 1: Projected Total */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 text-center shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-600">صورتحساب برآوردی</span>
            <span
              className={`inline-flex items-center text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                deltaPercent <= 0
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {deltaPercent <= 0 ? (
                <TrendingDown className="w-2.5 h-2.5 ml-0.5 inline" />
              ) : (
                <TrendingUp className="w-2.5 h-2.5 ml-0.5 inline" />
              )}
              {Math.abs(deltaPercent)}٪
            </span>
          </div>
          <div className="my-1">
            <span className="block text-sm sm:text-base font-mono font-black text-[#006948] leading-tight">
              {activeProjection.totalAmount.toLocaleString('fa-IR')}
            </span>
            <span className="text-[10px] text-slate-400">تومان</span>
          </div>
          <span className="text-[9px] text-slate-400 border-t border-slate-100 pt-1 block">
            {deltaVsCurrent <= 0
              ? `${Math.abs(deltaVsCurrent).toLocaleString('fa-IR')} ت کاهش`
              : `${deltaVsCurrent.toLocaleString('fa-IR')} ت افزایش`}
          </span>
        </div>

        {/* KPI 2: Projected Reactive Penalty */}
        <div
          className={`border rounded-2xl p-3 sm:p-4 text-center shadow-xs flex flex-col justify-between ${
            activeProjection.reactiveCost === 0
              ? 'bg-emerald-50/50 border-emerald-200'
              : 'bg-red-50/50 border-red-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-700">جریمه راکتیو</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                activeProjection.reactiveCost === 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {activeProjection.reactiveCost === 0 ? '۱۰۰٪ حذف' : 'مشمول'}
            </span>
          </div>
          <div className="my-1">
            <span
              className={`block text-sm sm:text-base font-mono font-black leading-tight ${
                activeProjection.reactiveCost === 0
                  ? 'text-emerald-700'
                  : 'text-red-700'
              }`}
            >
              {activeProjection.reactiveCost.toLocaleString('fa-IR')}
            </span>
            <span className="text-[10px] text-slate-500">تومان</span>
          </div>
          <span className="text-[9px] text-slate-500 border-t border-slate-200/50 pt-1 block">
            Cos φ = {activeProjection.cosPhi.toFixed(2)}
          </span>
        </div>

        {/* KPI 3: Savings Potential */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 text-center shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-600">پتانسیل صرفه‌جویی</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-[#006948]">
              ماه بعد
            </span>
          </div>
          <div className="my-1">
            <span className="block text-sm sm:text-base font-mono font-black text-slate-900 leading-tight">
              {nextMonthZinoSaving.toLocaleString('fa-IR')}
            </span>
            <span className="text-[10px] text-slate-400">تومان</span>
          </div>
          <span className="text-[9px] text-emerald-700 border-t border-slate-100 pt-1 block font-semibold">
            با اصلاح خازنی
          </span>
        </div>
      </div>

      {/* Parameter Adjustment Panel (روند فصلی + استراتژی جریمه راکتیو) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#006948]" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-900">
              تنظیم متغیرهای فصلی و سناریوی جریمه
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#006948] bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
            روند مصرف: {activeTrendPercent > 0 ? `+${activeTrendPercent}` : activeTrendPercent}٪
          </span>
        </div>

        {/* Step 1: Seasonal Usage Trend */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>۱. روند اقلیمی و مصرف فصلی ({targetMonth === 'mehr' ? 'گذر تابستان به پاییز' : 'فصل معتدل'})</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              تغییر بار سرمایشی و ساعات اوج
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
            <button
              onClick={() => setSeasonalPreset('autumn-mild')}
              className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                seasonalPreset === 'autumn-mild'
                  ? 'bg-emerald-50/80 border-emerald-400 text-[#006948] font-bold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Wind className="w-4 h-4 text-emerald-600" />
                <span className="font-mono text-[11px] font-bold">-۲۲٪</span>
              </div>
              <span className="text-xs font-bold leading-tight">پاییز معتدل</span>
              <span className="text-[10px] text-slate-500 mt-0.5">استاندارد توانیر</span>
            </button>

            <button
              onClick={() => setSeasonalPreset('late-heat')}
              className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                seasonalPreset === 'late-heat'
                  ? 'bg-amber-50/80 border-amber-400 text-amber-900 font-bold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="font-mono text-[11px] font-bold">-۸٪</span>
              </div>
              <span className="text-xs font-bold leading-tight">گرمای تأخیری</span>
              <span className="text-[10px] text-slate-500 mt-0.5">تداوم چیلرها</span>
            </button>

            <button
              onClick={() => setSeasonalPreset('early-cold')}
              className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                seasonalPreset === 'early-cold'
                  ? 'bg-cyan-50/80 border-cyan-400 text-cyan-900 font-bold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Snowflake className="w-4 h-4 text-cyan-600" />
                <span className="font-mono text-[11px] font-bold">-۳۵٪</span>
              </div>
              <span className="text-xs font-bold leading-tight">سرمای زودرس</span>
              <span className="text-[10px] text-slate-500 mt-0.5">خاموشی سرمایش</span>
            </button>

            <button
              onClick={() => setSeasonalPreset('custom')}
              className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                seasonalPreset === 'custom'
                  ? 'bg-purple-50/80 border-purple-400 text-purple-900 font-bold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Sliders className="w-4 h-4 text-purple-600" />
                <span className="font-mono text-[11px] font-bold">
                  {customTrendPercent > 0 ? `+${customTrendPercent}` : customTrendPercent}٪
                </span>
              </div>
              <span className="text-xs font-bold leading-tight">سفارشی</span>
              <span className="text-[10px] text-slate-500 mt-0.5">تنظیم با اسلایدر</span>
            </button>
          </div>

          {seasonalPreset === 'custom' && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mt-2 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">میزان تغییر مصرف نسبت به ماه جاری:</span>
                <span className="font-mono font-bold text-[#006948]">
                  {customTrendPercent > 0 ? `+${customTrendPercent}` : customTrendPercent} درصد
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="30"
                step="2"
                value={customTrendPercent}
                onChange={(e) => setCustomTrendPercent(Number(e.target.value))}
                className="w-full accent-[#006948] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>-۵۰٪ (صرفه‌جویی شدید)</span>
                <span>۰٪ (بدون تغییر)</span>
                <span>+۳۰٪ (افزایش بار)</span>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Power Factor Correction & Reactive Penalty Strategy */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>۲. سناریوی مدیریت توان راکتیو و ضریب توان (Cos φ)</span>
            <span className="text-[10px] font-normal text-slate-500">
              ضریب توان فعلی: <strong className="font-mono text-red-600">{currentCosPhi}</strong>
            </span>
          </label>

          <div className="space-y-2">
            {/* Option A: Status Quo */}
            <div
              onClick={() => setStrategy('status-quo')}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                strategy === 'status-quo'
                  ? 'bg-red-50/70 border-red-300 ring-1 ring-red-400'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                  strategy === 'status-quo'
                    ? 'border-red-600 bg-red-600 text-white'
                    : 'border-slate-300'
                }`}
              >
                {strategy === 'status-quo' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <div className="flex-1 text-right">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    تداوم وضع موجود (عدم نصب خازن)
                  </span>
                  <span className="text-xs font-mono font-bold text-red-700">
                    جریمه ماه بعد: {statusQuo.reactiveCost.toLocaleString('fa-IR')} ت
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  ضریب توان در محدوده بحرانی {currentCosPhi} باقی می‌ماند و شرکت توزیع برق
                  جریمه کامل توان راکتیو را در قبض ماه بعد نیز منظور خواهد کرد.
                </p>
              </div>
            </div>

            {/* Option B: Zino Smart Capacitor Bank */}
            <div
              onClick={() => setStrategy('zino-capacitor')}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                strategy === 'zino-capacitor'
                  ? 'bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-500'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                  strategy === 'zino-capacitor'
                    ? 'border-[#006948] bg-[#006948] text-white'
                    : 'border-slate-300'
                }`}
              >
                {strategy === 'zino-capacitor' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <div className="flex-1 text-right">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#006948]">
                      نصب بانک خازنی هوشمند زینو (پیشنهاد اصلی)
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Cos φ ≥ ۰.۹۵
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    جریمه راکتیو = ۰ تومان
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  حذف ۱۰۰٪ جریمه راکتیو از صورتحساب دوره آینده و آزادسازی ظرفیت دیماند
                  بدون خطر اضافه ولتاژ شبکه.
                </p>
              </div>
            </div>

            {/* Option C: Comprehensive Zino Efficiency Package */}
            <div
              onClick={() => setStrategy('zino-full')}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                strategy === 'zino-full'
                  ? 'bg-linear-to-r from-emerald-50 to-teal-50 border-teal-400 ring-1 ring-teal-500'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                  strategy === 'zino-full'
                    ? 'border-teal-700 bg-teal-700 text-white'
                    : 'border-slate-300'
                }`}
              >
                {strategy === 'zino-full' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <div className="flex-1 text-right">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-teal-950">
                      بسته بهره‌وری کامل (بانک خازنی + جابجایی بار پیک)
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 text-[10px] font-bold">
                      حداکثر صرفه‌جویی
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-teal-700">
                    بیشترین تخفیف
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  حذف کامل جریمه راکتیو همراه با انتقال بخشی از بارهای سنگین به ساعات کم‌باری شبانه
                  جهت دریافت پاداش تعرفه‌ای توانیر.
                </p>

                {strategy === 'zino-full' && (
                  <div className="mt-2.5 pt-2 border-t border-teal-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-600 text-[11px]">میزان جابجایی بار اوج به کم‌باری:</span>
                    <span className="font-mono font-bold text-teal-800">{peakShiftPercent}٪</span>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="5"
                      value={peakShiftPercent}
                      onChange={(e) => setPeakShiftPercent(Number(e.target.value))}
                      className="w-28 accent-teal-700 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Forecast Comparison Bars */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#006948]" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-900">
              مقایسه سناریوهای صورتحساب ماه آینده
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">واحد: تومان</span>
        </div>

        {/* 3 Comparison Bars */}
        <div className="space-y-3 pt-1">
          {/* Bar 1: Current Bill */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-600">
                ۱. دوره جاری ({bill.periodMonth}):
              </span>
              <span className="font-mono font-bold text-slate-800">
                {currentTotal.toLocaleString('fa-IR')} تومان
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-slate-400"
                style={{ width: '100%' }}
                title="مبلغ پایه دوره جاری"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>جریمه راکتیو: {currentReactive.toLocaleString('fa-IR')} ت</span>
              <span>مصرف: {currentKwh} kWh</span>
            </div>
          </div>

          {/* Bar 2: Status Quo Next Month */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-red-800">
                ۲. پیش‌بینی ماه بعد (بدون اقدام - تداوم جریمه):
              </span>
              <span className="font-mono font-bold text-red-700">
                {statusQuo.totalAmount.toLocaleString('fa-IR')} تومان
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-red-400 transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((statusQuo.totalAmount / currentTotal) * 100))}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-red-600 mt-0.5">
              <span>جریمه راکتیو ماندگار: {statusQuo.reactiveCost.toLocaleString('fa-IR')} ت</span>
              <span>کاهش فصلی اعمال‌شده: {activeTrendPercent}٪</span>
            </div>
          </div>

          {/* Bar 3: Zino Optimized Next Month */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-[#006948] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ۳. پیش‌بینی با اصلاح خازنی زینو:
              </span>
              <span className="font-mono font-black text-[#006948]">
                {zinoOptimized.totalAmount.toLocaleString('fa-IR')} تومان
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-[#006948] transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((zinoOptimized.totalAmount / currentTotal) * 100))}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-emerald-800 font-semibold mt-0.5">
              <span>جریمه راکتیو: ۰ تومان (حذف کامل)</span>
              <span>سود خالص ماه بعد: {nextMonthZinoSaving.toLocaleString('fa-IR')} ت</span>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#006948]" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-900">
              ریز محاسبات تفکیکی اقلام پیش‌بینی‌شده
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            استاندارد تعرفه ۱۴۰۳
          </span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-slate-50 py-2.5 px-3 text-slate-700 font-bold text-center">
            <div className="text-right">ردیف / عنوان هزینه</div>
            <div>وضع موجود (بدون خازن)</div>
            <div className="text-emerald-800">پیش‌بینی با زینو</div>
          </div>

          {/* Row: Active Energy Total */}
          <div className="grid grid-cols-3 py-2 px-3 text-center items-center">
            <div className="text-right text-slate-600 font-medium">کل انرژی اکتیو (kWh)</div>
            <div className="font-mono text-slate-700">{statusQuo.kwh.toLocaleString('fa-IR')}</div>
            <div className="font-mono font-bold text-[#006948]">
              {zinoOptimized.kwh.toLocaleString('fa-IR')}
            </div>
          </div>

          {/* Row: Cos Phi */}
          <div className="grid grid-cols-3 py-2 px-3 text-center items-center bg-slate-50/40">
            <div className="text-right text-slate-600 font-medium">ضریب توان (Cos φ)</div>
            <div className="font-mono text-red-600 font-bold">{statusQuo.cosPhi} (بحرانی)</div>
            <div className="font-mono text-emerald-700 font-bold">
              {zinoOptimized.cosPhi.toFixed(2)} (ایده‌آل)
            </div>
          </div>

          {/* Row: Base energy cost */}
          <div className="grid grid-cols-3 py-2 px-3 text-center items-center">
            <div className="text-right text-slate-600 font-medium">بهای انرژی پایه</div>
            <div className="font-mono text-slate-700">
              {statusQuo.baseCost.toLocaleString('fa-IR')}
            </div>
            <div className="font-mono text-slate-700">
              {zinoOptimized.baseCost.toLocaleString('fa-IR')}
            </div>
          </div>

          {/* Row: Peak cost */}
          <div className="grid grid-cols-3 py-2 px-3 text-center items-center bg-slate-50/40">
            <div className="text-right text-slate-600 font-medium">بهای ساعات اوج بار</div>
            <div className="font-mono text-amber-800">
              {statusQuo.peakCost.toLocaleString('fa-IR')}
            </div>
            <div className="font-mono text-emerald-700 font-bold">
              {zinoOptimized.peakCost.toLocaleString('fa-IR')}
            </div>
          </div>

          {/* Row: Reactive penalty */}
          <div className="grid grid-cols-3 py-2 px-3 text-center items-center bg-red-50/30">
            <div className="text-right text-red-800 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-600" />
              جریمه توان راکتیو
            </div>
            <div className="font-mono text-red-700 font-black">
              {statusQuo.reactiveCost.toLocaleString('fa-IR')} ت
            </div>
            <div className="font-mono text-emerald-700 font-black">
              ۰ تومان (حذف ۱۰۰٪)
            </div>
          </div>

          {/* Row: Tax and duties */}
          <div className="grid grid-cols-3 py-2 px-3 text-center items-center">
            <div className="text-right text-slate-500 font-medium">عوارض و مالیات ارزش‌افزوده</div>
            <div className="font-mono text-slate-600">
              {statusQuo.taxCost.toLocaleString('fa-IR')}
            </div>
            <div className="font-mono text-slate-600">
              {zinoOptimized.taxCost.toLocaleString('fa-IR')}
            </div>
          </div>

          {/* Row: Total */}
          <div className="grid grid-cols-3 py-3 px-3 text-center items-center bg-emerald-50/60 font-bold">
            <div className="text-right text-slate-900 font-black text-xs sm:text-sm">
              مبلغ نهایی صورتحساب
            </div>
            <div className="font-mono text-slate-800 text-xs sm:text-sm">
              {statusQuo.totalAmount.toLocaleString('fa-IR')} ت
            </div>
            <div className="font-mono text-[#006948] text-sm sm:text-base font-black">
              {zinoOptimized.totalAmount.toLocaleString('fa-IR')} ت
            </div>
          </div>
        </div>
      </div>

      {/* 12-Month Cumulative Penalty Projection Alert */}
      <div className="bg-amber-50/80 border border-amber-300/80 rounded-2xl p-4 text-right shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs sm:text-sm font-bold text-amber-950">
                چشم‌انداز خسارت انباشته سالانه جریمه راکتیو
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold">
                تحلیل مالی
              </span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed font-normal">
              در صورت عدم جبران‌سازی خازنی، مجموع جریمه توان راکتیو در ۱۲ ماه آینده بالغ بر{' '}
              <strong className="font-bold text-red-700 font-mono">
                {annualizedReactiveLoss.toLocaleString('fa-IR')} تومان
              </strong>{' '}
              خواهد شد. هزینه خرید و نصب بانک خازنی هوشمند زینو تنها با{' '}
              <strong>۷ الی ۸ ماه صرفه‌جویی</strong> در این جریمه به طور کامل بازمی‌گردد.
            </p>
          </div>
        </div>
      </div>

      {/* Actionable Engineering Advice for Next Month */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#006948]" />
          <h2 className="text-xs sm:text-sm font-bold text-slate-900">
            توصیه‌های فنی دپارتمان انرژی زینو برای دوره {targetMonthLabel}
          </h2>
        </div>

        <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006948] shrink-0 mt-1.5" />
            <span>
              <strong>انقضای ساعات پیک تابستان:</strong> با فرارسیدن مهرماه ساعات اوج‌بار از ۵ ساعت به ۴ ساعت کاهش یافته و ضریب جریمه ساعات گرم حذف می‌گردد.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006948] shrink-0 mt-1.5" />
            <span>
              <strong>تعدیل مدار چیلرها:</strong> با توجه به کاهش دمای شبانه، مدار دوم چیلر اسکرو را از مدار خارج نموده و کنترل دما را روی ۲۵ درجه سلسیوس تنظیم فرمایید.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006948] shrink-0 mt-1.5" />
            <span>
              <strong>فوریت سفارش خازن:</strong> جهت اعمال در قرائت کنتور دوره آتی، استعلام تابلوی خازنی باید حداقل ۱۰ روز کاری پیش از پایان دوره نهایی شود.
            </span>
          </li>
        </ul>
      </div>

      {/* CTAs */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onViewSolutions}
          className="w-full h-12 bg-[#006948] hover:bg-[#00855d] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-sm cursor-pointer"
        >
          <span>استعلام بانک خازنی متناسب با برآورد ماه آینده</span>
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onViewAudit}
            className="h-10 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>ممیزی تفکیکی بارهای القایی</span>
          </button>

          <button
            type="button"
            onClick={onOpenReport}
            className="h-10 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>دریافت سند رسمی و برآورد PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
