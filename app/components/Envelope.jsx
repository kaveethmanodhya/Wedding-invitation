'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Envelope({ config, onOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => onOpen(), 1000); // reduced from 1200
  };

  /* ── Responsive values ── */
  const cardAspect   = isDesktop ? '16 / 9'  : '3 / 4.2';
  const cardMaxWidth = isDesktop ? 'min(860px, calc(100vw - 64px))' : 'min(440px, calc(100vw - 32px))';
  const nameFontSize = isDesktop ? 'clamp(28px, 4.5vw, 52px)' : 'clamp(32px, 8.5vw, 56px)';
  const labelSize   = isDesktop ? 'clamp(8px, 1vw, 11px)' : 'clamp(8px, 1.8vw, 11px)';

  /*
   * Ribbon mask — adaptive for mobile/desktop. 
   * Mobile uses the tight mask that was confirmed "OK".
   * Desktop reverts to the stable version requested by the user.
   */
  const ribbonMask = isDesktop
    ? [
        'linear-gradient(to bottom,',
        '  black         0%,',
        '  black         8%,',
        '  rgba(0,0,0,0) 12%,',
        '  rgba(0,0,0,0) 28%,',
        '  rgba(0,0,0,0.1) 30%,',
        '  rgba(0,0,0,0.5) 31%,',
        '  black         32%',
        ')',
      ].join('')
    : [
        'linear-gradient(to bottom,',
        '  black         0%,',
        '  black         3%,',
        '  rgba(0,0,0,0) 6%,',
        '  rgba(0,0,0,0) 24%,',
        '  black         28%',
        ')',
      ].join('');

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -80, transition: { duration: 0.8, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: 'var(--colorBg)', padding: isDesktop ? '32px' : '16px' }}
        >
          {/* ════════════════════════════════════════════════════════
                The Letter / Gift Card
                overflow:hidden ensures ribbons are clipped to card
          ════════════════════════════════════════════════════════ */}
          <div
            className="relative flex flex-col items-center justify-between text-center"
            style={{
              width: '100%',
              maxWidth: cardMaxWidth,
              aspectRatio: cardAspect,
              backgroundColor: 'var(--colorSurface)',
              boxShadow: '0 24px 70px rgba(0,0,0,0.14), 0 6px 20px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.05)',
              overflow: 'hidden',
              padding: isDesktop ? '3.5% 6%' : '10% 8%', // Reverted desktop padding
            }}
          >
            {/* Paper texture */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`,
                opacity: 0.04,
              }}
            />

            {/* Corner brackets */}
            {[
              'top-3 left-3 border-t border-l',
              'top-3 right-3 border-t border-r',
              'bottom-3 left-3 border-b border-l',
              'bottom-3 right-3 border-b border-r',
            ].map((cls, i) => (
              <div
                key={i}
                className={`absolute w-8 h-8 ${cls}`}
                style={{ borderColor: 'var(--colorPrimary)', opacity: 0.3 }}
              />
            ))}

            {/* ── VERTICAL RIBBON — masked in the text zone, smooth fade-in below ── */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: 0, bottom: 0,
                left: '50%', transform: 'translateX(-50%)',
                width: '44px',
                backgroundColor: 'var(--colorPrimary)',
                opacity: 0.88,
                zIndex: 1,
                maskImage: ribbonMask,
                WebkitMaskImage: ribbonMask,
              }}
            />
            {/* Vertical shimmer line — same mask so it also cuts */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: 0, bottom: 0,
                left: '50%', transform: 'translateX(-50%)',
                width: '2px',
                backgroundColor: 'rgba(255,255,255,0.22)',
                zIndex: 2,
                maskImage: ribbonMask,
                WebkitMaskImage: ribbonMask,
              }}
            />

            {/* ── HORIZONTAL RIBBON — full width, no masking needed (below text area) ── */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: 0, right: 0,
                top: '58%', transform: 'translateY(-50%)',
                height: '44px',
                backgroundColor: 'var(--colorPrimary)',
                opacity: 0.88,
                zIndex: 1,
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                left: 0, right: 0,
                top: '58%', transform: 'translateY(-50%)',
                height: '2px',
                backgroundColor: 'rgba(255,255,255,0.22)',
                zIndex: 2,
              }}
            />

            {/* ═══════════════════════════════════════════════════
                TOP — Title + Names (ABOVE ribbon zone, z-10)
            ═══════════════════════════════════════════════════ */}
            <div
              className="relative flex flex-col items-center"
              style={{ zIndex: 10, paddingTop: '0%' }}
            >
              {/* "A Wedding Invitation" */}
              <p
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: labelSize,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'var(--colorPrimary)',
                  marginBottom: isDesktop ? '3%' : '5%',
                  fontWeight: 600,
                  // Replaced motion with standard fade-in if JS is slow
                  opacity: mounted ? 1 : 1, 
                }}
              >
                {config.envelope?.title || 'A Wedding Invitation'}
              </p>

              {/* Couple Names — large bold script */}
              <h1
                style={{
                  fontFamily: 'var(--font-script, cursive)',
                  fontSize: nameFontSize,
                  lineHeight: 1.15,
                  color: 'var(--colorTextDark)',
                  fontWeight: 700,
                  textShadow: '0 2px 14px rgba(0,0,0,0.10)',
                  marginBottom: isDesktop ? '2%' : '3%',
                  wordBreak: 'break-word',
                  opacity: 1,
                }}
              >
                {config.envelope?.subtitle || config.couple.displayNames}
              </h1>
            </div>

            {/* ═══════════════════════════════════════════════════
                MIDDLE — Wax Seal at ribbon intersection (z-20)
            ═══════════════════════════════════════════════════ */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute flex items-center justify-center group outline-none"
              style={{
                zIndex: 200,
                left: '50%',
                top: '58%',
                x: '-50%',
                y: '-50%',
                width: '120px',
                height: '120px',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer'
              }}
              onClick={handleOpen}
            >
              {/*
                White glow — REDUCED radius (scale 1.15 instead of 1.6)
                and uses a tighter radial gradient that disappears quickly
              */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.98) 42%, rgba(255,255,255,0.6) 58%, transparent 72%)',
                  transform: 'scale(1.15)',
                  zIndex: -1,
                }}
              />

              {/* Seal disc */}
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundColor: 'var(--colorPrimary)',
                  border: '4px solid var(--colorSecondary)',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-serif, serif)',
                    fontSize: '9px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#fff',
                    textAlign: 'center',
                    padding: '0 8px',
                    lineHeight: 1.6,
                  }}
                >
                  {(config.envelope?.buttonText || 'Open Invitation').replace(' ', '\n')}
                </span>
              </div>
            </motion.button>

            {/* ═══════════════════════════════════════════════════
                BOTTOM — Click to reveal (z-10)
            ═══════════════════════════════════════════════════ */}
            <div
              className="relative flex flex-col items-center cursor-pointer"
              style={{ zIndex: 10, paddingBottom: isDesktop ? '6%' : '24%' }}
              onClick={handleOpen}
            >
              <svg
                width="16" height="10" viewBox="0 0 16 10" fill="none"
                style={{ marginBottom: '8px', opacity: 0.4 }}
              >
                <path d="M1 9L8 2L15 9" stroke="var(--colorPrimary)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: labelSize,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--colorTextDark)',
                  opacity: 0.7,
                  fontWeight: 500,
                }}
              >
                Click to reveal the message
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
