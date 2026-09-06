import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const AuthCard: React.FC = () => {
  const { login, register, loginWithDemoAccount, authError, clearAuthError } =
    useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    clearAuthError();
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setLocalError('Please enter an email address.');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setLocalError('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        await register(name.trim(), trimmedEmail, password);
      } else {
        await login(trimmedEmail, password);
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setIsLoading(true);
    try {
      await loginWithDemoAccount();
    } finally {
      setIsLoading(false);
    }
  };

  const displayedError = localError || authError;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-blue-500 text-white shadow-lg shadow-primary-500/30 mb-3">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Student Expense Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Budget smarter, track every rupee, and reach your student goals
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          {/* Mode Switch Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {displayedError && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-xl flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <div className="leading-snug">{displayedError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name for Registration */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === 'register' && (
                <p className="text-[11px] text-slate-400 mt-1">Must be at least 6 characters</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary-600 hover:bg-primary-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-primary-500/25 disabled:bg-primary-300"
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In to Tracker</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Create Student Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-2.5">
              Evaluating or testing the application?
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              Continue with Instant Demo Account
            </button>
          </div>
        </div>

        {/* Security / Firestore notice */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Firestore isolated user privacy enabled</span>
        </div>
      </div>
    </div>
  );
};
