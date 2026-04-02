'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope from './components/Envelope';
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

  return (
    <>
      <AnimatePresence>
        {!hasOpened && (
          <Envelope config={config} onOpen={() => setHasOpened(true)} />
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
