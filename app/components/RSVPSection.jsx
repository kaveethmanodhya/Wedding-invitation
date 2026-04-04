'use client';
import { useState, useRef, useEffect } from 'react';

export default function RSVPSection({ config }) {
  const { rsvp } = config;
  const [formData, setFormData] = useState({
    name: '', phone: '',
    attendance: '', guests: '1',
    events: { ceremony: true },
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const headerRef = useRef(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('opacity-100', '!translate-y-0'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const layout = config?.heroLayout ?? 1;
  const isAttending = formData.attendance === 'Attending';

  function validate() {
    const e = {};
    if (!formData.name.trim()) e.name = 'Please enter your name.';
    if (!formData.attendance) e.attendance = 'Please select an option.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('loading');

    try {
      const selectedEvents = Object.entries(formData.events)
        .filter(([_, attended]) => attended)
        .map(([name]) => name.charAt(0).toUpperCase() + name.slice(1))
        .join(', ');

      const message =
        `💍 *Wedding invitation Reply* 💍\n\n` +
        `*Guest Name:* ${formData.name}\n` +
        `*Phone:* ${formData.phone || 'Not provided'}\n` +
        `*Attendance:* ${formData.attendance === 'Attending' ? '✅ Joyfully Accepts' : '❌ Regretfully Declines'}\n` +
        `${formData.attendance === 'Attending' ? `*Guests:* ${formData.guests}\n*Events:* ${selectedEvents}\n` : ''}` +
        `*Message:* ${formData.message || 'No additional message'}`;

      const encodedMessage = encodeURIComponent(message);
      const cleanNumber = rsvp.whatsappNumber.replace(/[+\s-]/g, '').replace(/^0+/, '');
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  const guestOptions = Array.from({ length: rsvp.maxGuests }, (_, i) => i + 1);

  // Layout Styles
  let bgClass = "bg-[var(--colorBg)]";
  let inputCls = `w-full px-4 py-3 rounded-none font-serif text-base bg-white/40 text-[var(--colorTextDark)] placeholder:text-[var(--colorTextDark)]/35 placeholder:italic border border-[var(--colorPrimary)]/30 outline-none focus:border-[var(--colorPrimary)] focus:ring-1 focus:ring-[var(--colorPrimary)] transition-all duration-200`;
  let labelCls = "block font-sans text-xs font-semibold tracking-widest uppercase text-[var(--colorTextDark)] opacity-80 mb-1.5";
  let btnCls = "w-full flex items-center justify-center gap-2 py-4 bg-[var(--colorPrimary)] text-white font-sans text-xs font-bold tracking-widest uppercase shadow-[0_4px_18px_var(--colorPrimary)/40] hover:bg-transparent hover:text-[var(--colorPrimary)] border border-[var(--colorPrimary)] transition-all duration-300";
  let optionBtnCls = (active) => `flex items-center gap-2.5 cursor-pointer font-serif text-base px-5 py-2.5 border transition-all duration-200 ${active ? 'bg-[var(--colorPrimary)]/10 border-[var(--colorPrimary)] text-[var(--colorTextDark)] shadow-sm' : 'bg-transparent border-[var(--colorPrimary)]/25 text-[var(--colorTextDark)]/70 hover:border-[var(--colorPrimary)]'}`;

  if (layout === 2) {
    inputCls = `w-full px-4 py-4 rounded-xl font-serif text-base bg-[var(--colorBg)]/50 border-b-2 border-[var(--colorPrimary)]/50 focus:border-[var(--colorPrimary)] outline-none transition-all duration-200 placeholder:text-[var(--colorTextDark)]/40`;
    btnCls = "w-full flex items-center justify-center py-5 rounded-full bg-[var(--colorTextDark)] text-[var(--colorBg)] font-sans text-sm font-bold tracking-widest uppercase hover:bg-[var(--colorPrimary)] hover:text-white transition-all duration-300 shadow-xl";
  } else if (layout === 3) {
    inputCls = `w-full px-4 py-3 font-serif text-base bg-[var(--colorPrimary)]/5 text-[var(--colorTextDark)] placeholder:text-[var(--colorTextDark)]/40 border border-[var(--colorPrimary)]/40 outline-none focus:border-[var(--colorPrimary)] focus:ring-1 focus:ring-[var(--colorPrimary)] transition-all duration-200 shadow-inner`;
    btnCls = "w-full flex items-center justify-center py-4 bg-[var(--colorTextDark)] text-[var(--colorBg)] font-sans text-xs font-bold tracking-widest uppercase shadow-lg hover:bg-[var(--colorPrimary)] hover:text-white transition-all duration-300 border border-[var(--colorPrimary)]";
  } else if (layout === 4) {
    inputCls = `w-full px-6 py-4 rounded-none font-serif text-lg bg-white border border-[var(--colorTextDark)]/10 focus:border-[var(--colorPrimary)] outline-none transition-all duration-300 placeholder:opacity-30`;
    btnCls = "w-full flex items-center justify-center py-5 bg-[var(--colorTextDark)] text-white font-sans text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-[var(--colorPrimary)] transition-all duration-500 shadow-2xl";
    optionBtnCls = (active) => `flex items-center gap-3 cursor-pointer font-serif text-lg px-6 py-3 border transition-all duration-300 ${active ? 'bg-[var(--colorPrimary)] text-white border-[var(--colorPrimary)] shadow-lg scale-105' : 'bg-white border-[var(--colorTextDark)]/10 text-[var(--colorTextDark)]/60 hover:border-[var(--colorPrimary)]'}`;
  }

  if (status === 'success') {
    return (
      <section
        id="rsvp"
        className="py-20 md:py-28 transition-colors duration-500"
        style={{
          backgroundColor: 'var(--colorBg)',
          ...(config.sectionBackgrounds?.rsvp ? {
            backgroundImage: `url(${config.sectionBackgrounds.rsvp})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          } : {})
        }}
      >
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className={`${layout === 4 ? 'bg-white' : 'bg-[var(--colorPrimary)]/10'} border border-[var(--colorPrimary)]/25 rounded-2xl p-10 shadow-xl`}>
            <p className="text-4xl mb-4 text-[var(--colorPrimary)] drop-shadow-sm">🌿</p>
            <h2 className="font-serif text-3xl text-[var(--colorTextDark)] mb-4 italic">Thank You</h2>
            <p className="font-serif text-xl text-[var(--colorTextDark)]/80 leading-relaxed">
              Your reply has been received.<br />We look forward to celebrating with you!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="rsvp"
      className="py-20 md:py-32 relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: 'var(--colorBg)' }}
    >
      {/* ── BLURRED BACKGROUND LAYER ── */}
      {config.sectionBackgrounds?.rsvp && (
        <div
          className="absolute inset-0 z-0 pointer-events-none transition-transform duration-1000"
          style={{
            backgroundImage: `url(${config.sectionBackgrounds.rsvp})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            filter: 'blur(15px)',
            transform: 'scale(1.05)',
            opacity: 0.5
          }}
        />
      )}
      <div className="absolute inset-0 bg-white/5 z-[1] pointer-events-none" />
      {layout === 1 && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 80%, var(--colorPrimary) 0%, transparent 55%), radial-gradient(circle at 80% 20%, var(--colorPrimary) 0%, transparent 55%)', opacity: 0.05 }} />
      )}
      {layout === 3 && (
        <>
          <div className="absolute inset-8 border border-[var(--colorPrimary)] pointer-events-none opacity-30 mix-blend-multiply" />
          <div className="absolute inset-12 border border-[var(--colorPrimary)] pointer-events-none opacity-20 outline outline-1 outline-offset-2 outline-[var(--colorPrimary)]" />
        </>
      )}

      <div className={`relative max-w-2xl mx-auto px-6 transition-        layout === 4 ? 'bg-white p-10 md:p-16 shadow-2xl border-t-[12px] border-[var(--colorPrimary)]'
        : layout === 3 ? 'bg-[var(--colorBg)] p-8 md:p-14 shadow-2xl border border-[var(--colorPrimary)]/30' 
        : layout === 2 ? 'bg-white/40 p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[40px] border border-white/60 backdrop-blur-md'
        : 'bg-[var(--colorPrimary)]/5 p-6 md:p-10 border border-[var(--colorPrimary)]/20'
      }`}>

        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 opacity-0 translate-y-8 transition-all duration-1000">
          {layout === 4 ? (
            <>
              <h2 className="font-sans text-5xl md:text-6xl font-bold text-[var(--colorTextDark)] mb-4 tracking-tighter">R.S.V.P.</h2>
              <p className="font-sans text-xs md:text-sm text-[var(--colorTextDark)] opacity-70">Kindly respond by {rsvp.deadline}</p>
            </>
          ) : layout === 3 ? (
            <>
              <span className="text-3xl text-[var(--colorPrimary)] mb-4 block">❀</span>
              <h2 className="font-serif text-4xl md:text-5xl text-[var(--colorTextDark)] mb-4 tracking-wide">Please Confirm.</h2>
              <div className="w-24 h-0.5 bg-[var(--colorPrimary)] mx-auto opacity-60 mb-4" />
              <p className="font-sans text-xs tracking-widest uppercase text-[var(--colorTextDark)]/80">Please respond by {rsvp.deadline}</p>
            </>
          ) : layout === 2 ? (
            <>
              <h2 className="font-serif text-4xl md:text-6xl font-bold uppercase tracking-widest text-[var(--colorTextDark)] mb-4 drop-shadow-sm">Please Confirm</h2>
              <p className="font-script text-3xl text-[var(--colorPrimary)] mb-6">We would love to see you</p>
              <div className="w-16 h-px bg-[var(--colorPrimary)] mx-auto opacity-70" />
              <p className="font-sans text-xs tracking-widest uppercase text-[var(--colorTextDark)]/70 mt-6">Respond by {rsvp.deadline}</p>
            </>
          ) : (
            <>
              <p className="font-sans text-[0.7rem] tracking-[0.3em] uppercase text-[var(--colorPrimary)] mb-3">We Hope to See You</p>
              <h2 className="font-serif text-4xl md:text-5xl font-normal text-[var(--colorTextDark)] mb-3">firm</h2>
              <span className="text-[var(--colorPrimary)]/60 text-2xl">❧</span>
              <p className="font-sans text-sm text-[var(--colorTextDark)]/55 mt-3">Kindly respond by <strong className="text-[var(--colorPrimary)]">{rsvp.deadline}</strong></p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8 relative z-10 w-full max-w-lg mx-auto">
          {/* ── ATTENDANCE HEARTS (Layout 4) ── */}
          {layout === 4 ? (
            <div className="flex justify-center gap-10 md:gap-16 mb-4">
              <button
                type="button"
                onClick={() => setFormData(f => ({ ...f, attendance: 'Attending' }))}
                className="flex flex-col items-center gap-3 group transition-transform hover:scale-105"
              >
                <div className={`transition-colors duration-300 ${formData.attendance === 'Attending' ? 'text-[var(--colorPrimary)]' : 'text-gray-300'}`}>
                  <HeartIcon size={80} fill={formData.attendance === 'Attending'} />
                </div>
                <span className="font-sans text-[10px] md:text-xs font-bold leading-tight text-center tracking-tight">I WILL BE<br />ATTENDING</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData(f => ({ ...f, attendance: 'Not Attending' }))}
                className="flex flex-col items-center gap-3 group transition-transform hover:scale-105"
              >
                <div className={`transition-colors duration-300 ${formData.attendance === 'Not Attending' ? 'text-[var(--colorPrimary)]' : 'text-gray-300'}`}>
                  <HeartIcon size={80} fill={formData.attendance === 'Not Attending'} />
                </div>
                <span className="font-sans text-[10px] md:text-xs font-bold leading-tight text-center tracking-tight">I WILL NOT BE<br />ATTENDING</span>
              </button>
            </div>
          ) : (
            <div>
              <label className={labelCls}>Will you be attending? *</label>
              <div className="flex gap-3 flex-wrap">
                {[{ value: 'Attending', label: 'Joyfully Accept 🎉' }, { value: 'Not Attending', label: 'Regretfully Decline' }].map(({ value, label }) => (
                  <label key={value} className={optionBtnCls(formData.attendance === value)}>
                    <input type="radio" name="attendance" value={value} className="sr-only" checked={formData.attendance === value} onChange={() => setFormData(f => ({ ...f, attendance: value }))} />
                    {label}
                  </label>
                ))}
              </div>
              {errors.attendance && <p className="text-red-400 text-xs mt-1">{errors.attendance}</p>}
            </div>
          )}

          {/* ── GUEST SELECTION (Layout 4 style) ── */}
          {formData.attendance === 'Attending' && layout === 4 && (
            <div className="flex items-center justify-center gap-4 py-4 border-y border-gray-100">
              <span className="font-sans text-sm text-[var(--colorTextDark)] opacity-60">How many guests will attend?</span>
              <select
                className="w-16 h-10 border border-gray-300 rounded text-center font-sans font-bold text-sm cursor-pointer hover:border-[var(--colorPrimary)] transition-colors"
                value={formData.guests}
                onChange={e => setFormData(f => ({ ...f, guests: e.target.value }))}
              >
                {guestOptions.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          )}

          {/* ── NAME & CONTACT (Updated Layout 4) ── */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center w-full">
              <label className={`${labelCls} !text-[var(--colorTextDark)] !opacity-100 !mb-2 !font-bold`}>Your Name</label>
              <input
                type="text"
                placeholder=""
                className={`${inputCls} text-center border-gray-200 focus:border-[var(--colorPrimary)] ${errors.name ? '!border-red-400' : ''}`}
                value={formData.name}
                onChange={e => { setFormData(f => ({ ...f, name: e.target.value })); setErrors(x => ({ ...x, name: '' })); }}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="flex flex-col items-center w-full">
              <label className={`${labelCls} !text-[var(--colorTextDark)] !opacity-100 !mb-2 !font-bold`}>Your Contact Number:</label>
              <input
                type="tel"
                placeholder=""
                className={`${inputCls} text-center border-gray-200 focus:border-[var(--colorPrimary)]`}
                value={formData.phone}
                onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
              />
            </div>
          </div>

          {/* ── MESSAGE (Hidden in Layout 4 as per image) ── */}
          {layout !== 4 && (
            <div>
              <label className={labelCls}>Message for the Couple (optional)</label>
              <textarea rows={3} placeholder="Write your wishes here…" className={`${inputCls} resize-y min-h-[100px]`} value={formData.message} onChange={e => setFormData(f => ({ ...f, message: e.target.value }))} />
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className={`${layout === 4 ? 'bg-[var(--colorPrimary)] text-white py-5 rounded shadow-lg hover:brightness-110 active:scale-[0.98] transition-all !font-bold tracking-widest uppercase text-sm' : btnCls} mt-4`}
          >
            {status === 'loading' ? <span className="w-5 h-5 rounded-full border-2 border-[var(--colorBg)] border-t-transparent animate-spin mx-auto" /> : (layout === 4 ? 'SEND' : 'Send My Reply')}
          </button>

          {status === 'error' && (
            <p className="text-center text-red-500 text-sm font-sans mt-2">
              Oops! Something went wrong. Please try again or contact us directly.
            </p>
          )}
        </form>
      </div>

      {/* Floating corner detail (Layout 4) */}
      {layout === 4 && (
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10 pointer-events-none translate-x-4 grayscale sepia">
          <img src="/images/nature-arch-bg.png" className="w-full h-full object-contain" />
        </div>
      )}
    </section>
  );
}

// ── HeartIcon Helper ──
function HeartIcon({ size = 60, fill = false }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth="1"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.89-8.89 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
