// src/app/mentors/[slug]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Mentor not found</p>
        <Link href="/mentors" className="px-8 py-4 bg-[#00A651] text-white rounded-full hover:bg-[#008c44] transition">
          Back to All Mentors
        </Link>
      </div>
    </div>
  );
}