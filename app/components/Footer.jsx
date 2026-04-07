'use client';

export default function Footer({ config }) {
  const { couple = {}, wedding = {}, heroLayout = 1 } = config || {};
  const isLayout9 = heroLayout === 9;

  return (
    <footer 
      className={`${isLayout9 ? 'bg-[#020617] border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]' : 'bg-[var(--colorTextDark)]'} relative text-center py-20 px-6 overflow-hidden transition-all`}
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
            opacity: isLayout9 ? 0.1 : 0.3
          }} 
        />
      )}
      <div className={`absolute inset-0 z-[1] pointer-events-none ${isLayout9 ? 'bg-black/60' : 'bg-black/40'}`} />

      <div className="relative z-10">
        <p className={`font-script text-5xl mb-2 drop-shadow-md ${isLayout9 ? 'text-white' : 'text-[var(--colorSecondary)]'}`}>
          {couple?.displayNames || ''}
        </p>
        <p className={`font-serif text-sm tracking-[0.3em] uppercase mb-8 ${isLayout9 ? 'text-white/40' : 'text-[var(--colorSecondary)]/60'}`}>
          {wedding?.displayDate || ''}
        </p>
        
        <div className={`w-12 h-px mx-auto mb-8 ${isLayout9 ? 'bg-white/10' : 'bg-[var(--colorSecondary)]/20'}`} />
        
        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/30">
          Handcrafted with Love — &copy; {wedding?.year || new Date().getFullYear()} KodeX
        </p>
      </div>
    </footer>
  );
}
