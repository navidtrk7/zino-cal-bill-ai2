import React, { useState } from 'react';
import { BillData } from '../types';
import { auditEquipmentList } from '../data/mockData';
import {
  Cpu,
  AlertTriangle,
  ArrowDownRight,
  SlidersHorizontal,
  CheckCircle,
  FileSpreadsheet,
  Download,
  Activity,
  Zap,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface AuditViewProps {
  bill: BillData;
  onOpenReport: () => void;
}

export const AuditView: React.FC<AuditViewProps> = ({ bill, onOpenReport }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'chiller' | 'pump' | 'elevator'>('all');

  const filteredList =
    selectedCategory === 'all'
      ? auditEquipmentList
      : auditEquipmentList.filter((e) => e.category === selectedCategory);

  return (
    <div className="w-full max-w-xl mx-auto py-2 px-3 sm:px-4 space-y-4">
      {/* Location & Demand Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            کد اشتراک: {bill.subscriptionNumber}
          </span>
          <span className="text-xs font-bold text-red-600 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            ممیزی در محل موتورخانه مرکزی
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <h1 className="text-base sm:text-lg font-bold text-slate-900">
            {bill.title}
          </h1>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#006948] text-xs font-mono font-bold border border-emerald-200">
            دیماند: {bill.contractedDemand}
          </span>
        </div>

        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          ممیزی تخصصی تجهیزات القایی سنگین، چیلرها، بوسترپمپ‌ها و درایوهای آسانسور.
        </p>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 mt-2 border-t border-slate-100 pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#006948] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            همه بارهای القایی (۱۱)
          </button>
          <button
            onClick={() => setSelectedCategory('chiller')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'chiller'
                ? 'bg-[#006948] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            چیلر و کمپرسورها (۲)
          </button>
          <button
            onClick={() => setSelectedCategory('pump')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'pump'
                ? 'bg-[#006948] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            بوستر و پمپ‌ها (۳)
          </button>
          <button
            onClick={() => setSelectedCategory('elevator')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'elevator'
                ? 'bg-[#006948] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            آسانسورها (۶)
          </button>
        </div>
      </div>

      {/* Reactive Penalty Culprit Card */}
      <div className="bg-red-50/80 border border-red-200 rounded-2xl p-4 shadow-xs text-right">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-red-100 text-red-700 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-red-950 mb-1">
              عامل جریمه راکتیو ۳۲۵,۰۰۰ تومانی این دوره شناسایی شد
            </h2>
            <p className="text-xs text-red-900 leading-relaxed font-normal">
              کارکرد مستقیم الکتروموتورهای ۱۲۰ تن بدون VFD و عدم تفکیک خازن‌های
              موضعی در تابلوی توزیع طبقه ۳-.
            </p>
          </div>
        </div>

        {/* 3 Cos Phi Badges */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-red-200/60">
          <div className="bg-white/80 rounded-xl p-2 text-center border border-red-200">
            <span className="text-[10px] text-red-600 font-bold block">بحرانی</span>
            <span className="font-mono font-black text-red-700 text-sm sm:text-base">
              ۰.۷۲
            </span>
            <span className="text-[9px] text-slate-600 block mt-0.5">چیلر شماره ۱ و ۲</span>
            <span className="text-[9px] font-mono text-slate-400">Cos φ</span>
          </div>

          <div className="bg-white/80 rounded-xl p-2 text-center border border-amber-200">
            <span className="text-[10px] text-amber-700 font-bold block">هشدار</span>
            <span className="font-mono font-black text-amber-800 text-sm sm:text-base">
              ۰.۷۶
            </span>
            <span className="text-[9px] text-slate-600 block mt-0.5">بوستر پمپ‌ها</span>
            <span className="text-[9px] font-mono text-slate-400">Cos φ</span>
          </div>

          <div className="bg-white/80 rounded-xl p-2 text-center border border-slate-200">
            <span className="text-[10px] text-slate-600 font-bold block">متوسط</span>
            <span className="font-mono font-black text-slate-800 text-sm sm:text-base">
              ۰.۸۱
            </span>
            <span className="text-[9px] text-slate-600 block mt-0.5">موتور آسانسور</span>
            <span className="text-[9px] font-mono text-slate-400">Cos φ</span>
          </div>
        </div>
      </div>

      {/* Equipment Detailed Cards */}
      <div className="space-y-3">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
          >
            {/* Title & Share Tag */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-[#006948] shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    {item.name}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    ظرفیت کل: {item.capacity} ({item.countInfo})
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                {item.sharePercent}٪ سهم مصرف
              </span>
            </div>

            {/* Inverter status & monthly loss */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-700 font-medium">
                <span>وضعیت درایو:</span>
                <span className="text-red-600 font-bold flex items-center gap-1">
                  {item.statusDetails}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span className="text-slate-500">اتلاف مستقیم ماهانه:</span>
                <span className="font-mono font-black text-red-700 text-sm">
                  {item.monthlyLossAmount.toLocaleString('fa-IR')} تومان
                </span>
              </div>
              <div className="text-[10px] text-slate-500">{item.lossDetails}</div>
            </div>

            {/* Recommended action button */}
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">
                {item.recommendationAction}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#006948] text-white text-[10px] font-bold font-mono">
                -{item.savingPercent}٪ مصرف
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Facilities Saving Potential Simulation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#006948]" />
            <span>پتانسیل صرفه‌جویی تأسیسات</span>
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#006948] text-[10px] font-bold font-mono">
            ۳۵٪ کاهش
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mb-3">
          شبیه‌سازی بار موتورخانه بر اساس داده‌های کنتور دیجیتال
        </p>

        {/* Before / After Bars */}
        <div className="space-y-2 text-xs">
          <div>
            <div className="flex justify-between text-[11px] text-slate-600 mb-1 font-medium">
              <span>مصرف فعلی موتورخانه (وضع موجود):</span>
              <span className="font-mono font-bold text-slate-800">۳۵۰ kWh / دوره</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
              <div className="w-[65%] bg-emerald-800" title="بارهای مفید" />
              <div className="w-[20%] bg-amber-600" title="پیک گرما" />
              <div className="w-[15%] bg-red-600" title="تلفات راکتیو" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-emerald-900 mb-1 font-bold">
              <span>پس از بهینه‌سازی زینو (VFD + بانک خازنی):</span>
              <span className="font-mono font-bold text-[#006948]">۲۲۵ kWh / دوره</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden bg-slate-100">
              <div className="w-[64%] h-full bg-[#006948] rounded-full" />
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-900">
            صرفه‌جویی خالص سالانه در قبوض:
          </span>
          <span className="font-mono font-black text-[#006948] text-sm sm:text-base">
            ۳,۴۵۰,۰۰۰ تومان
          </span>
        </div>
      </div>

      {/* بسته راهکارهای پیشنهادی دپارتمان ZINO ESCO */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900">
            بسته راهکارهای پیشنهادی دپارتمان ZINO ESCO
          </h2>
          <span className="text-[10px] text-emerald-700 font-medium">
            قرارداد تضمین کارایی
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
              <span>مدل بهینه‌سازی EPCF (بدون پیش‌پرداخت)</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-[#006948] text-[10px]">
                محبوب‌ترین
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              هزینه تجهیزات و نصب مستقیماً از محل مابه‌التفاوت صرفه‌جویی قبض در ۱۲ ماه
              تسویه می‌شود.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
              <span>بانک خازنی هوشمند ۱۰۰ kVAR مدل ZN-CAP</span>
              <span className="text-[10px] font-mono text-slate-400">راکتور فیلتر ۷٪</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              کنترلر میکروپروسسوری با پله‌های تریستوری فوق سریع جهت حذف ۱۰۰٪ جریمه
              راکتیو.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
              <span>نصب اینورتر درایو دور متغیر (VFD اختصاصی)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              تطبیق بلادرنگ دور کمپرسور چیلر و هد هیدرولیک بوستر با تقاضای لحظه‌ای
              طبقات برج.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() =>
            alert('کارشناس ممیزی تأسیسات با دستگاه پاور آنالایزر اعزام خواهد شد.')
          }
          className="w-full h-12 bg-[#006948] hover:bg-[#00855d] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
        >
          <Zap className="w-4 h-4" />
          <span>درخواست اعزام کارشناس و پلاک‌خوانی موتورخانه</span>
        </button>

        <button
          type="button"
          onClick={onOpenReport}
          className="w-full h-10 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>دریافت دفترچه محاسباتی و چک‌لیست تجهیزات (PDF)</span>
        </button>

        <div className="pt-1 text-center">
          <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            اعزام تیم ممیزی با دستگاه پاور آنالایزر Fluke ظرف حداکثر ۴۸ ساعت کاری
          </span>
        </div>
      </div>
    </div>
  );
};
