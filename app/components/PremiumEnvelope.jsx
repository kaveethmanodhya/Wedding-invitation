"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';

export default function PremiumEnvelope({ config, onOpenInvitation }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const videoRef = useRef(null);

  const sealImage = config?.envelope?.waxSealImage || '/images/wax-seal.png';
  const envelopeVideo = config?.envelopeVideo || '/videos/envelope-open.mp4';
  const sealColor = config?.envelopeColors?.seal || '#dc2626';

  const handleOpen = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error("Video play failed:", err);
        // Fallback: If video fails, try to proceed anyway
        setTimeout(onOpenInvitation, 1000);
      });
    }
  };

  return (
    <motion.div 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ 
        position: 'fixed', 
        inset: 0, 
        backgroundColor: '#ffffff', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 9999 
      }}
    >
      {/* 3:2 Aspect Ratio Wrapper (Responsive) */}
      <div 
        className="relative w-full max-w-[650px] mx-auto pt-[66.66%]"
      >
        
        {/* Video Animation Layer (Absolute Fill) */}
        <video
          ref={videoRef}
          src={envelopeVideo}
          className="absolute top-0 left-0 w-full h-full object-contain"
          playsInline
          muted
          onEnded={() => onOpenInvitation()}
          // Ensure it's ready
          preload="auto"
        />

        {/* Wax Seal Overlay (Interactive) */}
        <AnimatePresence>
          {!isAnimating && (
            <motion.div
              key="wax-seal"
              onClick={handleOpen}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-transparent"
              style={{ 
                zIndex: 50, // On top of paused video
                width: 'clamp(80px, 15vw, 120px)', 
                height: 'clamp(80px, 15vw, 120px)', 
                cursor: 'pointer', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none'
              }}
            >
              <img 
                src={sealImage} 
                alt="Wax Seal" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain', 
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))'
                }} 
              />
              {/* Subtle dynamic tint */}
              <div style={{
                position: 'absolute',
                inset: '15%',
                borderRadius: '50%',
                backgroundColor: sealColor,
                opacity: 0.2,
                mixBlendMode: 'overlay',
                pointerEvents: 'none'
              }}></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Loading Text (if video takes time) */}
        {!isAnimating && !videoRef.current?.readyState && (
           <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 text-[10px] uppercase tracking-[0.4em] pointer-events-none animate-pulse">
             Tap to Open
           </div>
        )}
      </div>
    </motion.div>
  );
}
