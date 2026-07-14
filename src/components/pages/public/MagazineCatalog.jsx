// src/components/pages/MagazineCatalog.jsx
import React from 'react';
import FlipGallery from '@/components/common/FlipGallery';

const modelImageModules = import.meta.glob('@/assets/models/*.webp', {
  eager: true,
  import: 'default',
});

const modelImages = Object.entries(modelImageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, url], index) => ({
    title: `Model ${index + 1}`,
    url,
  }));

export default function MagazineCatalog() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-transparent">
      {/* Left-aligned title */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-8 md:pl-12 lg:pl-16 z-10 hidden sm:block">
        <h1 className="font-cormorant text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-dark-teal dark:text-warm-white leading-[0.9]">
          Magazine
          <br />
          <span className="italic text-old-gold">Catalog</span>
        </h1>
        {/* Optional decorative line */}
        <div className="mt-4 w-16 h-px bg-old-gold/50" />
        <p className="mt-4 font-jost text-xs tracking-[0.2em] text-warm-gray dark:text-warm-white/70 uppercase">
          Our Collection
        </p>
      </div>

      {/* Centered gallery – same as before */}
      <FlipGallery images={modelImages} />
    </div>
  );
}