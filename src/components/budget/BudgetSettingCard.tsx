import React, { useState, useEffect } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';
import { Wallet, Check, Sparkles, TrendingDown, PiggyBank } from 'lucide-react';

export const BudgetSettingCard: React.FC = () => {
  const { budget, totalSpent, remainingBudget, updateMonthlyBudget } = useExpenses();

  const [inputBudget, setInputBudget] = useState<string>(
    String(budget.monthlyBudget || 20000)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    setInputBudget(String(budget.monthlyBudget || 20000));
  }, [budget.monthlyBudget]);

  const proposedBudget = Number(inputBudget) || 0;
  const proposedRemaining = proposedBudget - totalSpent;
  const proposedPercentage =
    proposedBudget > 0 ? Math.round((totalSpent / proposedBudget) * 100) : 0;

  const presets = [5000, 10000, 15000, 20000, 25000, 30000];

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseFloat(inputBudget);
    if (isNaN(val) || val <= 0) return;

    setIsSaving(true);
    try {
      await updateMonthlyBudget(val);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6 max-w-3xl mx-auto">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Monthly Budget Manager</h3>
            <p className="text-xs text-slate-500">
              Set and adjust your monthly spending allowance
            </p>
          </div>
        </div>
      </div>

      {/* Current Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase">
            Active Budget
          </span>
          <p className="text-lg font-bold text-slate-900 mt-0.5">
            {formatCurrency(budget.monthlyBudget)}
          </p>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
            Total Spent
          </span>
          <p className="text-lg font-bold text-amber-600 mt-0.5">
            {formatCurrency(totalSpent)}
          </p>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1">
            <PiggyBank className="w-3.5 h-3.5 text-emerald-500" />
            Remaining
          </span>
          <p
            className={`text-lg font-bold mt-0.5 ${
              remainingBudget < 0 ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {formatCurrency(remainingBudget)}
          </p>
        </div>
      </div>

      {/* Budget Edit Form */}
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Enter New Monthly Budget (₹)
          </label>
          <div className="relative max-w-md">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-lg">
              ₹
            </span>
            <input
              type="number"
              min="500"
              step="100"
              required
              value={inputBudget}
              onChange={(e) => setInputBudget(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-lg font-bold text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              placeholder="20000"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="block text-xs font-semibold text-slate-500 mb-2">
            Quick Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setInputBudget(String(preset))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  Number(inputBudget) === preset
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300 hover:bg-primary-50/50'
                }`}
              >
                ₹{preset.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Live Calculation Preview */}
        {proposedBudget > 0 && proposedBudget !== budget.monthlyBudget && (
          <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 space-y-1 animate-fade-in">
            <div className="font-bold flex items-center gap-1.5 text-primary-700">
              <Sparkles className="w-3.5 h-3.5" />
              Preview with this proposed budget:
            </div>
            <p>
              If your budget is changed to{' '}
              <strong>{formatCurrency(proposedBudget)}</strong>, your current spending
              ({formatCurrency(totalSpent)}) will represent{' '}
              <strong>{proposedPercentage}%</strong> of the budget.
            </p>
            <p>
              Remaining balance would become{' '}
              <strong className={proposedRemaining < 0 ? 'text-rose-600' : 'text-emerald-700'}>
                {formatCurrency(proposedRemaining)}
              </strong>
              .
            </p>
          </div>
        )}

        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving || Number(inputBudget) === budget.monthlyBudget}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            {isSaving ? 'Updating...' : 'Update Monthly Budget'}
          </button>
          {successMsg && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 animate-fade-in">
              <Check className="w-4 h-4" /> Saved in Firestore!
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
