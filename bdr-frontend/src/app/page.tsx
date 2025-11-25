'use client';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb, Heart, Rocket } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider'; // ← ONLY THIS LINE ADDED

const steps = [
  {
    icon: Lightbulb,
    title: '1. Share Your Vision',
    desc: 'Upload your startup idea. Tell us how it creates jobs for Rwandan youth.',
    color: 'blue',
    delay: 0.2,
  },
  {
    icon: Heart,
    title: '2. Get Backed',
    desc: 'Local and diaspora backers fund you via MoMo, card, or bank. 5% platform fee.',
    color: 'yellow',
    delay: 0.4,
  },
  {
    icon: Rocket,
    title: '3. Launch & Employ',
    desc: 'Hit your goal → launch → hire youth. We mentor you all the way.',
    color: 'green',
    delay: 0.6,
  },
];

const colorMap = {
  blue: 'bg-bdr-blue',
  yellow: 'bg-bdr-yellow',
  green: 'bg-bdr-green',
};

export default function Home() {
  const { user } = useAuth(); // ← Now we know if user is logged in

  return (
    <>
      <Hero />
      <Stats />

      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How <span className="text-bdr-green">Beyond-Degrees</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From idea to impact in 3 simple steps. No degree required — just vision.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: step.delay, duration: 0.6 }}
                className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3"
              >
                <div
                  className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity ${colorMap[step.color]}`}
                />
                <div className="relative z-10">
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg ${colorMap[step.color]} text-white`}
                  >
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">{step.desc}</p>
                </div>
                <div className="mt-6 flex justify-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-400">
                    {i + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* START YOUR JOURNEY BUTTON — NOW 100% PROTECTED */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16"
          >
            {user ? (
              <Link
                href="/projects/create"
                className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-gradient-hero rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/auth/register?role=entrepreneur"
                className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-gradient-hero rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Back a Project CTA — unchanged & perfect */}
      <section className="py-20 bg-gradient-cta">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Rwanda’s Future Starts With You
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-700 mb-8"
          >
            Every RWF 200,000 you give creates 1 job. Be the change.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/projects"
              className="inline-flex items-center px-10 py-5 text-xl font-bold text-bdr-yellow bg-bdr-blue rounded-full shadow-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Back a Project Now
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}