import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useExpenses } from '../../context/ExpenseContext';
import type { Expense, ExpenseCategory } from '../../types';
import { CATEGORY_LIST } from '../../utils/categories';
import { getTodayDateString } from '../../utils/formatters';
import { IndianRupee, Calendar, FileText, Tag, Edit3, PlusCircle } from 'lucide-react';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Expense | null;
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { addNewExpense, editExpense } = useExpenses();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [date, setDate] = useState(getTodayDateString());
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAmount(String(initialData.amount));
      setCategory(initialData.category);
      setDate(initialData.date);
      setNote(initialData.note || '');
    } else {
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(getTodayDateString());
      setNote('');
    }
    setFormError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setFormError('Please enter an expense title.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFormError('Please enter a valid amount greater than 0.');
      return;
    }

    if (!date) {
      setFormError('Please select a valid date.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && initialData) {
        await editExpense(initialData.id, {
          title: trimmedTitle,
          amount: numAmount,
          category,
          date,
          note: note.trim(),
        });
      } else {
        await addNewExpense({
          title: trimmedTitle,
          amount: numAmount,
          category,
          date,
          note: note.trim(),
        });
      }
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Expense' : 'Add New Expense'}
      subtitle={
        isEditing
          ? 'Update the details for this transaction'
          : 'Record a new spend for your student budget'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl animate-fade-in">
            {formError}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Expense Title <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="e.g. Lunch at Canteen, Bus Pass, Textbook"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-3.5 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm text-slate-800 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Amount & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IndianRupee className="w-4 h-4" />
              </span>
              <input
                type="number"
                step="any"
                min="1"
                required
                placeholder="150"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4" />
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm font-medium text-slate-800 transition-all cursor-pointer"
              >
                {CATEGORY_LIST.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-4 h-4" />
            </span>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm text-slate-800 transition-all"
            />
          </div>
        </div>

        {/* Optional Note */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Optional Note
          </label>
          <div className="relative">
            <span className="absolute top-3 left-3 flex items-center pointer-events-none text-slate-400">
              <FileText className="w-4 h-4" />
            </span>
            <textarea
              rows={2}
              placeholder="e.g. Split with classmate, paid via UPI"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm text-slate-800 transition-all placeholder:text-slate-400 resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 active:scale-[0.99] rounded-xl transition-all shadow-sm shadow-primary-500/25 disabled:bg-primary-300"
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : isEditing ? (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Save Expense</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
