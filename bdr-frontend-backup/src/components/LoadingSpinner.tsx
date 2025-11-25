'use client';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'blue' | 'yellow' | 'gray';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
};

const colorMap = {
  green: 'text-[#00A651]',
  blue: 'text-[#00A1D6]',
  yellow: 'text-[#FCD116]',
  gray: 'text-gray-500',
};

const speedMap = {
  slow: 'animate-spin-slow',
  normal: 'animate-spin',
  fast: 'animate-spin-fast',
};

export function LoadingSpinner({
  size = 'md',
  color = 'green',
  speed = 'normal',
  className,
}: LoadingSpinnerProps = {}) {
  return (
    <div
      role="status"
      aria-label="Loading"
      data-testid="loading-spinner"
      className="flex items-center justify-center p-8"
    >
      <Loader2
        className={cn(
          sizeMap[size],
          colorMap[color],
          speedMap[speed],
          className
        )}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}