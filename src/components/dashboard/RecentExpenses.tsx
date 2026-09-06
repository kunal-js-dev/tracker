import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { CategoryBadge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ArrowRight, PlusCircle, Sparkles, ReceiptText } from 'lucide-react';

interface RecentExpensesProps {
  onViewAllClick: () => void;
  onAddClick: () => void;
}

export const RecentExpenses: React.FC<RecentExpensesProps> = ({
  onViewAllClick,
  onAddClick,
}) => {
  const { expenses, loadDemoData } = useExpenses();

  const recent = expenses.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
          <p className="text-xs text-slate-500">Your latest recorded student expenses</p>
        </div>
        {expenses.length > 0 && (
          <button
            onClick={onViewAllClick}
            className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline"
          >
            View All ({expenses.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <div className="p-8 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
          <ReceiptText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No expenses recorded yet</p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-4">
            Track your canteen lunch, bus tickets, or photocopies to see them here!
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={onAddClick}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Expense
            </button>
            <button
              onClick={loadDemoData}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Demo Data
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {recent.map((item) => (
            <div
              key={item.id}
              className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <CategoryBadge category={item.category} size="sm" showIcon={false} />
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400">{formatDate(item.date)}</p>
                </div>
              </div>
              <div className="text-right whitespace-nowrap">
                <span className="text-sm font-bold text-slate-900">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
