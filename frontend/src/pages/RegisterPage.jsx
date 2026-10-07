import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Store, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' | 'seller'
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      addToast('Please fill all required fields', 'error');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      addToast('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    const result = await register({ name, email, password, phone, role });
    setIsLoading(false);

    if (result.success) {
      addToast(`Account created! Welcome to BazaarHub, ${result.user.name}.`, 'success');
      if (role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setErrorMessage(result.error);
      addToast(result.error, 'error');
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    const result = await loginWithGoogle(role);
    setIsGoogleLoading(false);

    if (result.success) {
      addToast(`Account linked with Google as ${result.user.name}!`, 'success');
      if (role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setErrorMessage(result.error);
      addToast(result.error, 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 space-y-6 select-none">
      
      {/* Brand */}
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

      {/* Main Registration Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Create Account
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

        {/* Account Role Type */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Register as:
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                role === 'customer'
                  ? 'border-orange-500 bg-orange-50 text-orange-950 ring-1 ring-orange-500 shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-3.5 h-3.5 text-orange-500" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                role === 'seller'
                  ? 'border-orange-500 bg-orange-50 text-orange-950 ring-1 ring-orange-500 shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-orange-500" />
              <span>Seller Account</span>
            </button>
          </div>
        </div>

        {/* Google Fast Sign-Up */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignUp}
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
            <span>Sign up with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-1">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider absolute">
            or register with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Your Name */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Your name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First and last name"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs sm:text-sm"
            />
          </div>

          {/* Mobile number */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Mobile number</label>
            <div className="flex gap-2">
              <span className="px-3 py-2.5 bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-600 text-xs flex items-center">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile phone number"
                className="flex-1 px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs sm:text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs sm:text-sm"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Passwords must be at least 6 characters.
            </span>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Re-enter password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs sm:text-sm"
            />
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
                <span>Creating account with Firebase...</span>
              </>
            ) : (
              <span>Create your BazaarHub account</span>
            )}
          </button>
        </form>

        <p className="text-[11px] text-slate-400 leading-relaxed text-center pt-2">
          By creating an account, you agree to BazaarHub's{' '}
          <Link to="/conditions" className="text-orange-600 hover:underline">Conditions of Use</Link> and{' '}
          <Link to="/privacy" className="text-orange-600 hover:underline">Privacy Notice</Link>.
        </p>

        <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-600 font-bold hover:underline">
            Sign in →
          </Link>
        </div>

      </div>

    </div>
  );
}

