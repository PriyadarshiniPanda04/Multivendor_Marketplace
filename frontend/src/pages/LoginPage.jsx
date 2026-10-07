import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, UserCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, resetPassword, continueAsGuest } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' | 'seller' | 'admin'
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Quick Demo Auto-Fill
  const handleQuickDemo = (demoRole) => {
    setRole(demoRole);
    if (demoRole === 'seller') {
      setEmail('seller@techworld.com');
      setPassword('password123');
    } else if (demoRole === 'admin') {
      setEmail('admin@bazaarhub.in');
      setPassword('password123');
    } else {
      setEmail('customer@bazaarhub.in');
      setPassword('password123');
    }
    setErrorMessage('');
  };

  // Email & Password Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      addToast('Please enter both email and password', 'error');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password, role);
    setIsLoading(false);

    if (result.success) {
      addToast(`Welcome back, ${result.user.name}!`, 'success');
      redirectAfterAuth(role);
    } else {
      setErrorMessage(result.error);
      addToast(result.error, 'error');
    }
  };

  // Google Sign-In Submit
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    const result = await loginWithGoogle(role);
    setIsGoogleLoading(false);

    if (result.success) {
      addToast(`Signed in with Google as ${result.user.name}`, 'success');
      redirectAfterAuth(role);
    } else {
      setErrorMessage(result.error);
      addToast(result.error, 'error');
    }
  };

  const redirectAfterAuth = (userRole) => {
    if (userRole === 'seller') {
      navigate('/seller/dashboard');
    } else if (userRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    addToast('Signed in as Guest Shopper', 'info');
    navigate('/');
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      addToast('Please enter your account email', 'error');
      return;
    }
    const res = await resetPassword(resetEmail);
    if (res.success) {
      setResetSent(true);
      addToast('Password reset link sent to your email!', 'success');
    } else {
      addToast(res.error, 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 space-y-6 select-none">
      
      {/* BazaarHub Logo */}
      <div className="text-center">
        <Link to="/" className="inline-flex items-center gap-1.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center font-black text-white text-base shadow-md group-hover:scale-105 transition-transform">
            BH
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-black text-slate-900">Bazaar</span>
            <span className="text-2xl font-black text-orange-500">Hub</span>
            <span className="text-xs text-orange-400 font-bold ml-0.5">.in</span>
          </div>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Sign in
          </h1>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Firebase Auth Active
          </span>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Account Role Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Sign in as:
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { id: 'customer', label: 'Customer' },
              { id: 'seller', label: 'Merchant' },
              { id: 'admin', label: 'Admin' }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`py-1.5 px-2 rounded-lg border font-semibold transition-all text-center cursor-pointer ${
                  role === r.id
                    ? 'border-orange-500 bg-orange-50 text-orange-950 ring-1 ring-orange-500 shadow-2xs font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Google One-Click Sign-In Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-700 shadow-2xs flex items-center justify-center gap-3 transition-all hover:border-slate-400 active:scale-[0.99] cursor-pointer disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-1">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider absolute">
            or sign in with email
          </span>
        </div>

        {/* 2. Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2.5 pl-9 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-2xs transition-all"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <label className="font-bold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setIsForgotPasswordOpen(true);
                }}
                className="text-orange-600 hover:underline font-semibold cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 pl-9 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-2xs transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-orange-500 focus:ring-orange-400 w-3.5 h-3.5 cursor-pointer"
              />
              <span>Keep me signed in on this device</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </button>
        </form>

        {/* Quick Demo Pre-fill for Testing */}
        <div className="pt-2 text-center">
          <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
            Quick Demo Fill:
          </span>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('seller')}
              className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              Demo Seller
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed text-center pt-2">
          By signing in, you agree to BazaarHub's{' '}
          <Link to="/conditions" className="text-orange-600 hover:underline">Conditions of Use</Link> and{' '}
          <Link to="/privacy" className="text-orange-600 hover:underline">Privacy Notice</Link>.
        </p>

        {/* Guest Continue */}
        <div className="pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleGuest}
            className="w-full py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-slate-400" />
            <span>Continue as Guest Shopper</span>
          </button>
        </div>

      </div>

      {/* New to BazaarHub CTA */}
      <div className="space-y-3 text-center">
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-[#f8fafc] px-3 text-xs text-slate-400 font-semibold uppercase tracking-wider absolute">
            New to BazaarHub?
          </span>
        </div>

        <Link
          to="/register"
          className="block w-full py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 shadow-2xs transition-colors"
        >
          Create your BazaarHub account
        </Link>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Reset Your Password
            </h3>
            <p className="text-xs text-slate-500">
              Enter your registered email address and we will send you a secure Firebase link to reset your password.
            </p>

            {resetSent ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-3">
                <p className="font-semibold">Check your inbox!</p>
                <p>A password reset link has been dispatched to {resetEmail}.</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordOpen(false);
                    setResetSent(false);
                  }}
                  className="w-full py-2 bg-emerald-600 text-white rounded-lg font-bold text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordResetSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="flex-1 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-xs"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

