import React, { useState } from 'react';
import { BillData } from '../types';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  Eye,
  Hash,
  Briefcase,
  Calendar,
  CreditCard,
  Zap,
} from 'lucide-react';

interface OcrResultViewProps {
  bill: BillData;
  onNext: () => void;
  onEdit: () => void;
  onReupload: () => void;
  onPreviewBillImage: () => void;
}

export const OcrResultView: React.FC<OcrResultViewProps> = ({
  bill,
  onNext,
  onEdit,
  onReupload,
  onPreviewBillImage,
}) => {
  const [progress, setProgress] = useState(68);

  const lowPercent = Math.round((bill.lowPeak / bill.activeEnergyTotal) * 100) || 44;
  const midPercent = Math.round((bill.midPeak / bill.activeEnergyTotal) * 100) || 34;
  const highPercent = Math.round((bill.highPeak / bill.activeEnergyTotal) * 100) || 22;

  // SVG Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-full max-w-xl mx-auto py-2 px-3 sm:px-4 space-y-4">
      {/* 2D Circular Extraction Status Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-xs flex flex-col items-center">
        <div className="relative w-36 h-36 flex items-center justify-center my-1">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
            {/* Background Track */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#e2e8f0"
              strokeWidth="9"
              fill="none"
            />
            {/* Progress Arc */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#006948"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <FileText className="w-6 h-6 text-[#006948] mb-1 stroke-[2]" />
            <span className="text-2xl font-mono font-black text-slate-900 leading-none">
              {progress}٪
            </span>
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-2 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>در حال استخراج و تحلیل مهندسی...</span>
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
          موتور هوش مصنوعی زینو در حال پردازش ماتریس مصرف و تفکیک تعرفه‌ای قبض شماست.
        </p>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full bg-emerald-50 text-[#006948] text-xs font-semibold border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>تأییدشده توسط OCR زینو (سطح اطمینان {bill.ocrConfidence}٪)</span>
        </div>
      </div>

      {/* Bill Document Thumbnail & Metadata */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
            <FileText className="w-6 h-6 text-[#006948]" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              {bill.title}
            </span>
            <span className="text-[11px] text-slate-500 font-mono mt-0.5 dir-ltr text-right">
              {bill.fileName} • {bill.fileSize}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onPreviewBillImage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>پیش‌نمایش</span>
        </button>
      </div>

      {/* Critical Anomaly Alert (توان راکتیو و پیک بار) */}
      {bill.reactivePenalty > 0 && (
        <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 text-right shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs sm:text-sm font-bold text-amber-900">
                  عارضه مصرف: توان راکتیو و پیک بار
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold">
                  بحرانی
                </span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed font-normal">
                به علت پایین بودن ضریب توان (کوسینوس فی {bill.cosPhi})، مبلغ{' '}
                <strong className="font-bold text-red-700 font-mono">
                  {bill.reactivePenalty.toLocaleString('fa-IR')} تومان
                </strong>{' '}
                مشمول جریمه راکتیو گردیده است. نصب بانک خازنی هوشمند این هزینه را
                کاملاً صفر می‌کند.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Extracted Bill Data Matrix */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              اطلاعات شناسایی‌شده صورتحساب
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#006948] border border-emerald-200 text-[10px] font-semibold">
            موفقیت‌آمیز
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {/* Row: Account Number */}
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              شماره پرونده / اشتراک
            </span>
            <span className="font-mono font-bold text-slate-800">
              {bill.subscriptionNumber}
            </span>
          </div>

          {/* Row: Tariff Type */}
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              نوع تعرفه و کاربری
            </span>
            <span className="font-semibold text-slate-800">
              {bill.tariffType} ({bill.tariffCode})
            </span>
          </div>

          {/* Row: Period */}
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              دوره مصرف
            </span>
            <span className="font-medium text-slate-800">
              ({bill.periodDays} روزه) {bill.periodDates}
            </span>
          </div>

          {/* Row: Bill and Payment IDs */}
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              شناسه قبض / پرداخت
            </span>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {bill.billId}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {bill.paymentId}
              </span>
            </div>
          </div>

          {/* Row: Active Energy Breakdown */}
          <div className="py-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                کل انرژی اکتیو مصرفی
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {bill.activeEnergyTotal.toLocaleString('fa-IR')} kWh
              </span>
            </div>

            {/* Segmented bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex gap-0.5 bg-slate-100 p-0.5">
              <div
                className="h-full bg-emerald-800 rounded-r-full transition-all"
                style={{ width: `${lowPercent}%` }}
                title={`کم‌باری: ${bill.lowPeak} kWh`}
              />
              <div
                className="h-full bg-emerald-400 transition-all"
                style={{ width: `${midPercent}%` }}
                title={`میان‌بار: ${bill.midPeak} kWh`}
              />
              <div
                className="h-full bg-amber-500 rounded-l-full transition-all"
                style={{ width: `${highPercent}%` }}
                title={`اوج‌بار: ${bill.highPeak} kWh`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-800"></span>
                کم‌باری: {bill.lowPeak} kWh
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                میان‌بار: {bill.midPeak} kWh
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                اوج: {bill.highPeak} kWh
              </span>
            </div>
          </div>

          {/* Row: Total Amount */}
          <div className="py-3.5 flex items-center justify-between bg-slate-50/70 -mx-4 px-4 sm:-mx-5 sm:px-5 mt-2 rounded-b-xl">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">
                مبلغ کل پرداختی قبض
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                {bill.totalAmountRials.toLocaleString('fa-IR')} ریال
              </span>
            </div>
            <div className="text-left">
              <span className="text-base sm:text-lg font-mono font-black text-[#006948]">
                {bill.totalAmount.toLocaleString('fa-IR')}
              </span>
              <span className="text-xs text-slate-600 mr-1 font-semibold">تومان</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary CTA: View Full Engineering Analysis */}
      <button
        type="button"
        onClick={onNext}
        className="w-full h-12 bg-[#006948] hover:bg-[#00855d] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-sm cursor-pointer"
      >
        <span>مشاهده تحلیل کامل و عارضه‌یابی مهندسی</span>
        <ArrowLeft className="w-4 h-4" />
      </button>

      {/* Secondary Controls */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onEdit}
          className="h-10 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>ویرایش دستی مقادیر</span>
        </button>

        <button
          type="button"
          onClick={onReupload}
          className="h-10 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>بارگذاری مجدد قبض</span>
        </button>
      </div>

      {/* Tavanir Compliance Note */}
      <div className="pt-1 text-center">
        <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          الگوریتم تطبیق داده با استاندارد توانیر نگارش ۱۴۰۳
        </span>
      </div>
    </div>
  );
};
