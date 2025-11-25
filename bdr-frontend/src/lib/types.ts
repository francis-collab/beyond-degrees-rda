// User roles
export type UserRole = 'backer' | 'entrepreneur' | 'admin';

export interface User {
  id: number;
  email: string;
  name: string; // ← matches backend
  role: UserRole; // ← backend sends string, not { value }
}

// Project status (exact match with backend)
export const PROJECT_STATUSES = [
  'draft',
  'submitted',
  'under_review',
  'approved',
  'active',
  'goal_reached',
  'failed',
  'completed',
  'suspended',
] as const;

export type ProjectStatus = typeof PROJECT_STATUSES[number];

export interface Project {
  id: number;
  title: string;
  description: string;
  funding_goal: number;
  current_funding: number;
  status: ProjectStatus;
  created_at: string;
  updated_at?: string;
  entrepreneur_id: number;
  image?: string;
  image_url?: string; // ← CDN fallback
  backers_count?: number;
  is_momo_ready?: boolean; // ← for badge
}