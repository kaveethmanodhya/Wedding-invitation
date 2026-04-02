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
      // Sanitize the number: remove +, space, - and any leading 0
      const cleanNumber = rsvp.whatsappNumber.replace(/[+\s-]/g, '').replace(/^0+/, '');
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');

      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  const inputCls = `w-full px-4 py-3 rounded-lg font-serif text-base
    bg-[var(--colorBg)] text-[var(--colorTextDark)] placeholder:text-[var(--colorTextDark)]/35 placeholder:italic
    border-[1.5px] border-[var(--colorPrimary)]/25 outline-none
    focus:border-[var(--colorPrimary)] focus:ring-2 focus:ring-[var(--colorPrimary)]/15
    transition-all duration-200`;

  const labelCls = 'block font-sans text-xs font-semibold tracking-[0.1em] uppercase text-[var(--colorTextDark)]/60 mb-1.5';

  const guestOptions = Array.from({ length: rsvp.maxGuests }, (_, i) => i + 1);

  if (status === 'success') {
    return (
      <section id="rsvp" className="bg-[var(--colorBg)] py-20 md:py-28">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="bg-[var(--colorPrimary)]/10 border border-[var(--colorPrimary)]/25 rounded-2xl p-10">
            <p className="text-4xl mb-4">💌</p>
            <p className="font-serif text-xl text-[var(--colorTextDark)] leading-relaxed">
              Thank you! Your Reply has been received.
              <br />We look forward to celebrating with you!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="bg-[var(--colorBg)] py-20 md:py-28 relative overflow-hidden">
      {/* Subtle radial bg tints */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 20% 80%, var(--colorPrimary) 0%, transparent 55%), radial-gradient(circle at 80% 20%, var(--colorPrimary) 0%, transparent 55%)', opacity: 0.05 }}
      />

      <div className="relative max-w-xl mx-auto px-6">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-10 opacity-0 translate-y-8 transition-all duration-700"
        >
          <p className="font-sans text-[0.7rem] tracking-[0.3em] uppercase text-[var(--colorPrimary)] mb-3">
            We Hope to See You
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-normal text-[var(--colorTextDark)] mb-3">Please Respond</h2>
          <span className="text-[var(--colorPrimary)]/60 text-2xl">❧</span>
          <p className="font-sans text-sm text-[var(--colorTextDark)]/55 mt-3">
            Kindly respond by <strong>{rsvp.deadline}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Name */}
          <div>
            <label className={labelCls}>Name *</label>
            <input type="text" placeholder="Your full name" className={`${inputCls} ${errors.name ? 'border-red-400' : ''}`}
              value={formData.name}
              onChange={e => { setFormData(f => ({ ...f, name: e.target.value })); setErrors(x => ({ ...x, name: '' })); }}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>


          {/* Phone */}
          <div>
            <label className={labelCls}>Phone Number</label>
            <input type="tel" placeholder="+94 77 123 4567" className={inputCls}
              value={formData.phone}
              onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
            />
          </div>

          {/* Attendance */}
          <div>
            <label className={labelCls}>Will you be attending? *</label>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: 'Attending', label: 'Joyfully Accept 🎉' },
                { value: 'Not Attending', label: 'Regretfully Decline' },
              ].map(({ value, label }) => (
                <label key={value}
                  className={`flex items-center gap-2.5 cursor-pointer font-serif text-base
                    px-4 py-2.5 rounded-xl border-[1.5px] transition-all duration-200
                    ${formData.attendance === value
                      ? 'bg-[var(--colorPrimary)]/10 border-[var(--colorPrimary)] text-[var(--colorTextDark)]'
                      : 'bg-[var(--colorBg)] border-[var(--colorPrimary)]/25 text-[var(--colorTextDark)]/70'}`}
                >
                  <input type="radio" name="attendance" value={value} className="sr-only"
                    checked={formData.attendance === value}
                    onChange={() => setFormData(f => ({ ...f, attendance: value }))}
                  />
                  {label}
                </label>
              ))}
            </div>
            {errors.attendance && <p className="text-red-400 text-xs mt-1">{errors.attendance}</p>}
          </div>

          {/* Guests + Events — only if attending */}
          {isAttending && (
            <>
              <div>
                <label className={labelCls}>Number of Guests (including yourself)</label>
                <select
                  className={`${inputCls} cursor-pointer`}
                  value={formData.guests}
                  onChange={e => setFormData(f => ({ ...f, guests: e.target.value }))}
                >
                  {guestOptions.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Which events will you attend?</label>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { key: 'ceremony', label: 'Ceremony' },
                  ].map(({ key, label }) => (
                    <label key={key}
                      className={`flex items-center gap-2 cursor-pointer font-serif text-base
                        px-4 py-2.5 rounded-xl border-[1.5px] transition-all duration-200
                        ${formData.events[key]
                      ? 'bg-[var(--colorPrimary)]/10 border-[var(--colorPrimary)] text-[var(--colorTextDark)]'
                      : 'bg-[var(--colorBg)] border-[var(--colorPrimary)]/25 text-[var(--colorTextDark)]/70'}`}
                >
                  <input type="checkbox" className="sr-only"
                    checked={formData.events[key]}
                    onChange={e => setFormData(f => ({ ...f, events: { ...f.events, [key]: e.target.checked } }))}
                  />
                  <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs
                    ${formData.events[key] ? 'bg-[var(--colorPrimary)] border-[var(--colorPrimary)] text-white' : 'border-[var(--colorPrimary)]/40'}`}>
                    {formData.events[key] && '✓'}
                  </span>
                  {label}
                </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Message */}
          <div>
            <label className={labelCls}>Message for the Couple (optional)</label>
            <textarea
              rows={3} placeholder="Write your wishes here…"
              className={`${inputCls} resize-y min-h-[80px]`}
              value={formData.message}
              onChange={e => setFormData(f => ({ ...f, message: e.target.value }))}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-full
              bg-[var(--colorPrimary)] text-white font-sans text-xs font-bold tracking-widest uppercase
              shadow-[0_4px_18px_var(--colorPrimary)/40]
              hover:bg-transparent hover:text-[var(--colorPrimary)] border border-[var(--colorPrimary)]
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-all duration-300"
          >
            {status === 'loading' ? (
              <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : 'Send My Reply'}
          </button>

          {status === 'error' && (
            <p className="text-center text-red-400 text-sm font-sans">
              Oops! Something went wrong. Please try again or contact us directly.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
