// src/app/success/page.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Users, TrendingUp, Heart, ChevronRight } from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

export default function SuccessPage() {
  const { user } = useAuth();

  const { data = {} } = useSWR('/api/v1/pages/success', fetcher, {
    fallbackData: {
      hero: {
        title: "Rwanda’s Youth Are Winning",
        subtitle: "Real startups. Real funding. Real jobs. Every RWF 200,000 creates <strong>1 job</strong>."
      },
      stats: [
        { icon: TrendingUp, value: 'RWF 405M+', label: 'Total Funding Raised' },
        { icon: Users, value: '45+', label: 'Jobs Created' },
        { icon: Heart, value: '127', label: 'Backers' }
      ],
      stories: [
        {
          id: 1,
          name: 'Jean Paul',
          startup: 'GreenTech Rwanda',
          funding: 'RWF 120M',
          jobs: 12,
          image: '/success/jean.jpg',
          quote: 'BDR helped me raise RWF 120M in 3 weeks. Now 12 youth have stable jobs.',
          date: '2025-02-15'
        },
        {
          id: 2,
          name: 'Marie Claire',
          startup: 'EcoBags Ltd',
          funding: 'RWF 85M',
          jobs: 8,
          image: '/success/marie.jpg',
          quote: 'From idea to 8 employees in 6 months. BDR made it possible.',
          date: '2025-01-20'
        },
        {
          id: 3,
          name: 'Emmanuel',
          startup: 'SolarKits',
          funding: 'RWF 200M',
          jobs: 25,
          image: '/success/emmanuel.jpg',
          quote: 'We now power 500 homes and employ 25 youth. BDR changed everything.',
          date: '2024-12-10'
        }
      ]
    }
  });

  const { hero, stats, stories } = data;

  return (
    <>
      {/* Hero — untouched */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00A651] via-[#FCD116] to-[#00A1D6] overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {hero?.title || "Rwanda’s Youth Are Winning"}
            </h1>
            <p
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
              dangerouslySetInnerHTML={{
                __html: hero?.subtitle || "Real startups. Real funding. Real jobs. Every RWF 200,000 creates <strong>1 job</strong>."
              }}
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center px-8 py-4 bg-white text-[#00A1D6] font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Back a Project <ChevronRight className="ml-2 w-6 h-6" />
              </Link>
              {user ? (
                <Link
                  href="/projects/create"
                  className="inline-flex items-center px-8 py-4 bg-transparent border-4 border-white text-white font-bold text-lg rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  Launch Your Idea
                </Link>
              ) : (
                <Link
                  href="/auth/register?role=entrepreneur"
                  className="inline-flex items-center px-8 py-4 bg-transparent border-4 border-white text-white font-bold text-lg rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  Launch Your Idea
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats — untouched */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(stats || []).map((stat: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-16 h-16 text-[#00A651] mx-auto mb-4" />
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-lg text-gray-600 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories — NOW USING YOUR REAL IMAGE francis.png */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Real Stories. Real Impact.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These Rwandan youth turned ideas into job-creating businesses — with your help.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(stories || []).map((story: any, i: number) => (
              <motion.article
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative h-48 bg-gray-200">
                  {/* ← ONLY THIS LINE CHANGED */}
                  <Image
                    src="/francis.png"
                    alt={story.name}
                    fill
                    className="object-cover"
                    priority={i === 0}
                    onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
                  />
                  <div className="absolute top-4 right-4 bg-[#00A651] text-white px-3 py-1 rounded-full text-sm font-bold">
                    {story.jobs} Jobs
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{story.name}</h3>
                  <p className="text-lg text-[#00A1D6] font-medium mb-3">{story.startup}</p>
                  <p className="text-3xl font-bold text-[#00A651] mb-4">{story.funding}</p>
                  <blockquote className="text-gray-700 italic mb-4">"{story.quote}"</blockquote>
                  <p className="text-sm text-gray-500">
                    {new Date(story.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — untouched & already protected */}
      <section className="py-20 bg-gradient-to-r from-[#00A1D6] to-[#00A651]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Be Part of the Next Success Story
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Your RWF 200,000 can create 1 job. Back a project or launch your own.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center px-8 py-4 bg-white text-[#00A1D6] font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Heart className="mr-2 w-6 h-6" /> Back a Project
              </Link>
              {user ? (
                <Link
                  href="/projects/create"
                  className="inline-flex items-center px-8 py-4 bg-transparent border-4 border-white text-white font-bold text-lg rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  Launch My Startup <ChevronRight className="ml-2 w-6 h-6" />
                </Link>
              ) : (
                <Link
                  href="/auth/register?role=entrepreneur"
                  className="inline-flex items-center px-8 py-4 bg-transparent border-4 border-white text-white font-bold text-lg rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  Launch My Startup <ChevronRight className="ml-2 w-6 h-6" />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}