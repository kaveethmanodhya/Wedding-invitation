'use client';
import { DESIGNER_CREDIT, DESIGNER_URL } from '../../lib/branding';

export default function Footer({ config, birthdayData = null, generalData = null }) {
  const { couple = {}, wedding = {}, heroLayout = 1 } = config || {};
  const isLayout9 = false;
  const displayName = birthdayData?.celebrantName
    || generalData?.eventTitle
    || generalData?.hostName
    || couple?.displayNames
    || '';

  return (
    <footer 
      className="bg-[var(--colorTextDark)] relative text-center py-20 px-6 overflow-hidden transition-all"
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
      <div className="absolute inset-0 z-[1] pointer-events-none bg-black/40" />

      <div className="relative z-10">
        <p className="font-script text-5xl mb-2 drop-shadow-md text-[var(--colorSecondary)]">
          {displayName}
        </p>
        <p className="font-serif text-sm tracking-[0.3em] uppercase mb-8 text-[var(--colorSecondary)]/60">
          {wedding?.displayDate || ''}
        </p>
        
        <div className="w-12 h-px mx-auto mb-8 bg-[var(--colorSecondary)]/20" />
        
       

        {/* Designer credit — shown on every template */}
        <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40 mt-3">
          <a href={DESIGNER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">
            {DESIGNER_CREDIT}
          </a>
        </p>
      </div>
    </footer>
  );
}
