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
  }

  if (status === 'success') {
    return (
      <section id="rsvp" className={`${bgClass} py-20 md:py-28 transition-colors duration-500`}>
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="bg-[var(--colorPrimary)]/10 border border-[var(--colorPrimary)]/25 rounded-2xl p-10">
            <p className="text-4xl mb-4 text-[var(--colorPrimary)] drop-shadow-sm">💌</p>
            <p className="font-serif text-xl md:text-2xl text-[var(--colorTextDark)] leading-relaxed">
              Thank you! Your Reply has been received.<br />We look forward to celebrating with you.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className={`${bgClass} py-20 md:py-32 relative overflow-hidden transition-colors duration-500`}>
      {layout === 1 && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 80%, var(--colorPrimary) 0%, transparent 55%), radial-gradient(circle at 80% 20%, var(--colorPrimary) 0%, transparent 55%)', opacity: 0.05 }} />
      )}
      {layout === 3 && (
        <>
          <div className="absolute inset-8 border border-[var(--colorPrimary)] pointer-events-none opacity-30 mix-blend-multiply" />
          <div className="absolute inset-12 border border-[var(--colorPrimary)] pointer-events-none opacity-20 outline outline-1 outline-offset-2 outline-[var(--colorPrimary)]" />
        </>
      )}

      <div className={`relative max-w-2xl mx-auto px-6 ${
        layout === 3 ? 'bg-[var(--colorBg)] p-8 md:p-14 shadow-2xl border border-[var(--colorPrimary)]/30' 
        : layout === 2 ? 'bg-white/40 p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[40px] border border-white/60 backdrop-blur-md'
        : 'bg-[var(--colorPrimary)]/5 p-6 md:p-10 border border-[var(--colorPrimary)]/20'
      }`}>
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 opacity-0 translate-y-8 transition-all duration-700">
          {layout === 3 ? (
            <>
              <span className="text-3xl text-[var(--colorPrimary)] mb-4 block">❀</span>
              <h2 className="font-serif text-4xl md:text-5xl text-[var(--colorTextDark)] mb-4 tracking-wide">Please Confirm</h2>
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
              <h2 className="font-serif text-4xl md:text-5xl font-normal text-[var(--colorTextDark)] mb-3">Please Confirm</h2>
              <span className="text-[var(--colorPrimary)]/60 text-2xl">❧</span>
              <p className="font-sans text-sm text-[var(--colorTextDark)]/55 mt-3">Kindly respond by <strong className="text-[var(--colorPrimary)]">{rsvp.deadline}</strong></p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 relative z-10 w-full max-w-lg mx-auto">
          <div>
            <label className={labelCls}>Name *</label>
            <input type="text" placeholder="Your full name" className={`${inputCls} ${errors.name ? '!border-red-400' : ''}`} value={formData.name} onChange={e => { setFormData(f => ({ ...f, name: e.target.value })); setErrors(x => ({ ...x, name: '' })); }} />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className={labelCls}>Phone Number</label>
            <input type="tel" placeholder="+94 77 123 4567" className={inputCls} value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} />
          </div>

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

          {isAttending && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[var(--colorPrimary)]/5 border border-[var(--colorPrimary)]/10">
              <div>
                <label className={labelCls}>Guests</label>
                <select className={`${inputCls} cursor-pointer`} value={formData.guests} onChange={e => setFormData(f => ({ ...f, guests: e.target.value }))}>
                  {guestOptions.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Events</label>
                <div className="flex gap-2 flex-wrap">
                  {[{ key: 'ceremony', label: 'Ceremony' }].map(({ key, label }) => (
                    <label key={key} className={optionBtnCls(formData.events[key])}>
                      <input type="checkbox" className="sr-only" checked={formData.events[key]} onChange={e => setFormData(f => ({ ...f, events: { ...f.events, [key]: e.target.checked } }))} />
                      <span className={`w-4 h-4 border flex items-center justify-center text-xs ${formData.events[key] ? 'bg-[var(--colorPrimary)] border-[var(--colorPrimary)] text-white' : 'border-gray-400'}`}>
                        {formData.events[key] && '✓'}
                      </span>
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className={labelCls}>Message for the Couple (optional)</label>
            <textarea rows={3} placeholder="Write your wishes here…" className={`${inputCls} resize-y min-h-[100px]`} value={formData.message} onChange={e => setFormData(f => ({ ...f, message: e.target.value }))} />
          </div>

          <button type="submit" disabled={status === 'loading'} className={`${btnCls} mt-4`}>
            {status === 'loading' ? <span className="w-5 h-5 rounded-full border-2 border-[var(--colorBg)] border-t-transparent animate-spin" /> : 'Send My Reply'}
          </button>

          {status === 'error' && (
            <p className="text-center text-red-500 text-sm font-sans mt-2">
               Oops! Something went wrong. Please try again or contact us directly.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
