import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound, Sun, Moon } from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { useTheme } from '../../context/ThemeContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAdmin();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setErrorMessage(res.error || 'Login failed. Please check credentials.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@omenterprises.com');
    setPassword('admin123');
  };

  return (
    <div className="admin-portal min-h-screen bg-background text-text-primary flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-body transition-colors duration-200">
      {/* Top Right Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="p-2 rounded-lg bg-surface border border-border-subtle text-text-primary hover:border-safety transition-colors cursor-pointer shadow-sm flex items-center justify-center"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-safety" /> : <Moon className="w-4 h-4 text-text-primary" />}
        </button>
      </div>

      {/* Background Subtle Technical Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-safety text-[var(--color-safety-text)] font-header font-bold text-3xl mb-3 shadow-lg shadow-safety/20">
            OM
          </div>
          <h1 className="font-header text-3xl uppercase font-bold text-text-primary tracking-wider">
            Admin Console
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            OM Enterprises &bull; Content Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface border border-border-subtle rounded-xl p-6 sm:p-8 shadow-xl backdrop-blur-sm relative">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/40 text-red-500 text-xs">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@omenterprises.com"
                  required
                  className="w-full bg-surface-subtle border border-border-subtle rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-safety transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-surface-subtle border border-border-subtle rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-safety transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-safety hover:opacity-90 text-[var(--color-safety-text)] font-header font-bold text-base tracking-wider uppercase py-3 rounded-lg transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-safety/20 disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill Shortcut */}
          <div className="mt-6 pt-6 border-t border-border-subtle">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2 px-3 rounded-lg text-xs font-mono text-text-secondary bg-surface-subtle hover:bg-border-subtle border border-border-subtle flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-safety" />
              <span>Click to auto-fill demo credentials</span>
            </button>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="text-center mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Protected with Database Row-Level Security</span>
        </div>
      </div>
    </div>
  );
};
