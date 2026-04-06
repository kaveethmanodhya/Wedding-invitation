'use client';
import { motion } from 'framer-motion';

function numericDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d)) return '';
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}.${dd}.${yy}`;
}

function dayName(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

const ScrollCue = () => (
  <a
    href="#story"
    aria-label="Scroll"
    className="flex flex-col items-center gap-1 mt-8 mx-auto w-fit"
    style={{ opacity: 0.5, color: 'var(--colorTextDark)' }}
  >
    <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
      Scroll
    </span>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  </a>
);

/* ─────────────────────────────────────────────────────────
   LAYOUT 1 — Rectangular Ornate Frame
───────────────────────────────────────────────────────── */
function Layout1({ config }) {
  const { couple = {}, wedding = {}, events = {}, heroImage } = config;
  const ceremony = events?.ceremony || {};
  const dayLabel = dayName(wedding?.dateTimeISO);

  return (
    <div className="flex flex-col items-center w-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: 'clamp(320px, 90vw, 540px)',
          minHeight: 'clamp(600px, 80vh, 850px)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.15)',
          backgroundColor: 'var(--colorBg)',
          position: 'relative',
          overflow: 'hidden',
          padding: '16px',
        }}
      >
        {/* Double Rectangular Border */}
        <div style={{ position: 'absolute', inset: '16px', border: '2px solid var(--colorPrimary)', pointerEvents: 'none', zIndex: 10 }} />
        <div style={{ position: 'absolute', inset: '22px', border: '1px solid var(--colorPrimary)', opacity: 0.5, pointerEvents: 'none', zIndex: 10 }} />

        {/* Hero BG Image Area - Top Half */}
        <div style={{ position: 'absolute', top: '24px', left: '24px', right: '24px', height: '45%' }}>
          <img src={heroImage || '/images/hero.png'} alt="Hero Background" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: 0.8 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--colorBg) 95%)' }} />
        </div>

        {/* Content Box */}
        <div className="relative z-20 flex flex-col items-center justify-end pt-[50%] h-full text-center px-8 pb-16">
          <p style={{ ...eyebrow, marginBottom: '24px' }}>Wedding Celebration</p>

          <h1 className="font-serif tracking-widest leading-tight" style={{ fontSize: 'clamp(32px, 8vw, 42px)', color: 'var(--colorTextDark)' }}>
            {(couple?.groom?.firstName || 'Groom').toUpperCase()}
          </h1>
          <span className="font-script my-2" style={{ fontSize: '32px', color: 'var(--colorPrimary)' }}>&</span>
          <h1 className="font-serif tracking-widest leading-tight" style={{ fontSize: 'clamp(32px, 8vw, 42px)', color: 'var(--colorTextDark)' }}>
            {(couple?.bride?.firstName || 'Bride').toUpperCase()}
          </h1>

          <div style={{ width: '60px', height: '1.5px', background: 'var(--colorPrimary)', margin: '32px 0', opacity: 0.8 }} />

          <p style={detail}>{dayLabel ? dayLabel + ', ' : ''} {wedding?.displayDate}</p>
          {ceremony?.time && <p style={{ ...detail, marginTop: '4px' }}>{ceremony.time}</p>}

          {ceremony?.venueName && (
            <>
              <p className="font-script mt-6" style={{ fontSize: '20px', color: 'var(--colorPrimary)' }}>Venue</p>
              <p style={{ ...detail, marginTop: '4px' }}>{ceremony?.venueName}</p>
            </>
          )}

        </div>
      </motion.div>
      <ScrollCue />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LAYOUT 2 — Oval Ornate Frame inside Card
───────────────────────────────────────────────────────── */
function Layout2({ config }) {
  const { couple = {}, wedding = {}, events = {}, heroImage } = config;
  const ceremony = events?.ceremony || {};
  const dayLabel = dayName(wedding?.dateTimeISO);

  return (
    <div className="flex flex-col items-center w-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: 'clamp(320px, 90vw, 540px)',
          minHeight: 'clamp(600px, 80vh, 850px)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.15)',
          backgroundColor: 'var(--colorBg)',
          position: 'relative',
          overflow: 'hidden',
          padding: '24px',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: heroImage ? 'flex-start' : 'center',
        }}
      >
        {/* Floating Oval Window */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', bottom: '16px', border: '1px solid var(--colorPrimary)', opacity: 0.4, borderRadius: '50% 50% / 10% 10%', pointerEvents: 'none' }} />

        {heroImage && heroImage.trim() !== "" && (
          <div style={{
            margin: '0 auto 24px', width: 'clamp(200px, 60vw, 300px)', height: 'clamp(280px, 80vw, 400px)',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid var(--colorPrimary)',
            padding: '4px',
            position: 'relative'
          }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
              <img src={heroImage} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 w-full">
          <p className="font-script text-[var(--colorPrimary)] mb-2" style={{ fontSize: 'clamp(28px, 6vw, 40px)' }}>We Are Getting Married</p>

          <h1 className="font-serif" style={{ fontSize: 'clamp(24px, 5vw, 32px)', color: 'var(--colorTextDark)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            {couple?.groom?.firstName || 'Groom'}
          </h1>
          <div style={{ height: '40px', width: '1px', background: 'var(--colorSecondary)', margin: '12px 0' }} />
          <h1 className="font-serif" style={{ fontSize: 'clamp(24px, 5vw, 32px)', color: 'var(--colorTextDark)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            {couple?.bride?.firstName || 'Bride'}
          </h1>

          <div className="flex gap-4 mt-8 items-center text-[var(--colorTextDark)] opacity-80 uppercase tracking-widest font-sans text-xs">
            <span>{dayLabel}</span>
            <span className="w-1.5 h-1.5 bg-[var(--colorPrimary)] rounded-full" />
            <span>{wedding?.displayDate}</span>
          </div>

          {ceremony?.venueName && (
            <p className="font-sans text-[0.65rem] tracking-widest uppercase mt-4 text-[var(--colorTextDark)]/70 max-w-[200px]">
              {ceremony?.venueName}
            </p>
          )}

        </div>
      </motion.div>
      <ScrollCue />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LAYOUT 3 — Royal Arch & Peacocks (Indian Style)
───────────────────────────────────────────────────────── */
function Layout3({ config }) {
  const { couple = {}, wedding = {}, events = {}, heroImage } = config;
  const ceremony = events?.ceremony || {};
  const dayLabel = dayName(wedding?.dateTimeISO);

  return (
    <div className="flex flex-col items-center w-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: 'clamp(320px, 90vw, 540px)',
          minHeight: 'clamp(600px, 80vh, 850px)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
          background: 'var(--colorBg)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
        }}
      >
        {/* Full Image Background wrapped by Arch */}
        {heroImage && (
          <div className="absolute inset-x-0 top-0 h-[60%] pointer-events-none z-0">
            <img src={heroImage} className="w-full h-full object-cover object-top" style={{ opacity: 0.8 }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, var(--colorBg) 95%)' }} />
          </div>
        )}


        {/* Content Box */}
        <div className="relative z-20 flex flex-col items-center justify-center pt-[20vh] px-8 pb-32 text-center h-full">
          
          <h1 className="font-serif text-5xl md:text-6xl my-4 tracking-widest drop-shadow-sm" style={{ color: 'var(--colorPrimary)' }}>
            {(couple?.groom?.firstName || 'Groom').toUpperCase()}
          </h1>
          <span className="font-sans text-[0.6rem] uppercase tracking-[0.3em] my-1" style={{ color: 'var(--colorTextDark)', opacity: 0.6 }}>With</span>
          <h1 className="font-serif text-5xl md:text-6xl my-4 tracking-widest drop-shadow-sm" style={{ color: 'var(--colorPrimary)' }}>
            {(couple?.bride?.firstName || 'Bride').toUpperCase()}
          </h1>

          <div style={{ width: '80px', height: '1.5px', background: 'var(--colorPrimary)', margin: '32px 0', opacity: 0.8 }} />

          <p className="font-sans text-xs tracking-wider uppercase opacity-80" style={{ color: 'var(--colorTextDark)' }}>
            {dayLabel ? dayLabel + ', ' : ''} {wedding?.displayDate}
          </p>
          {ceremony?.time && (
            <p className="font-sans text-xs tracking-wider mt-1 uppercase opacity-80" style={{ color: 'var(--colorTextDark)' }}>
              Time {ceremony.time}
            </p>
          )}

          <div style={{ width: '40px', height: '1px', background: 'var(--colorPrimary)', margin: '16px 0', opacity: 0.5 }} />

          <p className="font-script text-2xl mb-1" style={{ color: 'var(--colorSecondary)' }}>Venue</p>
          <p className="font-sans text-[0.65rem] tracking-widest uppercase leading-snug max-w-[200px]" style={{ color: 'var(--colorTextDark)', opacity: 0.8 }}>
            {ceremony?.venueName}<br />
            {ceremony?.address}
          </p>
        </div>

        {/* Decorative Peacocks */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8 pointer-events-none opacity-60 z-10">
          <span className="text-4xl filter saturate-50 drop-shadow-lg" style={{ color: 'var(--colorPrimary)' }}>🦚</span>
          <span className="text-4xl filter saturate-50 drop-shadow-lg" style={{ transform: 'scaleX(-1)', color: 'var(--colorPrimary)' }}>🦚</span>
        </div>
      </motion.div>
      <ScrollCue />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main export — reads heroLayout from config
───────────────────────────────────────────────────────── */
export default function Hero({ config }) {
  const layout = config?.heroLayout ?? 1;

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500"
      style={{ backgroundColor: 'var(--colorBg)' }}
    >
      {/* ── HERO VIDEO BACKGROUND ── */}
      {config.heroVideo && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-80"
          >
            <source src={config.heroVideo} type="video/mp4" />
          </video>
          {/* Subtle Video Overlay */}
          <div 
            className="absolute inset-0 z-10" 
            style={{ 
              background: `linear-gradient(to bottom, ${config.theme?.heroOverlayStart || 'rgba(0,0,0,0.3)'}, ${config.theme?.heroOverlayEnd || 'rgba(0,0,0,0.1)'})` 
            }} 
          />
        </div>
      )}

      {/* ── BLURRED BACKGROUND LAYER (Fallback or secondary) ── */}
      {config.sectionBackgrounds?.hero && !config.heroVideo && (
        <div 
          className="absolute inset-0 pointer-events-none transition-transform duration-1000 z-0"
          style={{ 
            backgroundImage: `url(${config.sectionBackgrounds.hero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(15px)',
            transform: 'scale(1.05)',
            opacity: 0.6
          }} 
        />
      )}
      {/* Subtle global overlay */}
      <div className="absolute inset-0 bg-black/10 z-[1] pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none z-[1]" style={{ background: 'radial-gradient(circle at 50% 50%, var(--colorPrimary) 0%, transparent 60%)', opacity: 0.03 }} />
      <div className="relative z-10 w-full flex justify-center py-20 px-4">
        {layout === 8 ? <Layout8 config={config} /> : 
         layout === 7 ? <Layout7 config={config} /> : 
         layout === 6 ? <Layout6 config={config} /> : 
         layout === 5 ? <Layout5 config={config} /> : 
         layout === 4 ? <Layout4 config={config} /> : 
         layout === 3 ? <Layout3 config={config} /> : 
         layout === 2 ? <Layout2 config={config} /> : <Layout1 config={config} />}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   LAYOUT 4 — Nature Arch (Premium Design)
   Inspired by a forest garden arch with central couple
