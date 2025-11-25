'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import {
  Mail, Lock, Loader2, AlertCircle, CheckCircle,
  Users, Target, TrendingUp, ChevronRight
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth(); // ← now we use the updated user after login
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);

      // SMART REDIRECT — ONLY CHANGE HERE
      if (user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/projects'); // ← entrepreneurs still go here (unchanged)
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        'Invalid email or password';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00A1D6] via-[#0077B6] to-[#004C99] overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT: LOGIN FORM — 100% UNCHANGED DESIGN */}
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Continue supporting Rwanda’s youth</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline w-4 h-4 mr-1" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@bdr.rw"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A1D6] focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A1D6] focus:border-transparent transition-all"
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
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ChevronRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don’t have an account?{' '}
                  <Link href="/auth/register" className="font-bold text-[#00A1D6] hover:text-[#00A651] transition-colors">
                    Register here
                  </Link>
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Secure login</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>MoMo ready</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT SIDE — 100% UNTOUCHED */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  Every Login = More Jobs for Rwanda
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { icon: Users, value: '156+', label: 'Jobs Created', key: 'jobs' },
                    { icon: Target, value: '42+', label: 'Projects Funded', key: 'projects' },
                    { icon: TrendingUp, value: '89+', label: 'Youth Mentored', key: 'mentored' },
                  ].map((stat) => (
                    <motion.div
                      key={stat.key}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (stat.key === 'jobs' ? 0 : stat.key === 'projects' ? 0.1 : 0.2) }}
                      className="bg-white/20 backdrop-blur-lg rounded-2xl p-6"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white/30 rounded-xl flex items-center justify-center">
                          <stat.icon className="w-8 h-8 text-[#FCD116]" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-white">{stat.value}</p>
                          <p className="text-white/90">{stat.label}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-12">
                  <blockquote className="text-xl text-white/90 italic">
                    “Beyond-Degrees gave me the chance to turn my idea into 12 jobs for young Rwandans.”
                  </blockquote>
                  <p className="mt-3 text-white font-medium">
                    — Alice Kamanzi, Eco-Bags Founder
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}