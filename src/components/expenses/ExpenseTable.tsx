import React, { useState } from 'react';
import type { Expense } from '../../types';
import { useExpenses } from '../../context/ExpenseContext';
import { CategoryBadge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ExpenseFormModal } from './ExpenseFormModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Edit2, Trash2, Calendar, FileText, PlusCircle, Sparkles } from 'lucide-react';

interface ExpenseTableProps {
  expenses: Expense[];
  onAddNewClick: () => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  onAddNewClick,
}) => {
  const { removeExpense, loadDemoData } = useExpenses();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const confirmDelete = async () => {
    if (!deletingExpense) return;
    setIsDeleting(true);
    try {
      await removeExpense(deletingExpense.id);
      setDeletingExpense(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLoadDemo = async () => {
    setIsLoadingDemo(true);
    try {
      await loadDemoData();
    } finally {
      setIsLoadingDemo(false);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">No expenses found</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
          You haven't added any expenses matching the criteria yet. Start recording your daily student spends or load demo data.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onAddNewClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Add First Expense
          </button>
          <button
            onClick={handleLoadDemo}
            disabled={isLoadingDemo}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            {isLoadingDemo ? 'Loading Sample Spends...' : 'Load Demo Data'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Desktop & Tablet Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Title & Note</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5 text-right">Amount</th>
                <th className="py-3.5 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Date */}
                  <td className="py-4 px-5 whitespace-nowrap text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </td>

                  {/* Title & Note */}
                  <td className="py-4 px-5">
                    <div className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                      {expense.title}
                    </div>
                    {expense.note && (
                      <p className="text-xs text-slate-500 mt-0.5 max-w-xs truncate">
                        {expense.note}
                      </p>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <CategoryBadge category={expense.category} />
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-5 whitespace-nowrap text-right font-bold text-slate-900 text-base">
                    {formatCurrency(expense.amount)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setEditingExpense(expense)}
                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit expense"
                        aria-label="Edit expense"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingExpense(expense)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete expense"
                        aria-label="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="sm:hidden divide-y divide-slate-100">
          {expenses.map((expense) => (
            <div key={expense.id} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 text-base truncate">
                    {expense.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              </div>

              {expense.note && (
                <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                  {expense.note}
                </p>
              )}

              <div className="flex items-center justify-between pt-1">
                <CategoryBadge category={expense.category} size="sm" />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingExpense(expense)}
                    className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    aria-label="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingExpense(expense)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingExpense && (
        <ExpenseFormModal
          isOpen={Boolean(editingExpense)}
          onClose={() => setEditingExpense(null)}
          initialData={editingExpense}
        />
      )}

      {/* Delete Confirmation */}
      {deletingExpense && (
        <ConfirmDialog
          isOpen={Boolean(deletingExpense)}
          onClose={() => setDeletingExpense(null)}
          onConfirm={confirmDelete}
          title="Delete Expense"
          message={`Are you sure you want to delete "${deletingExpense.title}" of ${formatCurrency(
            deletingExpense.amount
          )}? This action cannot be undone.`}
          confirmText="Delete Expense"
          isDestructive={true}
          isLoading={isDeleting}
        />
      )}
    </>
  );
};
