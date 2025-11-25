// src/app/projects/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { Search, Filter, Grid, List, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { Project } from '@/lib/types';
import { useAuth } from '@/components/AuthProvider'; // ← ONLY THIS LINE ADDED

export default function ProjectsPage() {
  const { user } = useAuth(); // ← Now we know if user is logged in

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const queryClient = useQueryClient();

  // FIXED: remove cacheTime to satisfy TypeScript
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => api.get('/api/v1/projects/').then(res => res.data),
    staleTime: 0,
    // cacheTime: 0, ← removed
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  }, [queryClient]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'live', label: 'Live & Fundraising' },
    { value: 'funded', label: 'Fully Funded' },
    { value: 'failed', label: 'Funding Failed' },
    { value: 'draft', label: 'In Draft' },
  ];

  return (
    <>
      {/* Hero Section — "Start Your Project" NOW PROTECTED */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-[#00A651] via-[#00A1D6] to-[#FCD116] overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Discover Rwanda's <span className="text-[#FCD116]">Next</span> Big Ideas
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8"
          >
            From eco-friendly bags to solar tech — every project creates jobs for Rwandan youth.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            {user ? (
              <Link
                href="/projects/create"
                className="inline-flex items-center px-8 py-4 text-lg font-bold text-[#00A651] bg-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                aria-label="Start your project"
              >
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/auth/register?role=entrepreneur"
                className="inline-flex items-center px-8 py-4 text-lg font-bold text-[#00A651] bg-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                aria-label="Register to start your project"
              >
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Filters & Search — 100% untouched */}
      <section className="py-8 bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00A1D6] focus:border-transparent transition-all"
                aria-label="Search projects by title or description"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow-md' : ''}`}
                  aria-label="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow-md' : ''}`}
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00A1D6] transition-all cursor-pointer"
                aria-label="Filter by project status"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid — 100% untouched */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 text-[#00A1D6] animate-spin" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? `Try adjusting your search or filters.` : `Be the first to launch a project!`}
              </p>
              {user ? (
                <Link
                  href="/projects/create"
                  className="inline-flex items-center px-6 py-3 bg-[#00A1D6] text-white font-bold rounded-full hover:bg-[#00A1D6]/90 transition-all"
                >
                  Start a Project
                </Link>
              ) : (
                <Link
                  href="/auth/register?role=entrepreneur"
                  className="inline-flex items-center px-6 py-3 bg-[#00A1D6] text-white font-bold rounded-full hover:bg-[#00A1D6]/90 transition-all"
                >
                  Start a Project
                </Link>
              )}
            </motion.div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={`${project.id}-${project.image_url}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/projects/${project.slug}`}>
                    <ProjectCard project={project} index={index} />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Footer — "Launch Your Startup" NOW PROTECTED */}
      <section className="py-20 bg-[#FCD116]/10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Your Idea Could Be Next
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-700 mb-8"
          >
            70% of Rwanda is under 35. Let's turn their energy into employment.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {user ? (
              <Link
                href="/projects/create"
                className="inline-flex items-center px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-[#00A1D6] to-[#00A651] rounded-full shadow-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                aria-label="Launch your startup"
              >
                Launch Your Startup
                <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
            ) : (
              <Link
                href="/auth/register?role=entrepreneur"
                className="inline-flex items-center px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-[#00A1D6] to-[#00A651] rounded-full shadow-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                aria-label="Register to launch your startup"
              >
                Launch Your Startup
                <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
