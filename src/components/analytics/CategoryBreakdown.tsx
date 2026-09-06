import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { CategoryBadge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Flame, Calculator, Award, Receipt } from 'lucide-react';

export const CategoryBreakdown: React.FC = () => {
  const { categorySummaries, totalSpent, highestExpense, expenses } = useExpenses();

  const averageExpense =
    expenses.length > 0 ? Math.round(totalSpent / expenses.length) : 0;

  // Filter categories that have transactions or sort by highest spending
  const sortedCategories = [...categorySummaries].sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spending */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Spending
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-2xl font-black text-slate-900">{formatCurrency(totalSpent)}</h4>
          <p className="text-xs text-slate-500 mt-1">Across all categories</p>
        </div>

        {/* Highest Expense */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Highest Expense
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-2xl font-black text-rose-600">
            {highestExpense ? formatCurrency(highestExpense.amount) : '₹0'}
          </h4>
          <p className="text-xs text-slate-500 mt-1 truncate">
            {highestExpense ? `${highestExpense.title} (${formatDate(highestExpense.date)})` : 'No expenses yet'}
          </p>
        </div>

        {/* Average Transaction */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Average Spend
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-2xl font-black text-slate-900">{formatCurrency(averageExpense)}</h4>
          <p className="text-xs text-slate-500 mt-1">Per transaction</p>
        </div>

        {/* Total Transactions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Transactions
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-2xl font-black text-slate-900">{expenses.length}</h4>
          <p className="text-xs text-slate-500 mt-1">Total items logged</p>
        </div>
      </div>

      {/* Category-Wise Spending Breakdown List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Category-wise Spending</h3>
          <p className="text-xs text-slate-500">
            Ranked breakdown of where your student funds are being spent
          </p>
        </div>

        <div className="space-y-3.5 pt-1">
          {sortedCategories.map((item) => (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <CategoryBadge category={item.category} size="sm" />
                  <span className="text-slate-400">
                    ({item.count} transaction{item.count === 1 ? '' : 's'})
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 text-sm">
                    {formatCurrency(item.total)}
                  </span>
                  <span className="text-slate-500 ml-1.5 font-semibold">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
