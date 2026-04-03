'use client';
import { useEffect, useRef } from 'react';

function useReveal(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('opacity-100', '!translate-y-0'), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

const PlaneIcon = () => (<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>);

// ── LAYOUT 1 — Rectangular Ornate Cards ──
function EventCard1({ event, delay }) {
  const ref = useReveal(delay);
  return (
    <article
      ref={ref}
      className="opacity-0 translate-y-8 transition-all duration-700 bg-[var(--colorBg)] border border-[var(--colorPrimary)] rounded-none px-8 py-10 flex flex-col items-center text-center gap-3 w-full max-w-sm relative group"
    >
      <div className="absolute inset-1.5 border border-[var(--colorPrimary)] opacity-40 pointer-events-none" />
      <span className="text-4xl mb-1 mt-2 text-[var(--colorPrimary)]">❀</span>
      <h3 className="font-serif text-2xl md:text-3xl font-medium text-[var(--colorTextDark)] tracking-wide">{event.title}</h3>
      <div className="w-16 h-px bg-[var(--colorPrimary)] my-2 opacity-60" />
      <span className="font-serif italic text-lg text-[var(--colorPrimary)] mb-2">{event.time}</span>

      <div className="flex flex-col gap-1 w-full max-w-xs text-center mb-6">
        <span className="font-sans font-bold uppercase tracking-widest text-xs text-[var(--colorTextDark)]">{event.venueName}</span>
        <span className="font-sans text-sm text-[var(--colorTextDark)]/75 mt-1 leading-relaxed">{event.address}</span>
        {event.dressCode && event.dressCode !== 'none' && (
          <span className="font-serif italic text-sm text-[var(--colorTextDark)] opacity-80 mt-3">Dress Code: {event.dressCode}</span>
        )}
      </div>

      <a href={event.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-auto flex items-center gap-2 px-8 py-3 bg-[var(--colorPrimary)] text-white font-sans text-[10px] font-bold tracking-widest uppercase hover:bg-transparent hover:text-[var(--colorPrimary)] border border-[var(--colorPrimary)] transition-all duration-300">
        <PlaneIcon /> Directions
      </a>
    </article>
  );
}

function Layout1({ config }) {
  const headerRef = useReveal(0);
  const { events } = config;
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
      <div ref={headerRef} className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-700">
        <p className="font-sans text-[0.7rem] tracking-[0.3em] uppercase text-[var(--colorPrimary)] mb-3">Mark Your Calendar</p>
        <h2 className="font-serif text-4xl md:text-5xl font-normal text-[var(--colorTextDark)] mb-4 tracking-wide">Event Details</h2>
        <div className="w-24 h-px bg-[var(--colorPrimary)] opacity-50 mx-auto" />
      </div>

      <div className={`flex flex-wrap justify-center gap-8 md:gap-12 ${Object.keys(events).length === 0 ? 'hidden' : ''}`}>
        {Object.entries(events).map(([key, event], idx) => (
          <EventCard1 key={key} event={event} delay={idx * 150} />
        ))}
      </div>
    </div>
  );
}

// ── LAYOUT 2 — Floating Elegant Cards ──
function EventCard2({ event, delay }) {
  const ref = useReveal(delay);
  return (
    <div ref={ref} className="opacity-0 translate-y-8 transition-all duration-700 w-full md:w-[48%] bg-white/70 backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-white/60 relative group hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-10 rounded-[32px]">
      <h3 className="font-script text-4xl text-[var(--colorPrimary)] mb-2 drop-shadow-sm">{event.title}</h3>
      <p className="font-serif text-[var(--colorTextDark)] opacity-80 text-lg mb-6 tracking-wide">{event.time}</p>

      <div className="space-y-4 mb-8">
        <p className="font-sans font-light text-sm uppercase tracking-widest text-[var(--colorTextDark)] opacity-90"><span className="font-bold border-b border-[var(--colorPrimary)]/50 mr-2">Venue</span> {event.venueName}</p>
        <p className="font-sans font-light text-sm uppercase tracking-widest text-[var(--colorTextDark)] opacity-90"><span className="font-bold border-b border-[var(--colorPrimary)]/50 mr-2">Loc</span> {event.address}</p>
        {event.dressCode && event.dressCode !== 'none' && (
          <p className="font-sans font-light text-sm uppercase tracking-widest text-[var(--colorTextDark)] opacity-90"><span className="font-bold border-b border-[var(--colorPrimary)]/50 mr-2">Attire</span> {event.dressCode}</p>
        )}
      </div>

      <a href={event.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-[var(--colorTextDark)] text-[var(--colorTextDark)] font-sans text-xs font-bold tracking-widest uppercase hover:text-[var(--colorPrimary)] hover:border-[var(--colorPrimary)] transition-colors px-6 py-2 rounded-full">
        <PlaneIcon /> Map
      </a>
    </div>
  );
}

function Layout2({ config }) {
  const headerRef = useReveal(0);
  const { events } = config;
  return (
    <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--colorPrimary)] opacity-5 rounded-full blur-3xl pointer-events-none" />
      <div ref={headerRef} className="opacity-0 translate-y-8 transition-all duration-700 mb-20 text-center relative z-10 w-full">
        <h2 className="font-script text-5xl md:text-6xl text-[var(--colorTextDark)] mb-6 leading-none drop-shadow-sm tracking-widest uppercase drop-shadow-sm">
          Celebrations
        </h2>
      </div>
      <div className={`flex flex-wrap justify-center gap-12 relative z-10 w-full ${Object.keys(events).length === 0 ? 'hidden' : ''}`}>
        {Object.entries(events).map(([key, event], idx) => (
          <EventCard2 key={key} event={event} delay={idx * 150} />
        ))}
      </div>
    </div>
  );
}

