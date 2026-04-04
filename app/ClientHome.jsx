'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope from './components/Envelope';
import CoupleReveal from './components/CoupleReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import StorySection from './components/StorySection';
import EventDetails from './components/EventDetails';
import RSVPSection from './components/RSVPSection';
import Footer from './components/Footer';

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

  if (!mounted) return null;

  const mainContent = (
    <main className={!hasOpened ? 'h-screen overflow-hidden' : 'bg-[var(--colorBg)]'}>
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
      <AnimatePresence mode="wait">
        {!hasOpened && revealStyle === 'envelope' && (
          <Envelope key="envelope-layer" config={config} onOpen={handleOpen} />
        )}
      </AnimatePresence>

      {revealStyle === 'couple' && !hasOpened ? (
        <CoupleReveal config={config} onOpen={handleOpen}>
          {mainContent}
        </CoupleReveal>
      ) : (
        <motion.div
          initial={{ opacity: revealStyle === 'couple' ? 1 : 0 }}
          animate={{ opacity: hasOpened || revealStyle === 'couple' ? 1 : 0 }}
          transition={{ duration: 1, delay: revealStyle === 'couple' ? 0 : 0.5 }}
        >
          {mainContent}
        </motion.div>
      )}
    </>
  );
}
