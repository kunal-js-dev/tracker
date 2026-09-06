import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExpenses } from '../../context/ExpenseContext';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Wallet,
  User,
  PlusCircle,
  Menu,
  X,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'expenses' | 'analytics' | 'budget' | 'profile';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenAddExpense: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenAddExpense,
}) => {
  const { currentUser } = useAuth();
  const { loadDemoData, expenses } = useExpenses();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleTabClick = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  const handleDemoClick = async () => {
    setIsLoadingDemo(true);
    try {
      await loadDemoData();
    } finally {
      setIsLoadingDemo(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => handleTabClick('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-primary-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight block leading-tight">
                Student <span className="text-primary-600">Expense Tracker</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 block tracking-wider uppercase">
                Smart Budgeting
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {expenses.length === 0 && (
              <button
                onClick={handleDemoClick}
                disabled={isLoadingDemo}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors"
                title="Load sample student expenses"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {isLoadingDemo ? 'Loading...' : 'Demo Data'}
              </button>
            )}

            <button
              onClick={onOpenAddExpense}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-primary-500/25 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Add Expense
            </button>

            {/* User Pill / Status */}
            <button
              onClick={() => handleTabClick('profile')}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                {currentUser?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block truncate max-w-[100px]">
                  {currentUser?.name?.split(' ')[0] || 'Student'}
                </span>
              </div>
            </button>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenAddExpense}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                {currentUser?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{currentUser?.name}</p>
                <p className="text-xs text-slate-400">{currentUser?.email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => {
                handleDemoClick();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Load Demo Data
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
