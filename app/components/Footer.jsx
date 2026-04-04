export default function Footer({ config }) {
  const { couple, wedding } = config;
  return (
    <footer className="bg-[var(--colorTextDark)] text-[var(--colorTextLight)]/55 text-center py-12 px-6">
      <p className="font-script text-4xl text-[var(--colorSecondary)] mb-1">{couple.displayNames}</p>
      <p className="font-serif text-sm tracking-widest text-[var(--colorSecondary)]/50 mb-4">{wedding.displayDate}</p>
      <p className="font-sans text-xs tracking-wide">&copy; {wedding.year} — Made by KodeX</p>
    </footer>
  );
}
