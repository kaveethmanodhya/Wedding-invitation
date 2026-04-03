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

export default function StorySection({ config }) {
  const { story } = config;
  const ref1 = useReveal();
  const ref2 = useReveal();
  const ref3 = useReveal();

  return (
    <section id="story" className="relative z-10 py-20 md:py-28 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">

        {/* Section header */}
        <div
          ref={ref1}
          className="text-center mb-12 opacity-0 translate-y-8 transition-all duration-700"
        >
          <p className="font-sans text-[0.7rem] tracking-[0.3em] uppercase text-[var(--colorPrimary)] mb-3">
            The Beginning
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-normal text-white mb-3">
            Our Story
          </h2>
          <span className="text-[var(--colorPrimary)]/60 text-2xl">❧</span>
        </div>

        {/* Invitation text */}
        <div
          ref={ref2}
          className="opacity-0 translate-y-8 transition-all duration-700 delay-100"
        >
          <div className="relative text-center py-8 px-6 md:px-16 mb-10 glass-panel rounded-2xl">
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--colorPrimary)] to-transparent mb-6" />
            <p className="font-serif italic font-medium text-lg md:text-xl leading-relaxed text-white max-w-2xl mx-auto">
              {story.invitationText}
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--colorPrimary)] to-transparent mt-6" />
          </div>
        </div>

        {/* Story Content with Images */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div
            ref={ref3}
            className="opacity-0 translate-y-8 transition-all duration-700 delay-200
              flex flex-col gap-6 text-center md:text-left glass-panel p-8 rounded-2xl"
          >
            {story.paragraphs.map((p, i) => (
              <p key={i} className="font-serif font-medium text-base md:text-lg leading-[1.8] text-white/95">
                {p}
              </p>
            ))}
          </div>

          {/* Side Images */}
          <div className="grid grid-cols-2 gap-4">
            {config.gallery?.slice(0, 2).map((img, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden glass-panel aspect-[3/4] ${i === 1 ? 'mt-8' : ''}`}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Ornament */}
        <p className="text-center mt-12 text-4xl text-[var(--colorPrimary)]/20 tracking-widest">❦</p>
      </div>
    </section>
  );
}
