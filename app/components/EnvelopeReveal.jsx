'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * Enhanced Premium 3D Wax-Seal Envelope Reveal.
 * Features:
 * - High-fidelity 3D paper folding (preserve-3d)
 * - Realistic internal card pocketing
 * - Reverted Wax Seal to "Previous Look" but with enhanced 3D shadows
 * - Organic card slide-up with parallax
 */
export default function EnvelopeReveal({ config, onOpen }) {
  const [stage, setStage] = useState('closed'); // closed | breaking | opening | sliding
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpen = () => {
    if (stage !== 'closed') return;
    
    // 1. Break the seal & initiate opening
    setStage('opening');
    
    // 2. Card starts sliding after flap is mostly open
    setTimeout(() => {
      setStage('sliding');
      
      // 3. Final callback to show main content
      setTimeout(() => {
        onOpen();
      }, 1500);
    }, 600);
  };

  if (!mounted) return null;

  const { premium } = config.envelope || {};
  const waxSealColor = premium?.waxSealColor || '#8a0303';
  const envelopeColor = premium?.envelopeColor || '#ffffff';
  const liningColor = premium?.liningColor || '#f3f4f6';

  // Animation Variants
  const flapVariants = {
    closed: { rotateX: 0, zIndex: 40 },
    opening: { 
      rotateX: -170, 
      zIndex: 5, // Moves behind the card once fully open
      transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } 
    }
  };

  const cardVariants = {
    closed: { y: 0, scale: 0.9, zIndex: 10, opacity: 0.8 },
    sliding: { 
      y: '-85%', 
      scale: 1, 
      zIndex: 100,
      opacity: 1,
      transition: { duration: 1.5, ease: [0.19, 1, 0.22, 1], delay: 0.1 } 
    }
  };

  const sealVariants = {
    closed: { scale: 1, opacity: 1, y: '-50%', x: '-50%' },
    opening: { 
      scale: 0.9, 
      opacity: 0, 
      y: '20%', 
      filter: 'blur(4px)',
      transition: { duration: 0.4, ease: "easeIn" } 
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[var(--colorBg)]">
      {/* Dynamic Lighting Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--colorPrimary)] opacity-[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[560px] aspect-[4/3] px-6 md:px-0 perspective-[2500px]">
        
        {/* ENVELOPE GROUP */}
        <div className="relative w-full h-full preserve-3d" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* 1. BACK PANEL (The actual pocket back) */}
          <div 
            className="absolute inset-0 z-0 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.2)]"
            style={{ 
              backgroundColor: envelopeColor,
              transformStyle: 'preserve-3d',
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
              borderRadius: '2px'
            }}
          >
            {/* Interior Lining (Premium Look) */}
            <div className="absolute inset-2 bottom-4 opacity-30 z-0" style={{ backgroundColor: liningColor }} />
            {/* Inner Shadow for the pocket depth */}
            <div className="absolute inset-0 shadow-[inset_0_20px_40px_rgba(0,0,0,0.05)] z-[1]" />
          </div>

          {/* 2. THE INVITATION CARD (Tucked Inside) */}
          <motion.div
            variants={cardVariants}
            initial="closed"
            animate={stage === 'sliding' ? 'sliding' : 'closed'}
            className="absolute inset-x-6 top-6 bottom-6 flex flex-col items-center justify-center text-center overflow-hidden border border-black/5"
            style={{ 
              backgroundColor: 'var(--colorSurface)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08), inset 0 0 100px rgba(0,0,0,0.01)',
              borderRadius: '1px'
            }}
          >
             {/* Premium Card Texture Overlay */}
             <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                  style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/fancy-paper.png")' }} />
             
             {/* Content Area */}
             <div className="relative z-10 w-full px-8">
                <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 1 }}
                >
                  <p className="font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-[var(--colorPrimary)] mb-6 opacity-80">
                    {config.envelope?.title || 'Wedding Invitation'}
                  </p>
                  
                  <h2 className="font-serif text-3xl md:text-5xl text-[var(--colorTextDark)] mb-6 leading-tight tracking-tight">
                    {config.couple.bride.firstName} <br/>
                    <span className="font-script text-2xl text-[var(--colorPrimary)] my-2 block">&</span>
                    {config.couple.groom.firstName}
                  </h2>

                  <div className="w-16 h-px bg-[var(--colorPrimary)] opacity-20 mx-auto mb-6" />
                  
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[var(--colorTextDark)] opacity-50">
                     {config.wedding.displayDate}
                  </p>
                </motion.div>
             </div>

             {/* Top Card Gradient Shine */}
             <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent z-0" />
          </motion.div>

          {/* 3. FRONT POCKET (V-Fold Overlays) */}
          <div className="absolute inset-0 z-30 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
             {/* Left Flap */}
             <div className="absolute inset-y-0 left-0 w-[51%] shadow-[10px_0_20px_rgba(0,0,0,0.03)]" 
                  style={{ 
                    backgroundColor: envelopeColor, 
                    clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)',
                    filter: 'brightness(0.99)',
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")'
                  }} 
             />
             {/* Right Flap */}
             <div className="absolute inset-y-0 right-0 w-[51%] shadow-[-10px_0_20px_rgba(0,0,0,0.03)]" 
                  style={{ 
                    backgroundColor: envelopeColor, 
                    clipPath: 'polygon(100% 0%, 0% 50%, 100% 100%)',
                    filter: 'brightness(0.99)',
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")'
                  }} 
             />
             {/* Bottom Flap */}
             <div className="absolute inset-x-0 bottom-0 h-2/3 shadow-[0_-15px_30px_rgba(0,0,0,0.04)]" 
                  style={{ 
                    backgroundColor: envelopeColor, 
                    clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
                    filter: 'brightness(0.97)',
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")'
                  }} 
             />
          </div>

          {/* 4. THE INTERACTIVE TOP FLAP (3D Rotation) */}
          <motion.div
            variants={flapVariants}
            initial="closed"
            animate={(stage === 'opening' || stage === 'sliding') ? 'opening' : 'closed'}
            className="absolute inset-x-0 top-0 h-1/2 origin-top z-40"
            style={{ 
              backgroundColor: envelopeColor,
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              transformStyle: 'preserve-3d',
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
              boxShadow: stage === 'closed' ? '0 10px 20px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            {/* Flap Interior (Self-Shadowing) */}
            <div className="absolute inset-0 bg-black/[0.03]" />
            <div className="absolute inset-0 opacity-10" style={{ backgroundColor: liningColor }} />
          </motion.div>

          {/* 5. THE WAX SEAL (Restored to Previous Look with 3D improvements) */}
          <AnimatePresence>
            {(stage === 'closed' || stage === 'opening') && (
              <motion.div
                variants={sealVariants}
                initial="closed"
                animate={stage === 'opening' ? 'opening' : 'closed'}
                className="absolute left-1/2 top-1/2 z-50 cursor-pointer group"
                onClick={handleOpen}
              >
                {/* Floating Hint Circle */}
                <motion.div 
                  animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute inset-0 -m-6 rounded-full border border-[var(--colorPrimary)] blur-sm pointer-events-none"
                />

                {/* THE SEAL BODY (Rounded Red Aesthetic) */}
                <div 
                  className="relative w-18 h-18 md:w-22 md:h-22 rounded-full flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.35),inset_0_4px_10px_rgba(255,255,255,0.2)] transition-transform hover:scale-105 active:scale-95"
                  style={{ 
                    backgroundColor: waxSealColor,
                    backgroundImage: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.2) 0%, transparent 70%)',
                    border: '1px solid rgba(0,0,0,0.15)'
                  }}
                >
                  {/* Inner Ring Emboss */}
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-white/20 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
                    <span className="font-serif text-white/90 text-2xl md:text-3xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                       {config.couple.bride.firstName[0]}{config.couple.groom.firstName[0]}
                    </span>
                  </div>

                  {/* Irregular Melting Wax Edge Overlay */}
                  <div className="absolute -inset-1 rounded-full border-4 border-transparent shadow-[inset_0_0_10px_rgba(0,0,0,0.2)] opacity-30 pointer-events-none" />
                </div>
                
                {/* CTA Label */}
                <motion.div 
                   animate={{ y: [0, 5, 0] }}
                   transition={{ repeat: Infinity, duration: 4 }}
                   className="absolute top-full mt-8 left-1/2 -translate-x-1/2"
                >
                   <span className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--colorTextDark)] opacity-60">
                     {config.envelope?.buttonText || 'Open Invitation'}
                   </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      <style jsx global>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}
