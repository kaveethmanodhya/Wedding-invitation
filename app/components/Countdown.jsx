'use client';
import { useState, useEffect, useRef } from 'react';

function CountdownBlock({ value, unit, isLayout9 }) {
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
    <div className={`flex flex-col items-center backdrop-blur-md transition-all duration-300
      rounded-2xl px-1.5 py-4 sm:px-6 sm:py-6 min-w-[62px] sm:min-w-[110px]
      ${isLayout9 ? 'bg-white/5 border border-white/10 shadow-inner' : 'bg-white/5 border border-[var(--colorSecondary)]/20'}`}
    >
      <span
        ref={ref}
        className={`font-sans font-black leading-none text-3xl sm:text-5xl tracking-tighter
          ${isLayout9 ? 'text-white' : 'text-[var(--colorSecondary)]'} ${flip ? 'flip' : ''}`}
      >
        {formatted}
      </span>
      <span className={`font-sans text-[0.5rem] sm:text-[0.6rem] tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-2
        ${isLayout9 ? 'text-white/40' : 'text-[var(--colorTextLight)]/40'}`}
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

  const layout = config?.heroLayout ?? 1;
  const isLayout9 = layout === 9;

  // If not mounted, render the section structure with empty blocks
  if (!isMounted) {
    return (
      <section id="countdown" className={`${isLayout9 ? 'bg-slate-900' : 'bg-[var(--colorTextDark)]'} text-[var(--colorTextLight)] py-16 md:py-24 text-center overflow-hidden`}>
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
      className={`${isLayout9 ? 'bg-[#020617] border-y border-white/5 shadow-2xl relative z-10 text-white' : 'bg-[var(--colorTextDark)] text-[var(--colorTextLight)]'} py-16 md:py-24 text-center overflow-hidden`}
    >
      <div className={`font-sans text-[10px] tracking-[0.6em] uppercase font-bold mb-10 ${isLayout9 ? 'text-white/40' : 'text-[var(--colorSecondary)]'}`}>
        Counting down to the big day
      </div>

      {done ? (
        <p className="font-script text-3xl text-[var(--colorSecondary)] px-4">
          🎉 Today is the day! Congratulations! 🎉
        </p>
      ) : timeLeft && (
        <div className="flex justify-center items-center gap-1 sm:gap-5 flex-nowrap px-1 sm:px-4 overflow-hidden">
          <CountdownBlock value={timeLeft.days}    unit="Days" isLayout9={isLayout9} />
          <span className={`font-serif text-xl sm:text-3xl mb-3 sm:mb-5 opacity-20 ${isLayout9 ? 'text-white' : 'text-[var(--colorSecondary)]'}`}>:</span>
          <CountdownBlock value={timeLeft.hours}   unit="Hours" isLayout9={isLayout9} />
          <span className={`font-serif text-xl sm:text-3xl mb-3 sm:mb-5 opacity-20 ${isLayout9 ? 'text-white' : 'text-[var(--colorSecondary)]'}`}>:</span>
          <CountdownBlock value={timeLeft.minutes} unit="Minutes" isLayout9={isLayout9} />
          <span className={`font-serif text-xl sm:text-3xl mb-3 sm:mb-5 opacity-20 ${isLayout9 ? 'text-white' : 'text-[var(--colorSecondary)]'}`}>:</span>
          <CountdownBlock value={timeLeft.seconds} unit="Seconds" isLayout9={isLayout9} />
        </div>
      )}
    </section>
  );
}
