import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from './AuthContext';
import type {
  Expense,
  BudgetSettings,
  ExpenseCategory,
  CategorySummary,
} from '../types';
import {
  subscribeToExpenses,
  addExpense as serviceAddExpense,
  updateExpense as serviceUpdateExpense,
  deleteExpense as serviceDeleteExpense,
  seedDemoExpenses,
} from '../services/expenseService';
import {
  subscribeToBudget,
  saveBudget as serviceSaveBudget,
  DEFAULT_BUDGET,
} from '../services/budgetService';
import { CATEGORIES, CATEGORY_LIST } from '../utils/categories';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  budget: BudgetSettings;
  loading: boolean;
  totalSpent: number;
  remainingBudget: number;
  spendingPercentage: number;
  budgetStatus: 'normal' | 'warning' | 'danger';
  highestExpense: Expense | null;
  categorySummaries: CategorySummary[];
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  addNewExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  editExpense: (id: string, data: Partial<Omit<Expense, 'id'>>) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  updateMonthlyBudget: (amount: number) => Promise<void>;
  loadDemoData: () => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<BudgetSettings>({
    monthlyBudget: DEFAULT_BUDGET,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Subscribe to user's expenses and budget whenever currentUser changes
  useEffect(() => {
    if (!currentUser?.userId) {
      setExpenses([]);
      setBudget({ monthlyBudget: DEFAULT_BUDGET });
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribeExpenses = subscribeToExpenses(
      currentUser.userId,
      (newExpenses) => {
        setExpenses(newExpenses);
        setLoading(false);
      },
      (error) => {
        showToast('Firestore error: ' + error.message, 'error');
        setLoading(false);
      }
    );

    const unsubscribeBudget = subscribeToBudget(currentUser.userId, (newBudget) => {
      setBudget(newBudget);
    });

    return () => {
      unsubscribeExpenses();
      unsubscribeBudget();
    };
  }, [currentUser?.userId]);

  // Calculations
  const totalSpent = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [expenses]);

  const remainingBudget = useMemo(() => {
    return (budget.monthlyBudget || 0) - totalSpent;
  }, [budget.monthlyBudget, totalSpent]);

  const spendingPercentage = useMemo(() => {
    if (!budget.monthlyBudget || budget.monthlyBudget <= 0) return 0;
    return Math.round((totalSpent / budget.monthlyBudget) * 100);
  }, [totalSpent, budget.monthlyBudget]);

  const budgetStatus: 'normal' | 'warning' | 'danger' = useMemo(() => {
    if (spendingPercentage >= 100) return 'danger';
    if (spendingPercentage >= 75) return 'warning';
    return 'normal';
  }, [spendingPercentage]);

  const highestExpense = useMemo(() => {
    if (expenses.length === 0) return null;
    return [...expenses].sort((a, b) => (b.amount || 0) - (a.amount || 0))[0];
  }, [expenses]);

  const categorySummaries: CategorySummary[] = useMemo(() => {
    const totals: Record<ExpenseCategory, { total: number; count: number }> = {
      Food: { total: 0, count: 0 },
      Travel: { total: 0, count: 0 },
      Education: { total: 0, count: 0 },
      Shopping: { total: 0, count: 0 },
      Entertainment: { total: 0, count: 0 },
      Other: { total: 0, count: 0 },
    };

    expenses.forEach((item) => {
      const cat = item.category in totals ? item.category : 'Other';
      totals[cat].total += Number(item.amount) || 0;
      totals[cat].count += 1;
    });

    return CATEGORY_LIST.map((cat) => {
      const catData = totals[cat];
      const percentage = totalSpent > 0 ? Math.round((catData.total / totalSpent) * 100) : 0;
      return {
        category: cat,
        total: catData.total,
        count: catData.count,
        percentage,
        color: CATEGORIES[cat].chartColor,
        icon: CATEGORIES[cat].iconName,
      };
    });
  }, [expenses, totalSpent]);

  // Actions
  const addNewExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!currentUser?.userId) {
      throw new Error('User must be signed in to add an expense.');
    }
    await serviceAddExpense(currentUser.userId, expenseData);
    showToast(`Expense "${expenseData.title}" saved successfully!`, 'success');
  };

  const editExpense = async (id: string, data: Partial<Omit<Expense, 'id'>>) => {
    if (!currentUser?.userId) {
      throw new Error('User must be signed in to edit an expense.');
    }
    await serviceUpdateExpense(currentUser.userId, id, data);
    showToast('Expense updated successfully!', 'success');
  };

  const removeExpense = async (id: string) => {
    if (!currentUser?.userId) {
      throw new Error('User must be signed in to delete an expense.');
    }
    await serviceDeleteExpense(currentUser.userId, id);
    showToast('Expense removed successfully.', 'info');
  };

  const updateMonthlyBudget = async (amount: number) => {
    if (!currentUser?.userId) {
      throw new Error('User must be signed in to change budget.');
    }
    await serviceSaveBudget(currentUser.userId, amount);
    showToast(`Monthly budget updated to ₹${amount.toLocaleString('en-IN')}`, 'success');
  };

  const loadDemoData = async () => {
    if (!currentUser?.userId) {
      throw new Error('User must be signed in to load demo data.');
    }
    const count = await seedDemoExpenses(currentUser.userId);
    showToast(`Added ${count} sample student expenses!`, 'success');
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        budget,
        loading,
        totalSpent,
        remainingBudget,
        spendingPercentage,
        budgetStatus,
        highestExpense,
        categorySummaries,
        toasts,
        showToast,
        removeToast,
        addNewExpense,
        editExpense,
        removeExpense,
        updateMonthlyBudget,
        loadDemoData,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
