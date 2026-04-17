'use client';
import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope from './components/Envelope';
import CoupleReveal from './components/CoupleReveal';
import CoverReveal from './components/CoverReveal';
import FadeReveal from './components/FadeReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import StorySection from './components/StorySection';
import Gallery from './components/Gallery';
import EventDetails from './components/EventDetails';
import RSVPSection from './components/RSVPSection';
import Timeline from './components/Timeline';
import Footer from './components/Footer';
import PremiumEnvelope from './components/PremiumEnvelope';
import LayoutEight from './components/LayoutEight';
import LayoutTen from './components/LayoutTen';
import RoyalEnvelope from './components/RoyalEnvelope';
import MintEnvelope from './components/MintEnvelope';

import { PRESET_THEMES } from '../lib/themes';

// ── Shared Falling Petals Animation ──
const FallingPetals = ({ color }) => {
  const petals = [...Array(15)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDuration: 10 + Math.random() * 15,
    animationDelay: Math.random() * 10,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.7
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden drop-shadow-sm" style={{ color }}>
      {petals.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: '-10vh', x: `${p.left}vw`, rotate: p.rotation, scale: p.scale, opacity: 0 }}
          animate={{
            y: '110vh',
            x: [`${p.left}vw`, `${p.left - 10 + Math.random() * 20}vw`],
            rotate: p.rotation + 360,
            opacity: [0, 0.8, 0.8, 0]
          }}
          transition={{
            duration: p.animationDuration,
            repeat: Infinity,
            delay: p.animationDelay,
            ease: "linear"
          }}
          className="absolute top-0 opacity-80 drop-shadow-sm filter"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default function ClientHome({ config }) {
  const audioRef = useRef(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  // Use useSyncExternalStore for robust hydration handling
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  // Play audio after user opens invitation
  const handleOpen = () => {
    setHasOpened(true);
    if (audioRef.current && config.audioUrl) {
      audioRef.current.play().catch(() => {});
      setAudioPlaying(true);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setAudioPlaying(true);
    }
  };

  const revealStyle = config.revealStyle || 'envelope';
  const themeId = config.themeId || config.theme || 'gold';
  
  // Safe theme color resolution
  const resolvedColors = PRESET_THEMES.find(t => t.id === themeId)?.colors || config.theme || PRESET_THEMES[0].colors;
  const theme = {
    colorPrimary: resolvedColors?.colorPrimary || '#C9956A',
    colorSecondary: resolvedColors?.colorSecondary || '#E8D5B7',
    colorTextLight: resolvedColors?.colorTextLight || '#8A7F6A',
    colorTextDark: resolvedColors?.colorTextDark || '#2C2018',
    colorBg: resolvedColors?.colorBg || '#FAF7F2',
    colorSurface: resolvedColors?.colorSurface || '#FFFFFF',
    heroOverlayStart: resolvedColors?.heroOverlayStart || 'rgba(18, 12, 6, 0.55)',
    heroOverlayEnd: resolvedColors?.heroOverlayEnd || 'rgba(18, 12, 6, 0.25)',
  };

  if (!mounted) return null;

  const themeStyles = `
    :root {
      --colorPrimary: ${theme.colorPrimary};
      --colorSecondary: ${theme.colorSecondary};
      --colorTextLight: ${theme.colorTextLight};
      --colorTextDark: ${theme.colorTextDark};
      --colorBg: ${theme.colorBg};
      --colorSurface: ${theme.colorSurface};
      --heroOverlayStart: ${theme.heroOverlayStart};
      --heroOverlayEnd: ${theme.heroOverlayEnd};
    }
  `;

  const mainContent = (
    <main className={`min-h-screen theme-${themeId} ${!hasOpened ? 'h-screen overflow-hidden' : (config.heroLayout === 9 ? 'bg-slate-950 text-white' : 'bg-[var(--colorBg)] text-[var(--colorTextDark)]')}`}>
      {config.heroLayout === 8 ? (
        <LayoutEight config={config} />
      ) : config.heroLayout === 10 ? (
        <LayoutTen config={config} />
      ) : (
        <>
          <Navbar config={config} />
          <Hero config={config} isOpened={hasOpened} />
          <Countdown config={config} />
          <StorySection config={config} />
          <Gallery config={config} />
          <Timeline config={config} />
          <EventDetails config={config} />
          <RSVPSection config={config} />
          <Footer config={config} />
        </>
      )}
    </main>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      {config.audioUrl && (
        <audio ref={audioRef} src={config.audioUrl} loop preload="auto" style={{ display: 'none' }} />
      )}
      <AnimatePresence mode="wait">
        {!hasOpened && (
          revealStyle === 'cover' ? (
            <CoverReveal key="cover-reveal" config={config} onOpen={handleOpen} />
          ) : revealStyle === 'couple' ? (
            <CoupleReveal key="couple-reveal" config={config} onOpen={handleOpen} />
          ) : revealStyle === 'fade' ? (
            <FadeReveal key="fade-reveal" config={config} onOpen={handleOpen} />
          ) : revealStyle === 'premium-envelope' ? (
            <PremiumEnvelope key="premium-envelope" config={config} onOpenInvitation={handleOpen} />
          ) : (revealStyle === 'royal-envelope' || revealStyle === 'royal_envelope') ? (
            <RoyalEnvelope key="royal-envelope" config={config} onOpen={handleOpen} />
          ) : (revealStyle === 'mint-envelope' || revealStyle === 'mint_envelope') ? (
            <MintEnvelope key="mint-envelope" config={config} onOpenInvitation={handleOpen} />
          ) : (
            <Envelope key="envelope-layer" config={config} onOpen={handleOpen} />
          )
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hasOpened ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {mainContent}
        {/* Floating audio toggle */}
        {config.audioUrl && (
          <button
            onClick={toggleAudio}
            className="fixed bottom-8 right-8 z-[9999] bg-white/90 backdrop-blur-md rounded-full p-4 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border border-[var(--colorPrimary)]/20"
            aria-label={audioPlaying ? 'Pause background music' : 'Play background music'}
          >
            {audioPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--colorPrimary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--colorTextDark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
                <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
              </svg>
            )}
          </button>
        )}
        {config.fallingPetals && <FallingPetals color={theme.colorPrimary} />}
      </motion.div>
    </>
  );
}
