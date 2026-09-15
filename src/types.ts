export interface BillData {
  id: string;
  title: string;
  customerName: string;
  subscriptionNumber: string;
  tariffType: string;
  tariffCode: string;
  periodDays: number;
  periodDates: string;
  periodMonth: string;
  billId: string;
  paymentId: string;
  activeEnergyTotal: number;
  lowPeak: number;
  midPeak: number;
  highPeak: number;
  cosPhi: number;
  cosPhiLimit: number;
  contractedDemand: string;
  connectionType: string;
  voltageLevel: string;
  ctRatio: string;
  baseEnergyCost: number;
  peakHoursCost: number;
  reactivePenalty: number;
  taxAndDuties: number;
  totalAmount: number;
  totalAmountRials: number;
  savingsOpportunity: number;
  fileName: string;
  fileSize: string;
  ocrConfidence: number;
  statusLabel: string;
  statusType: 'critical' | 'warning' | 'normal';
}

export interface EquipmentAuditItem {
  id: string;
  name: string;
  category: 'chiller' | 'pump' | 'elevator';
  capacity: string;
  countInfo: string;
  cosPhi: number;
  cosPhiStatus: 'critical' | 'warning' | 'normal';
  sharePercent: number;
  statusDetails: string;
  monthlyLossAmount: number;
  lossDetails: string;
  recommendationAction: string;
  savingPercent: number;
  technicalBadge?: string;
  electricalSpecs: {
    label: string;
    value: string;
  }[];
}

export interface HistoricalBill {
  id: string;
  periodName: string;
  periodNumber: number;
  days: number;
  totalAmount: number;
  reactivePenalty: number;
  statusTag: string;
  statusColor: 'critical' | 'warning' | 'success' | 'normal';
  lowPeakKwh: number;
  midPeakKwh: number;
  highPeakKwh: number;
  dailyAvgKwh: number;
}

export type ActiveTab =
  | 'upload'
  | 'ocr-result'
  | 'reports-roi'
  | 'forecast'
  | 'dashboard'
  | 'solutions'
  | 'audit'
  | 'official-report';

export interface ForecastParams {
  targetMonth: string;
  seasonalTrendPercent: number; // e.g. -22%
  seasonalPreset: 'autumn-mild' | 'late-heat' | 'early-cold' | 'custom';
  powerFactorCorrection: 'none' | 'partial' | 'zino-smart'; // none: current cosPhi, zino: 0.95+
  peakShiftPercent: number; // 0% to 30% shift to low peak
}

export interface ProjectedBillItem {
  baseEnergyCost: number;
  peakHoursCost: number;
  reactivePenalty: number;
  taxAndDuties: number;
  totalAmount: number;
  activeEnergyTotal: number;
  cosPhi: number;
}

export type DisplayMode = 'responsive' | 'mobile-view' | 'desktop-view';
