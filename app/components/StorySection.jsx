'use client';
import { useEffect, useRef } from 'react';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('opacity-100', '!translate-y-0'); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Layout1({ config, ref1, ref2, ref3 }) {
  const { story } = config;
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 md:py-28 relative">
      <div className="absolute inset-x-8 top-12 bottom-12 border border-[var(--colorPrimary)] opacity-30 pointer-events-none" />
      
      <div ref={ref1} className="text-center mb-12 opacity-0 translate-y-8 transition-all duration-700 relative z-10 pt-16">
        <p className="font-sans text-[0.7rem] tracking-[0.3em] uppercase text-[var(--colorPrimary)] mb-3">
          The Beginning
        </p>
        <h2 className="font-serif text-4xl md:text-5xl font-normal text-[var(--colorTextDark)] mb-3">
          Our Story
        </h2>
        <span className="text-[var(--colorPrimary)]/60 text-2xl">❧</span>
      </div>

      <div ref={ref2} className="opacity-0 translate-y-8 transition-all duration-700 delay-100 relative z-10">
        <div className="relative text-center py-8 px-6 md:px-16 mb-10">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--colorPrimary)] to-transparent mb-6 opacity-60" />
          <p className="font-serif text-xl md:text-2xl leading-relaxed text-[var(--colorTextDark)] max-w-2xl mx-auto">
            {story.invitationText}
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--colorPrimary)] to-transparent mt-6 opacity-60" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center relative z-10 pb-16 px-6">
        <div ref={ref3} className="opacity-0 translate-y-8 transition-all duration-700 delay-200 flex flex-col gap-6 text-center md:text-left">
          {story.paragraphs.map((p, i) => (
            <p key={i} className="font-serif text-base md:text-lg leading-[1.8] text-[var(--colorTextDark)]/80">
              {p}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {config.gallery?.slice(0, 2).map((img, i) => (
            <div key={i} className={`rounded-xl overflow-hidden shadow-xl aspect-[3/4] border-2 border-[var(--colorBg)] outline outline-1 outline-[var(--colorPrimary)] outline-offset-2 ${i === 1 ? 'mt-8' : ''}`}>
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 saturate-50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Layout2({ config, ref1, ref2, ref3 }) {
  const { story } = config;
  return (
    <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center bg-[var(--colorPrimary)]/5 p-10 md:p-16 rounded-[40px] border border-[var(--colorPrimary)]/20 relative">
        <div className="absolute top-0 left-10 w-20 h-1 bg-[var(--colorPrimary)] opacity-50" />
        <div className="absolute bottom-0 right-10 w-20 h-1 bg-[var(--colorPrimary)] opacity-50" />

        <div ref={ref1} className="lg:col-span-5 opacity-0 translate-y-8 transition-all duration-700">
          <h2 className="font-script text-5xl md:text-6xl text-[var(--colorPrimary)] mb-6 leading-none drop-shadow-sm">
            Journey of Love
          </h2>
          <p className="font-serif text-2xl md:text-3xl leading-snug text-[var(--colorTextDark)] mb-10 tracking-wide">
            {story.invitationText}
          </p>
        </div>

        <div ref={ref2} className="lg:col-span-7 flex flex-col gap-6 opacity-0 translate-y-8 transition-all duration-700 delay-100">
          {story.paragraphs.map((p, i) => (
            <p key={i} className="font-serif text-lg leading-[1.8] text-[var(--colorTextDark)] opacity-80 bg-white/40 p-6 rounded-2xl border border-white/50 backdrop-blur-sm">
              {p}
            </p>
          ))}
        </div>
      </div>

      <div ref={ref3} className="flex justify-center gap-6 mt-16 opacity-0 translate-y-8 transition-all duration-700 delay-200">
         {config.gallery?.slice(0, 3).map((img, i) => (
            <div key={i} className={`w-32 h-32 md:w-48 md:h-48 overflow-hidden rounded-full border-4 border-[var(--colorBg)] outline outline-[var(--colorPrimary)] outline-1 shadow-lg ${i === 1 ? '-translate-y-8' : ''}`}>
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-500 scale-110" />
            </div>
          ))}
      </div>
    </div>
  );
}

function Layout3({ config, ref1, ref2, ref3 }) {
  const { story } = config;
  return (
    <div className="relative max-w-5xl mx-auto px-6 py-28 md:py-36">
      {/* Decorative Border */}
      <div className="absolute inset-4 md:inset-8 border border-[var(--colorPrimary)] pointer-events-none opacity-40 mix-blend-multiply" />
      <div className="absolute inset-[18px] md:inset-[34px] border border-[var(--colorPrimary)] pointer-events-none opacity-20 outline outline-1 outline-offset-2 outline-[var(--colorPrimary)]" />
      
      <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto text-center px-4">
        <div ref={ref1} className="opacity-0 translate-y-8 transition-all duration-700 mb-12">
           <span className="text-3xl text-[var(--colorPrimary)] mb-4 block">❀</span>
           <h2 className="font-serif text-4xl md:text-5xl text-[var(--colorTextDark)] mb-4 tracking-wide">
             The Journey
           </h2>
           <div className="w-24 h-0.5 bg-[var(--colorPrimary)] mx-auto opacity-60" />
        </div>

        <div ref={ref2} className="opacity-0 translate-y-8 transition-all duration-700 delay-100 bg-[var(--colorPrimary)]/5 p-8 md:p-12 border border-[var(--colorPrimary)]/30 shadow-lg mb-16 relative">
          {/* Corner ornaments */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[var(--colorPrimary)]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[var(--colorPrimary)]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[var(--colorPrimary)]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[var(--colorPrimary)]" />
          
          <p className="font-serif text-xl md:text-2xl leading-loose text-[var(--colorTextDark)] mb-4">
            {story.invitationText}
          </p>
        </div>

        <div ref={ref3} className="opacity-0 translate-y-8 transition-all duration-700 delay-200 space-y-8">
          {story.paragraphs.map((p, i) => (
            <p key={i} className="font-sans text-sm md:text-base leading-relaxed tracking-wide text-[var(--colorTextDark)] opacity-80 text-justify md:text-center">
              {p}
            </p>
          ))}
        </div>
        
        <span className="text-3xl text-[var(--colorPrimary)] mt-16 scale-[-1]">❀</span>
      </div>
    </div>
  );
}

export default function StorySection({ config }) {
  const ref1 = useReveal();
  const ref2 = useReveal();
  const ref3 = useReveal();
  const layout = config?.heroLayout ?? 1;

  // The background color is handled globally by var(--colorBg)
  return (
    <section 
      id="story" 
      className="overflow-hidden transition-colors duration-500 relative"
      style={{ backgroundColor: 'var(--colorBg)' }}
    >
      {/* ── BLURRED BACKGROUND LAYER ── */}
      {config.sectionBackgrounds?.story && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none transition-transform duration-1000"
          style={{ 
            backgroundImage: `url(${config.sectionBackgrounds.story})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            filter: 'blur(15px)',
            transform: 'scale(1.05)',
            opacity: 0.5
          }} 
        />
      )}
      <div className="absolute inset-0 bg-white/5 z-[1] pointer-events-none" />
      {layout === 4 ? (
        <Layout4 config={config} ref1={ref1} ref2={ref2} ref3={ref3} />
      ) : layout === 3 ? (
        <Layout3 config={config} ref1={ref1} ref2={ref2} ref3={ref3} />
      ) : layout === 2 ? (
        <Layout2 config={config} ref1={ref1} ref2={ref2} ref3={ref3} />
      ) : (
        <Layout1 config={config} ref1={ref1} ref2={ref2} ref3={ref3} />
      )}
    </section>
  );
}

function Layout4({ config, ref1, ref2, ref3 }) {
  const { story } = config;
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 relative text-center">
      {/* Decorative nature elements */}
      <div className="absolute top-10 left-10 text-4xl opacity-10 pointer-events-none rotate-12">🌿</div>
      <div className="absolute bottom-10 right-10 text-4xl opacity-10 pointer-events-none -rotate-12">🍃</div>
      
      <div ref={ref1} className="opacity-0 translate-y-8 transition-all duration-1000 mb-16">
        <p className="font-sans text-[0.65rem] tracking-[0.4em] uppercase text-[var(--colorPrimary)] mb-4 font-bold">
          Our Journey
        </p>
        <h2 className="font-serif text-5xl md:text-6xl text-[var(--colorTextDark)] mb-6 tracking-tight">
          The Story of Us
        </h2>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-[var(--colorPrimary)] opacity-30" />
          <span className="text-[var(--colorPrimary)] text-xl">🪷</span>
          <div className="h-px w-12 bg-[var(--colorPrimary)] opacity-30" />
        </div>
      </div>

      <div ref={ref2} className="opacity-0 translate-y-8 transition-all duration-1000 delay-300 mb-20 max-w-2xl mx-auto">
        <p className="font-serif text-2xl md:text-3xl leading-relaxed text-[var(--colorTextDark)] italic">
          "{story.invitationText}"
        </p>
      </div>

      <div ref={ref3} className="opacity-0 translate-y-8 transition-all duration-1000 delay-500 space-y-10">
        {story.paragraphs.map((p, i) => (
          <p key={i} className="font-serif text-lg md:text-xl leading-[2] text-[var(--colorTextDark)]/70 max-w-3xl mx-auto px-4">
            {p}
          </p>
        ))}
        
        <div className="pt-12">
          <span className="font-script text-4xl text-[var(--colorPrimary)]">Happily Ever After</span>
        </div>
      </div>
    </div>
  );
}
