'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Gallery({ config }) {
  const { gallery } = config;
  const [lightbox, setLightbox] = useState(null); // index or null
  const headerRef = useRef(null);

  // Scroll reveal for header
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('opacity-100', '!translate-y-0'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape')     setLightbox(null);
      if (e.key === 'ArrowLeft')  setLightbox(i => (i - 1 + gallery.length) % gallery.length);
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % gallery.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [lightbox, gallery.length]);

  return (
    <section id="gallery" className="relative z-10 py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-12 opacity-0 translate-y-8 transition-all duration-700"
        >
          <p className="font-sans text-[0.7rem] tracking-[0.3em] uppercase text-[var(--colorPrimary)] mb-3">
            Pre-Shoot Moments
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-normal text-[var(--colorTextDark)] mb-3">
            Our Gallery
          </h2>
          <span className="text-[var(--colorPrimary)]/60 text-2xl">❧</span>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="columns-2 md:columns-3 gap-3 px-4 max-w-6xl mx-auto">
        {gallery.map((photo, idx) => (
          <button
            key={idx}
            onClick={() => setLightbox(idx)}
            className="break-inside-avoid mb-3 block w-full rounded-xl overflow-hidden
              group relative cursor-zoom-in focus:outline-none
              focus-visible:ring-2 focus-visible:ring-[var(--colorPrimary)]"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={600}
              height={800}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300
              flex items-center justify-center">
              <span className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">⊕</span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10
              flex items-center justify-center text-white text-xl hover:bg-white/25 transition-colors"
          >
            ×
          </button>
          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(i => (i - 1 + gallery.length) % gallery.length); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10
              flex items-center justify-center text-white text-2xl hover:bg-white/25 transition-colors"
          >
            ‹
          </button>
          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(i => (i + 1) % gallery.length); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10
              flex items-center justify-center text-white text-2xl hover:bg-white/25 transition-colors"
          >
            ›
          </button>
          {/* Image */}
          <div
            className="relative max-w-3xl w-full max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={gallery[lightbox].src}
              alt={gallery[lightbox].alt}
              width={900}
              height={1200}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}
