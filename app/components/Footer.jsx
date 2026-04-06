export default function Footer({ config }) {
  const { couple, wedding, heroLayout } = config;
  const isLayout9 = heroLayout === 9;

  return (
    <footer className={`${isLayout9 ? 'bg-[#020617] border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] relative z-10 text-white' : 'bg-[var(--colorTextDark)] text-[var(--colorTextLight)]/55'} text-center py-16 px-6`}>
      <p className={`font-sans text-[10px] tracking-[0.5em] uppercase font-bold mb-6 ${isLayout9 ? 'text-white/30' : 'text-[var(--colorSecondary)]/30'}`}>Thank You</p>
      <p className={`font-script text-5xl mb-2 drop-shadow-sm ${isLayout9 ? 'text-white' : 'text-[var(--colorSecondary)]'}`}>{couple.displayNames}</p>
      <p className={`font-serif text-sm tracking-[0.3em] uppercase mb-10 ${isLayout9 ? 'text-white/40' : 'text-[var(--colorSecondary)]/40'}`}>{wedding.displayDate}</p>
      <div className="w-12 h-px bg-white/10 mx-auto mb-10" />
      <p className="font-sans text-[9px] tracking-[0.3em] uppercase opacity-40">&copy; {wedding.year} — Made by KodeX</p>
    </footer>
  );
}
