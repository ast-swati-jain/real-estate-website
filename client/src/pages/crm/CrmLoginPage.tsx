import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const CrmLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        showToast('Welcome back! Signed in to CRM.');
        navigate('/crm');
      } else {
        setErrorMsg(result.message || 'Invalid email or password');
      }
    } catch (err: any) {
      setErrorMsg('Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    setErrorMsg('');

    try {
      const result = await login(demoEmail, 'password123');
      if (result.success) {
        showToast(`Signed in successfully as ${demoEmail.includes('admin') ? 'Admin' : 'Agent'}`);
        navigate('/crm');
      } else {
        setErrorMsg(result.message || 'Quick login failed');
      }
    } catch (err: any) {
      setErrorMsg('Failed to login with demo credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background aesthetic glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-4">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-xl shadow-brand-500/25 group-hover:scale-105 transition">
            <Building2 className="w-7 h-7" />
          </div>
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            EstatePro CRM Portal
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Centralized lead tracking, inquiries &amp; sales pipeline
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl space-y-6">
          {/* Quick Demo Credentials Box */}
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/60 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-brand-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Demo Evaluation Logins</span>
              </span>
              <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded">1-Click</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@estatepro.com')}
                disabled={loading}
                className="py-2 px-3 rounded-xl bg-slate-700/80 hover:bg-brand-600 text-white text-xs font-semibold text-center transition flex flex-col items-center"
              >
                <span className="font-bold">Admin Demo</span>
                <span className="text-[10px] text-slate-400">Alexander (Full Access)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('sarah.jenkins@estatepro.com')}
                disabled={loading}
                className="py-2 px-3 rounded-xl bg-slate-700/80 hover:bg-brand-600 text-white text-xs font-semibold text-center transition flex flex-col items-center"
              >
                <span className="font-bold">Agent Demo</span>
                <span className="text-[10px] text-slate-400">Sarah (Leads &amp; Tours)</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-800/60 text-rose-200 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="admin@estatepro.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition duration-150 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In to CRM</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-800">
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-white transition"
            >
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

