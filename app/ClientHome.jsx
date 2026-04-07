'use client';
import { useState, useEffect, useRef } from 'react';
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
import EnvelopeReveal from './components/EnvelopeReveal';
import LayoutEight from './components/LayoutEight';

import { PRESET_THEMES } from '../lib/themes';

export default function ClientHome({ config }) {
  const audioRef = useRef(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
  const theme = PRESET_THEMES.find(t => t.id === themeId)?.colors || config.theme || PRESET_THEMES[0].colors;

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
      <Navbar config={config} />
      <Hero config={config} />
      <Countdown config={config} />
      <StorySection config={config} />
      <Gallery config={config} />
      <Timeline config={config} />
      <EventDetails config={config} />
      <RSVPSection config={config} />
      <Footer config={config} />
    </main>
  );

  if (config.heroLayout === 8) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        {config.audioUrl && (
          <audio ref={audioRef} src={config.audioUrl} loop preload="auto" style={{ display: 'none' }} />
        )}
        <LayoutEight config={config} />
        
        {/* Simple floating audio toggle for layout 8 */}
        {config.audioUrl && (
          <button
            onClick={toggleAudio}
            className="fixed bottom-4 right-4 z-50 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition"
          >
            {audioPlaying ? '🔊' : '🔈'}
          </button>
        )}
      </>
    );
  }

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
          ) : revealStyle === 'premium_envelope' ? (
            <EnvelopeReveal key="premium-envelope" config={config} onOpen={handleOpen} />
          ) : (
            <Envelope key="envelope-layer" config={config} onOpen={handleOpen} />
          )
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hasOpened ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {mainContent}
        {/* Floating audio toggle */}
        {config.audioUrl && (
          <button
            onClick={toggleAudio}
            className="fixed bottom-4 right-4 z-50 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition"
            aria-label={audioPlaying ? 'Pause background music' : 'Play background music'}
          >
            {audioPlaying ? '🔊' : '🔈'}
          </button>
        )}
      </motion.div>
    </>
  );
}
