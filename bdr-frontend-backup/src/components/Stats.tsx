// src/components/Stats.tsx
'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, DollarSign, Users, TrendingUp } from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';

const FALLBACK = {
  total_projects: 42,
  funded_projects: 38,
  jobs_created: 156,
  youth_mentored: 89,
};

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { data = FALLBACK } = useSWR('/api/v1/pages/home', fetcher);

  const stats = [
    { icon: Briefcase, label: 'Projects Launched', key: 'total_projects', color: 'blue' },
    { icon: DollarSign, label: 'Funded Projects', key: 'funded_projects', color: 'yellow' },
    { icon: Users, label: 'Jobs Created', key: 'jobs_created', color: 'green' },
    { icon: TrendingUp, label: 'Youth Mentored', key: 'youth_mentored', color: 'blue' },
  ];

  const colorMap = { blue: 'bg-[#00A1D6]', yellow: 'bg-[#FCD116]', green: 'bg-[#00A651]' };
  const textColorMap = { blue: 'text-[#00A1D6]', yellow: 'text-[#FCD116]', green: 'text-[#00A651]' };

  const formatNumber = (num: number) => (num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString());

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Impact in <span className="text-[#00A1D6]">Numbers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every contribution creates real jobs for Rwandan youth. Here’s what we’ve achieved together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const value = data?.[stat.key as keyof typeof FALLBACK] ?? 0;
            const bgColor = colorMap[stat.color];
            const textColor = textColorMap[stat.color];

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity ${bgColor}`} />
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200 }}
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl ${bgColor} text-white`}
                  >
                    <stat.icon className="w-8 h-8" />
                  </motion.div>

                  <motion.div
                    className="text-5xl font-bold text-gray-900 mb-2"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {formatNumber(value)}
                    <span className={`text-3xl ${textColor}`}>+</span>
                  </motion.div>

                  <p className="text-lg text-gray-600 font-medium">{stat.label}</p>

                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${Math.min((value / 200) * 100, 100)}%` } : {}}
                      transition={{ delay: 0.7 + index * 0.1, duration: 1 }}
                      className={`h-full bg-gradient-to-r ${
                        stat.color === 'blue' ? 'from-[#00A1D6] to-blue-400/70' :
                        stat.color === 'yellow' ? 'from-[#FCD116] to-yellow-400/70' :
                        'from-[#00A651] to-green-400/70'
                      }`}
                    />
                  </div>
                </div>

                <div className={`absolute -inset-1 ${bgColor} blur-xl opacity-0 group-hover:opacity-30 transition-opacity rounded-2xl -z-10`} />
              </motion.div>
            );
          })}
        </div>

        {/* ALU Badge — BACK */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-3 bg-[#FCD116]/10 px-8 py-4 rounded-full">
            <div className="w-8 h-8 bg-[#FCD116] rounded-full flex items-center justify-center">
              <span className="text-[#00A1D6] font-bold text-sm">ALU</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              Powered by <span className="text-[#00A1D6]">African Leadership University</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}