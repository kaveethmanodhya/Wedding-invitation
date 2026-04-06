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
      className="py-20 md:py-28 transition-colors duration-500 relative overflow-hidden"
      style={{ backgroundColor: layout === 9 ? '#020617' : 'var(--colorBg)' }}
    >
      {/* ── BLURRED BACKGROUND LAYER ── */}
      {config.sectionBackgrounds?.gallery && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none transition-transform duration-1000"
          style={{ 
            backgroundImage: `url(${config.sectionBackgrounds.gallery})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(15px)',
            transform: 'scale(1.05)',
            opacity: 0.5
          }} 
        />
      )}
      <div className={`absolute inset-0 z-[1] pointer-events-none ${layout === 9 ? 'bg-black/40' : 'bg-white/5'}`} />
      <div className="max-w-5xl mx-auto px-6">
        

        {/* Header Layouts */}
        {(layout === 1 || layout === 3 || layout === 5 || layout === 6 || layout === 7 || layout === 8 || layout === 9) && (
          <div ref={headerRef} className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-700">
            {layout === 1 && (
              <>
                <p className="font-sans text-[0.7rem] tracking-[0.3em] uppercase text-[var(--colorPrimary)] mb-3">Our Moments</p>
                <h2 className="font-serif text-4xl md:text-5xl text-[var(--colorTextDark)] mb-4 tracking-wide">Captured Memories</h2>
                <div className="w-24 h-px bg-[var(--colorPrimary)] mx-auto opacity-50" />
              </>
            )}
            {layout === 3 && (
              <>
                <span className="text-3xl text-[var(--colorPrimary)] mb-4 block">❀</span>
                <h2 className="font-serif text-4xl md:text-5xl text-[var(--colorTextDark)] mb-4 tracking-wide">The Gallery</h2>
                <div className="w-24 h-0.5 bg-[var(--colorPrimary)] mx-auto opacity-60" />
              </>
            )}
            {layout === 5 && (
              <div className="text-left border-l-4 border-[var(--colorTextDark)] pl-8">
                <h2 className="font-sans text-5xl md:text-7xl font-bold uppercase tracking-tighter text-[var(--colorTextDark)] opacity-80 leading-none mb-2">Moments</h2>
                <p className="font-serif text-3xl italic text-[var(--colorTextDark)]/40 italic">A visual journey of us</p>
              </div>
            )}
            {layout === 6 && (
              <div className="relative inline-block">
                <span className="text-4xl absolute -top-10 -right-10 opacity-30">🌸</span>
                <h2 className="font-script text-6xl md:text-8xl text-[var(--colorPrimary)] mb-2">Beautiful Photos</h2>
                <p className="font-sans text-[10px] tracking-[0.5em] uppercase opacity-40">Lovely Times</p>
              </div>
            )}
            {layout === 7 && (
              <div>
                <h2 className="font-script text-5xl text-slate-800 mb-2 underline decoration-[var(--colorPrimary)]/20 decoration-8 underline-offset-[-2px]">Our Scrapbook</h2>
                <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-slate-400 mt-4">Flipping through the pages of our lives</p>
              </div>
            )}
            {layout === 8 && (
              <div className="text-center">
                <p className="font-sinhala text-xl text-[var(--colorPrimary)] mb-2">මතක සටහන්</p>
                <h2 className="font-sinhala text-4xl md:text-5xl text-[var(--colorTextDark)] mb-4">ඡායාරූප එකතුව</h2>
                <div className="w-16 h-1.5 bg-[var(--colorPrimary)] mx-auto rounded-full" />
              </div>
            )}
            {layout === 9 && (
              <div className="text-center">
                <h2 className="font-sans text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4 bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">Gallery</h2>
                <p className="font-sans text-[10px] tracking-[0.6em] uppercase text-white/40 font-bold">The Moments Captured In Time</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid Layouts */}
      {layout === 8 ? (
        // Layout 8: Traditional Solid Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 max-w-7xl mx-auto">
          {gallery.map((photo, idx) => (
            <button
              key={idx} onClick={() => setLightbox(idx)}
              className="group relative cursor-zoom-in focus:outline-none overflow-hidden aspect-square border-4 border-[var(--colorPrimary)]/30 rounded-2xl shadow-lg transition-transform duration-500 hover:rotate-1 hover:scale-[1.02]"
            >
              <Image src={photo.src} alt={photo.alt} width={800} height={800} className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-110" />
            </button>
          ))}
        </div>
      ) : layout === 7 ? (
        // Layout 7: Polaroid Scattered Grid
        <div className="flex flex-wrap justify-center gap-10 px-8 py-10">
          {gallery.map((photo, idx) => (
            <button
              key={idx} onClick={() => setLightbox(idx)}
              className={`group relative cursor-zoom-in focus:outline-none bg-white p-3 pb-12 shadow-xl border border-slate-100 w-full max-w-[280px] transition-all duration-500 hover:rotate-0 hover:z-20
                ${idx % 3 === 0 ? '-rotate-3 mt-4' : idx % 2 === 0 ? 'rotate-2 mb-4' : 'rotate-1'}`}
            >
              <div className="aspect-square bg-slate-50 overflow-hidden relative">
                <Image src={photo.src} alt={photo.alt} width={600} height={600} className="w-full h-full object-cover sepia-[0.3] group-hover:sepia-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-sm border border-white/20 shadow-sm" />
            </button>
          ))}
        </div>
      ) : layout === 6 ? (
        // Layout 6: Circular Floral Grid
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 px-6 max-w-6xl mx-auto">
          {gallery.map((photo, idx) => (
            <button
              key={idx} onClick={() => setLightbox(idx)}
              className="group relative cursor-zoom-in focus:outline-none rounded-full overflow-hidden aspect-square shadow-2xl transition-all duration-700 hover:scale-105 border-4 border-white/30"
            >
              <Image src={photo.src} alt={photo.alt} width={800} height={800} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="absolute inset-0 ring-inset ring-1 ring-white/40 rounded-full" />
            </button>
          ))}
        </div>
      ) : layout === 5 ? (
        // Layout 5: Minimalist Modern Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 px-0.5 max-w-full">
          {gallery.map((photo, idx) => (
            <button
              key={idx} onClick={() => setLightbox(idx)}
              className="group relative cursor-zoom-in focus:outline-none aspect-square overflow-hidden"
            >
              <Image src={photo.src} alt={photo.alt} width={1000} height={1000} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white/50 text-xs tracking-[0.5em] uppercase">VIEW</div>
            </button>
          ))}
        </div>
      ) : layout === 4 ? (
        // Layout 4: Nature Arch Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 max-w-6xl mx-auto">
          {gallery.map((photo, idx) => (
            <button
              key={idx} onClick={() => setLightbox(idx)}
              className="group relative cursor-zoom-in focus:outline-none w-full bg-white p-3 shadow-md hover:shadow-xl transition-all duration-500"
              style={{
                borderRadius: '120px 120px 0 0',
                border: '1px solid var(--colorPrimary)/20',
              }}
            >
              <div className="w-full h-full relative overflow-hidden" style={{ borderRadius: '110px 110px 0 0', aspectRatio: '3/4' }}>
                <Image src={photo.src} alt={photo.alt} width={600} height={800} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter saturate-50 group-hover:saturate-100" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-[var(--colorPrimary)]/10 transition-all duration-500 flex items-center justify-center">
                  <span className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-all duration-500 drop-shadow-md scale-50 group-hover:scale-100">🌿</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : layout === 3 ? (
        // Layout 3: Royal Arch Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6 max-w-6xl mx-auto">
          {gallery.map((photo, idx) => (
            <button
              key={idx} onClick={() => setLightbox(idx)}
              className="group relative cursor-zoom-in focus:outline-none w-full border-t-[3px] border-[var(--colorPrimary)] rounded-t-full overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 aspect-[3/4]"
            >
               <Image src={photo.src} alt={photo.alt} width={800} height={800} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
               <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
      ) : layout === 9 ? (
        // Layout 9: Modern Dark Glass Grid
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6 max-w-7xl mx-auto">
          {gallery.map((photo, idx) => (
            <button
              key={idx} onClick={() => setLightbox(idx)}
              className="group relative cursor-zoom-in focus:outline-none aspect-[3/4] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl transition-all duration-700 hover:scale-[1.03] hover:border-[var(--colorPrimary)]/30"
            >
              <Image src={photo.src} alt={photo.alt} width={800} height={1000} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                <span className="text-[10px] text-white font-bold tracking-[0.3em] uppercase opacity-90">View Moment</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        // Default Layout 1: Classic Masonry Style Grid
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 px-6 max-w-6xl mx-auto">
          {gallery.map((photo, idx) => (
            <button
              key={idx} onClick={() => setLightbox(idx)}
              className="group relative cursor-zoom-in focus:outline-none w-full break-inside-avoid shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-sm"
            >
              <Image src={photo.src} alt={photo.alt} width={1000} height={1000} className="w-full h-auto transition-transform duration-700 group-hover:scale-110" />
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
