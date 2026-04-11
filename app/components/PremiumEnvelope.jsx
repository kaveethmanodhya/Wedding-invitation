"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';

export default function PremiumEnvelope({ config, onOpenInvitation }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
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
      {/* Outer Wrapper: Maintains document flow and aspect ratio */}
      <div className="relative w-full max-w-[650px] mx-auto aspect-[3/2] flex items-center justify-center overflow-visible bg-transparent">
        
        {/* Inner Zoom Wrapper: Handles the 25% mobile scale-up independently */}
        <div className="absolute inset-0 w-full h-full scale-[1.35] sm:scale-110 origin-center flex items-center justify-center -translate-y-[10%]">
          
          {/* Layer 1 - Static Envelope Image has been removed. We now rely on the video's first frame. */}

          {/* Layer 2 - The Video (Acts as both static cover and animation) */}
          <video 
            ref={videoRef}
            src={`${envelopeVideo}#t=0.1`}
            className="absolute inset-0 w-full h-full object-contain"
            playsInline
            muted
            onLoadedData={() => setMediaReady(true)}
            onEnded={() => onOpenInvitation()}
            preload="metadata"
          />

          {/* Layer 3 - The Wax Seal Button */}
          <AnimatePresence>
            {!isAnimating && (
              <motion.button
                key="wax-seal"
                onClick={handleOpen}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`absolute z-50 left-1/2 top-[58%] sm:top-[58%] -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-opacity duration-500 border-none bg-transparent outline-none hover:scale-105 ${mediaReady ? 'opacity-100' : 'opacity-0'}`}
              >
                <img 
                  src={sealImage} 
                  alt="Wax Seal" 
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain bg-transparent"
                  style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))' }}
                />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Global Loading Indicator (Subtle) */}
        {!isAnimating && !videoRef.current?.readyState && (
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/20 text-[10px] uppercase tracking-[0.4em] pointer-events-none animate-pulse">
             Tap to Open
           </div>
        )}
      </div>
    </motion.div>
  );
}
