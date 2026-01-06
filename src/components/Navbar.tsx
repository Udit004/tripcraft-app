'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { authService } from '@/service';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="gradient-primary w-10 h-10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              TripCraft
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
              About
            </Link>
            <Link href="/dashboard" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
              My Trips
            </Link>
            <Link href="/contact" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-slate-600">Hi, {user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-primary-600 border border-primary-600 hover:bg-primary-50 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signUp"
                  className="px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link href="/about" className="text-slate-600 hover:text-primary-600 font-medium py-2">
                About
              </Link>
              <Link href="/dashboard" className="text-slate-600 hover:text-primary-600 font-medium py-2">
                My Trips
              </Link>
              <Link href="/contact" className="text-slate-600 hover:text-primary-600 font-medium py-2">
                Contact
              </Link>
              {isAuthenticated ? (
                <>
                  <span className="text-slate-600 py-2">Hi, {user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="text-left text-primary-600 font-medium py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-primary-600 font-medium py-2">
                    Sign In
                  </Link>
                  <Link href="/signUp" className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium text-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
