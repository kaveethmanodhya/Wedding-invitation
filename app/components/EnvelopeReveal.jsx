"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function EnvelopeReveal({ config, onOpenInvitation }) {
  const [isOpen, setIsOpen] = useState(false);

  // Dynamic Content mapping
  const coupleNames = config?.envelope?.subtitle || (config?.couple ? `${config.couple.bride.firstName} & ${config.couple.groom.firstName}` : 'Nethmi & Isuru');
  const initial = config?.couple?.bride?.firstName?.[0] || 'N';
  const envelopeTitle = config?.envelope?.title || 'A Wedding Invitation';
  
  // Dynamic Color mapping
  const colors = config?.envelopeColors || {
    back: '#064e3b',
    pocket: '#047857',
    flap: '#064e3b',
    card: '#fef3c7',
    seal: '#dc2626'
  };

  const sealImage = config?.envelope?.waxSealImage || '/images/wax-seal.png';

  const cardboardStyle = {
    backgroundImage: "url('/images/cardboard-texture.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'multiply',
  };

  const handleOpen = () => {
    setIsOpen(true);
    // Sequence: Seal breaks (0.2s) -> Flap opens (0.6s) -> Card rises (0.8s) -> Envelope fades (0.8s)
    setTimeout(() => {
      if (onOpenInvitation) onOpenInvitation();
    }, 2000); 
  };

  return (
    <motion.div 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ position: 'fixed', inset: 0, backgroundColor: '#171717', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
    >
      
      <motion.div 
        style={{ position: 'relative', width: '350px', height: '240px', perspective: '1200px' }}
        animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 1.5 : 1 }}
        transition={{ duration: 0.8, delay: 1.2, ease: "easeInOut" }}
      >
        
        {/* 1. Envelope Back */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundColor: colors.back, 
          ...cardboardStyle,
          borderRadius: '6px', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)' 
        }}>
          {/* Internal shadow inside the back for depth */}
          <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 50px rgba(0,0,0,0.3)', borderRadius: '6px' }} />
        </div>

        {/* 2. The Card */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: isOpen ? -120 : 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "backOut" }}
          style={{ 
            position: 'absolute', 
            inset: '10px', 
            backgroundColor: colors.card, 
            backgroundImage: "url('/images/cardboard-texture.png')",
            backgroundSize: 'cover',
            backgroundBlendMode: 'overlay',
            borderRadius: '4px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 10, 
            textAlign: 'center', 
            padding: '15px', 
            boxShadow: isOpen ? '0 -10px 20px rgba(0,0,0,0.15)' : 'none' 
          }}
        >
          <h2 style={{ fontSize: '22px', fontFamily: 'serif', color: colors.back, margin: '0 0 12px 0' }}>{envelopeTitle}</h2>
          <div style={{ width: '60px', height: '1px', backgroundColor: colors.back, opacity: 0.6, margin: '0 0 12px 0' }}></div>
          <p style={{ color: colors.back, fontFamily: 'serif', fontStyle: 'italic', margin: 0, fontSize: '16px' }}>{coupleNames}</p>
        </motion.div>

        {/* 3. Bottom & Side Pockets (Perfect 50% alignment) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', filter: isOpen ? 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))' : 'none', transition: 'filter 0.5s ease 0.4s' }}>
           <div style={{ 
             position: 'absolute', 
             inset: 0, 
             backgroundColor: colors.pocket, 
             ...cardboardStyle,
             clipPath: 'polygon(0 100%, 0 50%, 50% 50%, 100% 50%, 100% 100%)', 
             borderRadius: '0 0 6px 6px',
             boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.1)'
           }}></div>
           {/* Shadow cast onto the card by the pocket */}
           <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.1)', clipPath: 'polygon(0 50%, 50% 50%, 100% 50%, 100% 55%, 50% 55%, 0 55%)', filter: 'blur(3px)' }} />
           
           <div style={{ position: 'absolute', inset: 0, backgroundColor: '#ffffff', mixBlendMode: 'overlay', opacity: 0.1, clipPath: 'polygon(0 0, 50% 50%, 0 100%)' }}></div>
           <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000000', mixBlendMode: 'multiply', opacity: 0.05, clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)' }}></div>
        </div>

        {/* 4. Top Flap (Rotates on Open) */}
        <motion.div
          initial={{ rotateX: 0, zIndex: 30 }}
          animate={{ rotateX: isOpen ? -180 : 0, zIndex: isOpen ? 5 : 30 }} // Goes behind card when open
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{ position: 'absolute', inset: 0, transformOrigin: 'top', transformStyle: 'preserve-3d', pointerEvents: 'none' }}
        >
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            backgroundColor: colors.flap, 
            ...cardboardStyle,
            clipPath: 'polygon(0 0, 100% 0, 50% 50%)',
            backfaceVisibility: 'hidden'
          }}></div>
          {/* Inner face overlay for shadow when open */}
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            clipPath: 'polygon(0 0, 100% 0, 50% 50%)',
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.7s ease-in-out'
          }}></div>
        </motion.div>

        {/* 5. Wax Seal (Photorealistic Asset) */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              key="wax-seal"
              onClick={handleOpen}
              initial={{ scale: 1, x: "-50%", y: "-50%", opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.08, x: "-50%", y: "-50%" }}
              whileTap={{ scale: 0.92, x: "-50%", y: "-50%" }}
              transition={{ duration: 0.4 }}
              style={{ 
                position: 'absolute', 
                zIndex: 40, 
                width: '95px', 
                height: '95px', 
                cursor: 'pointer', 
                top: '50%', 
                left: '50%', 
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
                  mixBlendMode: 'multiply',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
                }} 
              />
              {/* Tint overlay for admin color coordination */}
              <div style={{
                position: 'absolute',
                inset: '15px',
                borderRadius: '50%',
                backgroundColor: colors.seal,
                opacity: 0.15,
                mixBlendMode: 'overlay',
                pointerEvents: 'none'
              }}></div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </motion.div>
  );
}
