'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import { supabase } from '@/lib/supabase';
import { useRecaptcha } from '@/hooks/useRecaptcha';

function getFriendlyError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('email rate limit exceeded') || lower.includes('over_email_send_rate_limit')) {
    return 'Our system is experiencing high demand. Please wait a few minutes and try again, or contact us for help.';
  }
  if (lower.includes('user already registered') || lower.includes('already been registered')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  if (lower.includes('password') && lower.includes('weak')) {
    return 'Your password is too weak. Please use at least 8 characters with a mix of letters, numbers, and symbols.';
  }
  if (lower.includes('invalid email')) {
    return 'Please enter a valid email address.';
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Connection error. Please check your internet and try again.';
  }
  return message;
}

export default function SignupPage() {
  const router = useRouter();
  const errorRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [success, setSuccess] = useState(false);
  const { getToken, verifying } = useRecaptcha();

  // Auto-scroll to error when it appears
  useEffect(() => {
    if (authError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setAuthError('');
    setIsLoading(true);

    const newErrors: any = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // reCAPTCHA verification
    const isHuman = await getToken('signup');
    if (!isHuman) {
      setAuthError('Security verification failed. Please try again.');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            newsletter: formData.newsletter
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Send Welcome Notification
        fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'welcome',
            payload: {
              email: formData.email,
              firstName: formData.firstName
            }
          })
        }).catch(err => console.error('Welcome notification error:', err));
        // If Supabase confirms via email, data.session might be null initially
        if (!data.session) {
          setSuccess(true);
        } else {
          // Auto-login success (if email confirming is off)
          router.push('/account');
          router.refresh();
        }
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setAuthError(getFriendlyError(err.message || 'Failed to sign up. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-mail-send-line text-4xl text-gsg-purple"></i>
          </div>
          <h1 className="text-3xl font-bold text-gsg-black mb-4">Check Your Email</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            We've sent a confirmation link to <strong className="text-gsg-black">{formData.email}</strong>.<br />
            Please check your inbox to activate your account.
          </p>
          <Link href="/auth/login" className="inline-block bg-gsg-purple text-white px-8 py-3 rounded-full font-bold hover:bg-gsg-purple-dark transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Back to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="relative w-16 h-16 mx-auto">
              <Image src="/fgfg.png" alt="GSG Logo" fill className="object-contain" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gsg-black mb-2">Create Account</h1>
          <p className="text-gray-500">Join us and start shopping today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {authError && (
            <div ref={errorRef} className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-3">
              <i className="ri-error-warning-fill text-lg flex-shrink-0 mt-0.5"></i>
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gsg-black mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gsg-purple focus:border-gsg-purple transition-all outline-none ${errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                    }`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gsg-black mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gsg-purple focus:border-gsg-purple transition-all outline-none ${errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                    }`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.lastName}</p>
                )}
              </div>
            </div>

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
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gsg-purple focus:border-gsg-purple transition-all outline-none ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                  }`}
                placeholder="+233 XX XXX XXXX"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.phone}</p>
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
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gsg-purple transition-colors"
                >
                  <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-xl`}></i>
                </button>
              </div>
              <PasswordStrengthMeter password={formData.password} />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gsg-black mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-gsg-purple focus:border-gsg-purple transition-all outline-none ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                    }`}
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gsg-purple transition-colors"
                >
                  <i className={`${showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-xl`}></i>
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  className="w-4 h-4 mt-1 text-gsg-purple rounded focus:ring-gsg-purple"
                />
                <span className="text-sm text-gray-600 group-hover:text-gsg-black transition-colors">
                  I agree to the{' '}
                  <Link href="/terms" className="text-gsg-purple hover:text-gsg-purple-dark font-bold hover:underline">
                    Terms & Conditions
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-gsg-purple hover:text-gsg-purple-dark font-bold hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.acceptTerms}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || verifying}
              className="w-full bg-gsg-black hover:bg-gsg-purple text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer mt-2"
            >
              {isLoading || verifying ? (
                <span className="flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i> {verifying ? 'Verifying...' : 'Creating account...'}
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or sign up with</span>
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
            Already have an account?{' '}
            <Link href="/auth/login" className="text-gsg-purple hover:text-gsg-purple-dark font-bold hover:underline">
              Sign in
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
