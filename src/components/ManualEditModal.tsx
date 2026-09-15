import React, { useState } from 'react';
import { BillData } from '../types';
import { X, Save, Edit3, RotateCcw } from 'lucide-react';

interface ManualEditModalProps {
  bill: BillData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedBill: BillData) => void;
}

export const ManualEditModal: React.FC<ManualEditModalProps> = ({
  bill,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<BillData>({ ...bill });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden my-auto border border-slate-200 text-right">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-[#006948]">
              <Edit3 className="w-4 h-4" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900">
              ویرایش دستی ارقام و مقادیر صورتحساب
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">
              عنوان اشتراک / مشترک
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full h-9 px-3 rounded-xl border border-slate-200 focus:border-[#006948] outline-none text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                شماره پرونده / اشتراک
              </label>
              <input
                type="text"
                value={formData.subscriptionNumber}
                onChange={(e) =>
                  setFormData({ ...formData, subscriptionNumber: e.target.value })
                }
                className="w-full h-9 px-3 rounded-xl border border-slate-200 focus:border-[#006948] outline-none text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                کد تعرفه
              </label>
              <input
                type="text"
                value={formData.tariffCode}
                onChange={(e) =>
                  setFormData({ ...formData, tariffCode: e.target.value })
                }
                className="w-full h-9 px-3 rounded-xl border border-slate-200 focus:border-[#006948] outline-none text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-slate-600 font-medium mb-1 text-[11px]">
                کم‌باری (kWh)
              </label>
              <input
                type="number"
                value={formData.lowPeak}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData({
                    ...formData,
                    lowPeak: val,
                    activeEnergyTotal: val + formData.midPeak + formData.highPeak,
                  });
                }}
                className="w-full h-8 px-2 rounded-lg border border-slate-200 focus:border-[#006948] outline-none text-slate-800 font-mono text-center"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1 text-[11px]">
                میان‌باری (kWh)
              </label>
              <input
                type="number"
                value={formData.midPeak}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData({
                    ...formData,
                    midPeak: val,
                    activeEnergyTotal: formData.lowPeak + val + formData.highPeak,
                  });
                }}
                className="w-full h-8 px-2 rounded-lg border border-slate-200 focus:border-[#006948] outline-none text-slate-800 font-mono text-center"
              />
            </div>
            <div>
              <label className="block text-amber-700 font-bold mb-1 text-[11px]">
                اوج‌بار (kWh)
              </label>
              <input
                type="number"
                value={formData.highPeak}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData({
                    ...formData,
                    highPeak: val,
                    activeEnergyTotal: formData.lowPeak + formData.midPeak + val,
                  });
                }}
                className="w-full h-8 px-2 rounded-lg border border-amber-300 focus:border-amber-500 outline-none text-amber-900 font-mono text-center font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-red-600 font-bold mb-1">
                جریمه راکتیو (تومان)
              </label>
              <input
                type="number"
                value={formData.reactivePenalty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reactivePenalty: Number(e.target.value),
                  })
                }
                className="w-full h-9 px-3 rounded-xl border border-red-300 focus:border-red-500 outline-none text-red-700 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                ضریب توان (Cos φ)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={formData.cosPhi}
                onChange={(e) =>
                  setFormData({ ...formData, cosPhi: Number(e.target.value) })
                }
                className="w-full h-9 px-3 rounded-xl border border-slate-200 focus:border-[#006948] outline-none text-slate-800 font-mono text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#006948] font-bold mb-1">
              مبلغ کل پرداختی قبض (تومان)
            </label>
            <input
              type="number"
              value={formData.totalAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalAmount: Number(e.target.value),
                  totalAmountRials: Number(e.target.value) * 10,
                })
              }
              className="w-full h-10 px-3 rounded-xl border border-emerald-300 focus:border-[#006948] outline-none text-[#006948] font-mono font-black text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>ذخیره تغییرات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
