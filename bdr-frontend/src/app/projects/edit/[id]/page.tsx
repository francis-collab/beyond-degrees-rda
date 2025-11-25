'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { ArrowLeft, Save, Trash2, Upload, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth(); // ← Only user, no loading

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    funding_goal: '',
    sector: 'Technology & Innovation',
    business_plan: null as File | null,
    current_pdf: '',
  });

  // PROTECT THE PAGE — Redirect if not logged in
  useEffect(() => {
    if (user === null) {
      router.push('/auth/register');
    }
  }, [user, router]);

  // Wait until user is loaded before rendering anything
  if (user === undefined || user === null) return null;

  // Fetch project
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/api/v1/projects/${id}`);
        setFormData({
          title: res.data.title || '',
          description: res.data.description || '',
          funding_goal: res.data.funding_goal?.toString() || '',
          sector: res.data.sector || 'Technology & Innovation',
          business_plan: null,
          current_pdf: res.data.business_plan_pdf
            ? res.data.business_plan_pdf.split('/').pop() || 'business_plan.pdf'
            : '',
        });
      } catch (err: any) {
        alert('Project not found or access denied');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({ ...prev, business_plan: e.target.files![0] }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('funding_goal', formData.funding_goal);
    data.append('sector', formData.sector);
    if (formData.business_plan) data.append('business_plan', formData.business_plan);

    try {
      await api.put(`/api/v1/projects/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Project updated successfully!');
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete(`/api/v1/projects/${id}`);
      alert('Project deleted');
      router.push('/dashboard');
    } catch (err) {
      alert('Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00A1D6] to-[#004C99] flex items-center justify-center">
        <p className="text-white text-2xl">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00A1D6] via-[#0077B6] to-[#004C99] py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <div className="flex items-center mb-8">
            <Link href="/dashboard" className="mr-4">
              <ArrowLeft className="w-8 h-8 text-bdr-blue" />
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Edit Project</h1>
          </div>

          <div className="space-y-8">
            {/* Title */}
            <div>
              <label className="block text-lg font-semibold mb-3">Project Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-bdr-blue focus:outline-none text-lg"
                placeholder="Project Title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-semibold mb-3">Project Description</label>
              <textarea
                rows={6}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-bdr-blue focus:outline-none text-lg resize-none"
                placeholder="Short description of your project"
              />
            </div>

            {/* Funding Goal */}
            <div>
              <label className="block text-lg font-semibold mb-3">Funding Goal (RWF)</label>
              <input
                type="number"
                value={formData.funding_goal}
                onChange={e => setFormData({ ...formData, funding_goal: e.target.value })}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-bdr-blue focus:outline-none text-lg"
                placeholder="5000000"
              />
            </div>

            {/* Sector */}
            <div>
              <label className="block text-lg font-semibold mb-3">Sector</label>
              <select
                value={formData.sector}
                onChange={e => setFormData({ ...formData, sector: e.target.value })}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-bdr-blue focus:outline-none text-lg"
              >
                <option value="Technology & Innovation">Technology & Innovation</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Renewable Energy">Renewable Energy</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Tourism & Hospitality">Tourism & Hospitality</option>
              </select>
            </div>

            {/* Replace Business Plan */}
            <div>
              <label className="block text-lg font-semibold mb-3">
                <FileText className="inline w-6 h-6 mr-2" />
                Business Plan (Current: {formData.current_pdf || 'None'})
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-bdr-blue transition-all cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="replace-pdf"
                />
                <label htmlFor="replace-pdf" className="cursor-pointer">
                  {formData.business_plan ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                      <p className="text-xl font-semibold text-green-600">{formData.business_plan.name}</p>
                      <p className="text-sm text-gray-500 mt-2">Click to change again</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-xl text-gray-600">Click to replace PDF</p>
                      <p className="text-sm text-gray-500 mt-2">Leave empty to keep current</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-5 bg-gradient-to-r from-bdr-blue to-bdr-green text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                <Save className="w-6 h-6" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-10 py-5 bg-red-600 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-70"
              >
                <Trash2 className="w-6 h-6" />
                {deleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
