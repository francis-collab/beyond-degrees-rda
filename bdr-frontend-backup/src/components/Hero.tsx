// src/components/Hero.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Users, Target, Zap } from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

const iconMap: { [key: string]: React.ElementType } = {
  Users,
  Target,
  Zap,
};

export default function Hero() {
  const { user } = useAuth();

  const { data } = useSWR('/api/v1/pages/home', fetcher, {
    fallbackData: {
      hero: {
        title: "From <span class='text-[#FCD116]'>Degree</span> to <span class='text-[#00A651]'>Jobs</span>",
        subtitle: "70% of Rwanda is under 35. We turn their ideas into startups — and startups into jobs.",
        stats: [
          { icon: 'Users', value: '42+', label: 'Projects Funded' },
          { icon: 'Target', value: '156', label: 'Jobs Created' },
          { icon: 'Zap', value: '89', label: 'Youth Mentored' },
        ],
        cta_explore: "Explore Projects",
        cta_launch: "Start Your Idea"
      }
    }
  });

  const hero = data?.hero || {};
  const stats = hero.stats || [
    { icon: 'Users', value: '42+', label: 'Projects Funded' },
    { icon: 'Target', value: '156', label: 'Jobs Created' },
    { icon: 'Zap', value: '89', label: 'Youth Mentored' }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-blue">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FCD116] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                dangerouslySetInnerHTML={{
                  __html: hero.title || "From <span class='text-[#FCD116]'>Degree</span> to <span class='text-[#00A651]'>Jobs</span>"
                }}
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl md:text-2xl text-white/90 max-w-2xl"
              >
                {hero.subtitle}
              </motion.p>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-3 gap-6"
            >
              {stats.map((stat: any, i: number) => {
                const IconComponent = iconMap[stat.icon] || Users;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex justify-center mb-2">
                      <IconComponent className="w-8 h-8 text-[#FCD116]" aria-hidden="true" />
                    </div>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-white/80">{stat.label}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/projects"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-[#00A1D6] bg-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                {hero.cta_explore || "Explore Projects"}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              {user ? (
                <Link
                  href="/projects/create"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-[#00A651] rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  {hero.cta_launch || "Start Your Idea"}
                </Link>
              ) : (
                <Link
                  href="/auth/register?role=entrepreneur"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-[#00A651] rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  {hero.cta_launch || "Start Your Idea"}
                </Link>
              )}
            </motion.div>
          </motion.div>

          {/* Right: Hero Image — NOW 100% WORKING */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/heroimage.png"  // Correct path: public/heroimage.png
                alt="Rwandan youth launching startups and creating jobs in Kigali"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                priority
                unoptimized={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-6 -right-6 bg-[#FCD116] text-[#00A1D6] px-6 py-3 rounded-full shadow-xl font-bold text-lg"
            >
              Live in 90 Days
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-white rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </section>
  );
}