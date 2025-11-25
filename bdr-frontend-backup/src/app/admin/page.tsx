// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import api from '@/lib/api';
import {
  Loader2, DollarSign, Briefcase, Users, TrendingUp,
  MessageCircle, AlertCircle, Trash2, Mail, Clock, Reply
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      router.push('/auth/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, projectsRes, messagesRes] = await Promise.all([
          api.get('/api/v1/admin/stats'),
          api.get('/api/v1/projects'),
          api.get('/api/v1/admin/messages')
        ]);
        setStats(statsRes.data);
        setProjects(projectsRes.data);
        setMessages(messagesRes.data);
      } catch (err: any) {
        console.error("Admin load failed:", err);
        alert("Check backend is running");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, router]);

  const markAsRead = async (id: number) => {
    await api.patch(`/api/v1/admin/messages/${id}/read`);
    setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
    setStats(prev => ({ ...prev, unread_messages: prev.unread_messages - 1 }));
  };

  const deleteProject = async (id: number) => {
    if (!confirm("Delete this project forever?")) return;
    try {
      await api.delete(`/api/v1/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
      alert("Project deleted.");
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-yellow-400 to-green-600 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-20 h-20 animate-spin text-white mx-auto mb-8" />
          <p className="text-4xl font-bold text-white">Loading Your Kingdom, Francis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-yellow-400 to-green-600">
      <div className="bg-black/40 backdrop-blur-xl min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 text-white">

          <div className="text-center mb-16">
            <h1 className="text-7xl font-bold mb-4 drop-shadow-2xl">Admin Dashboard</h1>
            <p className="text-4xl opacity-90">Beyond Degrees Rwanda</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            <div className="bg-blue-700/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border-4 border-white/40 text-center">
              <DollarSign className="w-16 h-16 mx-auto mb-4" />
              <p className="text-2xl mb-2">Total Raised</p>
              <p className="text-5xl font-bold">RWF {(stats?.total_donated_rwf || 0).toLocaleString()}</p>
            </div>
            <div className="bg-yellow-500/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border-4 border-white/40 text-black text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4" />
              <p className="text-2xl mb-2">Jobs Created</p>
              <p className="text-5xl font-bold">{stats?.total_jobs_created || 0}</p>
            </div>
            <div className="bg-green-700/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border-4 border-white/40 text-center">
              <Users className="w-16 h-16 mx-auto mb-4" />
              <p className="text-2xl mb-2">Total Users</p>
              <p className="text-5xl font-bold">{(stats?.total_backers || 0) + (stats?.total_entrepreneurs || 0)}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border-4 border-yellow-400 text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-4" />
              <p className="text-2xl mb-2">Live Projects</p>
              <p className="text-5xl font-bold">{projects.length}</p>
            </div>
          </div>

          {/* Messages Summary */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-blue-300" />
              <p className="text-2xl">Total Messages</p>
              <p className="text-6xl font-bold">{stats?.total_messages || 0}</p>
            </div>
            <div className="bg-red-600/80 backdrop-blur-xl rounded-3xl p-8 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4" />
              <p className="text-2xl">UNREAD</p>
              <p className="text-6xl font-bold">{stats?.unread_messages || 0}</p>
            </div>
          </div>

          {/* FULL INBOX */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border-4 border-yellow-400 mb-20">
            <h2 className="text-4xl font-bold mb-8 text-center flex items-center justify-center gap-4">
              <Mail className="w-12 h-12" />
              Messages from Youth
            </h2>
            <div className="space-y-6">
              {messages.length === 0 ? (
                <p className="text-center text-2xl opacity-80">No messages yet</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`bg-black/40 rounded-2xl p-6 border-l-8 ${msg.is_read ? 'border-green-500' : 'border-red-500'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-xl font-bold">{msg.name}</p>
                        <p className="text-lg opacity-90">{msg.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-70 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(msg.created_at).toLocaleString('en-GB')}
                        </p>
                        {!msg.is_read && (
                          <button
                            onClick={() => markAsRead(msg.id)}
                            className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-sm font-bold"
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-lg leading-relaxed bg-black/30 p-4 rounded-xl">{msg.message}</p>
                    <div className="mt-4">
                      <a
                        href={`mailto:${msg.email}?subject=Re: Your Message to Beyond Degrees Rwanda`}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-bold transition"
                      >
                        <Reply className="w-5 h-5" />
                        Reply via Email
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border-4 border-yellow-400">
            <h2 className="text-4xl font-bold mb-8 text-center">Live Projects — Delete If Needed</h2>
            <div className="space-y-6">
              {projects.length === 0 ? (
                <p className="text-center text-2xl opacity-80">No projects yet. Youth are coming!</p>
              ) : (
                projects.map((project: any) => (
                  <div key={project.id} className="bg-black/30 rounded-2xl p-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold">{project.title}</h3>
                      <p className="text-lg opacity-90">by {project.user?.name || 'Unknown'}</p>
                      <p className="text-sm opacity-70">Goal: RWF {project.goal_amount?.toLocaleString() || 0}</p>
                    </div>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="bg-red-600 hover:bg-red-700 p-4 rounded-full transition transform hover:scale-110"
                    >
                      <Trash2 className="w-8 h-8" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="text-center py-20 mt-20 bg-black/40 rounded-3xl">
            <h1 className="text-8xl font-bold text-yellow-400 drop-shadow-2xl">
              Murakoze Cyane, Francis
            </h1>
            <p className="text-5xl mt-8 opacity-90">
              {stats?.total_jobs_created || 0} Jobs Created. Rwanda is Rising.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}