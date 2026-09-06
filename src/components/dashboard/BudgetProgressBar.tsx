import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';
import { ShieldCheck, AlertCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface BudgetProgressBarProps {
  onAdjustBudgetClick?: () => void;
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  onAdjustBudgetClick,
}) => {
  const { budget, totalSpent, spendingPercentage, budgetStatus, remainingBudget } =
    useExpenses();

  // Color mappings
  const statusConfig = {
    normal: {
      barColor: 'bg-emerald-500',
      trackColor: 'bg-emerald-100',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      textColor: 'text-emerald-700',
      icon: ShieldCheck,
      title: 'Spending is under control',
      description: `Great job! You have used ${spendingPercentage}% of your monthly allowance. ${formatCurrency(
        remainingBudget
      )} is still remaining.`,
    },
    warning: {
      barColor: 'bg-amber-500',
      trackColor: 'bg-amber-100',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      textColor: 'text-amber-700',
      icon: AlertTriangle,
      title: '75% or more of budget used',
      description: `Caution: You have consumed ${spendingPercentage}% of your total budget. Only ${formatCurrency(
        remainingBudget
      )} left for the rest of the month.`,
    },
    danger: {
      barColor: 'bg-rose-500',
      trackColor: 'bg-rose-100',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      textColor: 'text-rose-700',
      icon: AlertCircle,
      title: 'Budget exceeded!',
      description: `Warning: You have overspent by ${formatCurrency(
        Math.abs(remainingBudget)
      )} (${spendingPercentage}% spent). Consider adjusting your budget or reducing non-essential expenses.`,
    },
  }[budgetStatus];

  const Icon = statusConfig.icon;

  // Clamped percentage for the bar display
  const visualPercentage = Math.min(spendingPercentage, 100);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Monthly Budget Health
          </span>
          <div className="flex items-center gap-3 mt-1">
            <h4 className="text-xl font-bold text-slate-900">
              {formatCurrency(totalSpent)}{' '}
              <span className="text-sm font-medium text-slate-500">
                spent of {formatCurrency(budget.monthlyBudget)}
              </span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.badgeBg}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {spendingPercentage}% Spent
          </span>
          {onAdjustBudgetClick && (
            <button
              onClick={onAdjustBudgetClick}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-0.5 ml-1"
            >
              Adjust Budget <ArrowUpRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-1.5">
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${statusConfig.barColor}`}
            style={{ width: `${visualPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-semibold text-slate-400">
          <span>0%</span>
          <span className="text-slate-500">75% (Warning threshold)</span>
          <span>100%</span>
        </div>
      </div>

      {/* Warning / Status Notification Banner */}
      <div
        className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${statusConfig.badgeBg}`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${statusConfig.textColor}`} />
        <div>
          <h5 className="text-sm font-bold">{statusConfig.title}</h5>
          <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
            {statusConfig.description}
          </p>
        </div>
      </div>
    </div>
  );
};
