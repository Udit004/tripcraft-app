'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services';
import { useAuth } from '@/context/AuthContext'; 

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const data = await authService.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (data.success) {
        login(data.user); // Assuming the user data is returned in data.user
        router.push('/dashboard');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-primary-600">
            Create Account
          </h1>
          <p className="text-slate-600">
            Join us and start your journey
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium mb-2 text-slate-900"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-slate-50 border-2 border-gray-200 text-slate-900 focus:border-primary-600 focus:bg-white"
                placeholder="johndoe"
                minLength={3}
                maxLength={30}
              />
            </div>

            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium mb-2 text-slate-900"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-slate-50 border-2 border-gray-200 text-slate-900 focus:border-primary-600 focus:bg-white"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-2 text-slate-900"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-slate-50 border-2 border-gray-200 text-slate-900 focus:border-primary-600 focus:bg-white"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium mb-2 text-slate-900"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg outline-none transition-all bg-slate-50 border-2 border-gray-200 text-slate-900 focus:border-primary-600 focus:bg-white"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg text-sm bg-red-50 text-red-800 border border-red-200">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-600">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link 
            href="/login"
            className="block text-center py-3 px-4 rounded-lg font-medium transition-all bg-secondary-500 hover:bg-secondary-600 text-white shadow-md hover:shadow-lg"
          >
            Sign In
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-sm mt-6 text-slate-600">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
