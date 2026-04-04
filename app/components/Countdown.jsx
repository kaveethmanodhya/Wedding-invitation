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
      rounded-xl px-1.5 py-3 sm:px-6 sm:py-5 min-w-[62px] sm:min-w-[100px] backdrop-blur-sm transition-all duration-300"
    >
      <span
        ref={ref}
        className={`font-serif font-light text-[var(--colorSecondary)] leading-none
          text-3xl sm:text-5xl tracking-tight ${flip ? 'flip' : ''}`}
      >
        {formatted}
      </span>
      <span className="font-sans text-[0.5rem] sm:text-[0.58rem] tracking-[0.1em] sm:tracking-[0.2em] uppercase
        text-[var(--colorTextLight)]/40 mt-1 sm:mt-2"
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
      <section id="countdown" className="bg-[var(--colorTextDark)] text-[var(--colorTextLight)] py-16 md:py-20 text-center overflow-hidden">
        <p className="font-serif text-xs tracking-[0.24em] uppercase text-[var(--colorSecondary)] mb-8 invisible">
          Counting down to the big day
        </p>
        <div className="flex justify-center items-center gap-1 sm:gap-5 flex-nowrap px-1 sm:px-4 opacity-0 scale-95 sm:scale-100 transition-transform">
           <div className="min-w-[62px] sm:min-w-[100px] h-20 sm:h-24 bg-white/5 rounded-xl transition-all" />
           <div className="min-w-[62px] sm:min-w-[100px] h-20 sm:h-24 bg-white/5 rounded-xl transition-all" />
           <div className="min-w-[62px] sm:min-w-[100px] h-20 sm:h-24 bg-white/5 rounded-xl transition-all" />
           <div className="min-w-[62px] sm:min-w-[100px] h-20 sm:h-24 bg-white/5 rounded-xl transition-all" />
        </div>
      </section>
    );
  }

  return (
    <section
      id="countdown"
      className="bg-[var(--colorTextDark)] text-[var(--colorTextLight)] py-16 md:py-20 text-center overflow-hidden"
    >
      <p className="font-serif text-xs tracking-[0.24em] uppercase text-[var(--colorSecondary)] mb-8">
        Counting down to the big day
      </p>

      {done ? (
        <p className="font-script text-3xl text-[var(--colorSecondary)] px-4">
          🎉 Today is the day! Congratulations! 🎉
        </p>
      ) : timeLeft && (
        <div className="flex justify-center items-center gap-1 sm:gap-5 flex-nowrap px-1 sm:px-4 overflow-hidden">
          <CountdownBlock value={timeLeft.days}    unit="Days" />
          <span className="font-serif text-xl sm:text-3xl text-[var(--colorSecondary)]/40 mb-3 sm:mb-5">:</span>
          <CountdownBlock value={timeLeft.hours}   unit="Hours" />
          <span className="font-serif text-xl sm:text-3xl text-[var(--colorSecondary)]/40 mb-3 sm:mb-5">:</span>
          <CountdownBlock value={timeLeft.minutes} unit="Minutes" />
          <span className="font-serif text-xl sm:text-3xl text-[var(--colorSecondary)]/40 mb-3 sm:mb-5">:</span>
          <CountdownBlock value={timeLeft.seconds} unit="Seconds" />
        </div>
      )}
    </section>
  );
}
