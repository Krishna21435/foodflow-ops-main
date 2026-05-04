import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  ChevronDown,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

const ROLES = [
  { value: 'customer', label: '🛒 Customer', desc: 'Browse & order food' },
  { value: 'restaurant', label: '🍽️ Restaurant', desc: 'Manage your menu & orders' },
  { value: 'delivery', label: '🚴 Rider', desc: 'Deliver orders & earn' },
  { value: 'admin', label: '👨‍💼 Admin', desc: 'Manage the platform & ops' },
];

const PasswordStrength = ({ password }) => {
  if (!password) return null;
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Number', ok: /\d/.test(password) },
    { label: 'Letter', ok: /[a-zA-Z]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ['bg-red-500', 'bg-yellow-500', 'bg-emerald-500'];
  const labels = ['Weak', 'Fair', 'Strong'];
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? colors[score - 1] : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map((c) => (
            <span
              key={c.label}
              className={`text-[10px] font-medium flex items-center gap-1 transition-colors ${
                c.ok ? 'text-emerald-400' : 'text-white/20'
              }`}
            >
              <CheckCircle2 className="w-2.5 h-2.5" />
              {c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span className={`text-[10px] font-bold ${colors[score - 1].replace('bg-', 'text-')}`}>
            {labels[score - 1]}
          </span>
        )}
      </div>
    </div>
  );
};

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'customer' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const user = await signup(form.name, form.email, form.password, form.role);
      if (user.role === 'customer') navigate('/customer');
      else if (user.role === 'restaurant') navigate('/restaurant');
      else if (user.role === 'delivery') navigate('/delivery');
      else if (user.role === 'admin') navigate('/ops');
      else navigate('/');
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err?.message ||
        'Registration failed. The backend may be offline.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const mismatch = form.confirm && form.password !== form.confirm;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0b]">
      {/* Background glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-violet-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-violet-500/10 border border-violet-500/20 rounded-3xl mb-5">
            <Sparkles className="text-violet-400 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Create Account</h1>
          <p className="text-white/40 text-sm">Join FoodFlow and start your journey</p>
        </div>

        <div className="glass p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                <input
                  id="signup-name"
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  autoComplete="name"
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                <input
                  id="signup-email"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="email"
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 outline-none transition-all"
                />
              </div>
            </div>

            {/* Role selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">I am a…</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                    className={`relative py-3 px-2 rounded-2xl border text-center transition-all duration-200 ${
                      form.role === r.value
                        ? 'bg-violet-500/15 border-violet-500/50 text-white'
                        : 'bg-white/3 border-white/10 text-white/40 hover:bg-white/8 hover:text-white/70'
                    }`}
                  >
                    <div className="text-lg leading-none mb-1">{r.label.split(' ')[0]}</div>
                    <div className="text-[10px] font-semibold leading-tight">
                      {r.label.split(' ').slice(1).join(' ')}
                    </div>
                    {form.role === r.value && (
                      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-400" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-white/25 pl-1 pt-0.5">
                {ROLES.find((r) => r.value === form.role)?.desc}
              </p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-white/20 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Confirm Password</label>
              <div className="relative">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    mismatch ? 'text-red-400/60' : 'text-white/20'
                  }`}
                />
                <input
                  id="signup-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={set('confirm')}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-12 text-white placeholder-white/20 outline-none transition-all focus:ring-2 ${
                    mismatch
                      ? 'border-red-500/40 focus:ring-red-500/30'
                      : 'border-white/10 focus:ring-violet-500/50 focus:border-violet-500/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mismatch && (
                <p className="text-[11px] text-red-400 pl-1 animate-pulse">Passwords don't match</p>
              )}
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              disabled={loading || mismatch}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 group font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading || mismatch
                  ? 'rgba(139,92,246,0.3)'
                  : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                color: 'white',
                boxShadow: loading || mismatch ? 'none' : '0 0 30px rgba(124,58,237,0.35)',
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-white/30 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
