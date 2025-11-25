'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock, Users, Loader2, XCircle, FileText, Rocket, Trophy
} from 'lucide-react';
import api from '@/lib/api';
import { Project as BaseProject } from '@/lib/types';
import PaymentModal from '@/components/PaymentModal';
import { useState } from 'react';

// Extend Project type locally to include missing properties
interface Project extends BaseProject {
  jobs_to_create?: number;
  days_remaining?: number | null;
}

const statusConfig: Record<string, any> = {
  draft: { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Draft', button: false },
  active: { icon: Rocket, color: 'text-green-600', bg: 'bg-green-100', label: 'Live & Fundraising', button: true },
  funded: { icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Goal Reached!', button: false },
  failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Failed', button: false },
};

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'stripe' | null>(null);

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['project', slug],
    queryFn: () => api.get(`/api/v1/projects/slug/${slug}`).then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-16 h-16 text-[#00A1D6] animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <XCircle className="w-32 h-32 text-red-500 mx-auto mb-8" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">This project may have been removed or the link is incorrect.</p>
          <Link href="/projects" className="inline-flex items-center px-8 py-4 bg-[#00A1D6] text-white font-bold text-lg rounded-full hover:bg-[#0088b8] transition">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const progress = Math.min(100, (project.current_funding / project.funding_goal) * 100);
  const jobsToCreate = project.jobs_to_create ?? Math.floor(project.funding_goal / 200000);
  const currentStatus = statusConfig[project.status] || statusConfig.draft;
  const daysLeft = project.days_remaining ?? null;

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[65vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={project.image_url || '/placeholder-project.jpg'}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-full ${currentStatus.bg}`}>
                <currentStatus.icon className={`w-8 h-8 ${currentStatus.color}`} />
              </div>
              <span className="text-2xl font-bold text-white">{currentStatus.label}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-8 text-white text-lg">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8" />
                <span className="font-bold">Creates {jobsToCreate} jobs</span>
              </div>
              {project.status === 'active' && daysLeft !== null && (
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8" />
                  <span className="font-bold">{daysLeft} days left</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-3xl shadow-2xl p-10">
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-gray-900">
                    RWF {Number(project.current_funding).toLocaleString()}
                  </div>
                  <div className="text-xl text-gray-500">
                    of RWF {Number(project.funding_goal).toLocaleString()} goal
                  </div>
                </div>
                <div className="h-8 bg-gray-200 rounded-full overflow-hidden mb-6">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-[#00A1D6] to-[#00A651]"
                  />
                </div>
                <div className="text-center text-3xl font-bold text-[#00A1D6] mb-10">
                  {progress.toFixed(0)}% funded
                </div>

                {/* PAYMENT BUTTONS */}
                {currentStatus.button && (
                  <div className="space-y-5">
                    <button
                      onClick={() => { setPaymentMethod('momo'); setShowPayment(true); }}
                      className="w-full py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-2xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4"
                    >
                      Fund with MoMo
                    </button>
                    <button
                      onClick={() => { setPaymentMethod('stripe'); setShowPayment(true); }}
                      className="w-full py-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-2xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4"
                    >
                      Fund with Stripe
                    </button>
                  </div>
                )}

                {/* BUSINESS PLAN PDF */}
                {project.business_plan_pdf && (
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${project.business_plan_pdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-10 p-8 bg-gradient-to-r from-[#00A1D6]/10 to-[#00A651]/10 rounded-3xl text-center hover:scale-105 transition-all shadow-lg cursor-pointer"
                  >
                    <FileText className="w-16 h-16 text-[#00A1D6] mx-auto mb-4" />
                    <p className="text-2xl font-bold text-gray-800">View Full Business Plan (PDF)</p>
                    <p className="text-sm text-gray-600 mt-2">Opens in new tab · Secure download</p>
                  </a>
                )}
              </div>
            </div>

            {/* About Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-5xl font-bold text-gray-900 mb-10">About This Project</h2>
                <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed space-y-6">
                  <p className="text-2xl font-medium text-gray-800">
                    {project.description}
                  </p>
                  {project.detailed_description ? (
                    <div className="mt-10 pt-10 border-t-2 border-gray-200 text-lg">
                      {project.detailed_description.split('\n\n').map((para, i) => (
                        <p key={i} className="mb-6">{para.trim()}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-lg italic text-gray-600 mt-6">
                      No additional details provided.
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal
        project={project}
        isOpen={showPayment}
        onClose={() => {
          setShowPayment(false);
          setPaymentMethod(null);
        }}
        defaultMethod={paymentMethod}
      />
    </>
  );
}
