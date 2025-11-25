'use client';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Mailchimp / Resend
    console.log('Subscribed:', email);
    setEmail('');
    alert('Thank you! You’ll hear from us soon.'); // Replace with toast later
  };

  const socialLinks = [
    { Icon: Facebook, href: 'https://facebook.com/bdr.rw', label: 'Facebook' },
    { Icon: Twitter, href: 'https://twitter.com/bdr_rwa', label: 'Twitter' },
    { Icon: Linkedin, href: 'https://linkedin.com/company/bdr-rwanda', label: 'LinkedIn' },
    { Icon: Instagram, href: 'https://instagram.com/bdr.rw', label: 'Instagram' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00A1D6] via-[#FCD116] to-[#00A651] rounded-full" />
                <div className="absolute inset-1.5 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-[#00A1D6]">BDR</span>
                </div>
              </div>
              <div>
                <p className="text-xl font-bold">Beyond-Degrees</p>
                <p className="text-sm text-[#00A651]">-Rwanda</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              Turning Rwanda’s 70% youth population into job creators by 2035 — one startup at a time.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${label}`}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#00A1D6] transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FCD116]">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Browse Projects', href: '/projects' },
                { name: 'Find a Mentor', href: '/mentors' },
                { name: 'Success Stories', href: '/success' },
                { name: 'Start Your Project', href: '/projects/create' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FCD116]">Get in Touch</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <a href="mailto:francisschooten@gmail.com" className="hover:text-white">francisschooten@gmail.com</a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <a href="tel:+250788000000" className="hover:text-white">+250 787 789 315</a>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Kigali Innovation City, Rwanda</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FCD116]">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-3">
              Get stories of youth transforming Rwanda every week.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                aria-label="Email for newsletter"
                className="flex-1 px-4 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:border-[#00A1D6] transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-[#00A1D6] text-white rounded-lg hover:bg-[#0088b8] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500">
          <p>
            © {currentYear} Beyond-Degrees-Rwanda. Made with <span className="text-red-500">heart</span> in Kigali, Rwanda.
          </p>
          <p className="mt-1">
            <Link href="/privacy" className="hover:text-white mx-2">Privacy Policy</Link>
            <span className="text-gray-600">|</span>
            <Link href="/terms" className="hover:text-white mx-2">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}