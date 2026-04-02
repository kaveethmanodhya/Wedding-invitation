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

function EventCard({ event, delay }) {
  const ref = useReveal(delay);

  return (
    <article
      ref={ref}
      className="opacity-0 translate-y-8 transition-all duration-700
        bg-[var(--colorBg)] border border-[var(--colorPrimary)]/20 rounded-3xl
        px-8 py-10 flex flex-col items-center text-center gap-3
        shadow-[0_8px_40px_rgba(var(--colorTextDarkRGB,44,32,24),0.09)]
        hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(var(--colorTextDarkRGB,44,32,24),0.14)]
        transition-[transform,box-shadow] duration-300"
    >
      <span className="text-4xl mb-1">{event.icon}</span>
      <h3 className="font-serif text-2xl md:text-3xl font-medium text-[var(--colorTextDark)]">
        {event.title}
      </h3>
      <div className="w-10 h-px bg-[var(--colorPrimary)]/60 my-1" />

      {/* Details */}
      {[
        { icon: 'clock', label: event.time },
        { icon: 'home',  label: event.venueName },
        { icon: 'pin',   label: event.address },
        { icon: 'heart', label: `Dress Code: ${event.dressCode}` },
      ].map(({ icon, label }) => (
        <div key={icon} className="flex items-start gap-2.5 w-full max-w-xs text-left">
          <span className="mt-0.5 shrink-0">
            {icon === 'clock'  && <ClockIcon />}
            {icon === 'home'   && <HomeIcon />}
            {icon === 'pin'    && <PinIcon />}
            {icon === 'heart'  && <HeartIcon />}
          </span>
          <span className="font-sans text-sm text-[var(--colorTextDark)]/75">{label}</span>
        </div>
      ))}

      <a
        href={event.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center gap-2 px-7 py-3 rounded-full
          bg-[var(--colorPrimary)] text-white font-sans text-xs font-semibold tracking-widest uppercase
          shadow-[0_4px_18px_var(--colorPrimary)/35]
          hover:bg-transparent hover:text-[var(--colorPrimary)] border border-[var(--colorPrimary)]
          transition-all duration-300 w-full max-w-xs justify-center"
      >
        <PlaneIcon />
        Get Directions
      </a>
    </article>
  );
}

export default function EventDetails({ config }) {
  const headerRef = useReveal(0);
  const { events } = config;

  return (
    <section id="events" className="bg-white py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-14 opacity-0 translate-y-8 transition-all duration-700"
        >
          <p className="font-sans text-[0.7rem] tracking-[0.3em] uppercase text-[var(--colorPrimary)] mb-3">
            Mark Your Calendar
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-normal text-[var(--colorTextDark)] mb-3">
            Event Details
          </h2>
          <span className="text-[var(--colorPrimary)]/60 text-2xl">❧</span>
        </div>

        {/* Cards */}
        {/* Gallery Images in Events */}
        <div className="grid grid-cols-2 gap-4 mb-20">
          {config.gallery?.slice(2, 4).map((img, i) => (
            <div key={i} className={`rounded-3xl overflow-hidden shadow-lg aspect-video ${i === 1 ? 'md:mt-12' : ''}`}>
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>

        {/* Cards — Centered if only one */}
        <div className={`flex flex-wrap justify-center gap-6 md:gap-8 ${Object.keys(events).length === 0 ? 'hidden' : ''}`}>
          {Object.entries(events).map(([key, event], idx) => (
            <div key={key} className="w-full max-w-sm">
              <EventCard event={event} delay={idx * 150} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Inline SVG icons ──────────────────────────────────────────
const iconClass = 'w-4 h-4 shrink-0 text-[var(--colorPrimary)]';
const ClockIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);
const HomeIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const PinIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const HeartIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);
const PlaneIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 11l19-9-9 19-2-8-8-2z"/>
  </svg>
);
