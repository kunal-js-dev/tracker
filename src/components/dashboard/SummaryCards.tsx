import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';
import { Wallet, TrendingDown, PiggyBank, Receipt } from 'lucide-react';

interface SummaryCardsProps {
  onBudgetCardClick?: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ onBudgetCardClick }) => {
  const { budget, totalSpent, remainingBudget, expenses } = useExpenses();

  const isRemainingNegative = remainingBudget < 0;

  const cards = [
    {
      title: 'Monthly Budget',
      value: formatCurrency(budget.monthlyBudget),
      subtext: 'Allocated for this month',
      icon: Wallet,
      color: 'bg-blue-50 text-primary-600 border-blue-100',
      action: onBudgetCardClick,
      badgeText: 'Change',
    },
    {
      title: 'Total Spent',
      value: formatCurrency(totalSpent),
      subtext: `${expenses.length} transaction${expenses.length === 1 ? '' : 's'} recorded`,
      icon: TrendingDown,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      title: 'Remaining Budget',
      value: formatCurrency(Math.abs(remainingBudget)),
      subtext: isRemainingNegative ? 'Deficit (Budget exceeded)' : 'Available to spend',
      icon: PiggyBank,
      color: isRemainingNegative
        ? 'bg-rose-50 text-rose-600 border-rose-100'
        : 'bg-emerald-50 text-emerald-600 border-emerald-100',
      valueColor: isRemainingNegative ? 'text-rose-600' : 'text-emerald-700',
      prefix: isRemainingNegative ? '- ' : '',
    },
    {
      title: 'Total Expenses',
      value: String(expenses.length),
      subtext: 'Items this period',
      icon: Receipt,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group ${
              card.action ? 'cursor-pointer' : ''
            }`}
            onClick={card.action}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 ${card.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <h3
                className={`text-2xl font-extrabold tracking-tight ${
                  card.valueColor || 'text-slate-900'
                }`}
              >
                {card.prefix || ''}
                {card.value}
              </h3>
              {card.badgeText && (
                <span className="text-xs font-semibold text-primary-600 group-hover:underline ml-auto">
                  {card.badgeText} &rarr;
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1 font-medium">{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
};
