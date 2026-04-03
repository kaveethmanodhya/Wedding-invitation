'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Gallery({ config }) {
  const { gallery } = config;
  const [lightbox, setLightbox] = useState(null);
  const headerRef = useRef(null);
  const layout = config?.heroLayout ?? 1;

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
    <section 
      id="gallery" 
      className="py-20 md:py-28 transition-colors duration-500"
      style={{
        backgroundColor: 'var(--colorBg)',
        ...(config.sectionBackgrounds?.gallery ? {
          backgroundImage: `url(${config.sectionBackgrounds.gallery})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        } : {})
      }}
    >
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Layout 1 */}
        {layout === 1 && (
          <div ref={headerRef} className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-700">
            <p className="font-sans text-[0.7rem] tracking-[0.3em] uppercase text-[var(--colorPrimary)] mb-3">Pre-Shoot Moments</p>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[var(--colorTextDark)] mb-4 tracking-wide">Our Gallery</h2>
            <div className="w-24 h-px bg-[var(--colorPrimary)] opacity-50 mx-auto mt-2" />
          </div>
        )}

        {/* Header Layout 2 */}
        {layout === 2 && (
          <div ref={headerRef} className="text-center md:text-left mb-16 opacity-0 translate-y-8 transition-all duration-700 relative">
            <h2 className="font-serif text-5xl md:text-6xl text-[var(--colorTextDark)] tracking-widest drop-shadow-sm">
              The <span className="font-script text-[var(--colorPrimary)] text-6xl md:text-8xl align-middle lowercase">Gallery</span>
            </h2>
            <div className="absolute -left-6 top-1/2 w-4 h-4 border-l border-t border-[var(--colorPrimary)] hidden md:block" />
          </div>
        )}

        {/* Header Layout 3 */}
        {layout === 3 && (
          <div ref={headerRef} className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-3xl text-[var(--colorPrimary)] mb-4 block">❀</span>
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--colorTextDark)] mb-4 tracking-wide">Captured Moments</h2>
            <div className="w-24 h-0.5 bg-[var(--colorPrimary)] mx-auto opacity-60" />
          </div>
        )}
      </div>

      {/* Grid Layouts */}
      {layout === 3 ? (
        // Layout 3: Royal Arch Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-6xl mx-auto">
          {gallery.map((photo, idx) => (
            <button
              key={idx} onClick={() => setLightbox(idx)}
              className="group relative cursor-zoom-in focus:outline-none w-full"
              style={{
                borderRadius: '50% 50% 0 0 / 20% 20% 0 0',
                border: '4px solid var(--colorPrimary)',
                padding: '4px',
                aspectRatio: '3/4',
                background: 'var(--colorBg)',
                boxShadow: '0 10px 30px rgba(0,0,0, 0.05)'
              }}
            >
              <div className="w-full h-full relative overflow-hidden" style={{ borderRadius: '50% 50% 0 0 / 20% 20% 0 0' }}>
                <Image src={photo.src} alt={photo.alt} width={600} height={800} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter hover:saturate-150" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <span className="text-[var(--colorBg)] text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md">✤</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : layout === 2 ? (
        // Layout 2: Scattered Floating Ornate Grid
        <div className="grid grid-cols-2 gap-4 md:gap-8 px-4 max-w-5xl mx-auto">
          {gallery.map((photo, idx) => (
            <button
              key={idx} onClick={() => setLightbox(idx)}
              className={`group relative cursor-zoom-in focus:outline-none overflow-hidden rounded-full shadow-lg border-2 border-[var(--colorBg)] outline outline-1 outline-[var(--colorPrimary)] outline-offset-4
                ${idx % 2 === 0 ? 'aspect-square' : 'aspect-[3/4] mt-12'}`}
            >
              <div className="relative w-full h-full bg-[var(--colorBg)]">
                <Image src={photo.src} alt={photo.alt} width={800} height={800} className="w-full h-full object-cover saturate-50 opacity-80 hover:saturate-100 hover:opacity-100 transition-all duration-700 hover:scale-110" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        // Layout 1: Ornate Rectangular Framed Grid
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
          {gallery.map((photo, idx) => (
            <button
              key={idx} onClick={() => setLightbox(idx)}
              className="mb-3 block w-full rounded-none overflow-hidden group relative cursor-zoom-in outline-none p-1.5 border border-[var(--colorPrimary)]/40 hover:border-[var(--colorPrimary)] transition-colors duration-300"
            >
              <div className="relative overflow-hidden w-full h-full aspect-[3/4] border border-[var(--colorPrimary)]/20">
                 <Image src={photo.src} alt={photo.alt} width={600} height={800} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-[var(--colorPrimary)]/0 group-hover:bg-[var(--colorPrimary)]/20 transition-all duration-300 flex items-center justify-center">
                   <span className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md">⊕</span>
                 </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox (Shared) */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-xl hover:bg-[var(--colorPrimary)] transition-colors">×</button>
          <button onClick={(e) => { e.stopPropagation(); setLightbox(i => (i - 1 + gallery.length) % gallery.length); }} className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white text-2xl hover:bg-[var(--colorPrimary)] transition-colors">‹</button>
          <button onClick={(e) => { e.stopPropagation(); setLightbox(i => (i + 1) % gallery.length); }} className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white text-2xl hover:bg-[var(--colorPrimary)] transition-colors">›</button>
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Image src={gallery[lightbox].src} alt={gallery[lightbox].alt} width={1200} height={1600} className={`max-w-full max-h-[90vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] ${layout === 3 ? 'border-[3px] border-[var(--colorPrimary)] rounded-t-full' : layout === 2 ? 'rounded-full border-2 border-[var(--colorPrimary)]' : 'border-4 border-white'}`} style={{ maxHeight: '90vh' }} />
          </div>
        </div>
      )}
    </section>
  );
}
