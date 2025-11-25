// src/app/auth/register/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import {
  Mail, Lock, User, ChevronRight, Loader2,
  CheckCircle, AlertCircle, Briefcase, Shield
} from 'lucide-react';

type UserRole = 'entrepreneur' | 'admin';

export default function RegisterPage() {
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, email, password, role });
      setShowSuccess(true);
      setTimeout(() => router.push('/auth/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      value: 'entrepreneur' as const,
      title: 'I Want to Launch a Project',
      icon: Briefcase,
      desc: 'Turn your idea into a job-creating business in Rwanda.',
      color: '#00A651',
      bg: 'bg-[#00A651]',
      border: 'border-[#00A651]',
      bgLight: 'bg-[#00A651]/10',
    },
    {
      value: 'admin' as const,
      title: 'I Am Francis — The Founder',
      icon: Shield,
      desc: 'francisschooten@gmail.com only — full control of BDR',
      color: '#FCD116',
      bg: 'bg-yellow-500',
      border: 'border-yellow-500',
      bgLight: 'bg-yellow-500/10',
    },
  ];

  return (
    <>
      {/* Hero Section — EXACT SAME DESIGN */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FCD116] via-[#00A1D6] to-[#00A651] overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: Register Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 max-w-md mx-auto lg:mx-0"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#00A1D6] via-[#FCD116] to-[#00A651] rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">BDR</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Rwanda’s Future</h1>
                <p className="text-gray-600">Choose your role and start creating jobs</p>
              </div>

              {/* Role Selection */}
              <div className="mb-8">
                <p className="text-sm font-medium text-gray-700 mb-4">I am a...</p>
                <div className="grid grid-cols-1 gap-3">
                  {roleOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = role === option.value;
                    return (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setRole(option.value)}
                        className={`relative p-5 rounded-2xl border-2 transition-all text-left ${
                          isActive
                            ? `${option.border} ${option.bgLight} shadow-lg`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-12 h-12 ${option.bg} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{option.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{option.desc}</p>
                          </div>
                        </div>
                        {isActive && (
                          <CheckCircle className="absolute top-5 right-5 w-6 h-6 text-[#00A651]" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Form — 100% UNCHANGED */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-1" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Francis Mutabazi"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FCD116] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline w-4 h-4 mr-1" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="francisschooten@gmail.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FCD116] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="inline w-4 h-4 mr-1" /> Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FCD116] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="inline w-4 h-4 mr-1" /> Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FCD116] focus:border-transparent transition-all"
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-red-50 rounded-xl border border-red-200"
                    >
                      <p className="text-sm text-red-700 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#00A1D6] to-[#00A651] text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>{role === 'admin' ? 'Claim Admin Access' : 'Create Account'}</span>
                      <ChevronRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="font-bold text-[#00A1D6] hover:text-[#00A651] transition-colors">
                    Sign in here
                  </Link>
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>No fees to join</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Impact Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  {role === 'entrepreneur' ? 'Your Idea = Jobs for Rwanda' : 'You Control Rwanda’s Future'}
                </h2>
                <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8">
                  <div className="text-center">
                    <Shield className="w-16 h-16 text-[#FCD116] mx-auto mb-4" />
                    <p className="text-5xl font-bold text-white mb-2">
                      {role === 'entrepreneur' ? '1 Startup' : '1 Founder'}
                    </p>
                    <p className="text-xl text-white/90">
                      = <span className="text-[#00A651]">10+ Jobs</span> for Rwandan Youth
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    '70% of Rwanda is under 35',
                    'Youth unemployment is real',
                    'Your action creates change',
                  ].map((fact, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="bg-white/10 backdrop-blur rounded-2xl p-4"
                    >
                      <p className="text-white font-medium">{fact}</p>
                    </motion.div>
                  ))}
                </div>
                <blockquote className="text-xl text-white/90 italic mt-8">
                  “Beyond Degrees is building the future of Rwanda — one job at a time.”
                </blockquote>
                <p className="text-white font-medium">
                  — Francis Mutabazi, Founder
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
            >
              <CheckCircle className="w-20 h-20 text-[#00A651] mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Welcome to BDR!
              </h2>
              <p className="text-gray-600 mb-6">
                Your account is ready. Redirecting to login...
              </p>
              <div className="bg-gray-100 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <strong>Next:</strong> {role === 'admin' ? 'Access Admin Dashboard' : 'Launch your project'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}