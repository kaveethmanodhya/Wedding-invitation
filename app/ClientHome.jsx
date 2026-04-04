'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope from './components/Envelope';
import CoupleReveal from './components/CoupleReveal';
import CoverReveal from './components/CoverReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import StorySection from './components/StorySection';
import EventDetails from './components/EventDetails';
import RSVPSection from './components/RSVPSection';
import Footer from './components/Footer';

import { PRESET_THEMES } from '../lib/themes';

export default function ClientHome({ config }) {
  const [hasOpened, setHasOpened] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpen = () => {
    setHasOpened(true);
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
    <main className={`min-h-screen theme-${themeId} ${!hasOpened ? 'h-screen overflow-hidden' : 'bg-[var(--colorBg)] text-[var(--colorTextDark)]'}`}>
      <Navbar config={config} />
      <Hero config={config} />
      <Countdown config={config} />
      <StorySection config={config} />
      <EventDetails config={config} />
      <RSVPSection config={config} />
      <Footer config={config} />
    </main>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      <AnimatePresence mode="wait">
        {!hasOpened && (
          revealStyle === 'cover' ? (
            <CoverReveal key="cover-reveal" config={config} onOpen={handleOpen} />
          ) : revealStyle === 'couple' ? (
            <CoupleReveal key="couple-reveal" config={config} onOpen={handleOpen} />
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
      </motion.div>
    </>
  );
}
