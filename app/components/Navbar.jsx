'use client';
import { useState, useEffect } from 'react';

export default function Navbar({ config }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#story', label: 'Our Story' },
    { href: '#events', label: 'Events' },
    { href: '#rsvp', label: 'Reply' },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between
          px-6 md:px-12 transition-all duration-300
          ${scrolled
            ? 'py-3 bg-[var(--colorBg)]/95 backdrop-blur-lg shadow-sm'
            : 'py-5 bg-transparent'
          }`}
      >
        {/* Logo / Names */}
        <span
          className={`font-script text-2xl tracking-wide transition-colors duration-300
            ${scrolled ? 'text-[var(--colorTextLight)]' : 'text-white'}`}
        >
          {config.couple.displayNames}
        </span>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-8">
          {links.map(l => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`font-sans text-xs font-semibold tracking-[0.15em] uppercase
                  relative group transition-colors duration-300
                  text-[var(--colorTextLight)]/90
                  hover:text-white`}
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[var(--colorPrimary)] transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          className="md:hidden flex flex-col gap-1.5 p-1"
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className={`block w-6 h-px transition-all duration-300
                bg-white
                ${menuOpen && i === 0 ? 'rotate-45 translate-y-2' : ''}
                ${menuOpen && i === 1 ? 'opacity-0' : ''}
                ${menuOpen && i === 2 ? '-rotate-45 -translate-y-2' : ''}
              `}
            />
          ))}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300
          ${menuOpen ? 'visible' : 'invisible'}`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300
            ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeMenu}
        />
        <aside
          className={`absolute top-0 right-0 h-full w-72 bg-[var(--colorSurface)] shadow-xl
            flex flex-col pt-20 transition-transform duration-300
            ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={closeMenu}
              className="px-8 py-4 font-sans text-xs font-semibold tracking-[0.18em]
                uppercase text-[var(--colorTextDark)] border-b border-[var(--colorPrimary)]/15
                hover:text-[var(--colorPrimary)] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </aside>
      </div>
    </>
  );
}
