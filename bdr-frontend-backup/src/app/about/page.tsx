// src/app/about/page.tsx
'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users, Target, TrendingUp, Heart, Lightbulb,
  Globe, ChevronRight
} from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

export default function AboutPage() {
  const { user } = useAuth();

  const { data = {} } = useSWR('/api/v1/pages/about', fetcher, {
    fallbackData: {
      hero: {
        title: "Beyond <span class='text-[#00A1D6]'>Degrees</span>",
        subtitle: "We don’t wait for degrees. We create jobs — for Rwanda’s 70% youth population.",
        stats: [
          { icon: Users, value: '70%', label: 'Rwanda Under 35' },
          { icon: Target, value: '2035', label: 'Vision: Job Creators' }
        ]
      },
      mission: {
        pillars: [
          { icon: Lightbulb, title: 'Idea First', desc: 'No degree required. Just a vision to create jobs.', color: '#FCD116' },
          { icon: Heart, title: 'Community Backed', desc: 'Local + diaspora fund via MoMo, card, or bank.', color: '#00A1D6' },
          { icon: TrendingUp, title: 'Job Focused', desc: 'Every RWF 10,000 = 1 job for Rwandan youth.', color: '#00A651' }
        ]
      },
      stats: [
        { icon: Users, value: '156+', label: 'Jobs Created' },
        { icon: Target, value: '42+', label: 'Projects Funded' },
        { icon: Globe, value: '89+', label: 'Youth Mentored' },
        { icon: Heart, value: 'RWF 1.2B+', label: 'Raised' }
      ],
      partners: [
        { name: "African Leadership University", logo: "ALU", color: "#00A1D6", desc: "Our academic partner. Provides mentorship and innovation labs." },
        { name: "MTN MoMo", logo: "MTN", color: "#FCD116", desc: "Instant payments. 90% of backers use MoMo." },
        { name: "Rwandan Diaspora", logo: Globe, color: "#00A651", desc: "40% of funding comes from Rwandans abroad." }
      ],
      cta: {
        title: "Rwanda’s Future Starts Now",
        subtitle: "Join 10,000+ Rwandans building a job-rich future."
      }
    }
  });

  const { hero, mission, stats, partners, cta } = data;

  return (
    <>
      {/* Hero Section — ONLY IMAGE CHANGED */}
      <section className="relative min-h-screen flex items-center justify-center gradient-yellow overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                  dangerouslySetInnerHTML={{ __html: hero?.title || "Beyond <span class='text-[#00A1D6]'>Degrees</span>" }}
                />
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl text-white/90 max-w-2xl"
                >
                  {hero?.subtitle}
                </motion.p>
              </div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-2 gap-6">
                {(hero?.stats || []).map((stat: any, i: number) => (
                  <div key={i} className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center">
                    <stat.icon className="w-10 h-10 text-[#00A1D6] mx-auto mb-2" />
                    <p className="text-4xl font-bold text-white">{stat.value}</p>
                    <p className="text-white/90">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                <Link href="/projects" className="inline-flex items-center px-8 py-4 text-lg font-bold text-[#FCD116] bg-[#00A1D6] rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  See the Impact <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* ONLY THIS IMAGE CHANGED */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="/aboutimage.jpg" 
                  alt="Rwandan youth entrepreneurs building startups and creating jobs" 
                  width={800} 
                  height={600} 
                  className="w-full h-auto object-cover" 
                  priority 
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#00A651] text-white px-6 py-3 rounded-full shadow-xl font-bold text-lg">
                Made in Rwanda
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Everything below is 100% untouched — Mission, Stats, Partners, CTA — all perfect */}
      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-[#00A1D6]">Mission</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Turn Rwanda’s youth from job seekers into job creators — one startup at a time.
            </motion.p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(mission?.pillars || []).map((item: any) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity`} style={{ backgroundColor: item.color }} />
                <div className="relative z-10">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl text-white`} style={{ backgroundColor: item.color }}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">{item.title}</h3>
                  <p className="text-gray-600 text-center">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {(stats || []).map((stat: any) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#00A1D6] to-[#00A651] rounded-full flex items-center justify-center shadow-xl">
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-lg text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
            Powered by <span className="text-[#00A1D6]">Visionaries</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            {(partners || []).map((partner: any, i: number) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`bg-gradient-to-br from-${partner.color}/10 to-${i === 1 ? '[#00A1D6]' : i === 2 ? '[#FCD116]' : '[#00A651]'}/10 rounded-3xl p-8`}
              >
                <div className={`w-24 h-24 mx-auto mb-6 ${typeof partner.logo === 'string' ? partner.color : '#00A651'} rounded-2xl flex items-center justify-center`}>
                  {typeof partner.logo === 'string' ? (
                    <span className="text-3xl font-bold text-white">{partner.logo}</span>
                  ) : (
                    <partner.logo className="w-12 h-12 text-white" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{partner.name}</h3>
                <p className="text-gray-600">{partner.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Already protected & perfect */}
      <section className="py-20 gradient-green">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.h2 initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold text-white mb-6">
            {cta?.title || "Rwanda’s Future Starts Now"}
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-xl text-white/90 mb-8">
            {cta?.subtitle || "Join 10,000+ Rwandans building a job-rich future."}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="inline-flex items-center px-8 py-4 text-lg font-bold text-[#00A651] bg-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Back a Project <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            {user ? (
              <Link
                href="/projects/create"
                className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-[#00A1D6] rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Launch Your Idea
              </Link>
            ) : (
              <Link
                href="/auth/register?role=entrepreneur"
                className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-[#00A1D6] rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Launch Your Idea
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}