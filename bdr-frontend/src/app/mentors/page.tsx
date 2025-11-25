// src/app/mentors/[slug]/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star, Clock, Users, Calendar, ChevronRight,
  Filter, Search, Award, Globe
} from 'lucide-react';
import { mentors } from '@/lib/mentors';

export default function MentorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('all');

  const expertiseOptions = Array.from(
    new Set(['all', ...mentors.flatMap(m => m.expertise)])
  );

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesExpertise = selectedExpertise === 'all' || mentor.expertise.includes(selectedExpertise);
    return matchesSearch && matchesExpertise;
  });

  const scrollToMentors = () => {
    document.getElementById('mentors')?.scrollIntoView({ behavior: 'smooth' });
  };

  const featuredMentor = mentors.find(m => m.slug === 'grace-mukamana') || mentors[0];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-[#00A651] via-[#00A1D6] to-[#FCD116] overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
              <div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  Learn from <span className="text-[#FCD116]">Rwanda’s</span> Best
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-xl md:text-2xl text-white/90 max-w-2xl">
                  1-on-1 mentoring from top CEOs, founders, and diaspora leaders.<br />
                  Book via MoMo in 60 seconds.
                </motion.p>
              </div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-3 gap-6">
                {[
                  { icon: Award, value: '10+', label: 'Top Mentors' },
                  { icon: Star, value: '4.9', label: 'Avg Rating' },
                  { icon: Clock, value: '400+', label: 'Sessions' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center">
                    <stat.icon className="w-8 h-8 text-[#FCD116] mx-auto mb-2" />
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-white/90 text-sm">{stat.label}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                <button onClick={scrollToMentors} className="inline-flex items-center px-8 py-4 text-lg font-bold text-[#00A651] bg-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Find Your Mentor
                  <ChevronRight className="ml-2 w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>

            {/* Featured Mentor */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src={featuredMentor.image}
                        alt={featuredMentor.name}
                        width={96}
                        height={96}
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-[#FCD116] text-[#00A1D6] px-3 py-1 rounded-full text-xs font-bold">
                      TOP MENTOR
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{featuredMentor.name}</h3>
                    <p className="text-white/90">{featuredMentor.title} at {featuredMentor.company}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FCD116] text-[#FCD116]" />
                      ))}
                      <span className="text-white/80 text-sm ml-1">5.0</span>
                    </div>
                  </div>
                </div>
                {/* Safe optional chaining for quote */}
                <p className="text-white/90 mb-6">
                  {featuredMentor.quote ?? 'This mentor has helped dozens of founders raise millions. Book a session today.'}
                </p>
                <Link
                  href={`/mentors/${featuredMentor.slug}`}
                  className="inline-flex items-center px-6 py-3 bg-[#FCD116] text-[#00A1D6] font-bold rounded-full hover:bg-[#FCD116]/90 transition-all"
                >
                  Book Now — RWF {featuredMentor.hourly_rate.toLocaleString()}/hr
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search mentors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00A651] transition-all cursor-pointer"
              >
                {expertiseOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All Expertise' : option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Mentors Grid */}
      <section id="mentors" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredMentors.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Globe className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No mentors found</h3>
              <p className="text-gray-600">Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMentors.map((mentor, index) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
                >
                  {mentor.available && (
                    <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span>Available Now</span>
                    </div>
                  )}

                  <div className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <Image
                            src={mentor.image}
                            alt={mentor.name}
                            width={80}
                            height={80}
                            className="object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-[#00A1D6] text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">
                          {mentor.rating}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#00A651] transition-colors">
                          {mentor.name}
                        </h3>
                        <p className="text-gray-600">{mentor.title}</p>
                        <p className="text-sm text-gray-500">{mentor.company}</p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">{mentor.bio}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentor.expertise.slice(0, 3).map((exp, i) => (
                        <span key={i} className="px-3 py-1 bg-[#00A1D6]/10 text-[#00A1D6] text-xs font-medium rounded-full">
                          {exp}
                        </span>
                      ))}
                      {mentor.expertise.length > 3 && (
                        <span className="text-xs text-gray-500">+{mentor.expertise.length - 3} more</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{mentor.sessions_completed} sessions</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-[#FCD116] text-[#FCD116]" />
                        <span>{mentor.rating}</span>
                      </div>
                    </div>

                    {/* Safe optional chaining for quote */}
                    <p className="italic text-gray-600 mb-4">
                      {mentor.quote ?? ''}
                    </p>

                    <Link href={`/mentors/${mentor.slug}`} className="block w-full">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 px-6 bg-gradient-to-r from-[#00A1D6] to-[#00A651] text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <span>Book Session — RWF {mentor.hourly_rate.toLocaleString()}/hr</span>
                        <Calendar className="w-5 h-5" />
                      </motion.button>
                    </Link>
                  </div>

                  <div className="absolute -inset-1 bg-gradient-to-r from-[#00A1D6] to-[#00A651] blur-xl opacity-0 group-hover:opacity-30 transition-opacity -z-10" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-[#FCD116]/10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.h2 initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Startup Needs a Mentor
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-xl text-gray-700 mb-8">
            93% of successful startups had a mentor. Don’t build alone.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <button onClick={scrollToMentors} className="inline-flex items-center px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-[#00A1D6] to-[#00A651] rounded-full shadow-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Find Your Mentor Now
              <ChevronRight className="ml-3 w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
