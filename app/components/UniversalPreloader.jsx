"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function UniversalPreloader({ config, onReveal, children }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const isPremiumEnvelope = config?.revealStyle === 'premium-envelope' || config?.revealStyle === 'premium_envelope';
  const envelopeVideo = config?.envelopeVideo || (isPremiumEnvelope ? '/videos/envelope-open.mp4' : null);
  const rawOpenMode = config?.envelopeOpenMode || 'tap';
  const openMode = (rawOpenMode === 'tap' || rawOpenMode === 'onclick') ? 'tap' : 'auto';
  const isAutoOpen = openMode === 'auto';
  const [timestamp] = useState(() => Date.now());
  const [waitingForTap, setWaitingForTap] = useState(false);

  const forceSkipAnimation = () => {
    setMediaReady(true);
    setHasEnded(true);
    if (onReveal) onReveal();
  };

  useEffect(() => {
    if (!envelopeVideo) return;
    
    // Clear old aggressive Service Workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister();
        }
        navigator.serviceWorker.register('/service-worker.js');
      });
    }

    if (openMode === 'tap') {
      setMediaReady(true);
      setWaitingForTap(true);
    } else {
      timeoutRef.current = setTimeout(() => {
        forceSkipAnimation();
      }, 2500);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [openMode, envelopeVideo]);

  const handleOpen = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsAnimating(true);
    setWaitingForTap(false); 
    
    if (videoRef.current) {
      // Removed currentTime = 0.1 to prevent seek stalls on mobile
      
      // Add a new short failsafe in case the play() promise hangs
      timeoutRef.current = setTimeout(() => forceSkipAnimation(), 2000);
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Play started successfully, kill the failsafe, let onEnded handle the rest
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }).catch(error => {
          console.error("Video play failed:", error);
          forceSkipAnimation();
        });
      }
    } else {
      forceSkipAnimation();
    }
  };

  if (!envelopeVideo) {
    return <>{children}</>;
  }

  return (
    <>
      <div style={{ opacity: hasEnded ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }} className="w-full h-full relative z-0">
        {children}
      </div>

      <AnimatePresence>
        {!hasEnded && (
          <motion.div 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`z-[9999] flex items-center justify-center bg-gray-900/60 transition-all duration-500 ${!isAnimating && !isAutoOpen ? 'cursor-pointer' : ''} ${isAnimating ? 'pointer-events-none' : ''} fixed inset-0 w-screen h-screen overflow-hidden`}
            onClick={!isAutoOpen ? handleOpen : undefined}
          >
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            
            <motion.div
              animate={{ opacity: hasEnded ? 0 : 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="relative w-full h-full sm:h-auto md:h-[85vh] sm:max-w-4xl lg:max-w-5xl md:max-w-none md:w-auto aspect-auto sm:aspect-[3/2] md:aspect-auto flex items-center justify-center sm:-translate-y-[10%] bg-transparent sm:overflow-visible">
                <div className="absolute inset-0 w-full h-full md:relative md:inset-auto md:h-full md:w-auto flex items-center justify-center md:rounded-2xl md:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] md:border md:border-white/10 overflow-hidden">
                  
                  {!videoError ? (
                    <video 
                      ref={videoRef}
                      className="h-full w-auto max-w-none absolute left-1/2 -translate-x-1/2 object-contain sm:relative sm:left-0 sm:translate-x-0 sm:w-full sm:h-full md:w-auto md:h-full md:object-contain"
                      playsInline
                      muted
                      autoPlay={openMode !== 'tap'}
                      onLoadedData={() => setMediaReady(true)}
                      onPlay={() => {
                        // The moment the video starts playing successfully, kill the failsafe timer!
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                      }}
                      onEnded={() => {
                        setHasEnded(true);
                        setTimeout(() => {
                          if (onReveal) onReveal();
                        }, 500);
                      }}
                      onError={(e) => {
                        console.warn('Video failed to load, skipping animation:', e);
                        setVideoError(true);
                        forceSkipAnimation();
                      }}
                      preload="auto"
                      poster={config?.heroImage || config?.envelopeImage}
                    >
                      <source src={`${envelopeVideo}${envelopeVideo.includes('?') ? '&' : '?'}cb=${timestamp}`} type="video/mp4" />
                      <source src={`${envelopeVideo.replace('.mp4', '.webm')}${envelopeVideo.replace('.mp4', '.webm').includes('?') ? '&' : '?'}cb=${timestamp}`} type="video/webm" />
                    </video>
                  ) : (
                    <img
                      src={config?.heroImage || config?.envelopeImage || '/images/placeholder.png'}
                      alt="Envelope fallback"
                      className="h-full w-auto max-w-none absolute left-1/2 -translate-x-1/2 object-contain sm:relative sm:left-0 sm:translate-x-0 sm:w-full sm:h-full md:w-auto md:h-full md:object-contain"
                      onLoad={() => setMediaReady(true)}
                      onError={() => setMediaReady(true)}
                    />
                  )}
                </div>
              </div>
            </motion.div>

            {!isAnimating && !isAutoOpen && (
               <div className={`absolute bottom-10 md:bottom-20 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-1000 z-[100] ${mediaReady ? 'opacity-100' : 'opacity-100'}`}>
                 <span className="font-sans text-xs md:text-sm uppercase tracking-[0.4em] text-white bg-black/30 backdrop-blur-sm px-5 py-2.5 rounded-full whitespace-nowrap border border-white/10">
                   Tap Anywhere to Open
                 </span>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
