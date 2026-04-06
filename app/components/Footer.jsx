'use client';

export default function Footer({ config }) {
  const { couple, wedding } = config;
  return (
    <footer 
      className="relative text-center py-20 px-6 overflow-hidden transition-all"
      style={{ backgroundColor: 'var(--colorTextDark)' }}
    >
      {/* ── SECTION BACKGROUND IMAGE ── */}
      {config.sectionBackgrounds?.footer && (
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{ 
            backgroundImage: `url(${config.sectionBackgrounds.footer})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
            opacity: 0.3
          }} 
        />
      )}
      <div className="absolute inset-0 bg-black/40 z-[1] pointer-events-none" />

      <div className="relative z-10">
        <p className="font-script text-4xl text-[var(--colorSecondary)] mb-2 drop-shadow-md">
          {couple.displayNames}
        </p>
        <p className="font-serif text-sm tracking-[0.3em] uppercase text-[var(--colorSecondary)]/60 mb-8">
          {wedding.displayDate}
        </p>
        
        <div className="w-12 h-px bg-[var(--colorSecondary)] opacity-20 mx-auto mb-8" />
        
        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/30">
          Handcrafted with Love — &copy; {wedding.year} KodeX
        </p>
      </div>
    </footer>
  );
}
