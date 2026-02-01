'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Refs for each OTP input
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0] && !success) {
      inputRefs.current[0].focus();
    }
  }, [success]);

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && value) {
      verifyOtp(newOtp.join(''));
    }
  };

  // Handle keydown
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');

    if (digits.length > 0) {
      const newOtp = [...otp];
      digits.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
      setError(null);

      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();

      if (digits.length === 6) {
        verifyOtp(digits.join(''));
      }
    }
    e.preventDefault();
  };

  // Verify OTP
  const verifyOtp = async (otpCode: string) => {
    if (!email) {
      setError('Email not found. Please go back and try signing in again.');
      return;
    }

    if (!supabase) {
      setError('Authentication system not configured.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'signup',
      });

      if (verifyError) {
        setError('Invalid verification code. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!email || !supabase) {
      setError('Cannot resend OTP. Please go back and try signing in again.');
      return;
    }

    setResending(true);
    setError(null);
    setResendSuccess(false);

    try {
      const { error: resendError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (resendError) {
        setError('Failed to resend code. Please try again.');
      } else {
        setResendSuccess(true);
        setError(null);
      }
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // Success Component
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">
              Redirecting you to the dashboard...
            </p>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-white">MedQBank</span>
          </Link>

          <div className="mt-20 space-y-6">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Verify your email address
            </h2>
            <p className="text-lg text-slate-300">
              We've sent a 6-digit verification code to your inbox. Enter it below to activate your account.
            </p>
          </div>

          <div className="mt-16 flex items-center space-x-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-full border-2 border-slate-800 flex items-center justify-center text-white text-sm font-medium">JD</div>
              <div className="w-10 h-10 bg-purple-500 rounded-full border-2 border-slate-800 flex items-center justify-center text-white text-sm font-medium">MK</div>
              <div className="w-10 h-10 bg-pink-500 rounded-full border-2 border-slate-800 flex items-center justify-center text-white text-sm font-medium">AS</div>
            </div>
            <p className="text-slate-400 text-sm">Joined by 10,000+ medical students</p>
          </div>
        </div>

        <div className="relative z-10 flex items-center space-x-4 text-slate-400 text-sm">
          <span>Secure verification</span>
          <span>•</span>
          <span>Powered by Supabase</span>
        </div>
      </div>

      {/* Right Side - OTP Verification */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">MedQBank</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter verification code</h1>
            <p className="text-gray-500">
              We've sent a code to <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>

          {/* Success Message */}
          {resendSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <p className="text-sm text-green-700">New code sent! Please check your email.</p>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* OTP Input */}
          <form onSubmit={(e) => { e.preventDefault(); verifyOtp(otp.join('')); }} className="space-y-6">
            <div className="flex justify-between gap-2 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value && !/^\d$/.test(value)) return;
                    const newOtp = [...otp];
                    newOtp[index] = value;
                    setOtp(newOtp);
                    setError(null);
                    if (value && index < 5) {
                      inputRefs.current[index + 1]?.focus();
                    }
                    if (index === 5 && value) {
                      verifyOtp(newOtp.join(''));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otp[index] && index > 0) {
                      inputRefs.current[index - 1]?.focus();
                    }
                  }}
                  onPaste={(e) => {
                    const pastedData = e.clipboardData.getData('text');
                    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');
                    if (digits.length > 0) {
                      const newOtp = [...otp];
                      digits.forEach((digit, idx) => {
                        if (idx < 6) newOtp[idx] = digit;
                      });
                      setOtp(newOtp);
                      setError(null);
                      const nextIndex = Math.min(digits.length, 5);
                      inputRefs.current[nextIndex]?.focus();
                      if (digits.length === 6) {
                        verifyOtp(digits.join(''));
                      }
                    }
                    e.preventDefault();
                  }}
                  disabled={isSubmitting}
                  className={`w-14 h-14 text-center text-2xl font-semibold border-2 rounded-xl outline-none transition-all duration-200 ${
                    error
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                  } disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-300`}
                  placeholder="0"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isSubmitting || otp.join('').length !== 6}
              className="w-full py-3.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify & Continue</span>
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Didn't receive the code?{' '}
              <button
                onClick={handleResendOtp}
                disabled={resending}
                className="text-gray-900 font-medium hover:text-indigo-600 transition-colors inline-flex items-center space-x-1 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                <span>{resending ? 'Sending...' : 'Resend code'}</span>
              </button>
            </p>
          </div>

          {/* Back to Sign In */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link
              href="/signin"
              className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
