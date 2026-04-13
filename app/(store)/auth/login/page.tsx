'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useRecaptcha } from '@/hooks/useRecaptcha';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const { getToken, verifying } = useRecaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setAuthError('');
    setIsLoading(true);

    // Validation
    const newErrors: any = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // reCAPTCHA verification
    const isHuman = await getToken('login');
    if (!isHuman) {
      setAuthError('Security verification failed. Please try again.');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        router.push('/account');
        router.refresh(); // Refresh to update auth state in other components
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="relative w-16 h-16 mx-auto">
              <Image src="/fgfg.png" alt="GSG Logo" fill className="object-contain" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gsg-black mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your account to continue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-3">
              <i className="ri-error-warning-fill text-lg mt-0.5"></i>
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gsg-black mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gsg-purple focus:border-gsg-purple transition-all outline-none ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                  }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gsg-black mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-gsg-purple focus:border-gsg-purple transition-all outline-none ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                    }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gsg-purple transition-colors"
                >
                  <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-xl`}></i>
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 text-gsg-purple rounded border-gray-300 focus:ring-gsg-purple"
                />
                <span className="text-sm text-gray-600 group-hover:text-gsg-purple transition-colors">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-gsg-purple hover:text-gsg-purple-dark font-bold hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading || verifying}
              className="w-full bg-gsg-black hover:bg-gsg-purple text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer mt-2"
            >
              {isLoading || verifying ? (
                <span className="flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i> {verifying ? 'Verifying...' : 'Signing in...'}
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                disabled
                className="flex items-center justify-center space-x-2 border border-gray-200 bg-gray-50 py-3 rounded-xl cursor-not-allowed opacity-60 hover:bg-gray-100 transition-colors"
              >
                <i className="ri-google-fill text-xl text-red-500"></i>
                <span className="font-bold text-gray-600">Google</span>
              </button>
              <button
                disabled
                className="flex items-center justify-center space-x-2 border border-gray-200 bg-gray-50 py-3 rounded-xl cursor-not-allowed opacity-60 hover:bg-gray-100 transition-colors"
              >
                <i className="ri-facebook-circle-fill text-xl text-blue-600"></i>
                <span className="font-bold text-gray-600">Facebook</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-gsg-purple hover:text-gsg-purple-dark font-bold hover:underline">
              Create one now
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-gray-500 hover:text-gsg-black font-medium inline-flex items-center transition-colors">
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
