import React, { useState, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import { Navbar } from './components/layout/Navbar';
import type { NavTab } from './components/layout/Navbar';
import { AuthCard } from './components/auth/AuthCard';
import { ToastContainer } from './components/common/Toast';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { BudgetProgressBar } from './components/dashboard/BudgetProgressBar';
import { RecentExpenses } from './components/dashboard/RecentExpenses';
import { ExpenseTable } from './components/expenses/ExpenseTable';
import { ExpenseFilterBar } from './components/expenses/ExpenseFilterBar';
import { ExpenseFormModal } from './components/expenses/ExpenseFormModal';
import { SpendingChart } from './components/analytics/SpendingChart';
import { CategoryBreakdown } from './components/analytics/CategoryBreakdown';
import { BudgetSettingCard } from './components/budget/BudgetSettingCard';
import { ProfileView } from './components/profile/ProfileView';
import type { ExpenseFilter } from './types';
import {
  PlusCircle,
  Sparkles,
  ArrowRight,
  Receipt,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const { expenses, loadDemoData } = useExpenses();

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Expense History Filtering state
  const [filter, setFilter] = useState<ExpenseFilter>({
    searchQuery: '',
    category: 'All',
    sortBy: 'date-desc',
  });

  // Filtered and sorted expenses for the Expenses Tab
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Search query
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.note && item.note.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (filter.category !== 'All') {
      result = result.filter((item) => item.category === filter.category);
    }

    // Sorting
    result.sort((a, b) => {
      if (filter.sortBy === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (filter.sortBy === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (filter.sortBy === 'amount-desc') {
        return (b.amount || 0) - (a.amount || 0);
      }
      if (filter.sortBy === 'amount-asc') {
        return (a.amount || 0) - (b.amount || 0);
      }
      return 0;
    });

    return result;
  }, [expenses, filter]);

  const resetFilters = () => {
    setFilter({
      searchQuery: '',
      category: 'All',
      sortBy: 'date-desc',
    });
  };

  // Loading spinner for initial auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">
            Loading Student Expense Tracker...
          </p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show Auth Page
  if (!currentUser) {
    return (
      <>
        <AuthCard />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-primary-100 selection:text-primary-800">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddExpense={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* Greeting Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back,{' '}
                  <span className="text-primary-600">
                    {currentUser.name.split(' ')[0] || 'Student'}
                  </span>
                  ! 👋
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Here is a snapshot of your monthly student budget and expenditures.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 active:scale-[0.99] text-white rounded-xl text-sm font-semibold shadow-sm shadow-primary-500/25 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Expense
                </button>
                {expenses.length === 0 && (
                  <button
                    onClick={() => loadDemoData()}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-sm font-semibold border border-amber-200 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Load Demo Data
                  </button>
                )}
              </div>
            </div>

            {/* Summary Cards */}
            <SummaryCards onBudgetCardClick={() => setActiveTab('budget')} />

            {/* Budget Progress Bar with 3-tier Warning Display */}
            <BudgetProgressBar onAdjustBudgetClick={() => setActiveTab('budget')} />

            {/* Grid: Recent Transactions & Quick Analytics Peek */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentExpenses
                  onViewAllClick={() => setActiveTab('expenses')}
                  onAddClick={() => setIsAddModalOpen(true)}
                />
              </div>

              {/* Quick Category / Analytics Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900">
                      Spending Insights
                    </h3>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-0.5"
                    >
                      Full Analytics <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <SpendingChart />
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4">
                  <button
                    onClick={() => setActiveTab('expenses')}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Receipt className="w-4 h-4" />
                    Browse All {expenses.length} Expenses
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXPENSES TAB */}
        {activeTab === 'expenses' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Expense History
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Search, filter, edit, and manage all your student transactions
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Expense
                </button>
                {expenses.length === 0 && (
                  <button
                    onClick={() => loadDemoData()}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-sm font-semibold border border-amber-200 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Load Demo Data
                  </button>
                )}
              </div>
            </div>

            {/* Filter & Search Bar */}
            <ExpenseFilterBar
              filter={filter}
              onChange={setFilter}
              onReset={resetFilters}
              totalFiltered={filteredExpenses.length}
            />

            {/* Expense Table & Cards */}
            <ExpenseTable
              expenses={filteredExpenses}
              onAddNewClick={() => setIsAddModalOpen(true)}
            />
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Spending Analytics
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Breakdown of spending by category, highest expense, and transaction stats
              </p>
            </div>

            {/* Overview Cards & Breakdown List */}
            <CategoryBreakdown />

            {/* Visual Charts */}
            <SpendingChart />
          </div>
        )}

        {/* BUDGET TAB */}
        {activeTab === 'budget' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-xl mx-auto mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Monthly Budget Settings
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Customize your monthly allowance to keep your campus life financially balanced
              </p>
            </div>

            <BudgetSettingCard />
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-xl mx-auto mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Student Profile & Settings
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                View your account information and manage Firebase database data
              </p>
            </div>

            <ProfileView />
          </div>
        )}
      </main>

      {/* Global Add Expense Modal */}
      <ExpenseFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Feedback Toast Alerts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <AppContent />
      </ExpenseProvider>
    </AuthProvider>
  );
}
