'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useActivityPoolContext } from '@/context/ActivityPoolContext';
import { Menu, X, MapPin } from 'lucide-react';
import { colors } from '@/constants/colors';
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const { poolCount } = useActivityPoolContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper function to check if a route is active
  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/dashboard', label: 'My Trips' },
    { href: '/explore', label: 'Explore' },
  ];

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-sm ${
        scrolled ? 'shadow-lg' : 'shadow-sm'
      }`}
      style={{ 
        backgroundColor: scrolled ? 'rgba(248, 250, 252, 0.95)' : colors.background,
        borderBottom: `1px solid ${scrolled ? colors.border : 'rgba(229, 231, 235, 0.5)'}`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
              <Image 
                src="/images/logo.png" 
                alt="TripCraft Logo" 
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg sm:text-xl font-semibold" style={{ color: colors.textMain }}>
              Trip<span className="text-xl sm:text-2xl font-bold" style={{ color: colors.secondary }}>Craft</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 font-medium text-sm transition-all duration-200 relative group ${
                  isActive(link.href) ? '' : 'hover:text-opacity-70'
                }`}
                style={{ 
                  color: isActive(link.href) ? colors.primary : colors.textMuted 
                }}
              >
                {link.label}
                {/* Active indicator - underline */}
                <span 
                  className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-200 ${
                    isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                  style={{ 
                    backgroundColor: isActive(link.href) ? colors.primary : colors.secondary,
                    opacity: isActive(link.href) ? 1 : 0.5
                  }}
                />
              </Link>
            ))}
            
            {isAuthenticated && (
              <Link
                href="/activity-pool"
                className={`px-4 py-2 font-medium text-sm transition-all duration-200 relative group flex items-center gap-1.5 ${
                  isActive('/activity-pool') ? '' : 'hover:text-opacity-70'
                }`}
                style={{ 
                  color: isActive('/activity-pool') ? colors.primary : colors.textMuted 
                }}
              >
                Pool
                {poolCount > 0 && (
                  <span 
                    className="min-w-[20px] h-5 px-1.5 flex items-center justify-center text-white text-xs rounded-full font-semibold shadow-sm"
                    style={{ backgroundColor: colors.secondary }}
                  >
                    {poolCount > 99 ? '99+' : poolCount}
                  </span>
                )}
                {/* Active indicator */}
                <span 
                  className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-200 ${
                    isActive('/activity-pool') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                  style={{ 
                    backgroundColor: isActive('/activity-pool') ? colors.primary : colors.secondary,
                    opacity: isActive('/activity-pool') ? 1 : 0.5
                  }}
                />
              </Link>
            )}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border hover:shadow-sm transition-all"
                  style={{ 
                    backgroundColor: colors.surface,
                    borderColor: colors.border
                  }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ backgroundColor: colors.secondary }}>
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium" style={{ color: colors.textMain }}>
                    {user?.username}
                  </span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ color: colors.textMuted }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div 
                      className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200"
                      style={{ 
                        backgroundColor: colors.surface,
                        borderColor: colors.border
                      }}
                    >
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-opacity-80 transition-colors"
                        style={{ 
                          color: colors.textMain,
                          backgroundColor: isActive('/profile') ? colors.background : 'transparent'
                        }}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm font-medium">Profile</span>
                      </Link>
                      <div style={{ borderTop: `1px solid ${colors.border}` }}></div>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left hover:bg-red-50"
                        style={{ 
                          color: '#DC2626',
                          backgroundColor: 'transparent'
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-lg transition-all font-medium text-sm hover:bg-opacity-80"
                  style={{ 
                    color: colors.textMuted,
                    backgroundColor: 'transparent'
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/signUp"
                  className="px-5 py-2 rounded-lg text-white transition-all font-medium text-sm hover:shadow-md hover:scale-105"
                  style={{ backgroundColor: colors.primary }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ 
              color: colors.textMuted,
              backgroundColor: mobileMenuOpen ? colors.surface : 'transparent'
            }}
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
          <div 
            className="md:hidden py-4 border-t animate-in slide-in-from-top duration-200"
            style={{ 
              borderColor: colors.border,
              backgroundColor: colors.surface
            }}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium py-3 px-4 rounded-lg transition-all duration-200 ${
                    isActive(link.href) ? 'shadow-sm' : ''
                  }`}
                  style={{
                    color: isActive(link.href) ? colors.primary : colors.textMuted,
                    backgroundColor: isActive(link.href) ? colors.background : 'transparent',
                    fontWeight: isActive(link.href) ? '600' : '500',
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {isAuthenticated && (
                <Link
                  href="/activity-pool"
                  className={`font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-between ${
                    isActive('/activity-pool') ? 'shadow-sm' : ''
                  }`}
                  style={{
                    color: isActive('/activity-pool') ? colors.primary : colors.textMuted,
                    backgroundColor: isActive('/activity-pool') ? colors.background : 'transparent',
                    fontWeight: isActive('/activity-pool') ? '600' : '500',
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Activity Pool</span>
                  {poolCount > 0 && (
                    <span 
                      className="min-w-[24px] h-6 px-2 flex items-center justify-center text-white text-xs rounded-full font-semibold"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      {poolCount > 99 ? '99+' : poolCount}
                    </span>
                  )}
                </Link>
              )}

              <div className="my-2" style={{ borderTop: `1px solid ${colors.border}` }}></div>

              {isAuthenticated ? (
                <>
                  <div 
                    className="flex items-center gap-3 py-3 px-4 rounded-lg mb-2"
                    style={{ backgroundColor: colors.background }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: colors.secondary }}>
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs" style={{ color: colors.textMuted }}>Signed in as</span>
                      <span className="text-sm font-semibold" style={{ color: colors.textMain }}>
                        {user?.username}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className={`font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                      isActive('/profile') ? 'shadow-sm' : ''
                    }`}
                    style={{
                      color: isActive('/profile') ? colors.primary : colors.textMuted,
                      backgroundColor: isActive('/profile') ? colors.background : 'transparent',
                      fontWeight: isActive('/profile') ? '600' : '500',
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left font-medium py-3 px-4 rounded-lg transition-all border flex items-center gap-3 hover:bg-red-50"
                    style={{ 
                      color: '#DC2626',
                      borderColor: '#FCA5A5',
                      backgroundColor: colors.surface
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="font-medium py-3 px-4 rounded-lg transition-all text-center"
                    style={{ 
                      color: colors.textMuted,
                      backgroundColor: 'transparent',
                      border: `1px solid ${colors.border}`
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signUp"
                    className="text-white font-medium py-3 px-4 rounded-lg text-center transition-all mt-2 shadow-md"
                    style={{ backgroundColor: colors.primary }}
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