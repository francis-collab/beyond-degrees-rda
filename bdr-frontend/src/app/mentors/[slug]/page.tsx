'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import {
  Star,
  Mail,
  Video,
  Award,
  Globe,
  Users,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { mentors, Mentor } from '@/lib/mentors';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

// Define a type with all optional extra fields
type MentorOptional = Mentor & {
  quote?: string;
  years_experience?: number;
  startups_mentored?: number;
  countries?: number;
  hours_mentored?: number;
};

export default function MentorDetailPage() {
  const { slug } = useParams();
  const currentSlug = slug as string;

  // Cast mentor to MentorOptional
  const mentor = mentors.find((m) => m.slug === currentSlug) as MentorOptional;

  useEffect(() => {
    if (currentSlug && !mentor) {
      notFound();
    }
  }, [currentSlug, mentor]);

  if (!mentor) return null;

  const handleBookSession = () => {
    const subject = `Mentorship Booking Request - ${mentor.name}`;
    const body = `Dear ${mentor.name.split(' ')[0]},\n\nI’d like to book a 1-hour mentorship session.\n\nRate: RWF ${mentor.hourly_rate.toLocaleString()}/hr\n\nPlease share 3 available time slots this week or next.\n\nLooking forward to learning from you!\n\nBest regards,\n[Your Name]\n[Your Phone]\n[Your Startup]`;

    window.location.href = `mailto:${mentor.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <section className="relative min-h-screen bg-gradient-to-br from-[#00A651]/10 via-white to-[#00A1D6]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-3 gap-12 items-start">

            {/* LEFT CARD */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-[#00A651] to-[#00A1D6] p-8 text-white text-center">
                  <div className="relative mx-auto w-40 h-40 mb-6">
                    <Image
                      src={mentor.image}
                      alt={mentor.name}
                      width={160}
                      height={160}
                      className="rounded-full object-cover border-8 border-white shadow-xl"
                      priority
                    />
                    {mentor.available && (
                      <div className="absolute bottom-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                        Available
                      </div>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold">{mentor.name}</h1>
                  <p className="text-xl opacity-90">{mentor.title}</p>
                  <p className="opacity-80">{mentor.company}</p>
                  <div className="flex justify-center gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="ml-2 text-lg font-bold">{mentor.rating}</span>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#00A1D6]">
                      RWF {mentor.hourly_rate.toLocaleString()}/hr
                    </p>
                    <p className="text-gray-600">1-hour session</p>
                  </div>

                  <button
                    onClick={handleBookSession}
                    className="w-full py-5 px-8 bg-gradient-to-r from-[#00A1D6] to-[#00A651] text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <Mail className="w-6 h-6" />
                    Book Session Now
                  </button>

                  <div className="flex justify-around text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Replies in 24h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-[#00A1D6]" />
                      <span>Zoom Call</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="font-bold text-lg mb-3">Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map((exp) => (
                        <span
                          key={exp}
                          className="px-4 py-2 bg-[#00A651]/10 text-[#00A651] rounded-full text-sm font-medium"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-12"
            >
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  About {mentor.name.split(' ')[0]}
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed">{mentor.bio}</p>
                {mentor.quote && (
                  <blockquote className="mt-8 pl-6 border-l-4 border-[#00A651] text-2xl font-medium text-[#00A651] italic">
                    “{mentor.quote}”
                  </blockquote>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {
                    icon: Award,
                    value: mentor.years_experience || '15+',
                    label: 'Years Experience',
                  },
                  {
                    icon: Users,
                    value: mentor.startups_mentored || '47+',
                    label: 'Startups Mentored',
                  },
                  {
                    icon: Globe,
                    value: mentor.countries || '12+',
                    label: 'Countries',
                  },
                  {
                    icon: Clock,
                    value: mentor.hours_mentored || '1,200+',
                    label: 'Hours Mentored',
                  },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-lg">
                    <stat.icon className="w-12 h-12 text-[#00A651] mx-auto mb-3" />
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  What Founders Say
                </h2>
                <div className="bg-gray-50 rounded-3xl p-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="font-bold text-lg">Startup Founder</p>
                      <p className="text-gray-600">Kigali, Rwanda</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-6 h-6 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xl italic text-gray-700">
                    "{mentor.name.split(' ')[0]} gave me clarity I couldn’t find anywhere else. Worth 10× the price."
                  </p>
                  <p className="text-sm text-gray-500 mt-6">
                    {format(new Date(), 'MMMM d, yyyy')}
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
