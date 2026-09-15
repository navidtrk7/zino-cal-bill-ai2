import React from 'react';
import { BillData } from '../types';
import { AiAssistantCard } from './AiAssistantCard';
import { X, Sparkles } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: BillData;
  initialTab?: 'chat' | 'live' | 'transcribe';
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  bill,
  initialTab = 'chat',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <AiAssistantCard
          bill={bill}
          initialTab={initialTab}
          isCompact={false}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
