// src/components/ProjectCard.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, ChevronRight, Briefcase } from 'lucide-react';
import { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const progress = project.funding_goal > 0
    ? (project.current_funding / project.funding_goal) * 100
    : 0;

  const statusConfig = {
    active: { label: 'LIVE NOW', color: 'bg-green-500' },
    goal_reached: { label: 'GOAL REACHED', color: 'bg-[#FCD116]' },
    completed: { label: 'COMPLETED', color: 'bg-[#00A651]' },
    failed: { label: 'CAMPAIGN ENDED', color: 'bg-red-500' },
  };

  const currentStatus = statusConfig[project.status as keyof typeof statusConfig] || {
    label: 'LIVE',
    color: 'bg-green-500'
  };

  const imageUrl = project.image_url && project.image_url !== '/placeholder-project.jpg'
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${project.image_url}`
    : '/placeholder-project.jpg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={imageUrl}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          unoptimized={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute top-4 right-4">
          <div className={`px-4 py-2 rounded-full text-sm font-bold text-white ${currentStatus.color} shadow-xl`}>
            {currentStatus.label}
          </div>
        </div>

        {project.is_momo_ready && (
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-4 left-4 bg-[#00A1D6] text-white px-4 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>MoMo Ready</span>
          </motion.div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-[#00A1D6] transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-600 line-clamp-2 text-sm">{project.description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-gray-900">
              RWF {project.current_funding.toLocaleString()}
            </span>
            <span className="text-gray-500">
              Goal: RWF {project.funding_goal.toLocaleString()}
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#00A1D6] to-[#00A651] rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </motion.div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{progress.toFixed(0)}% raised</span>
            <span>{project.backers_count || 0} supporters</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Briefcase className="w-5 h-5" />
              <span className="font-bold text-gray-800">
                {(project as any).jobs_to_create ?? Math.floor(project.funding_goal / 10000)} jobs
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>90 days</span>
            </div>
          </div>
        </div>

        <Link href={`/projects/${project.slug}`} className="block w-full mt-6">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 bg-gradient-to-r from-[#00A1D6] to-[#00A651] text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-yellow-500/40 transition-all flex items-center justify-center space-x-3"
          >
            <span>Support This Vision</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </Link>
      </div>

      <div className="absolute -inset-1 bg-gradient-to-r from-[#00A1D6] to-[#00A651] blur-xl opacity-0 group-hover:opacity-40 transition-opacity -z-10" />
    </motion.div>
  );
}
