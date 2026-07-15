import React from 'react';

export default function SkeletonShimmer({ className = '', style = {}, children }) {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div
        className={`relative overflow-hidden ${className}`}
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(199, 159, 72, 0.08) 0%, rgba(199, 159, 72, 0.2) 50%, rgba(199, 159, 72, 0.08) 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.4s linear infinite',
          ...style,
        }}
      >
        {children}
      </div>
    </>
  );
}
