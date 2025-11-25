'use client';
import { useAuth } from '@/components/AuthProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Package, DollarSign, Users, MessageCircle, Edit, TrendingUp, Clock, CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

// FIXED: Now matches backend field exactly
interface Project {
  id: number;
  title: string;
  funding_goal: number;
  current_funding: number;
  backers_count: number;
  days_remaining?: number | null;  // ← CHANGED FROM days_left → days_remaining
  status: string;
}

interface Message {
  id: number;
  from: string;
  content: string;
  time: string;
  unread: boolean;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, msgRes] = await Promise.all([
          api.get('/api/v1/projects/my'),
          api.get('/api/v1/messages'),
        ]);
        setProjects(projRes.data || []);
        setMessages(msgRes.data || []);
      } catch (err) {
        console.error('Failed to load dashboard data');
      }
    };
    if (user) fetchData();
  }, [user, router]);

  const totalRaised = projects.reduce((sum, p) => sum + p.current_funding, 0);
  const totalBackers = projects.reduce((sum, p) => sum + p.backers_count, 0);
  const jobsCreated = Math.floor(totalRaised / 200000);

  const stats = [
    { label: 'Projects Launched', value: projects.length, icon: Package },
    { label: 'Funds Raised', value: `RWF ${(totalRaised / 1000000).toFixed(1)}M`, icon: DollarSign },
    { label: 'Backers', value: totalBackers, icon: Users },
    { label: 'Jobs Created', value: jobsCreated, icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl font-bold text-bdr-blue mb-2">
            Welcome back, {user?.full_name || 'Entrepreneur'}!
          </h1>
          <p className="text-xl text-gray-600">Manage your projects and track impact.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-8 h-8 text-bdr-blue" />
                <span className="text-2xl font-bold text-bdr-green">{stat.value}</span>
              </div>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Your Projects</h2>
            <Link href="/projects/create" className="px-5 py-2 bg-bdr-blue text-white font-medium rounded-full hover:bg-bdr-blue/90 transition-all">
              + New Project
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {projects.length > 0 ? (
              projects.map((project, i) => {
                const progress = Math.round((project.current_funding / project.funding_goal) * 100);

                // FINAL FIX: Use real days_remaining from backend
                const daysLeft = project.days_remaining !== null && project.days_remaining !== undefined
                  ? project.days_remaining
                  : (project.status === 'active' ? 90 : 90); // fallback only for old data

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                      <Link href={`/projects/edit/${project.id}`} className="p-2 text-bdr-blue hover:bg-bdr-blue/10 rounded-lg transition-colors">
                        <Edit className="w-5 h-5" />
                      </Link>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">RWF {(project.current_funding / 1000000).toFixed(1)}M raised</span>
                        <span className="text-gray-600">of RWF {(project.funding_goal / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-bdr-blue to-bdr-green"
                        />
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-bdr-green font-bold">{progress}%</span>
                        <span className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {daysLeft} days left
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-700">
                        <Users className="w-4 h-4 mr-1" />
                        {project.backers_count} backers
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        ['active', 'funded'].includes(project.status)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {['active', 'funded'].includes(project.status) ? 'Live' : 'Draft'}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-xl text-gray-500">No projects yet. Start your first one!</p>
              </div>
            )}
          </div>
        </div>

        {/* Messages & Logout — 100% UNCHANGED */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Messages</h2>
          <div className="bg-white rounded-3xl shadow-xl p-6">
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start space-x-3 p-4 rounded-2xl ${msg.unread ? 'bg-bdr-blue/5' : 'bg-gray-50'}`}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-bdr-blue rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {msg.from.charAt(0)}
                      </div>
                      {msg.unread && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900">{msg.from}</p>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-gray-700">{msg.content}</p>
                    </div>
                    <Link
                      href={`/messages/${msg.id}`}
                      className="flex items-center gap-2 px-5 py-2 bg-bdr-blue text-white text-sm font-semibold rounded-full hover:bg-bdr-blue/90 transition-all hover:shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Reply
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No messages from backers or mentors yet.</p>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={logout}
            className="inline-flex items-center px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <CheckCircle className="mr-2 w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}