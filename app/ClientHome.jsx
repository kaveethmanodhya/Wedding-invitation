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
import Gallery from './components/Gallery';
import RSVPSection from './components/RSVPSection';
import Footer from './components/Footer';

export default function ClientHome({ config }) {
  const [hasOpened, setHasOpened] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const opened = sessionStorage.getItem('wedding_invitation_opened');
    if (opened) {
      setHasOpened(true);
    }
  }, []);

  const handleOpen = () => {
    setHasOpened(true);
    sessionStorage.setItem('wedding_invitation_opened', 'true');
  };

  const revealStyle = config.revealStyle || 'envelope';

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {!hasOpened && (
          revealStyle === 'couple' ? (
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
        <main className={!hasOpened ? 'h-screen overflow-hidden' : 'bg-[var(--colorBg)]'}>
          <Navbar config={config} />
          <Hero config={config} />
          <Countdown config={config} />
          <StorySection config={config} />
          <EventDetails config={config} />
          <RSVPSection config={config} />
          <Footer config={config} />
        </main>
      </motion.div>
    </>
  );
}
