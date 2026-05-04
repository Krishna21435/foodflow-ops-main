import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

const ROLES_MAP = {
  customer:   '/customer',
  restaurant: '/restaurant',
  delivery:   '/delivery',
  admin:      '/ops',
};

const LoginPage = () => {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();
  const formRef   = useRef(null);

  const doLogin = async (em, pw) => {
    setError('');
    setSubmitting(true);
    try {
      const user = await login(em, pw);
      navigate(ROLES_MAP[user.role] || '/');
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        setError('Incorrect email or password.');
      } else if (!err.response) {
        setError('Backend is offline. Use a demo account or sign up first.');
      } else {
        setError(err?.response?.data?.error || 'Login failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    await doLogin(email.trim().toLowerCase(), password.trim());
  };

  const handleQuickLogin = (em, pw) => {
    setEmail(em);
    setPassword(pw);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0b]">
      {/* Background glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl mb-6">
            <Shield className="text-emerald-500 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Welcome Back</h1>
          <p className="text-white/40">Enter your credentials to access FoodFlow</p>
        </div>

        <div className="glass p-8">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  autoComplete="email"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  autoComplete="current-password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-white/20 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Inline error */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={submitting}
              className="w-full gradient-button py-4 rounded-2xl flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick demo logins */}
          <div className="mt-10 pt-8 border-t border-white/5">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest text-center mb-4">
              Quick Demo Logins
            </p>
            <p className="text-[11px] text-white/20 text-center mb-5">Click to instantly log in as any role</p>
            <div className="grid grid-cols-2 gap-3">
              <DemoBtn label="🛒 Customer"   onClick={() => handleQuickLogin('cust@foodflow.com',  '123456')} disabled={submitting} />
              <DemoBtn label="🍽️ Restaurant" onClick={() => handleQuickLogin('rest@foodflow.com',  '123456')} disabled={submitting} />
              <DemoBtn label="🚴 Rider"      onClick={() => handleQuickLogin('rider@foodflow.com', '123456')} disabled={submitting} />
              <DemoBtn label="👨‍💼 Admin"      onClick={() => handleQuickLogin('admin@foodflow.com', '123456')} disabled={submitting} />
            </div>
          </div>

          {/* Signup link */}
          <p className="mt-6 text-center text-white/30 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const DemoBtn = ({ label, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {label}
  </button>
);

export default LoginPage;
