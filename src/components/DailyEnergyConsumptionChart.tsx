import React, { useState, useMemo } from 'react';
import { BillData } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  CalendarDays,
  Flame,
  TrendingUp,
  Sun,
  Activity,
  Filter,
  BarChart2,
  LineChart,
  Info,
} from 'lucide-react';

interface DailyEnergyConsumptionChartProps {
  bill: BillData;
}

interface DailyRecord {
  dayIndex: number;
  dayLabel: string;
  isHoliday: boolean;
  isHeatwave: boolean;
  lowPeak: number;
  midPeak: number;
  highPeak: number;
  totalKwh: number;
  cosPhi: number;
  estimatedCost: number;
}

// Helper to generate consistent daily simulated load data matching the bill's totals and characteristics
function generateDailyLoadData(bill: BillData): DailyRecord[] {
  const daysCount = bill.periodDays || 30;
  const avgKwh = bill.activeEnergyTotal / daysCount;

  // Distribute totals realistically across weekdays, weekends, and summer heatwaves
  const records: DailyRecord[] = [];
  let accumulatedLow = 0;
  let accumulatedMid = 0;
  let accumulatedHigh = 0;

  for (let i = 1; i <= daysCount; i++) {
    // Determine weekday vs Friday (Friday in Iran is every 7th day, say days 4, 11, 18, 25)
    const isHoliday = i % 7 === 4 || i === 15; // Friday or national holiday
    // Mid-month heatwave days (e.g. days 16, 17, 18, 19)
    const isHeatwave = i >= 16 && i <= 19;

    let dayFactor = 1.0;
    if (bill.id === 'commercial' || bill.id === 'residential') {
      // Commercial buildings use less on holidays, more during heatwaves
      dayFactor = isHoliday ? 0.45 : isHeatwave ? 1.38 : 0.95 + (Math.sin(i * 1.3) * 0.12);
    } else {
      // Industrial plant runs steady shifts with slight drop on Fridays
      dayFactor = isHoliday ? 0.75 : isHeatwave ? 1.15 : 0.98 + (Math.sin(i * 0.9) * 0.08);
    }

    const dayTotal = Math.round(avgKwh * dayFactor);
    // Proportionally split into low, mid, high peak
    const lowRatio = bill.lowPeak / (bill.activeEnergyTotal || 1);
    const midRatio = bill.midPeak / (bill.activeEnergyTotal || 1);
    const highRatio = bill.highPeak / (bill.activeEnergyTotal || 1);

    // High peak spikes more during heatwaves due to cooling chillers
    const highMultiplier = isHeatwave ? 1.35 : isHoliday ? 0.6 : 1.0;
    const high = Math.round(dayTotal * highRatio * highMultiplier);
    const mid = Math.round(dayTotal * midRatio);
    const low = Math.max(1, dayTotal - high - mid);
    const realTotal = low + mid + high;

    accumulatedLow += low;
    accumulatedMid += mid;
    accumulatedHigh += high;

    // Cos phi fluctuates: during heatwaves with heavy inductive compressor motor loads, cos phi worsens
    const baseCos = bill.cosPhi;
    const dayCosPhi = isHeatwave
      ? Number((baseCos - 0.04).toFixed(2))
      : isHoliday
      ? Number((baseCos + 0.03).toFixed(2))
      : Number((baseCos + Math.sin(i * 0.7) * 0.02).toFixed(2));

    const estCost = Math.round((realTotal / (bill.activeEnergyTotal || 1)) * bill.totalAmount);

    records.push({
      dayIndex: i,
      dayLabel: `روز ${i.toLocaleString('fa-IR')}`,
      isHoliday,
      isHeatwave,
      lowPeak: low,
      midPeak: mid,
      highPeak: high,
      totalKwh: realTotal,
      cosPhi: Math.min(0.95, Math.max(0.65, dayCosPhi)),
      estimatedCost: estCost,
    });
  }

  return records;
}

