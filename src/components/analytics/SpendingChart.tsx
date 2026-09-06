import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';
import { PieChart as PieIcon, BarChart2 } from 'lucide-react';

export const SpendingChart: React.FC = () => {
  const { categorySummaries, totalSpent } = useExpenses();
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');

  const chartData = categorySummaries
    .filter((item) => item.total > 0)
    .map((item) => ({
      name: item.category,
      value: item.total,
      percentage: item.percentage,
      count: item.count,
      color: item.color,
    }));

  if (totalSpent === 0 || chartData.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
        <p className="text-slate-400 text-sm">
          No spending data available yet. Record expenses to visualize category spending.
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold">{data.name}</p>
          <p className="text-slate-300">
            Amount: <span className="font-semibold text-white">{formatCurrency(data.value)}</span>
          </p>
          <p className="text-slate-300">
            Share: <span className="font-semibold text-white">{data.percentage}%</span>
          </p>
          <p className="text-slate-400 text-[11px]">{data.count} transactions</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Spending by Category</h3>
          <p className="text-xs text-slate-500">Visual distribution of expenses</p>
        </div>

        {/* Toggle between Donut and Bar */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setChartType('donut')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              chartType === 'donut'
                ? 'bg-white text-primary-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Donut Chart"
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Donut</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              chartType === 'bar'
                ? 'bg-white text-primary-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Bar Chart"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bar</span>
          </button>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'donut' ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 border-t border-slate-100 text-xs">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 font-medium text-slate-700">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.name}</span>
            <span className="text-slate-400 font-normal">({item.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};
