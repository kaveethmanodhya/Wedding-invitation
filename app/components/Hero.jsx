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


        {/* Ornate Arch Outline */}
        <div style={{
          position: 'absolute',
          inset: '16px',
          border: '2px solid var(--colorPrimary)',
          borderRadius: '350px 350px 0 0',
          pointerEvents: 'none',
          boxShadow: 'inset 0 0 20px var(--colorPrimary)',
          opacity: 0.8,
          zIndex: 1
        }}>
          {/* Inner border */}
          <div style={{ position: 'absolute', inset: '6px', border: '1px solid var(--colorPrimary)', opacity: 0.5, borderRadius: '344px 344px 0 0' }} />
        </div>

        {/* Top floral decoration placeholder */}
        <div className="absolute top-0 left-0 right-0 h-32 opacity-20 pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle at top, var(--colorPrimary) 0%, transparent 70%)' }} />

        {/* Content Box */}
        <div className="relative z-20 flex flex-col items-center pt-[15vh] px-8 pb-32 text-center h-full">
          
          <div className="flex flex-col items-center pt-8 pb-4 px-6 rounded-[100px_100px_20px_20px] mb-6 relative shadow-xl overflow-hidden w-11/12 max-w-[300px]">
            {/* Glass Background layer */}
            <div className="absolute inset-0 opacity-85 backdrop-blur-md" style={{ backgroundColor: 'var(--colorBg)' }} />
            <div className="absolute inset-0 opacity-40 border-[1.5px] rounded-[100px_100px_20px_20px]" style={{ borderColor: 'var(--colorPrimary)' }} />
            <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-white/30 to-transparent" />
            
            <div className="relative z-10 text-center">
              <p className="font-script text-3xl md:text-5xl mb-3" style={{ color: 'var(--colorTextDark)' }}>
                Wedding Invitation
              </p>
              <p className="font-sans text-[0.65rem] md:text-xs tracking-widest uppercase leading-relaxed max-w-[280px] mx-auto" style={{ color: 'var(--colorTextDark)' }}>
                You Are Cordially Invited To<br />
                Celebrate the marriage of
              </p>
            </div>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl my-4 tracking-widest drop-shadow-sm" style={{ color: 'var(--colorPrimary)' }}>
            {(couple?.groom?.firstName || 'Groom').toUpperCase()}
          </h1>
          <span className="font-sans text-[0.6rem] uppercase tracking-[0.3em] my-1" style={{ color: 'var(--colorTextDark)', opacity: 0.6 }}>With</span>
          <h1 className="font-serif text-4xl md:text-5xl my-4 tracking-widest drop-shadow-sm" style={{ color: 'var(--colorPrimary)' }}>
            {(couple?.bride?.firstName || 'Bride').toUpperCase()}
          </h1>

          <div style={{ width: '80px', height: '1.5px', background: 'var(--colorPrimary)', margin: '24px 0', opacity: 0.8 }} />

          <p className="font-sans text-xs tracking-wider" style={{ color: 'var(--colorTextDark)' }}>
            {dayLabel ? dayLabel + ', ' : ''} {wedding?.displayDate}
          </p>
          {ceremony?.time && (
            <p className="font-sans text-xs tracking-wider mt-1" style={{ color: 'var(--colorTextDark)' }}>
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
      style={{
        backgroundColor: 'var(--colorBg)',
        paddingTop: 'clamp(80px, 12vw, 120px)',
        paddingBottom: 'clamp(48px, 8vw, 80px)',
        paddingLeft: '16px',
        paddingRight: '16px',
        ...(config.sectionBackgrounds?.hero ? {
          backgroundImage: `url(${config.sectionBackgrounds.hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        } : {})
      }}
    >
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at 50% 50%, var(--colorPrimary) 0%, transparent 60%)', opacity: 0.03 }} />
      <div className="relative z-10 w-full flex justify-center">
        {layout === 3 ? <Layout3 config={config} /> : layout === 2 ? <Layout2 config={config} /> : <Layout1 config={config} />}
      </div>
    </section>
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