export const DailyEnergyConsumptionChart: React.FC<DailyEnergyConsumptionChartProps> = ({ bill }) => {
  const { theme } = useTheme();
  const [viewType, setViewType] = useState<'stacked-bar' | 'composed-area'>('stacked-bar');
  const [filterMode, setFilterMode] = useState<'all' | 'last-week' | 'working-days'>('all');

  // Generate records based on current bill data
  const rawRecords = useMemo(() => generateDailyLoadData(bill), [bill]);

  // Filtered dataset
  const displayRecords = useMemo(() => {
    if (filterMode === 'last-week') {
      return rawRecords.slice(-7);
    }
    if (filterMode === 'working-days') {
      return rawRecords.filter((r) => !r.isHoliday);
    }
    return rawRecords;
  }, [rawRecords, filterMode]);

  // Key metrics calculation
  const metrics = useMemo(() => {
    if (!displayRecords.length) {
      return { avg: 0, max: 0, maxDay: '', min: 0, minDay: '', total: 0, heatwaveCount: 0 };
    }
    let max = displayRecords[0].totalKwh;
    let maxDay = displayRecords[0].dayLabel;
    let min = displayRecords[0].totalKwh;
    let minDay = displayRecords[0].dayLabel;
    let sum = 0;
    let heatwaveCount = 0;

    displayRecords.forEach((r) => {
      sum += r.totalKwh;
      if (r.totalKwh > max) {
        max = r.totalKwh;
        maxDay = r.dayLabel;
      }
      if (r.totalKwh < min) {
        min = r.totalKwh;
        minDay = r.dayLabel;
      }
      if (r.isHeatwave) heatwaveCount++;
    });

    const avg = Math.round(sum / displayRecords.length);
    return { avg, max, maxDay, min, minDay, total: sum, heatwaveCount };
  }, [displayRecords]);

  // Custom Recharts Tooltip with Persian layout & numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: DailyRecord = payload[0]?.payload;
      if (!data) return null;

      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-right font-sans text-xs min-w-[200px] backdrop-blur-xs">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-2">
            <span className="font-bold text-slate-100 flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5 text-emerald-400" />
              <span>{data.dayLabel} ({bill.periodDates?.split('تا')[0]?.trim() || 'دوره'})</span>
            </span>
            {data.isHeatwave ? (
              <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-semibold flex items-center gap-0.5">
                <Sun className="w-2.5 h-2.5" />
                موج گرما
              </span>
            ) : data.isHoliday ? (
              <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-semibold">
                تعطیل
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">روز کاری</span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-amber-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-amber-500 inline-block"></span>
                اوج‌بار (پیک):
              </span>
              <span className="font-mono font-bold">
                {data.highPeak.toLocaleString('fa-IR')} kWh
              </span>
            </div>

            <div className="flex items-center justify-between text-emerald-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block"></span>
                میان‌باری:
              </span>
              <span className="font-mono font-bold">
                {data.midPeak.toLocaleString('fa-IR')} kWh
              </span>
            </div>

            <div className="flex items-center justify-between text-[#22c55e]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-[#006948] inline-block"></span>
                کم‌باری:
              </span>
              <span className="font-mono font-bold">
                {data.lowPeak.toLocaleString('fa-IR')} kWh
              </span>
            </div>

            <div className="border-t border-slate-800 pt-1.5 mt-1.5 flex items-center justify-between font-bold text-white">
              <span>مجموع مصرف روز:</span>
              <span className="font-mono text-emerald-400 text-sm">
                {data.totalKwh.toLocaleString('fa-IR')} kWh
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5">
              <span>ضریب توان (Cos φ):</span>
              <span
                className={`font-mono font-bold ${
                  data.cosPhi < 0.85 ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {data.cosPhi.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
              <span>بهای تخمینی روز:</span>
              <span className="font-mono">
                {data.estimatedCost.toLocaleString('fa-IR')} تومان
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 transition-colors">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#006948] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              نمودار مصرف انرژی روزانه (Daily Energy Profile)
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#006948] dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
              Recharts
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            پایش نوسانات بار، تقاضای اوج و ضریب توان در طول بازه {bill.periodDays} روزه قبض
          </p>
        </div>

        {/* View and Filter Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-slate-700 text-[#006948] dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              کل دوره ({bill.periodDays} روز)
            </button>
            <button
              onClick={() => setFilterMode('last-week')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                filterMode === 'last-week'
                  ? 'bg-white dark:bg-slate-700 text-[#006948] dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              ۷ روز آخر
            </button>
            <button
              onClick={() => setFilterMode('working-days')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                filterMode === 'working-days'
                  ? 'bg-white dark:bg-slate-700 text-[#006948] dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              روزهای کاری
            </button>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewType('stacked-bar')}
              title="نمودار میله‌ای تفکیک سه‌زمانه"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewType === 'stacked-bar'
                  ? 'bg-white dark:bg-slate-700 text-[#006948] dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewType('composed-area')}
              title="نمودار مساحتی و پروفایل بار"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewType === 'composed-area'
                  ? 'bg-white dark:bg-slate-700 text-[#006948] dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Mini Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-right">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">میانگین روزانه</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              {metrics.avg.toLocaleString('fa-IR')}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">kWh/روز</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 text-right">
          <span className="text-[10px] text-amber-800 dark:text-amber-300 block font-medium flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            بیشینه اوج تقاضا ({metrics.maxDay})
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono font-bold text-amber-900 dark:text-amber-200 text-sm">
              {metrics.max.toLocaleString('fa-IR')}
            </span>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">kWh</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70 text-right">
          <span className="text-[10px] text-emerald-800 dark:text-emerald-300 block font-medium">
            کمترین مصرف ({metrics.minDay})
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono font-bold text-[#006948] dark:text-emerald-300 text-sm">
              {metrics.min.toLocaleString('fa-IR')}
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">kWh</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-right">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">ضریب بار (Load Factor)</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              {metrics.max > 0 ? Math.round((metrics.avg / metrics.max) * 100) : 0}٪
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">نوسان متعادل</span>
          </div>
        </div>
      </div>

      {/* Main Recharts Container */}
      <div className="w-full h-72 sm:h-80 pt-2 pb-1" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          {viewType === 'stacked-bar' ? (
            <ComposedChart
              data={displayRecords}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
              <XAxis
                dataKey="dayIndex"
                tickLine={false}
                stroke={theme === 'dark' ? '#64748b' : '#94a3b8'}
                fontSize={11}
                tickFormatter={(val) => `${val}`}
              />
              <YAxis
                tickLine={false}
                stroke={theme === 'dark' ? '#64748b' : '#94a3b8'}
                fontSize={11}
                domain={[0, 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={metrics.avg}
                stroke={theme === 'dark' ? '#34d399' : '#006948'}
                strokeDasharray="4 4"
                label={{
                  value: `میانگین: ${metrics.avg} kWh`,
                  position: 'insideTopRight',
                  fill: theme === 'dark' ? '#34d399' : '#006948',
                  fontSize: 10,
                  fontFamily: 'Vazirmatn, sans-serif',
                }}
              />
              {/* Stacked Bars representing the 3 tariff zones */}
              <Bar
                dataKey="lowPeak"
                name="کم‌باری"
                stackId="a"
                fill={theme === 'dark' ? '#059669' : '#006948'}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="midPeak"
                name="میان‌باری"
                stackId="a"
                fill="#10b981"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="highPeak"
                name="اوج‌بار"
                stackId="a"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="totalKwh"
                name="کل مصرف روزانه"
                stroke={theme === 'dark' ? '#38bdf8' : '#0f172a'}
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          ) : (
            <ComposedChart
              data={displayRecords}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="totalKwhGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme === 'dark' ? '#10b981' : '#006948'} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={theme === 'dark' ? '#10b981' : '#006948'} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="highPeakGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
              <XAxis
                dataKey="dayIndex"
                tickLine={false}
                stroke={theme === 'dark' ? '#64748b' : '#94a3b8'}
                fontSize={11}
                tickFormatter={(val) => `${val}`}
              />
              <YAxis
                tickLine={false}
                stroke={theme === 'dark' ? '#64748b' : '#94a3b8'}
                fontSize={11}
                domain={[0, 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={metrics.avg}
                stroke={theme === 'dark' ? '#34d399' : '#006948'}
                strokeDasharray="4 4"
                label={{
                  value: `میانگین دوره: ${metrics.avg} kWh`,
                  position: 'insideTopRight',
                  fill: theme === 'dark' ? '#34d399' : '#006948',
                  fontSize: 10,
                  fontFamily: 'Vazirmatn, sans-serif',
                }}
              />
              <Area
                type="monotone"
                dataKey="totalKwh"
                name="کل بار مصرفی (kWh)"
                stroke={theme === 'dark' ? '#34d399' : '#006948'}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#totalKwhGrad)"
              />
              <Area
                type="monotone"
                dataKey="highPeak"
                name="بار ساعات اوج (kWh)"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#highPeakGrad)"
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Legend and Descriptive Highlights */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#006948] dark:bg-emerald-600"></span>
            کم‌باری (۲۳ تا ۷)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-500"></span>
            میان‌باری (۷ تا ۱۳ و ۱۷ تا ۱۹)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-amber-500"></span>
            اوج‌بار پیک (۱۳ تا ۱۷ و ۱۹ تا ۲۳)
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`w-4 h-0.5 ${theme === 'dark' ? 'bg-sky-400' : 'bg-slate-900'}`}></span>
            پروفایل کل روز
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/60 font-medium">
          <Sun className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>روزهای ۱۶ تا ۱۹: جهش بار ناشی از دمای بالای ۴۰ درجه و عملکرد چیلرها</span>
        </div>
      </div>
    </div>
  );
};
