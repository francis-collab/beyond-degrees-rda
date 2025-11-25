'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import {
  Mail, Phone, MapPin, Send, CheckCircle,
  Loader2, AlertCircle
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await api.post('/api/v1/contact', formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center gradient-green overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Let’s Talk Rwanda
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
          >
            Have a question? Want to partner? We’re all ears.
          </motion.p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="bg-gray-50 rounded-3xl p-8 shadow-xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>

                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center space-x-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <p className="text-green-800 font-medium">Message sent! We’ll reply within 24 hours.</p>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3"
                  >
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <p className="text-red-800">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        autoComplete="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A1D6] transition-all"
                        placeholder="Jean K."
                        aria-label="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A1D6] transition-all"
                        placeholder="jean@bdr.rw"
                        aria-label="Your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A1D6] transition-all"
                      placeholder="+250 788 123 456"
                      aria-label="Your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A1D6] transition-all"
                      placeholder="Partnership, Feedback, etc."
                      aria-label="Subject of your message"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A1D6] transition-all resize-none"
                      placeholder="Tell us how we can help..."
                      aria-label="Your message"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-gradient-to-r from-[#00A1D6] to-[#00A651] text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                    aria-label="Send your message"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
                <div className="space-y-6">
                  {[
                    {
                      icon: MapPin,
                      title: 'Office',
                      content: (
                        <>
                          KG 7 Ave, Kacyiru<br />
                          Kigali, Rwanda
                        </>
                      ),
                      key: 'office'
                    },
                    {
                      icon: Phone,
                      title: 'Call Us',
                      content: (
                        <a href="tel:+250788123456" className="text-[#00A651] hover:underline">
                          +250 787 789 315
                        </a>
                      ),
                      key: 'phone'
                    },
                    {
                      icon: Mail,
                      title: 'Email',
                      content: (
                        <a href="mailto:francisschooten@gmail.com" className="text-[#FCD116] hover:underline">
                          francisschoten@gmail.com
                        </a>
                      ),
                      key: 'email'
                    },
                  ].map((item) => (
                    <div key={item.key} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#00A1D6]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-[#00A1D6]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#00A1D6]/5 to-[#00A651]/5 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Office Hours</h3>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-medium">Mon–Fri:</span> 8:00 AM – 5:00 PM</p>
                  <p><span className="font-medium">Sat:</span> 9:00 AM – 1:00 PM</p>
                  <p><span className="font-medium">Sun:</span> Closed</p>
                </div>
              </div>

              <div className="bg-[#00A1D6]/10 rounded-3xl p-8 text-center">
                <h3 className="text-xl font-bold text-[#00A1D6] mb-3">
                  Partner with Us
                </h3>
                <p className="text-gray-700 mb-4">
                  Corporates, NGOs, and government — let’s create 10,000 jobs together.
                </p>
                <a
                  href="mailto:partners@bdr.rw"
                  className="inline-flex items-center px-6 py-3 bg-[#00A1D6] text-white font-bold rounded-full hover:bg-[#00A1D6]/90 transition-all"
                  rel="noopener"
                >
                  Explore Partnerships
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}