// ── LAYOUT 3 — Royal Arch / Solid block ──
function EventCard3({ event, delay }) {
  const ref = useReveal(delay);
  return (
    <div ref={ref} className="opacity-0 translate-y-8 transition-all duration-700 relative bg-[var(--colorPrimary)]/5 border border-[var(--colorPrimary)]/50 p-8 md:p-10 w-full max-w-md mx-auto text-center shadow-lg group hover:bg-[var(--colorPrimary)]/10 transition-colors">
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--colorPrimary)] m-2 pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--colorPrimary)] m-2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--colorPrimary)] m-2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--colorPrimary)] m-2 pointer-events-none" />

      <h3 className="font-serif text-3xl md:text-4xl text-[var(--colorTextDark)] mb-2 tracking-wide">{event.title}</h3>
      <p className="font-script text-3xl text-[var(--colorPrimary)] mb-6 drop-shadow-sm">{event.time}</p>

      <div className="w-16 h-[1px] bg-[var(--colorPrimary)] mx-auto mb-6 opacity-60" />

      <p className="font-sans text-xs tracking-widest uppercase font-bold text-[var(--colorTextDark)] mb-1">{event.venueName}</p>
      <p className="font-sans text-sm tracking-wide text-[var(--colorTextDark)]/80 mb-6 max-w-[200px] mx-auto leading-relaxed">{event.address}</p>

      {event.dressCode && event.dressCode !== 'none' && (
        <p className="font-serif italic text-sm text-[var(--colorTextDark)] opacity-90 mb-8">Dress Code: {event.dressCode}</p>
      )}

      <a href={event.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-[var(--colorTextDark)] text-[var(--colorBg)] font-sans text-xs tracking-widest uppercase hover:bg-[var(--colorPrimary)] transition-colors shadow-md">
        View Map
      </a>
    </div>
  );
}

function Layout3({ config }) {
  const headerRef = useReveal(0);
  const { events } = config;
  return (
    <div className="max-w-5xl mx-auto px-6 py-28 md:py-36">
      <div ref={headerRef} className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-700">
        <span className="text-3xl text-[var(--colorPrimary)] mb-4 block">❀</span>
        <h2 className="font-serif text-4xl md:text-5xl text-[var(--colorTextDark)] mb-4 tracking-wide">Celebrations</h2>
        <div className="w-24 h-0.5 bg-[var(--colorPrimary)] mx-auto opacity-60" />
      </div>

      <div className={`grid md:grid-cols-2 gap-10 md:gap-14 justify-center ${Object.keys(events).length === 0 ? 'hidden' : ''}`}>
        {Object.entries(events).map(([key, event], idx) => (
          <div key={key} className={Object.keys(events).length === 1 ? 'md:col-span-2' : ''}>
            <EventCard3 event={event} delay={idx * 150} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EventDetails({ config }) {
  const layout = config?.heroLayout ?? 1;

  return (
    <section id="events" className="overflow-hidden bg-[var(--colorBg)] transition-colors duration-500">
      {layout === 3 ? <Layout3 config={config} /> : layout === 2 ? <Layout2 config={config} /> : <Layout1 config={config} />}
    </section>
  );
}
