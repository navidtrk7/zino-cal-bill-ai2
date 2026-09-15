import React, { useState, useRef } from 'react';
import { BillData } from '../types';
import { initialBills } from '../data/mockData';
import {
  UploadCloud,
  Camera,
  Paperclip,
  ShieldCheck,
  AlertTriangle,
  PiggyBank,
  Sparkles,
  ArrowLeft,
  Building2,
  Factory,
  Home,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react';

interface UploadLandingViewProps {
  onSelectBill: (bill: BillData) => void;
  onScanComplete: () => void;
}

export const UploadLandingView: React.FC<UploadLandingViewProps> = ({
  onSelectBill,
  onScanComplete,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startScanSimulation = (billKey: string = 'commercial', customFileName?: string) => {
    setIsScanning(true);
    setProgress(10);
    setStatusMessage('در حال خواندن بارکد و فراداده‌های سند...');
    setUploadedFileName(customFileName || 'bill-tehran-1403-06.pdf');

    const steps = [
      { p: 35, msg: 'استخراج داده‌های عددی اکتیو و راکتیو با هوش مصنوعی...' },
      { p: 68, msg: 'تطبیق جدول مصرف با آخرین آیین‌نامه تعرفه توانیر ۱۴۰۵...' },
      { p: 90, msg: 'محاسبه جریمه خازنی و تحلیل تلفات اوج‌بار...' },
      { p: 100, msg: 'استخراج تکمیل شد! انتقال به گزارش تحلیل مهندسی...' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusMessage(steps[currentStep].msg);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          const selected = initialBills[billKey] || initialBills.commercial;
          if (customFileName) {
            selected.fileName = customFileName;
          }
          onSelectBill(selected);
          onScanComplete();
        }, 500);
      }
    }, 450);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      startScanSimulation('commercial', file.name);
    }
  };

  return (
    <div className="w-full flex flex-col justify-between max-w-2xl mx-auto py-2 px-3 md:px-6">
      {/* Top Banner & Title */}
      <section className="text-center my-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-[#006948] text-xs font-bold mb-3 border border-emerald-300/60">
          <Sparkles className="w-3.5 h-3.5" />
          <span>پردازش ابری نسل جدید • نسخه هوشمند زینو</span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
          تحلیل آنی قبض برق و کشف جریمه‌های پنهان
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          با هوش مصنوعی زینو، صورتحساب خود را در چند ثانیه عارضه‌یابی، توان راکتیو
          را شناسایی و هزینه‌های مازاد را تا ۱۰۰٪ حذف کنید.
        </p>

        {/* 3 Metric counters */}
        <div className="grid grid-cols-3 gap-2 mt-4 max-w-md mx-auto">
          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 text-center shadow-xs">
            <span className="block text-base sm:text-lg font-mono font-black text-[#006948]">
              ۹۹.۴٪
            </span>
            <span className="text-[11px] text-slate-500 font-medium">دقت OCR زینو</span>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 text-center shadow-xs">
            <span className="block text-base sm:text-lg font-mono font-black text-amber-600">
              صفر
            </span>
            <span className="text-[11px] text-slate-500 font-medium">تاوان راکتیو</span>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 text-center shadow-xs">
            <span className="block text-base sm:text-lg font-mono font-black text-emerald-700">
              ۲ ثانیه
            </span>
            <span className="text-[11px] text-slate-500 font-medium">زمان خوانش فوری</span>
          </div>
        </div>
      </section>

      {/* Main Upload Dropzone */}
      <section className="w-full my-3">
        <div
          onClick={() => {
            if (!isScanning) fileInputRef.current?.click();
          }}
          className="relative bg-white rounded-2xl p-6 sm:p-8 border-2 border-dashed border-emerald-500/50 hover:border-emerald-600 transition-all shadow-xs flex flex-col items-center text-center cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#006948] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-emerald-200">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
            بارگذاری یا رها کردن سند
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            پشتیبانی از فرمت‌های JPG ،PNG و PDF (حداکثر ۱۰ مگابایت)
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf"
            className="hidden"
          />

          {/* Action Buttons */}
          <div className="w-full max-w-sm flex flex-col gap-2.5">
            <button
              type="button"
              disabled={isScanning}
              onClick={(e) => {
                e.stopPropagation();
                startScanSimulation('commercial');
              }}
              className="w-full h-11 bg-[#006948] hover:bg-[#00855d] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-sm disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              <span>اسکن مستقیم با دوربین یا بارگذاری</span>
            </button>

            <button
              type="button"
              disabled={isScanning}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs flex items-center justify-center gap-2 active:scale-[0.99] transition-colors"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>انتخاب فایل از گالری یا PDF</span>
            </button>
          </div>

          {/* Scanning Progress Bar */}
          {isScanning && (
            <div className="w-full max-w-sm mt-5 pt-4 border-t border-slate-100 text-right">
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="text-[#006948] flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#006948] animate-ping"></span>
                  {statusMessage}
                </span>
                <span className="font-mono text-[#006948] font-bold">
                  {progress}٪
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#006948] to-emerald-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {uploadedFileName && (
                <div className="text-[11px] text-slate-400 mt-1.5 font-mono text-left dir-ltr">
                  فایل انتخابی: {uploadedFileName}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Quick Test with Presets */}
      <section className="my-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-slate-700">
            آزمایش سریع با نمونه قبوض آماده:
          </span>
          <span className="text-[11px] text-slate-500">
            برای مشاهده نحوه تحلیل، یکی از موارد را انتخاب کنید:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Preset 1: Commercial (Main demo) */}
          <button
            type="button"
            onClick={() => startScanSimulation('commercial')}
            className="flex flex-col text-right p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 font-bold text-xs text-slate-800 group-hover:text-[#006948]">
                <Building2 className="w-4 h-4 text-emerald-600" />
                برج اداری نگین آفریقا
              </span>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-[11px] text-amber-700 font-medium">
              مصرف نامتعارف در ساعات اوج بار و راکتیو
            </span>
            <span className="text-[10px] text-slate-400 mt-1">
              تعرفه عمومی اداری کد ۲۳ • ۳۵۰ kWh
            </span>
          </button>

          {/* Preset 2: Industrial */}
          <button
            type="button"
            onClick={() => startScanSimulation('industrial')}
            className="flex flex-col text-right p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 font-bold text-xs text-slate-800 group-hover:text-[#006948]">
                <Factory className="w-4 h-4 text-emerald-600" />
                کارخانه صنعتی (۵۰۰kW)
              </span>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-[11px] text-red-600 font-bold">
              حاوی جریمه راکتیو ۱۸.۴ میلیون تومانی
            </span>
            <span className="text-[10px] text-slate-400 mt-1">
              تعرفه صنعتی تولیدی • دیماندی اختصاصی
            </span>
          </button>

          {/* Preset 3: Residential */}
          <button
            type="button"
            onClick={() => startScanSimulation('residential')}
            className="flex flex-col text-right p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 font-bold text-xs text-slate-800 group-hover:text-[#006948]">
                <Home className="w-4 h-4 text-emerald-600" />
                مسکونی (پلکان ۴)
              </span>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              فرصت تخفیف ۳۵٪ با بهینه‌سازی
            </span>
            <span className="text-[10px] text-slate-400 mt-1">
              کاهش پله مصرف تابستانه
            </span>
          </button>
        </div>
      </section>

      {/* Processing Benefits Section (From Image 2) */}
      <section className="my-4 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
        <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
          <FileCheck2 className="w-4 h-4 text-[#006948]" />
          <span>مزایای پردازش هوشمند زینو</span>
          <span className="text-[10px] font-normal text-slate-500 mr-auto">ویژه مشترکین سراسر کشور</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="p-2 rounded-lg bg-emerald-100 text-[#006948] shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                استخراج هوشمند OCR
              </span>
              <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                پشتیبانی کامل از تمام قبوض سراسری: صنعتی، تجاری، اداری و کشاورزی
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                عارضه‌یابی و جریمه‌ها
              </span>
              <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                کشف ریالی مازاد بهای توان راکتیو (جریمه خازنی)، نرخ اوج‌بار و دیماند
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="p-2 rounded-lg bg-emerald-100 text-[#006948] shrink-0 mt-0.5">
              <PiggyBank className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                شبیه‌سازی سود و ROI
              </span>
              <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                طراحی پروپوزال بانک خازنی هوشمند و سامانه ذخیره‌ساز انرژی بدون توقف بار
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Security Footer */}
      <footer className="pt-2 pb-1 text-center">
        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>امنیت کامل داده‌ها • منطبق با آخرین الگوریتم ابلاغی تعرفه توانیر ۱۴۰۵</span>
        </p>
      </footer>
    </div>
  );
};
