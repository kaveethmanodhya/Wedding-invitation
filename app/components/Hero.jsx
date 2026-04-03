'use client';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────
   Shared helpers
───────────────────────────────────────────────────────── */
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
    style={{ opacity: 0.3, color: 'var(--colorTextDark)' }}
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
   LAYOUT 1 — "forever" script overlay card
   (portrait card, photo top half, script straddles, details below)
───────────────────────────────────────────────────────── */
function Layout1({ config }) {
  const { couple, wedding, events, heroImage } = config;
  const ceremony = events?.ceremony || {};

  /* The photo height as a CSS string — used in both the clipped container and the absolute overlay positioning */
  const photoH = 'clamp(280px, 55vw, 520px)';

  return (
    <div className="flex flex-col items-center w-full">
      <motion.div
        className="glass-panel"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: 'clamp(320px, 90vw, 640px)',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        {/* Photo — clipped */}
        <div style={{ height: photoH, overflow: 'hidden', lineHeight: 0 }}>
          <img
            src={heroImage || '/images/hero.png'}
            alt={couple?.displayNames || 'Wedding Photo'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              filter: 'grayscale(45%) brightness(1.05) contrast(0.95) saturate(0.75)',
              display: 'block',
            }}
          />
        </div>

        {/* "forever" — straddles photo/text boundary */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `calc(${photoH} * 0.60)`,
            zIndex: 20,
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span
            className="font-script"
            style={{
              fontSize: 'clamp(80px, 20vw, 148px)',
              lineHeight: 1,
              color: '#ffffff',
              textShadow: '0 2px 30px rgba(0,0,0,0.07)',
              letterSpacing: '-0.01em',
              userSelect: 'none',
              display: 'block',
            }}
          >
            forever
          </span>
        </div>

        {/* Text section */}
        <div
          className="text-center"
          style={{
            paddingTop: 'clamp(48px, 11vw, 80px)',
            paddingBottom: '36px',
            paddingLeft: '28px',
            paddingRight: '28px',
          }}
        >
          <p style={{ ...eyebrow, color: 'var(--colorPrimary)' }}>With Love</p>
          <h1 style={names}>{couple?.displayNames || 'Kaveeth & Pramudi'}</h1>
          <div style={divider} />
          <p style={detail}>Invite You to Their Wedding</p>
          <p style={detail}>{wedding?.displayDate}{ceremony?.time ? ` at ${ceremony.time}` : ''}</p>
          <p style={{ ...detail, marginBottom: '16px' }}>
            {[ceremony?.venueName, ceremony?.address].filter(Boolean).join(', ')}
          </p>
          <p style={reception}>reception to follow ceremony</p>
        </div>
      </motion.div>
      <ScrollCue />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LAYOUT 2 — Names-on-photo, big numeric date card
   (full-bleed photo fading to white, names on photo, large date below)
───────────────────────────────────────────────────────── */
function Layout2({ config }) {
  const { couple, wedding, events, heroImage } = config;
  const ceremony = events?.ceremony || {};
  const bride = couple?.bride?.fullName || couple?.displayNames?.split('&')[1]?.trim() || '';
  const groom = couple?.groom?.fullName || couple?.displayNames?.split('&')[0]?.trim() || '';
  const dateNumeric = numericDate(wedding?.dateTimeISO);
  const dayLabel = dayName(wedding?.dateTimeISO);

  const pipeDetails = [
    ceremony?.time,
    ceremony?.venueName ? `${ceremony.venueName}${ceremony?.address ? ', ' + ceremony.address : ''}` : null,
    'Reception to follow',
  ].filter(Boolean).join(' | ');

  return (
    <div className="flex flex-col items-center w-full">
      <motion.div
        className="glass-panel"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: 'clamp(320px, 90vw, 640px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Photo with gradient fade at bottom */}
        <div style={{ position: 'relative', lineHeight: 0 }}>
          <img
            src={heroImage || '/images/hero.png'}
            alt={couple?.displayNames || 'Wedding Photo'}
            style={{
              width: '100%',
              height: 'clamp(300px, 60vw, 540px)',
              objectFit: 'cover',
              objectPosition: 'center top',
              filter: 'grayscale(55%) brightness(1.0) contrast(0.92) saturate(0.6)',
              display: 'block',
            }}
          />
          {/* Gradient fade from photo into white */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '45%',
              background: 'linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--colorBg) 40%, transparent) 60%, color-mix(in srgb, var(--colorBg) 90%, transparent) 100%)',
              pointerEvents: 'none',
            }}
          />
          {/* Names overlaid on photo — upper area */}
          <div
            style={{
              position: 'absolute',
              top: 'clamp(20px, 5vw, 40px)',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'clamp(12px, 3vw, 24px)',
              padding: '0 24px',
              pointerEvents: 'none',
            }}
          >
            <span style={photoName}>{groom}</span>
            <span style={{ color: '#fff', fontSize: 'clamp(12px, 2.5vw, 18px)', fontFamily: 'var(--font-serif)', opacity: 0.9 }}>&amp;</span>
            <span style={photoName}>{bride}</span>
          </div>
        </div>

        {/* Text section below */}
        <div
          className="text-center"
          style={{ paddingTop: '8px', paddingBottom: '36px', paddingLeft: '28px', paddingRight: '28px' }}
        >
          {/* Invite text */}
          <p style={{ ...detail, fontStyle: 'italic', fontSize: 'clamp(10px, 2vw, 12px)', marginBottom: '4px' }}>
            Invite You to
          </p>
          <p style={{ ...detail, fontStyle: 'italic', fontSize: 'clamp(10px, 2vw, 12px)', marginBottom: '20px' }}>
            Celebrate Their Marriage
          </p>

          {/* Day name */}
          {dayLabel && (
            <p style={{ ...eyebrow, marginBottom: '4px' }}>{dayLabel}</p>
          )}

          {/* Big numeric date */}
          <p
            className="font-serif"
            style={{
              fontSize: 'clamp(36px, 10vw, 72px)',
              fontWeight: 400,
              color: '#ffffff',
              letterSpacing: '0.04em',
              lineHeight: 1,
              marginBottom: '20px',
            }}
          >
            {dateNumeric || wedding?.displayDate}
          </p>

          {/* Thin rule */}
          <div style={{ ...divider, marginBottom: '16px' }} />

          {/* Pipe-separated details */}
          <p
            className="font-serif"
            style={{
              fontSize: 'clamp(9px, 1.8vw, 11px)',
              fontStyle: 'italic',
              color: '#ffffff',
              opacity: 0.8,
              letterSpacing: '0.04em',
              lineHeight: 1.7,
            }}
          >
            {pipeDetails}
          </p>
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
      className="min-h-screen flex flex-col items-center justify-center relative z-10"
      style={{
        backgroundColor: 'transparent',
        paddingTop: 'clamp(80px, 12vw, 120px)',
        paddingBottom: 'clamp(48px, 8vw, 80px)',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
    >
      {layout === 2 ? <Layout2 config={config} /> : <Layout1 config={config} />}
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
  marginBottom: '10px',
  fontWeight: 400,
  opacity: 0.8,
};

const names = {
  fontFamily: 'var(--font-sans, sans-serif)',
  fontSize: 'clamp(12px, 2.8vw, 17px)',
  letterSpacing: '0.2em',
  fontWeight: 700,
  color: '#ffffff',
  textTransform: 'uppercase',
  marginBottom: '14px',
  lineHeight: 1.35,
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
  color: '#ffffff',
  textTransform: 'uppercase',
  marginBottom: '8px',
  fontWeight: 400,
  opacity: 0.7,
};

const reception = {
  fontFamily: 'var(--font-serif, serif)',
  fontSize: '11px',
  letterSpacing: '0.05em',
  color: '#ffffff',
  fontStyle: 'italic',
  fontWeight: 400,
  opacity: 0.5,
};

const photoName = {
  fontFamily: 'var(--font-sans, sans-serif)',
  fontSize: 'clamp(11px, 2.5vw, 16px)',
  letterSpacing: '0.2em',
  fontWeight: 700,
  textTransform: 'uppercase',
  color: '#ffffff',
  textShadow: '0 1px 12px rgba(0,0,0,0.5)',
};
