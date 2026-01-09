'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#1E3A8A] to-[#0EA5A4] rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-[#0F172A]">
              TripCraft
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/about" 
              className="text-[#475569] hover:text-[#1E3A8A] font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              href="/dashboard" 
              className="text-[#475569] hover:text-[#1E3A8A] font-medium transition-colors"
            >
              My Trips
            </Link>
            <Link 
              href="/contact" 
              className="text-[#475569] hover:text-[#1E3A8A] font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-[#475569] px-3">
                  {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg text-[#1E3A8A] border border-[#E5E7EB] hover:border-[#1E3A8A] hover:bg-[#F8FAFC] transition-all font-medium text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-lg text-[#475569] hover:text-[#1E3A8A] hover:bg-[#F8FAFC] transition-all font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/signUp"
                  className="px-5 py-2 rounded-lg bg-[#1E3A8A] text-white hover:bg-[#1E40AF] transition-colors font-medium text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#475569] hover:bg-[#F8FAFC] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E5E7EB]">
            <div className="flex flex-col gap-1">
              <Link 
                href="/about" 
                className="text-[#475569] hover:text-[#1E3A8A] hover:bg-[#F8FAFC] font-medium py-3 px-3 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/dashboard" 
                className="text-[#475569] hover:text-[#1E3A8A] hover:bg-[#F8FAFC] font-medium py-3 px-3 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Trips
              </Link>
              <Link 
                href="/contact" 
                className="text-[#475569] hover:text-[#1E3A8A] hover:bg-[#F8FAFC] font-medium py-3 px-3 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="border-t border-[#E5E7EB] my-2"></div>
              
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-[#475569] py-3 px-3">
                    Signed in as {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-left text-[#1E3A8A] hover:bg-[#F8FAFC] font-medium py-3 px-3 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-[#475569] hover:text-[#1E3A8A] hover:bg-[#F8FAFC] font-medium py-3 px-3 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/signUp" 
                    className="bg-[#1E3A8A] text-white hover:bg-[#1E40AF] font-medium py-3 px-3 rounded-lg text-center transition-colors mt-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
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