───────────────────────────────────────────────────────── */
function Layout4({ config }) {
  const { couple, wedding, events, heroImage, coupleImages } = config;
  const ceremony = events?.ceremony || {};
  const dateObj = new Date(wedding?.dateTimeISO);
  const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayNum = dateObj.getDate();
  const year = dateObj.getFullYear();

  // Primary image from admin "Hero Background Image" field
  const heroBg = heroImage || '/images/nature-arch-bg.png';

  return (
    <div className="flex flex-col items-center w-full max-w-[600px] mx-auto min-h-[85vh] bg-white relative overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.15)] border-[12px] border-white">
      {/* Full Background (Liquid Layer) */}
      <div className="absolute inset-x-0 top-0 bottom-0 z-0">
         <img src={heroBg} className="w-full h-full object-cover object-top transition-transform duration-[20s] animate-pulse-slow" style={{ opacity: 0.15, filter: 'blur(10px) saturate(1.5)' }} />
      </div>

      {/* ── TOP DATE HEADER (Matching image layout) ── */}
      <div className="relative z-20 w-full px-6 pt-10 pb-6 flex items-center justify-between border-b border-black/5">
        <div className="flex-1 text-center font-sans font-bold text-[14px] md:text-[16px] tracking-[0.25em] uppercase text-[#2C2018] opacity-90">
          {dayLabel || 'SUNDAY'}
        </div>
        
        {/* Central Date Box (Liquid Glass Box) */}
        <div className="relative flex flex-col items-center px-10 py-6">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-lg border border-white/60 shadow-sm" />
          <div className="relative z-10 flex flex-col items-center">
            <span className="font-sans font-bold text-[12px] tracking-widest text-[#8A7F6A] mb-1">{month}</span>
            <span className="font-serif text-6xl text-[#2C2018] leading-none mb-1">{dayNum}</span>
            <span className="font-sans text-[11px] tracking-[0.2em] text-[#8A7F6A] font-bold">{year}</span>
          </div>
          {/* Vertical separators match the image style */}
          <div className="absolute -left-0 top-6 bottom-6 w-px bg-black/10" />
          <div className="absolute -right-0 top-6 bottom-6 w-px bg-black/10" />
        </div>

        <div className="flex-1 text-center font-sans font-bold text-[14px] md:text-[16px] tracking-[0.25em] uppercase text-[#2C2018] opacity-90">
          {ceremony?.time ? `AT ${ceremony.time.toUpperCase()}` : 'AT 10:00 AM'}
        </div>
      </div>

      {/* ── MAIN LIQUID GLASS ARCH ── */}
      <div className="relative w-full flex-1 px-4 mt-8 mb-4">
        <div className="relative w-full h-[540px] rounded-t-[180px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.12)] border border-white/40 group">
          
          {/* Internal Shimmer Layer */}
          <div className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-tr from-white/0 via-white/10 to-transparent animate-shimmer" />

          {/* Primary View (Arched Photo) */}
          <div className="absolute inset-0 z-10 transition-transform duration-700 group-hover:scale-105">
            <img src={heroBg} className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
          </div>
        </div>

        {/* Decorative Glass Highlights floating beneath the arch */}
        <div className="absolute -bottom-10 left-10 w-24 h-24 bg-white/40 backdrop-blur-xl rounded-full border border-white/60 -z-10 shadow-lg blur-sm" />
        <div className="absolute -top-10 right-10 w-32 h-32 bg-white/20 backdrop-blur-2xl rounded-full border border-white/40 -z-10 animate-float" />
      </div>

      {/* ── FOOTER NAMES & BRANDING ── */}
      <div className="relative z-40 text-center flex flex-col items-center py-8 bg-white w-full">
        <h2 className="font-serif text-3xl md:text-5xl text-[#2C2018] tracking-[0.2em] uppercase mb-4 font-medium transition-all duration-500 group-hover:tracking-[0.25em]">
          {couple?.groom?.firstName} & {couple?.bride?.firstName}
        </h2>

        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-8 bg-[#8A7F6A]/30" />
          <span className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#8A7F6A] font-bold">The Celebration Of</span>
          <div className="h-px w-8 bg-[#8A7F6A]/30" />
        </div>

        <p className="font-serif text-sm md:text-base text-[#2C2018]/80 italic opacity-70">
          Together with their families invite you to their wedding
        </p>
      </div>

      {/* Extra Liquid Corner Flair */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[var(--colorPrimary)]/5 to-transparent opacity-30 pointer-events-none" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LAYOUT 5 — Modern Minimalist High-Contrast
───────────────────────────────────────────────────────── */
function Layout5({ config }) {
  const { couple = {}, wedding = {}, heroImage } = config;
  const year = wedding?.dateTimeISO ? new Date(wedding.dateTimeISO).getFullYear() : '';

  return (
    <div className="flex flex-col items-center w-full px-6 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "circOut" }}
        className="relative mb-12"
      >
        <div className="w-1 h-32 bg-[var(--colorPrimary)] mx-auto mb-8 opacity-40" />
        <h1 className="font-serif text-[clamp(64px,15vw,120px)] leading-[0.8] tracking-tighter text-[var(--colorTextDark)] mb-4">
          {couple?.groom?.firstName?.[0]}<span className="text-[var(--colorPrimary)]">&</span>{couple?.bride?.firstName?.[0]}
        </h1>
        <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-[var(--colorTextDark)] opacity-60">
          The Wedding of {couple?.groom?.firstName} & {couple?.bride?.firstName}
        </p>
      </motion.div>

      <div className="flex flex-col items-center gap-4">
        <p className="font-serif text-3xl italic text-[var(--colorTextDark)]">{wedding?.displayDate}</p>
        <div className="h-px w-12 bg-[var(--colorPrimary)]" />
        <p className="font-sans text-xs tracking-[0.3em] uppercase opacity-70">{year} • SAVE THE DATE</p>
      </div>

      {heroImage && (
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-16 w-full max-w-sm aspect-[4/5] rounded-full overflow-hidden border border-[var(--colorPrimary)]/20 p-4"
        >
          <img src={heroImage} className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-1000" />
        </motion.div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LAYOUT 6 — Watercolor Floral (Garden Theme)
───────────────────────────────────────────────────────── */
function Layout6({ config }) {
  const { couple = {}, wedding = {}, heroImage } = config;

  return (
    <div className="flex flex-col items-center w-full min-h-[80vh] justify-center px-8 relative">
      {/* Decorative Floral background blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--colorPrimary)]/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[var(--colorSecondary)]/5 rounded-full blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="text-4xl mb-4 block">🌸</span>
        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[var(--colorTextDark)]/60 mb-6 font-bold">You are cordially invited</p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8">
          <h1 className="font-script text-6xl md:text-8xl text-[var(--colorPrimary)]">{couple?.groom?.firstName}</h1>
          <span className="font-serif text-2xl text-[var(--colorSecondary)]/50 italic">and</span>
          <h1 className="font-script text-6xl md:text-8xl text-[var(--colorPrimary)]">{couple?.bride?.firstName}</h1>
        </div>

        <div className="relative inline-block px-12 py-6 border border-[var(--colorPrimary)]/10 rounded-[40px_10px_40px_10px]">
          <p className="font-serif text-2xl md:text-3xl text-[var(--colorTextDark)]">{wedding?.displayDate}</p>
          <div className="absolute -top-3 -left-3 text-2xl">🍃</div>
          <div className="absolute -bottom-3 -right-3 text-2xl">🌿</div>
        </div>
      </motion.div>

      {heroImage && (
        <div className="mt-12 w-full max-w-md aspect-video rounded-3xl overflow-hidden shadow-2xl relative">
          <img src={heroImage} className="w-full h-full object-cover" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/20" />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LAYOUT 7 — Retro Polaroid / Scrapbook
───────────────────────────────────────────────────────── */
function Layout7({ config }) {
  const { couple = {}, wedding = {}, heroImage } = config;

  return (
    <div className="flex flex-col items-center w-full py-16 px-6">
      <motion.div
        initial={{ rotate: -3, opacity: 0, scale: 0.9 }}
        animate={{ rotate: -2, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-6 pb-20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 max-w-sm w-full relative z-10"
      >
        <div className="aspect-square bg-slate-100 overflow-hidden mb-6">
          <img src={heroImage || '/images/hero.png'} className="w-full h-full object-cover sepia-[0.3]" />
        </div>
        <div className="text-center">
          <h1 className="font-script text-4xl text-slate-800 mb-2">Our Wedding Day</h1>
          <p className="font-sans text-xs tracking-widest uppercase text-slate-400">{wedding?.displayDate}</p>
        </div>
        {/* Tape effect */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/40 backdrop-blur-sm border border-white/20 rotate-1 shadow-sm mix-blend-overlay" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center"
      >
        <h2 className="font-serif text-4xl text-[var(--colorPrimary)] mb-4">
          {couple?.groom?.firstName} <span className="text-2xl font-script">&</span> {couple?.bride?.firstName}
        </h2>
        <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[var(--colorTextDark)]/60">
          Capture these moments with us
        </p>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LAYOUT 8 — Sinhala Traditional (Sri Lankan style)
───────────────────────────────────────────────────────── */
function Layout8({ config }) {
  const { couple = {}, wedding = {}, events = {}, heroImage } = config;
  const ceremony = events?.ceremony || {};

  return (
    <div className="flex flex-col items-center w-full min-h-[85vh] relative overflow-hidden bg-[var(--colorBg)] px-6">
      {/* Traditional Bo Leaf pattern hints in background */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="var(--colorPrimary)">
          <path d="M100,20 C100,20 160,80 160,120 C160,160 130,180 100,180 C70,180 40,160 40,120 C40,80 100,20 100,20 Z" />
        </svg>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-xl bg-white/50 backdrop-blur-md rounded-[40px] border-4 border-double border-[var(--colorPrimary)] p-8 md:p-12 text-center my-12 shadow-2xl"
      >
        {/* Traditional Symbol */}
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-[var(--colorPrimary)] flex items-center justify-center">
            <span className="text-2xl text-[var(--colorPrimary)]">🪔</span>
          </div>
        </div>

        <p className="font-sinhala text-lg md:text-xl text-[var(--colorTextDark)] mb-6 leading-relaxed">
          ශුභ මංගලම් <br />
          <span className="text-sm opacity-60">Subha Mangalam</span>
        </p>

        <h1 className="font-sinhala text-3xl md:text-6xl text-[var(--colorPrimary)] mb-4 tracking-tight">
          {couple?.groom?.firstName} සහ {couple?.bride?.firstName}
        </h1>

        <div className="flex items-center justify-center gap-4 my-8">
          <div className="h-px flex-1 bg-[var(--colorPrimary)]/30" />
          <div className="w-3 h-3 rotate-45 bg-[var(--colorPrimary)]" />
          <div className="h-px flex-1 bg-[var(--colorPrimary)]/30" />
        </div>

        <div className="space-y-4">
          <p className="font-sinhala text-2xl text-[var(--colorTextDark)]">
            {wedding?.displayDate}
          </p>
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase opacity-50 mb-4">Wedding Celebration</p>
          
          {ceremony?.venueName && (
            <div className="bg-[var(--colorPrimary)]/5 p-4 rounded-2xl inline-block w-full max-w-xs">
              <p className="font-sinhala text-sm text-[var(--colorTextDark)]/80 mb-1 font-bold">පින්බර උත්සව අවස්ථාව</p>
              <p className="font-sans text-xs font-bold uppercase">{ceremony?.venueName}</p>
            </div>
          )}
        </div>

        <div className="mt-12 text-[var(--colorPrimary)] opacity-40 text-3xl">✾</div>
      </motion.div>

      {heroImage && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="w-full h-64 md:h-96 -mt-32 relative z-0"
        >
          <img src={heroImage} className="w-full h-full object-cover" style={{ maskImage: 'linear-gradient(to top, transparent, black)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--colorBg)] to-transparent" />
        </motion.div>
      )}
    </div>
  );
}

/* ── Shared style constants ── */
const eyebrow = {
  fontFamily: 'var(--font-sans, sans-serif)',
  fontSize: '10px',
  letterSpacing: '0.24em',
  color: 'var(--colorPrimary)',
  textTransform: 'uppercase',
  fontWeight: 400,
  opacity: 0.9,
};

const divider = {
  width: '44px',
  height: '1px',
  background: 'var(--colorSecondary)',
  margin: '0 auto 16px',
};

const detail = {
  fontFamily: 'var(--font-sans, sans-serif)',
  fontSize: 'clamp(9px, 1.8vw, 11px)',
  letterSpacing: '0.2em',
  color: 'var(--colorTextDark)',
  textTransform: 'uppercase',
  fontWeight: 400,
  opacity: 0.8,
};
