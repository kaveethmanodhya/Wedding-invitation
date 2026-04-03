'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function CoupleReveal({ config, onOpen }) {
  const [stage, setStage] = useState('running'); // 'running' | 'met' | 'closing'
  
  const groomImg = config.coupleImages?.groom;
  const brideImg = config.coupleImages?.bride;

  useEffect(() => {
    // Stage 1: Running together (duration 2s)
    const metTimer = setTimeout(() => {
      setStage('met');
    }, 2000);

    // Stage 2: Stay met (duration 2s)
    const closingTimer = setTimeout(() => {
      setStage('closing');
    }, 4000);

    // Stage 3: Close overlay (duration 0.8s fade)
    const openTimer = setTimeout(() => {
      onOpen();
    }, 4800);

    return () => {
      clearTimeout(metTimer);
      clearTimeout(closingTimer);
      clearTimeout(openTimer);
    };
  }, [onOpen]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[110] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--colorBg)' }}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl">🌸</div>
        <div className="absolute bottom-10 right-10 text-4xl">🌸</div>
        <div className="absolute top-1/4 right-20 text-2xl">✨</div>
        <div className="absolute bottom-1/4 left-20 text-2xl">✨</div>
      </div>

      <div className="relative w-full max-w-lg h-64 flex items-center justify-center">
        {/* Groom */}
        <motion.div
          initial={{ x: '-100vw', opacity: 0 }}
          animate={{ x: stage === 'running' ? -40 : 0, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute"
        >
          {groomImg ? (
            <img src={groomImg} alt="Groom" className="h-40 w-auto object-contain" />
          ) : (
            <span className="text-7xl block transform -scale-x-100">🏃‍♂️</span>
          )}
        </motion.div>

        {/* Bride */}
        <motion.div
          initial={{ x: '100vw', opacity: 0 }}
          animate={{ x: stage === 'running' ? 40 : 0, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute"
        >
          {brideImg ? (
            <img src={brideImg} alt="Bride" className="h-40 w-auto object-contain" />
          ) : (
            <span className="text-7xl">🏃‍♀️</span>
          )}
        </motion.div>

        {/* Heart Animation */}
        <AnimatePresence>
          {stage !== 'running' && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 0 }}
              animate={{ 
                scale: [0, 1.2, 1], 
                opacity: 1, 
                y: -80 
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ 
                duration: 0.6, 
                times: [0, 0.7, 1],
                ease: "backOut" 
              }}
              className="absolute z-10"
            >
              <div className="relative">
                <span className="text-6xl">❤️</span>
                <motion.span 
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute -top-2 -right-2 text-2xl"
                >
                  ✨
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: stage !== 'running' ? 1 : 0 }}
          className="absolute bottom-0 text-center"
        >
          <p className="font-script text-3xl text-[var(--colorTextDark)] mt-4">
            {config.couple.displayNames}
          </p>
          <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--colorPrimary)] font-bold mt-2">
            Are Getting Married
          </p>
        </motion.div>
      </div>

      {/* Progress Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-200 rounded-full overflow-hidden"
      >
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 4.8, ease: "linear" }}
          className="h-full bg-[var(--colorPrimary)]"
        />
      </motion.div>
    </motion.div>
  );
}
