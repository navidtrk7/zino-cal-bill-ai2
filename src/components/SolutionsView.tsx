import React, { useState } from 'react';
import { BillData } from '../types';
import {
  Lightbulb,
  TrendingDown,
  Clock,
  CheckCircle2,
  ShoppingCart,
  Calculator,
  Calendar,
  Send,
  Phone,
  MapPin,
  Sparkles,
  Zap,
  ShieldCheck,
  BatteryCharging,
} from 'lucide-react';

interface SolutionsViewProps {
  bill: BillData;
}

export const SolutionsView: React.FC<SolutionsViewProps> = ({ bill }) => {
  const [applicantName, setApplicantName] = useState('علی محمدی - کارگاه قطعه‌سازی');
  const [phoneNumber, setPhoneNumber] = useState('09123456789');
  const [inspectionType, setInspectionType] = useState('بازدید حضوری تابلو برق');
  const [preferredDate, setPreferredDate] = useState('1403/06/15');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      // Keep state
    }, 4000);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-2 px-3 sm:px-4 space-y-4">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-[#006948] border border-emerald-200">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900">
                راهکارهای بهینه‌سازی قبض
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#006948] text-[10px] font-bold border border-emerald-200">
                تحلیل هوشمند
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              اشتراک {bill.tariffType} {bill.subscriptionNumber}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-normal pt-2 border-t border-slate-100">
          بر اساس عوارض توان راکتیو و بار مصرفی اوج در آخرین دوره، اجرای راهکارهای
          زیر بیشترین نرخ بازگشت سرمایه را فراهم می‌کند.
        </p>
      </div>

      {/* شبیه‌سازی مالی و ROI */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-[#006948]" />
            <span>شبیه‌سازی مالی و ROI</span>
          </h2>
          <span className="text-[11px] text-emerald-800 font-bold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
            پیش‌بینی سالانه
          </span>
        </div>

        {/* Visual Bar Comparison */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-end justify-center gap-8 sm:gap-12 h-44 mb-3">
            {/* Current State Bar */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-red-700 font-bold mb-1">
                ۱۵,۳۶۰,۰۰۰
              </span>
              <div className="w-16 sm:w-20 h-32 rounded-t-lg bg-red-700 flex flex-col items-center justify-center text-white p-1 text-center shadow-xs">
                <span className="text-[11px] font-bold">وضعیت فعلی</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-700 mt-1.5">
                ۱,۲۸۰,۰۰۰ <span className="text-[10px] font-normal">م/ماه</span>
              </span>
            </div>

            {/* Reduction Indicator Arrow */}
            <div className="flex flex-col items-center justify-center text-emerald-700 font-mono font-bold text-xs pb-10">
              <TrendingDown className="w-6 h-6 stroke-[2.5]" />
              <span>-۲۵.۴٪</span>
            </div>

            {/* With Zino Bar */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-emerald-800 font-bold mb-1">
                ۱۱,۴۶۰,۰۰۰
              </span>
              <div className="w-16 sm:w-20 h-24 rounded-t-lg bg-[#006948] flex flex-col items-center justify-center text-white p-1 text-center shadow-xs">
                <span className="text-[11px] font-bold">با زینو</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#006948] mt-1.5">
                ۹۵۵,۰۰۰ <span className="text-[10px] font-normal">م/ماه</span>
              </span>
            </div>
          </div>

          {/* Annual Net Savings Badge */}
          <div className="p-3 rounded-xl bg-white border border-emerald-300 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>صرفه‌جویی خالص سالانه:</span>
            </div>
            <div className="font-mono font-black text-[#006948] text-base">
              ۳,۹۰۰,۰۰۰ <span className="text-xs font-normal text-slate-600">تومان</span>
            </div>
          </div>

          <div className="mt-2 text-[11px] text-emerald-800 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>حذف ۱۰۰٪ جریمه توان راکتیو + اصلاح ضریب توان به بالای ۰.۹۵</span>
          </div>
        </div>

        {/* ROI Payback Period Box */}
        <div className="mt-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006948] text-white flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-mono font-black text-slate-900">
                  ۸ ماه
                </span>
                <span className="px-2 py-0.5 rounded bg-white text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  ROI عالی
                </span>
              </div>
              <span className="text-xs text-slate-600">
                زمان بازگشت کامل هزینه سرمایه‌گذاری
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* سبد تجهیزات مهندسی پیشنهادی */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900">
            سبد تجهیزات مهندسی پیشنهادی
          </h2>
          <span className="text-[11px] text-slate-400">دیتابیس رسمی زینو</span>
        </div>

        <div className="space-y-3">
          {/* Equipment 1: Smart Capacitor Bank */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    SKU: ZN-CAP-IND
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">
                    راکتیو
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  بانک خازنی اتوماتیک هوشمند
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  کنترل میکروپروسسوری پله‌ها، حذف قطعی جریمه راکتیو صورتحساب و کاهش توان
                  ظاهری ترانسفورماتور.
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="font-mono font-black text-slate-900 text-sm sm:text-base">
                    ۲۴,۸۰۰,۰۰۰ <span className="text-xs font-normal text-slate-600">تومان</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    گارانتی ۱۸ ماهه زینو
                  </span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shrink-0 text-emerald-700">
                <Zap className="w-8 h-8 stroke-[1.5]" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert('پیش‌فاکتور بانک خازنی با موفقیت ثبت و ارسال شد.')}
              className="w-full mt-3 h-10 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>سفارش و بررسی آنلاین</span>
            </button>
          </div>

          {/* Equipment 2: BESS Battery Energy Storage */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    SKU: ZN-BESS-100KWH
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                    اوج‌بار
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  سامانه ذخیره‌ساز انرژی صنعتی (BESS)
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  تخلیه انرژی در ساعات اوج بار با تعرفه سنگین، تضمین پایداری خط تولید در
                  خاموشی (Zero Downtime).
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-bold text-[#006948]">
                    استعلام مهندسی
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    سلول LFP هوشمند
                  </span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shrink-0 text-amber-600">
                <BatteryCharging className="w-8 h-8 stroke-[1.5]" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert('محاسبه‌گر تخصصی ظرفیت ذخیره‌ساز باتری فعال شد.')}
              className="w-full mt-3 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>محاسبه ظرفیت برای مجتمع</span>
            </button>
          </div>
        </div>
      </div>

      {/* فرم درخواست بازدید و پیش‌فاکتور رسمی */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-[#006948]">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900">
              درخواست بازدید و پیش‌فاکتور رسمی
            </h2>
            <span className="text-[10px] text-slate-500">
              اعزام تیم ممیزی فنی زینو به محل اشتراک
            </span>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#006948] mx-auto" />
            <h3 className="text-xs sm:text-sm font-bold text-emerald-950">
              درخواست شما با کد پیگیری ZN-REQ-9842 ثبت شد
            </h3>
            <p className="text-[11px] text-emerald-800">
              کارشناس فنی دپارتمان ممیزی انرژی ظرف ۲ ساعت کاری جهت هماهنگی با شما تماس
              خواهد گرفت.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                نام متقاضی / واحد صنعتی
              </label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-[#006948] focus:ring-1 focus:ring-[#006948] outline-none text-slate-800 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                شماره تلفن همراه
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-[#006948] focus:ring-1 focus:ring-[#006948] outline-none text-slate-800 font-mono dir-ltr text-right bg-slate-50/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  نوع بررسی
                </label>
                <select
                  value={inspectionType}
                  onChange={(e) => setInspectionType(e.target.value)}
                  className="w-full h-10 px-2 rounded-xl border border-slate-200 focus:border-[#006948] outline-none text-slate-800 bg-slate-50/50"
                >
                  <option>بازدید حضوری تابلو برق</option>
                  <option>پلاک‌خوانی موتورخانه</option>
                  <option>آنالیز هارمونیک Fluke</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  تاریخ ترجیحی
                </label>
                <input
                  type="text"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-[#006948] outline-none text-slate-800 font-mono text-center bg-slate-50/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-[#006948] hover:bg-[#00855d] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ثبت درخواست اعزام کارشناس و پیش‌فاکتور رسمی</span>
            </button>
          </form>
        )}

        {/* Company Contact Information */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-[11px] text-slate-500">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Phone className="w-3.5 h-3.5 text-emerald-700" />
            <span>دپارتمان مهندسی و راه‌حل‌های انرژی زینو: ۰۲۱-۸۸۷۸۵۹۵۶</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>تهران، برج نگین آفریقا، طبقه ۷، واحد ۷۰۲</span>
          </div>
        </div>
      </div>
    </div>
  );
};
