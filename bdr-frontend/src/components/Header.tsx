// components/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from './AuthProvider';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Mentors', href: '/mentors' },
  { name: 'Success', href: '/success' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isEntrepreneur = user?.role === 'entrepreneur';
  const isLoggedIn = !!user;

  const handleStartProject = () => {
    if (isLoggedIn) {
      router.push('/projects/create');
    } else {
      router.push('/auth/register');
    }
    setMobileMenuOpen(false);
  };

  const handleAdminDashboard = () => {
    if (isAdmin) {
      router.push('/admin');
    } else {
      router.push('/auth/login');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg z-50 border-b border-gray-100"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00A1D6] via-[#FCD116] to-[#00A651] rounded-full group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-[#00A1D6]">BDR</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900">Beyond</span>
              <span className="text-xl font-bold text-[#00A651]">-Degrees</span>
              <span className="text-sm text-gray-600 block -mt-1">Rwanda</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Desktop navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-all duration-200 relative group ${
                  pathname === link.href ? 'text-[#00A1D6]' : 'text-gray-700 hover:text-[#00A1D6]'
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-[#00A1D6] transition-all duration-300 ${
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* RIGHT SIDE — LOGIC FIXED */}
          <div className="hidden md:flex items-center space-x-4">

            {/* Start Project — Always visible */}
            <button
              onClick={handleStartProject}
              className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#00A1D6] to-[#00A651] rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Start Project
            </button>

            {/* Admin Dashboard — ONLY FOR ADMIN */}
            {isAdmin && (
              <button
                onClick={handleAdminDashboard}
                className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 ring-2 ring-yellow-300"
              >
                Admin Dashboard
              </button>
            )}

            {/* Auth State */}
            {isLoggedIn ? (
              <>
                {/* Show Dashboard only for entrepreneur */}
                {isEntrepreneur && (
                  <Link
                    href="/dashboard"
                    className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-[#00A1D6] transition-colors"
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="px-5 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === link.href
                      ? 'bg-[#00A1D6]/10 text-[#00A1D6]'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {isEntrepreneur && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700"
                >
                  Dashboard
                </Link>
              )}
            </nav>

            <div className="mt-6 flex flex-col space-y-3 px-4">
              <button
                onClick={handleStartProject}
                className="text-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#00A1D6] to-[#00A651] rounded-full"
              >
                Start Project
              </button>

              {isAdmin && (
                <button
                  onClick={handleAdminDashboard}
                  className="text-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full ring-2 ring-yellow-300"
                >
                  Admin Dashboard
                </button>
              )}

              {isLoggedIn ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-center px-5 py-3 text-sm font-medium text-red-600"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-center px-5 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}