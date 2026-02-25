import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Chrome, Apple, Facebook, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmailInputWithSuggestions } from './EmailInputWithSuggestions';
export interface LoginPageProps {
  onBack?: () => void;
  onForward?: () => void;
  onLoginSuccess?: (method: string, email?: string) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}
export const LoginPage = ({
  onBack,
  onForward,
  onLoginSuccess,
  onForgotPassword,
  onSignUp
}: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle social login
  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    setIsLoading(true);
    setLoginMethod(provider);
    setError('');

    // Simulate OAuth flow
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess?.(provider);
    }, 1500);
  };

  // Handle email/password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    setLoginMethod('email');

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess?.('email', email);
    }, 1500);
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 sm:py-12 flex items-center justify-center px-4">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 py-8 sm:py-10 text-white text-center relative">
            {onBack && <button onClick={onBack} className="absolute left-4 top-4 p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ArrowLeft size={20} />
              </button>}
            {onForward && <button onClick={onForward} className="absolute right-4 top-4 p-2 hover:bg-white/10 rounded-lg transition-colors" title="Continue">
                <ArrowRight size={20} />
              </button>}
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-blue-100 text-sm">Sign in to continue to PayUpp</p>
          </div>

          <div className="px-6 sm:px-8 py-8">
            {/* Error Message */}
            <AnimatePresence>
              {error && <motion.div initial={{
              opacity: 0,
              y: -10
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -10
            }} className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </motion.div>}
            </AnimatePresence>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button onClick={() => handleSocialLogin('google')} disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed group">
                {isLoading && loginMethod === 'google' ? <Loader2 size={20} className="animate-spin text-blue-600" /> : <Chrome size={20} className="text-gray-700 group-hover:scale-110 transition-transform" />}
                <span>Continue with Google</span>
              </button>

              <button onClick={() => handleSocialLogin('apple')} disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-black border-2 border-black rounded-xl hover:bg-gray-900 transition-all font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed group">
                {isLoading && loginMethod === 'apple' ? <Loader2 size={20} className="animate-spin" /> : <Apple size={20} className="group-hover:scale-110 transition-transform" />}
                <span>Continue with Apple</span>
              </button>

              <button onClick={() => handleSocialLogin('facebook')} disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-[#1877F2] border-2 border-[#1877F2] rounded-xl hover:bg-[#166FE5] transition-all font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed group">
                {isLoading && loginMethod === 'facebook' ? <Loader2 size={20} className="animate-spin" /> : <Facebook size={20} className="group-hover:scale-110 transition-transform" />}
                <span>Continue with Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {/* Email Field */}
              <EmailInputWithSuggestions id="email" value={email} onChange={value => setEmail(value)} placeholder="you@example.com" disabled={isLoading} label="Email address" />

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" disabled={isLoading} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600" disabled={isLoading}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer" disabled={isLoading} />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">Remember me</span>
                </label>
                <button type="button" onClick={onForgotPassword} className="text-sm text-blue-600 hover:text-blue-700 font-medium" disabled={isLoading}>
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button type="submit" disabled={isLoading || !email || !password} className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30">
                {isLoading && loginMethod === 'email' ? <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Signing in...</span>
                  </> : <>
                    <span>Sign in</span>
                    <CheckCircle2 size={18} />
                  </>}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button onClick={onSignUp} className="text-blue-600 hover:text-blue-700 font-semibold" disabled={isLoading}>
                  Sign up
                </button>
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} className="text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Secure login</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Your data is encrypted and protected with bank-level security. We never share your information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <CheckCircle2 size={14} className="text-green-600" />
            <span>256-bit encryption</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 size={14} className="text-green-600" />
            <span>GDPR compliant</span>
          </div>
        </div>
      </motion.div>
    </div>;
};