import React from 'react';
import { BillData } from '../types';
import {
  FileText,
  Download,
  Share2,
  Printer,
  X,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Send,
  UserCheck,
} from 'lucide-react';

interface OfficialReportModalProps {
  bill: BillData;
  isOpen: boolean;
  onClose: () => void;
  onRequestInspection?: () => void;
}

export const OfficialReportModal: React.FC<OfficialReportModalProps> = ({
  bill,
  isOpen,
  onClose,
  onRequestInspection,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `گزارش تحلیلی انرژی ${bill.title}`,
        text: `گزارش ممیزی و تحلیل قبض برق اشتراک ${bill.subscriptionNumber}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('لینک گزارش در کلیپ‌بورد کپی شد.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden my-auto border border-slate-200 text-right">
        {/* Modal Top Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-[#006948]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                گزارش تحلیلی و سند PDF (شهریور ۱۴۰۳)
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {bill.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              title="چاپ نسخه"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              title="اشتراک‌گذاری"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="بستن"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Pills Bar */}
        <div className="bg-white px-4 py-2 border-b border-slate-100 flex items-center justify-between no-print">
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              className="px-3 py-1 rounded-lg bg-emerald-50 text-[#006948] font-bold border border-emerald-200"
            >
              پیش‌نمایش سند رسمی
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="h-8 px-3 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود سند</span>
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto space-y-5 bg-white text-slate-900">
          {/* Official Letterhead */}
          <div className="border-b-2 border-[#006948] pb-4 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#006948] flex items-center justify-center text-white shrink-0">
                <Zap className="w-6 h-6 fill-white text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  شرکت مهندسی و بازرگانی زینو
                </h1>
                <span className="text-[11px] text-slate-500 font-medium block">
                  سهامی خاص • دپارتمان ممیزی و پایش انرژی
                </span>
                <span className="text-xs font-bold text-[#006948] block mt-0.5">
                  گزارش رسمی ممیزی فنی و تفکیک قبوض برق
                </span>
              </div>
            </div>

            {/* QR Code and verification */}
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200 text-center shrink-0">
              <QrCode className="w-10 h-10 text-slate-800" />
              <span className="text-[9px] text-slate-500 mt-1 font-mono">تأیید اصالت</span>
            </div>
          </div>

          {/* Reference Meta Box */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">شماره استناد پرونده</span>
              <span className="font-mono font-bold text-slate-900 dir-ltr inline-block mt-0.5">
                ZN-140306-9842
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">تاریخ ثبت و صدور</span>
              <span className="font-mono font-bold text-slate-900 mt-0.5 block">
                ۱۴۰۳/۰۶/۲۸
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">صحت‌سنجی OCR</span>
              <span className="font-bold text-[#006948] mt-0.5 block">
                {bill.ocrConfidence}٪ تأیید شده
              </span>
            </div>
          </div>

          {/* مشخصات فنی و هویتی اشتراک */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#006948]"></span>
                <span>مشخصات فنی و هویتی اشتراک</span>
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                {bill.tariffType}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">نام مشترک:</span>
                <span className="font-bold text-slate-900">{bill.customerName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">شناسه قبض:</span>
                <span className="font-mono font-bold text-slate-900">{bill.billId}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">شناسه پرداخت:</span>
                <span className="font-mono font-bold text-slate-900">{bill.paymentId}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">دیماند قراردادی:</span>
                <span className="font-bold text-slate-900">{bill.contractedDemand}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">سطح ولتاژ:</span>
                <span className="font-bold text-slate-900">{bill.voltageLevel}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">ضریب قرائت (CT):</span>
                <span className="font-mono font-bold text-slate-900">{bill.ctRatio}</span>
              </div>
            </div>
          </div>

          {/* ماتریس مصرف اکتیو ۳ زمانه */}
          <div>
            <h2 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006948]"></span>
              <span>ماتریس مصرف اکتیو ۳ زمانه (دوره ۳۰ روزه)</span>
            </h2>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-right divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-bold">
                  <tr>
                    <th className="py-2 px-3">بازه زمانی</th>
                    <th className="py-2 px-3 text-center">کیلووات‌ساعت</th>
                    <th className="py-2 px-3 text-center">سهم از کل</th>
                    <th className="py-2 px-3 text-left">وضعیت بار</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 px-3 font-medium">کم‌باری</td>
                    <td className="py-2 px-3 text-center font-mono font-bold">
                      {bill.lowPeak} kWh
                    </td>
                    <td className="py-2 px-3 text-center font-mono">۴۴.۳٪</td>
                    <td className="py-2 px-3 text-left text-[#006948] font-bold">بهینه</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">میان‌باری</td>
                    <td className="py-2 px-3 text-center font-mono font-bold">
                      {bill.midPeak} kWh
                    </td>
                    <td className="py-2 px-3 text-center font-mono">۳۴.۳٪</td>
                    <td className="py-2 px-3 text-left text-slate-600 font-medium">متوسط</td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="py-2 px-3 font-bold text-amber-900">اوج‌بار (پیک)</td>
                    <td className="py-2 px-3 text-center font-mono font-black text-amber-800">
                      {bill.highPeak} kWh
                    </td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-amber-800">
                      ۲۱.۴٪
                    </td>
                    <td className="py-2 px-3 text-left text-amber-700 font-bold">سنگین</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="py-2.5 px-3">مجموع مصرف</td>
                    <td className="py-2.5 px-3 text-center font-mono font-black text-[#006948]">
                      {bill.activeEnergyTotal} kWh
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">۱۰۰٪</td>
                    <td className="py-2.5 px-3 text-left text-[#006948]">مجاز</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* تفکیک مالی، بهای انرژی و هزینه‌های تحمیلی */}
          <div>
            <h2 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006948]"></span>
              <span>تفکیک مالی، بهای انرژی و هزینه‌های تحمیلی</span>
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">بهای پایه انرژی اکتیو:</span>
                <span className="font-mono font-bold text-slate-800">
                  {bill.baseEnergyCost.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">بهای ساعات اوج‌بار (نرخ مضاعف پیک):</span>
                <span className="font-mono font-bold text-amber-800">
                  {bill.peakHoursCost.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <div>
                    <span className="font-bold text-red-900 block">
                      جریمه راکتیو (ضریب زیان Cos φ = ۰.۷۸):
                    </span>
                    <span className="text-[10px] text-red-700">
                      ۱۰۰٪ با نصب بانک خازن قابل حذف است
                    </span>
                  </div>
                </div>
                <span className="font-mono font-black text-red-700 text-sm">
                  {bill.reactivePenalty.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">عوارض برق و مالیات ارزش افزوده (۱۰٪):</span>
                <span className="font-mono font-medium text-slate-600">
                  {bill.taxAndDuties.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              {/* Total Box */}
              <div className="p-3.5 rounded-xl bg-slate-100 flex items-center justify-between mt-2">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  مبلغ کل قابل پرداخت صورتحساب:
                </span>
                <div className="text-left font-mono font-black text-slate-900 text-base sm:text-lg">
                  {bill.totalAmount.toLocaleString('fa-IR')}{' '}
                  <span className="text-xs font-normal text-slate-600">تومان</span>
                </div>
              </div>
            </div>
          </div>

          {/* تحلیل مهندسی زینو و پیشنهاد راهکار */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
            <h3 className="font-bold text-amber-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-800" />
              <span>تحلیل مهندسی زینو و پیشنهاد راهکار</span>
            </h3>
            <p className="text-amber-900 leading-relaxed font-normal">
              ضریب توان مجتمع نگین آفریقا به دلیل بار موتوری آسانسورها و چیلرها بدون
              جبران‌سازی خازنی بر روی <strong>۰.۷۸</strong> افت کرده است. نصب بانک
              خازنی تمام‌اتوماتیک ۱۰۰ کیلووار مدل <strong>ZN-CAP-IND</strong> زینو
              علاوه بر توقف کامل جریمه ماهیانه ۳۲۵ هزار تومانی، سرمایه‌گذاری را در
              کمتر از <strong>۸ ماه</strong> بازمی‌گرداند.
            </p>
          </div>

          {/* Signature & Digital Stamp */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">تأییدیه دفتر فنی ممیزی زینو</span>
              <span className="font-bold text-slate-900 block mt-0.5">
                مهندس ر. کاظمی (ممیز ارشد)
              </span>
              <span className="font-mono text-[10px] text-slate-500 dir-ltr inline-block">
                کد رهگیری: ZN-ENG-IR-884
              </span>
            </div>

            <div className="p-2.5 rounded-xl border-2 border-dashed border-emerald-600 bg-emerald-50/50 text-center">
              <div className="text-[11px] font-black text-[#006948]">مهر دیجیتال ZINO</div>
              <div className="text-[9px] text-emerald-800 mt-0.5">
                معتبر با امضای کریپتوگرافیک
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 no-print">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none h-10 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دریافت PDF (۱.۴ مگابایت)</span>
            </button>
            <button
              onClick={handleShare}
              className="flex-1 sm:flex-none h-10 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ارسال واتساپ / ایمیل</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onRequestInspection) onRequestInspection();
            }}
            className="w-full sm:w-auto h-10 px-4 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <UserCheck className="w-4 h-4" />
            <span>درخواست بازدید حضوری و صدور پیش‌فاکتور</span>
          </button>
        </div>
      </div>
    </div>
  );
};
