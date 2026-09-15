import React, { useState } from 'react';
import { ActiveTab, DisplayMode, BillData } from './types';
import { initialBills } from './data/mockData';
import { Header } from './components/Header';
import { MobileTabBar, DesktopSidebar } from './components/Navigation';
import { UploadLandingView } from './components/UploadLandingView';
import { OcrResultView } from './components/OcrResultView';
import { ReportsRoiView } from './components/ReportsRoiView';
import { DashboardView } from './components/DashboardView';
import { SolutionsView } from './components/SolutionsView';
import { AuditView } from './components/AuditView';
import { FutureBillForecast } from './components/FutureBillForecast';
import { OfficialReportModal } from './components/OfficialReportModal';
import { ManualEditModal } from './components/ManualEditModal';
import { BillPreviewModal } from './components/BillPreviewModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('upload');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('responsive');
  const [currentBill, setCurrentBill] = useState<BillData>(initialBills.commercial);

  // Modals state
  const [isOfficialReportOpen, setIsOfficialReportOpen] = useState(false);
  const [isManualEditOpen, setIsManualEditOpen] = useState(false);
  const [isBillPreviewOpen, setIsBillPreviewOpen] = useState(false);

  // Handle bill selection from preset or scan
  const handleSelectBill = (bill: BillData) => {
    setCurrentBill(bill);
  };

  const handleScanComplete = () => {
    setActiveTab('ocr-result');
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <UploadLandingView
            onSelectBill={handleSelectBill}
            onScanComplete={handleScanComplete}
          />
        );
      case 'ocr-result':
        return (
          <OcrResultView
            bill={currentBill}
            onNext={() => setActiveTab('reports-roi')}
            onEdit={() => setIsManualEditOpen(true)}
            onReupload={() => setActiveTab('upload')}
            onPreviewBillImage={() => setIsBillPreviewOpen(true)}
          />
        );
      case 'reports-roi':
        return (
          <ReportsRoiView
            bill={currentBill}
            onViewSolutions={() => setActiveTab('solutions')}
            onViewAudit={() => setActiveTab('audit')}
            onViewForecast={() => setActiveTab('forecast')}
          />
        );
      case 'forecast':
        return (
          <FutureBillForecast
            bill={currentBill}
            onViewSolutions={() => setActiveTab('solutions')}
            onViewAudit={() => setActiveTab('audit')}
            onOpenReport={() => setIsOfficialReportOpen(true)}
          />
        );
      case 'dashboard':
        return (
          <DashboardView
            bill={currentBill}
            onViewBillDetails={(period) => {
              setActiveTab('ocr-result');
            }}
            onViewSolutions={() => setActiveTab('solutions')}
            onViewForecast={() => setActiveTab('forecast')}
            onAddNewBill={() => setActiveTab('upload')}
            onOpenPdfReport={() => setIsOfficialReportOpen(true)}
          />
        );
      case 'solutions':
        return <SolutionsView bill={currentBill} />;
      case 'audit':
        return (
          <AuditView
            bill={currentBill}
            onOpenReport={() => setIsOfficialReportOpen(true)}
          />
        );
      case 'official-report':
        return (
          <div className="w-full max-w-xl mx-auto py-6 px-4 text-center">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#006948] mx-auto flex items-center justify-center mb-3 border border-emerald-200">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                سند رسمی ممیزی و تحلیل تفکیکی قبض برق
              </h2>
              <p className="text-xs text-slate-500 mb-5 max-w-md mx-auto leading-relaxed">
                نسخه کامل ممهور به مهر دیجیتال شرکت زینو، شامل محاسبات ریز تعرفه توانیر
                و جدول استهلاک سرمایه‌گذاری بانک خازنی.
              </p>
              <button
                onClick={() => setIsOfficialReportOpen(true)}
                className="h-11 px-6 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <span>باز کردن و مشاهده سند رسمی PDF</span>
              </button>
            </div>
          </div>
        );
      default:
        return (
          <UploadLandingView
            onSelectBill={handleSelectBill}
            onScanComplete={handleScanComplete}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans antialiased selection:bg-[#006948]/20 selection:text-[#006948]">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        onOpenOfficialReport={() => setIsOfficialReportOpen(true)}
      />

      {/* Main Content Area based on Display Mode */}
      {displayMode === 'mobile' ? (
        /* Mobile Device Frame Mockup */
        <main className="flex-1 flex items-center justify-center p-2 sm:p-6 bg-slate-200/70">
          <div className="w-full max-w-[420px] h-[844px] max-h-[90vh] bg-white rounded-[40px] shadow-2xl border-8 border-slate-800 flex flex-col overflow-hidden relative">
            {/* Mobile Top Status Bar */}
            <div className="h-9 bg-white shrink-0 px-6 flex items-center justify-between text-[11px] font-mono font-bold text-slate-800 select-none z-30 border-b border-slate-100">
              <span>9:41</span>
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
              <div className="flex items-center gap-1.5 text-xs">
                <span>5G</span>
                <span className="w-5 h-2.5 border border-slate-800 rounded-xs inline-block relative p-0.5">
                  <span className="w-full h-full bg-slate-800 block rounded-xs"></span>
                </span>
              </div>
            </div>

            {/* Mobile App Title Bar */}
            <div className="bg-white border-b border-slate-100 px-4 py-2 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#006948] flex items-center justify-center text-white text-[10px] font-bold">
                  Z
                </div>
                <span className="text-xs font-black text-slate-800">
                  قبض‌خوان هوشمند زینو
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#006948] bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                تعرفه ۱۴۰۵
              </span>
            </div>

            {/* Scrollable View Container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#f8fafc] p-2">
              {renderActiveView()}
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <MobileTabBar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isMobileShell
            />
          </div>
        </main>
      ) : displayMode === 'desktop' ? (
        /* Desktop Workspace with Sidebar */
        <div className="flex-1 flex max-w-7xl w-full mx-auto overflow-hidden">
          <DesktopSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f8fafc]">
            {renderActiveView()}
          </main>
        </div>
      ) : (
        /* Fluid Responsive Layout (Mobile bar on mobile, full width on desktop) */
        <div className="flex-1 flex flex-col md:flex-row max-w-6xl w-full mx-auto">
          {/* Desktop sidebar visible on md+ screens */}
          <div className="hidden md:block">
            <DesktopSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <main className="flex-1 p-2 sm:p-4 pb-20 md:pb-6 overflow-y-auto">
            {renderActiveView()}
          </main>

          {/* Mobile bottom navigation visible on mobile screens only */}
          <div className="fixed bottom-0 inset-x-0 md:hidden z-30 shadow-lg">
            <MobileTabBar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <OfficialReportModal
        bill={currentBill}
        isOpen={isOfficialReportOpen}
        onClose={() => setIsOfficialReportOpen(false)}
        onRequestInspection={() => {
          setActiveTab('solutions');
        }}
      />

      <ManualEditModal
        bill={currentBill}
        isOpen={isManualEditOpen}
        onClose={() => setIsManualEditOpen(false)}
        onSave={(updated) => setCurrentBill(updated)}
      />

      <BillPreviewModal
        bill={currentBill}
        isOpen={isBillPreviewOpen}
        onClose={() => setIsBillPreviewOpen(false)}
      />
    </div>
  );
}
