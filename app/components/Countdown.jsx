'use client';
import { useState, useEffect, useRef } from 'react';

function CountdownBlock({ value, unit }) {
  const [prev, setPrev]   = useState(value);
  const [flip, setFlip]   = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (value !== prev) {
      setFlip(true);
      const t = setTimeout(() => { setFlip(false); setPrev(value); }, 350);
      return () => clearTimeout(t);
    }
  }, [value, prev]);

  const formatted = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center bg-white/5 border border-[var(--colorSecondary)]/20
      rounded-xl px-4 py-4 sm:px-6 sm:py-5 min-w-[72px] sm:min-w-[100px] backdrop-blur-sm"
    >
      <span
        ref={ref}
        className={`font-serif font-light text-[var(--colorSecondary)] leading-none
          text-4xl sm:text-5xl tracking-tight ${flip ? 'flip' : ''}`}
      >
        {formatted}
      </span>
      <span className="font-sans text-[0.58rem] tracking-[0.2em] uppercase
        text-white/90 mt-2"
      >
        {unit}
      </span>
    </div>
  );
}

export default function Countdown({ config }) {
  const [isMounted, setIsMounted] = useState(false);
  const target = new Date(config.wedding.dateTimeISO).getTime();

  const [timeLeft, setTimeLeft] = useState(null);
  const [done,     setDone]     = useState(false);

  function computeTimeLeft(t) {
    const diff = t - Date.now();
    if (diff <= 0) return null;
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  }

  useEffect(() => {
    setIsMounted(true);
    setTimeLeft(computeTimeLeft(target));

    const id = setInterval(() => {
      const tl = computeTimeLeft(target);
      if (!tl) { setDone(true); clearInterval(id); return; }
      setTimeLeft(tl);
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  // If not mounted, render the section structure with empty blocks
  // to avoid layout shift while preventing hydration mismatch
  if (!isMounted) {
    return (
      <section id="countdown" className="relative z-10 text-[var(--colorTextLight)] py-16 md:py-20 text-center" style={{ backgroundColor: 'color-mix(in srgb, var(--colorTextDark) 60%, transparent)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
        <p className="font-serif text-xs tracking-[0.24em] uppercase text-[var(--colorSecondary)] mb-8 invisible">
          Counting down to the big day
        </p>
        <div className="flex justify-center items-center gap-3 sm:gap-5 flex-wrap px-4 opacity-0">
           <div className="min-w-[72px] sm:min-w-[100px] h-24 bg-white/5 rounded-xl" />
           <div className="min-w-[72px] sm:min-w-[100px] h-24 bg-white/5 rounded-xl" />
           <div className="min-w-[72px] sm:min-w-[100px] h-24 bg-white/5 rounded-xl" />
           <div className="min-w-[72px] sm:min-w-[100px] h-24 bg-white/5 rounded-xl" />
        </div>
      </section>
    );
  }

  return (
    <section
      id="countdown"
      className="relative z-10 text-[var(--colorTextLight)] py-16 md:py-20 text-center"
      style={{ backgroundColor: 'color-mix(in srgb, var(--colorTextDark) 60%, transparent)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
    >
      <p className="font-serif text-xs tracking-[0.24em] uppercase text-[var(--colorSecondary)] mb-8">
        Counting down to the big day
      </p>

      {done ? (
        <p className="font-script text-3xl text-[var(--colorSecondary)]">
          🎉 Today is the day! Congratulations! 🎉
        </p>
      ) : timeLeft && (
        <div className="flex justify-center items-center gap-3 sm:gap-5 flex-wrap px-4">
          <CountdownBlock value={timeLeft.days}    unit="Days" />
          <span className="font-serif text-3xl text-[var(--colorSecondary)]/40 mb-5">:</span>
          <CountdownBlock value={timeLeft.hours}   unit="Hours" />
          <span className="font-serif text-3xl text-[var(--colorSecondary)]/40 mb-5">:</span>
          <CountdownBlock value={timeLeft.minutes} unit="Minutes" />
          <span className="font-serif text-3xl text-[var(--colorSecondary)]/40 mb-5">:</span>
          <CountdownBlock value={timeLeft.seconds} unit="Seconds" />
        </div>
      )}
    </section>
  );
}
