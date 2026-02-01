'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, EyeOff, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  medicalSchool: string;
  currentYear: string;
  graduationYear: string;
  terms: boolean;
}

const medicalSchools = [
  'Johns Hopkins University',
  'Stanford University',
  'Harvard Medical School',
  'UCLA David Geffen School of Medicine',
  'NYU Grossman School of Medicine',
  'Columbia University',
  'University of Pennsylvania',
  'University of California, San Francisco',
  'Yale School of Medicine',
  'Other',
];

const currentYears = [
  { value: 'ms1', label: '1st Year (MS1)' },
  { value: 'ms2', label: '2nd Year (MS2)' },
  { value: 'ms3', label: '3rd Year (MS3)' },
  { value: 'ms4', label: '4th Year (MS4)' },
];

const graduationYears = Array.from(
  { length: 6 },
  (_, i) => ({ value: String(2025 + i), label: String(2025 + i) })
);

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();

  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    setError(null);

    if (!supabase) {
      setError('Authentication system not configured. Please set up Supabase environment variables.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Attempt to sign up with Supabase
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            medical_school: data.medicalSchool,
            current_year: data.currentYear,
            graduation_year: data.graduationYear,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signupError) {
        console.error('Signup error:', signupError);
        setError(signupError.message || 'Failed to create account. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Check if email confirmation is required
      if (signupData.user && signupData.session) {
        // User is automatically signed in (email confirmation disabled or already confirmed)
        router.push('/dashboard');
      } else if (signupData.user) {
        // User created but needs email confirmation - redirect to verify page
        router.push('/verify-otp?email=' + encodeURIComponent(data.email));
      } else {
        setError('Account created but could not proceed. Please try signing in.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Unexpected signup error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Motivational Quote */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 flex-col justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-semibold text-white">MedQBank</span>
        </Link>

        <div className="space-y-6">
          <blockquote className="text-3xl font-medium text-white leading-relaxed">
            "The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and then starting on the first one."
          </blockquote>
          <div className="flex items-center space-x-4">
            <img
              src="https://i.pravatar.cc/150?img=8"
              alt="Medical Student"
              className="w-12 h-12 rounded-full border-2 border-white/30"
            />
            <div>
              <p className="text-white font-semibold">Dr. Michael Chen</p>
              <p className="text-white/70 text-sm">MS4, Stanford University • Matched at Mass General</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-white/60 text-sm">
          <span>Join 10,000+ medical students</span>
          <span>•</span>
          <span>95% match rate</span>
          <span>•</span>
          <span>14-day free trial</span>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">MedQBank</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-600">Start your 14-day free trial. No credit card required.</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.fullName ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                } focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200`}
                placeholder="Dr. Jane Smith"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                } focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200`}
                placeholder="jane@university.edu"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain uppercase, lowercase, and number',
                    },
                  })}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                  } focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200 pr-12`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
              {/* Password strength indicator */}
              <div className="mt-2 flex items-center space-x-2">
                <div className={`h-1 flex-1 rounded-full ${
                  password?.length >= 8 ? 'bg-green-500' : 'bg-gray-200'
                }`}></div>
                <span className="text-xs text-gray-500">8+ characters</span>
              </div>
            </div>

            {/* Medical School */}
            <div>
              <label htmlFor="medicalSchool" className="block text-sm font-medium text-gray-700 mb-1">
                Medical School
              </label>
              <select
                id="medicalSchool"
                {...register('medicalSchool', { required: 'Medical school is required' })}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.medicalSchool ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                } focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200 bg-white`}
              >
                <option value="">Select your medical school</option>
                {medicalSchools.map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
              </select>
              {errors.medicalSchool && (
                <p className="mt-1 text-sm text-red-500">{errors.medicalSchool.message}</p>
              )}
            </div>

            {/* Current Year & Graduation Year */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="currentYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Year
                </label>
                <select
                  id="currentYear"
                  {...register('currentYear', { required: 'Year is required' })}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.currentYear ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                  } focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200 bg-white`}
                >
                  <option value="">Select year</option>
                  {currentYears.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
                {errors.currentYear && (
                  <p className="mt-1 text-sm text-red-500">{errors.currentYear.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Graduation Year
                </label>
                <select
                  id="graduationYear"
                  {...register('graduationYear', { required: 'Graduation year is required' })}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.graduationYear ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                  } focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200 bg-white`}
                >
                  <option value="">Select year</option>
                  {graduationYears.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
                {errors.graduationYear && (
                  <p className="mt-1 text-sm text-red-500">{errors.graduationYear.message}</p>
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                {...register('terms', { required: 'You must accept the terms' })}
                className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/signin" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
