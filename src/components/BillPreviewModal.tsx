import React from 'react';
import { BillData } from '../types';
import { X, Eye, Barcode, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface BillPreviewModalProps {
  bill: BillData;
  isOpen: boolean;
  onClose: () => void;
}

export const BillPreviewModal: React.FC<BillPreviewModalProps> = ({
  bill,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden my-auto border border-slate-200 text-right">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-[#006948]">
              <Eye className="w-4 h-4" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900">
              پیش‌نمایش سند اسکن‌شده قبض برق
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bill Replica (Tavanir Style) */}
        <div className="p-4 sm:p-6 bg-slate-50 overflow-y-auto max-h-[70vh]">
          <div className="bg-white border-2 border-slate-300 rounded-xl p-4 shadow-sm space-y-3 text-xs font-sans">
            {/* Header of bill */}
            <div className="border-b border-slate-300 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#006948] flex items-center justify-center text-white">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-xs block">
                    شرکت توزیع نیروی برق تهران بزرگ
                  </span>
                  <span className="text-[10px] text-slate-500">
                    صورتحساب بهای برق مصرفی و خدمات عمومی
                  </span>
                </div>
              </div>
              <div className="text-left font-mono text-[10px] text-slate-600">
                <span>کد رایانه: ۹۸۴۲۱۰۴</span>
              </div>
            </div>

            {/* Subscriber Info */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px]">
              <div>
                <span className="text-slate-500">نام مشترک: </span>
                <span className="font-bold text-slate-800">{bill.customerName}</span>
              </div>
              <div>
                <span className="text-slate-500">شماره پرونده: </span>
                <span className="font-mono font-bold text-slate-800">{bill.subscriptionNumber}</span>
              </div>
              <div>
                <span className="text-slate-500">نوع تعرفه: </span>
                <span className="font-medium text-slate-800">{bill.tariffType}</span>
              </div>
              <div>
                <span className="text-slate-500">دیماند / ولتاژ: </span>
                <span className="font-mono text-slate-800">{bill.contractedDemand} / {bill.voltageLevel}</span>
              </div>
            </div>

            {/* Consumption Table */}
            <div>
              <div className="text-[10px] font-bold text-slate-700 mb-1">
                جدول مصارف ۳ زمانه کنتور دیجیتال (kWh):
              </div>
              <table className="w-full text-center border border-slate-200 rounded text-[11px]">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="py-1 border-b">کم‌باری</th>
                    <th className="py-1 border-b">میان‌باری</th>
                    <th className="py-1 border-b">اوج‌بار</th>
                    <th className="py-1 border-b">مجموع کل</th>
                  </tr>
                </thead>
                <tbody className="font-mono font-bold text-slate-800">
                  <tr>
                    <td className="py-1.5">{bill.lowPeak}</td>
                    <td className="py-1.5">{bill.midPeak}</td>
                    <td className="py-1.5 text-amber-700">{bill.highPeak}</td>
                    <td className="py-1.5 text-[#006948]">{bill.activeEnergyTotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Financials & Penalties */}
            <div className="border border-slate-200 rounded-lg p-2.5 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>بهای انرژی مصرفی اکتیو:</span>
                <span className="font-mono">{bill.baseEnergyCost.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex justify-between text-amber-800 font-medium">
                <span>مابه‌التفاوت ساعات اوج بار:</span>
                <span className="font-mono">{bill.peakHoursCost.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex justify-between text-red-700 font-bold bg-red-50 p-1 rounded">
                <span>مازاد بهای توان راکتیو (جریمه خازنی):</span>
                <span className="font-mono">{bill.reactivePenalty.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>عوارض و مالیات قانونی:</span>
                <span className="font-mono">{bill.taxAndDuties.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t pt-1 text-xs">
                <span>مبلغ قابل پرداخت صورتحساب:</span>
                <span className="font-mono text-[#006948]">{bill.totalAmount.toLocaleString('fa-IR')} تومان</span>
              </div>
            </div>

            {/* Barcodes */}
            <div className="flex items-center justify-around pt-2 border-t border-slate-200">
              <div className="text-center font-mono">
                <div className="h-7 w-28 bg-slate-800 mx-auto rounded-xs opacity-70 flex items-center justify-center text-[9px] text-white tracking-widest">
                  ||||| | ||||| ||
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">شناسه قبض: {bill.billId}</span>
              </div>
              <div className="text-center font-mono">
                <div className="h-7 w-28 bg-slate-800 mx-auto rounded-xs opacity-70 flex items-center justify-center text-[9px] text-white tracking-widest">
                  |||| ||| |||| |
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">شناسه پرداخت: {bill.paymentId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            استخراج ۱۰۰٪ فیلدها توسط سامانه پردازش هوشمند زینو
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#006948] text-white text-xs font-bold transition-colors"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
};
