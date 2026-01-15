'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Heart } from 'lucide-react';
import { colors } from '@/constants/colors';
import { getPoolCount } from '@/services/activityPoolService';
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [poolCount, setPoolCount] = useState(0);

  // Fetch pool count when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getPoolCount().then(setPoolCount).catch(() => setPoolCount(0));
    }
  }, [isAuthenticated, pathname]); // Re-fetch when route changes

  // Helper function to check if a route is active
  const isActive = (href: string) => pathname === href;

  // Helper function to get active link styles
  const getNavLinkStyles = (href: string) => {
    const isCurrentPage = isActive(href);
    return {
      color: isCurrentPage ? colors.primary : colors.textMuted,
      borderBottom: isCurrentPage ? `3px solid ${colors.primary}` : 'none',
      paddingBottom: '8px',
    };
  };

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
              <Image src="/images/logo.png" alt="TripCraft Logo" width={50} height={50} />
            <span className="text-xl font-semibold text-[#0F172A]">
              Trip<span className='text-2xl font-bold text-teal-800'>Craft</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/about" 
              className="font-medium transition-colors"
              style={getNavLinkStyles('/about')}
            >
              About
            </Link>
            <Link 
              href="/dashboard" 
              className="font-medium transition-colors"
              style={getNavLinkStyles('/dashboard')}
            >
              My Trips
            </Link>
            <Link 
              href="/explore" 
              className="font-medium transition-colors"
              style={getNavLinkStyles('/explore')}
            >
              Explore
            </Link>
            {isAuthenticated && (
              <Link 
                href="/activity-pool" 
                className="font-medium transition-colors relative"
                style={getNavLinkStyles('/activity-pool')}
              >
                <div className="flex items-center gap-1">
                  Pool
                  {poolCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {poolCount > 99 ? '99+' : poolCount}
                    </span>
                  )}
                </div>
              </Link>
            )}
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
                className="font-medium py-3 px-3 rounded-lg transition-colors"
                style={{
                  color: isActive('/about') ? colors.primary : colors.textMuted,
                  backgroundColor: isActive('/about') ? colors.background : 'transparent',
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/dashboard" 
                className="font-medium py-3 px-3 rounded-lg transition-colors"
                style={{
                  color: isActive('/dashboard') ? colors.primary : colors.textMuted,
                  backgroundColor: isActive('/dashboard') ? colors.background : 'transparent',
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                My Trips
              </Link>
              <Link 
                href="/explore" 
                className="font-medium py-3 px-3 rounded-lg transition-colors"
                style={{
                  color: isActive('/explore') ? colors.primary : colors.textMuted,
                  backgroundColor: isActive('/explore') ? colors.background : 'transparent',
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore
              </Link>
              {isAuthenticated && (
                <Link 
                  href="/activity-pool" 
                  className="font-medium py-3 px-3 rounded-lg transition-colors flex items-center gap-2"
                  style={{
                    color: isActive('/activity-pool') ? colors.primary : colors.textMuted,
                    backgroundColor: isActive('/activity-pool') ? colors.background : 'transparent',
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="h-4 w-4" />
                  Activity Pool
                  {poolCount > 0 && (
                    <span className="bg-pink-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
                      {poolCount}
                    </span>
                  )}
                </Link>
              )}
              
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