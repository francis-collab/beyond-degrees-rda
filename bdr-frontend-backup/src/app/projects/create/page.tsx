'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';
import { Upload, FileText, ArrowLeft, CheckCircle, Image, Rocket } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function CreateProjectPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [launchNow, setLaunchNow] = useState(true); // ← DEFAULT: LIVE ON SUBMIT

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    funding_goal: '',
    jobs_to_create: '',
    sector: 'Technology & Innovation',
    business_plan: null as File | null,
    image: null as File | null,
  });

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const goal = e.target.value;
    setFormData({ ...formData, funding_goal: goal });
    if (goal && !isNaN(Number(goal))) {
      const jobs = Math.floor(Number(goal) / 200000);
      setFormData(prev => ({ ...prev, jobs_to_create: jobs.toString() }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, business_plan: e.target.files[0] });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.business_plan) {
      return alert('Please upload your business plan (PDF)');
    }

    setIsLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('funding_goal', formData.funding_goal);
    data.append('business_plan', formData.business_plan);
    data.append('launch_now', launchNow ? 'true' : 'false'); // ← THIS MAKES IT LIVE

    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await api.post('/api/v1/projects/upload', data);
      alert(launchNow 
        ? 'Project LAUNCHED successfully! It is now LIVE and accepting funds!' 
        : 'Project saved as draft. You can launch it later.'
      );
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Launch failed:', err);
      alert(err.response?.data?.detail || 'Failed to launch project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00A1D6] via-[#0077B6] to-[#004C99] py-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-10"
        >
          <div className="flex items-center mb-8">
            <Link href="/dashboard" className="mr-4">
              <ArrowLeft className="w-8 h-8 text-bdr-blue" />
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Start Your Project</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project Title */}
            <div>
              <label className="block text-lg font-semibold mb-3">Project Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-bdr-blue focus:outline-none text-lg"
                placeholder="e.g. GreenTech Rwanda"
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
              <p className="mt-2 text-sm text-gray-500">
                Sector will be auto-detected from your title (you can change it later)
              </p>
            </div>

            {/* Funding Goal */}
            <div>
              <label className="block text-lg font-semibold mb-3">Funding Goal (RWF)</label>
              <input
                type="number"
                required
                value={formData.funding_goal}
                onChange={handleGoalChange}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-bdr-blue focus:outline-none text-lg"
                placeholder="5000000"
              />
              <p className="mt-2 text-sm text-gray-600">
                <strong>{formData.jobs_to_create || 0} jobs</strong> will be created (RWF 200,000 = 1 job)
              </p>
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-lg font-semibold mb-3">Project Description</label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-bdr-blue focus:outline-none text-lg resize-none"
                placeholder="Tell us about your vision..."
              />
            </div>

            {/* Project Cover Image */}
            <div>
              <label className="block text-lg font-semibold mb-3">
                <Image className="inline w-6 h-6 mr-2" />
                Project Cover Image (Recommended)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-bdr-blue transition-all cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="project-image"
                />
                <label htmlFor="project-image" className="cursor-pointer">
                  {formData.image ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                      <p className="text-xl font-semibold text-green-600">{formData.image.name}</p>
                      <p className="text-sm text-gray-500 mt-1">Click to change</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-xl text-gray-600">Click to upload image</p>
                      <p className="text-sm text-gray-500 mt-2">JPG, PNG, WebP • Max 5MB</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Business Plan PDF */}
            <div>
              <label className="block text-lg font-semibold mb-3">
                <FileText className="inline w-6 h-6 mr-2" />
                Upload Business Plan (PDF only)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-bdr-blue transition-all cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={handleFileChange}
                  className="hidden"
                  id="business-plan"
                />
                <label htmlFor="business-plan" className="cursor-pointer">
                  {formData.business_plan ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                      <p className="text-xl font-semibold text-green-600">{formData.business_plan.name}</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-xl text-gray-600">Click to upload PDF</p>
                      <p className="text-sm text-gray-500 mt-2">Max 10MB</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* LAUNCH NOW CHECKBOX */}
            <div className="bg-gradient-to-r from-[#00A1D6]/10 to-[#00A651]/10 rounded-3xl p-8 border-2 border-[#00A1D6]/30">
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={launchNow}
                  onChange={(e) => setLaunchNow(e.target.checked)}
                  className="w-8 h-8 text-[#00A1D6] rounded-lg focus:ring-[#00A1D6]"
                />
                <div>
                  <p className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Rocket className="w-8 h-8 text-[#00A1D6]" />
                    Launch Project Immediately
                  </p>
                  <p className="text-lg text-gray-700 mt-2">
                    Your project will go <strong>LIVE instantly</strong> and start accepting funds via MoMo & Card
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-7 bg-gradient-to-r from-[#00A1D6] to-[#00A651] text-white text-3xl font-bold rounded-full shadow-3xl hover:scale-105 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-4"
            >
              {isLoading ? (
                <>Creating Project...</>
              ) : launchNow ? (
                <>
                  <Rocket className="w-10 h-10" />
                  Launch Project Now
                </>
              ) : (
                'Save as Draft'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}