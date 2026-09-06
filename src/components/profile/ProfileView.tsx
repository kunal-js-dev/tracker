import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExpenses } from '../../context/ExpenseContext';
import { formatDate } from '../../utils/formatters';
import {
  Mail,
  Fingerprint,
  Calendar,
  Sparkles,
  Database,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, isFirebaseReady, logout } = useAuth();
  const { loadDemoData } = useExpenses();

  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const handleLoadDemo = async () => {
    setIsLoadingDemo(true);
    try {
      await loadDemoData();
    } finally {
      setIsLoadingDemo(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-blue-400 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-primary-500/20">
              {currentUser?.name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{currentUser?.name || 'Student'}</h2>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                {currentUser?.email}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5" />
              User ID (UID)
            </span>
            <p className="text-sm font-mono font-medium text-slate-800 mt-1 break-all select-all">
              {currentUser?.userId}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Member Since
            </span>
            <p className="text-sm font-semibold text-slate-800 mt-1">
              {currentUser?.createdAt
                ? formatDate(currentUser.createdAt.split('T')[0])
                : 'Today'}
            </p>
          </div>
        </div>
      </div>

      {/* Demo Data Management Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Demo & Testing Data</h3>
            <p className="text-xs text-slate-500">
              Populate your student account with realistic sample expenses
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Quickly test the dashboard progress bar, category breakdown, and charts by injecting
          pre-configured student expenses:
        </p>

        <ul className="text-xs text-slate-500 list-disc list-inside space-y-1 bg-slate-50 p-4 rounded-xl">
          <li><strong>Food:</strong> Campus Cafeteria Lunch (₹150), Chai & Samosa (₹60)</li>
          <li><strong>Travel:</strong> Metro Smart Card (₹80), Bus Pass Renewal (₹110)</li>
          <li><strong>Education:</strong> Data Structures Reference Textbook (₹500)</li>
          <li><strong>Shopping:</strong> College Backpack & Stationery (₹300)</li>
          <li><strong>Entertainment:</strong> Weekend Cinema Ticket (₹250)</li>
        </ul>

        <div className="pt-2">
          <button
            onClick={handleLoadDemo}
            disabled={isLoadingDemo}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-amber-500/25 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isLoadingDemo ? 'Loading Sample Data...' : 'Load Demo Student Data'}
          </button>
        </div>
      </div>

      {/* Backend & Security Status Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Database & Security</h3>
            <p className="text-xs text-slate-500">
              Firebase configuration and user isolation status
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex items-start gap-3 p-3.5 rounded-xl border bg-slate-50 border-slate-200">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-900 mb-0.5">Strict Data Isolation</p>
              Your data is isolated under <code className="bg-slate-200 px-1 py-0.5 rounded">users/{currentUser?.userId}/expenses</code> and <code className="bg-slate-200 px-1 py-0.5 rounded">users/{currentUser?.userId}/settings/budget</code>. No other user can read or modify your expenses.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl border bg-slate-50 border-slate-200">
            {isFirebaseReady ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="text-xs text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-900 mb-0.5">
                {isFirebaseReady
                  ? 'Connected to Live Firebase Cloud Firestore'
                  : 'Operating in Local Storage Demo Mode'}
              </p>
              {isFirebaseReady ? (
                <span>All actions are synced in real-time with Google Cloud Firestore.</span>
              ) : (
                <span>
                  Add your Firebase API keys to <code className="bg-slate-200 px-1 py-0.5 rounded">.env</code> to connect directly to your live Firebase project.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
