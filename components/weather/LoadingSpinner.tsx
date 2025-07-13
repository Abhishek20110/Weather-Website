'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-2 border-white/30 border-t-white rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
}

export function WeatherSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="h-6 bg-white/20 rounded w-32 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-16"></div>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="h-12 bg-white/20 rounded w-24 mx-auto mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-20 mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="h-6 bg-white/20 rounded w-32 mx-auto mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-20 mx-auto"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-white/20 rounded w-full"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-white/20 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}