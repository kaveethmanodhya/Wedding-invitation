'use client';
import { useState, useRef, useEffect } from 'react';
import { getDietaryTitle, getDietaryItems, getInitialDietary, buildDietaryString } from '../../lib/dietary';

export default function RSVPSection({ config, labels = {} }) {
  const rsvp = config?.rsvp || {};
  const dietaryItems = getDietaryItems(config);
  const dietaryTitle = getDietaryTitle(config);
  const currentLayout = config?.heroLayout || 1;

  // Check both dynamic paths
  const layoutSpecificFields = config?.layoutSettings?.[`layout_${currentLayout}`]?.rsvpFields;
  const globalFields = config?.rsvp?.fields;

  const defaultRsvpFields = [
    { id: "guestName", type: "text", label: "Guest Name", placeholder: "Enter your full name", required: true },
    { id: "attending", type: "button-group", label: "Attending?", options: "Joyfully Accept,Regretfully Decline", required: true },
    { id: "guestCount", type: "guest-count", label: "Guest Count", placeholder: "1", required: true },
    { id: "menu", type: "checkbox-group", label: "Menu Choice", options: "Chicken,Fish,Vegetarian", required: false },
    { id: "message", type: "textarea", label: "Message to the Couple", placeholder: "Write your wishes here...", required: false }
  ];

  // Safely determine which fields to render
  const fieldsToRender = (layoutSpecificFields && layoutSpecificFields.length > 0) 
    ? layoutSpecificFields 
    : (globalFields && globalFields.length > 0) 
      ? globalFields 
      : defaultRsvpFields;

  const [formData, setFormData] = useState({});
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
  const isAttending = formData.attending && formData.attending.toLowerCase().includes('yes');

  function validate() {
    const e = {};
    fieldsToRender.forEach(field => {
      if (field.required && !formData[field.id]?.toString().trim()) {
        e[field.id] = 'This field is required.';
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleCheckboxChange = (fieldId, option, isChecked) => {
    let current = formData[fieldId] ? formData[fieldId].split(', ') : [];
    if (isChecked) current.push(option);
    else current = current.filter(o => o !== option);
    setFormData({ ...formData, [fieldId]: current.join(', ') });
  };

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('loading');

    try {
      const fieldsText = fieldsToRender.map(field => {
        return `*${field.label}:* ${formData[field.id] || 'Not provided'}`;
      }).join('\n');

      const waMessage = `${labels.rsvpMessageHeader || '💍 *Wedding Invitation Reply* 💍'}\n\n${fieldsText}`;

      // 1. WhatsApp redirect
      const encodedMessage = encodeURIComponent(waMessage);
      const cleanNumber = (rsvp?.whatsappNumber || '').replace(/[+\s-]/g, '').replace(/^0+/, '');
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');

      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  const guestOptions = Array.from({ length: rsvp?.maxGuests || 2 }, (_, i) => i + 1);

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
  } else if (layout === 5) {
    inputCls = `w-full px-4 py-3 rounded-none border-2 border-[var(--colorTextDark)] bg-white focus:bg-[var(--colorPrimary)]/5 outline-none transition-all font-sans text-sm uppercase tracking-widest`;
    btnCls = "w-full py-4 bg-[var(--colorTextDark)] text-white font-sans text-xs font-black uppercase tracking-[0.5em] hover:bg-white hover:text-[var(--colorTextDark)] border-2 border-[var(--colorTextDark)] transition-all shadow-[8px_8px_0_var(--colorPrimary)]";
  } else if (layout === 6) {
    inputCls = `w-full px-5 py-3 rounded-[30px] border border-[var(--colorPrimary)]/20 bg-white/50 focus:bg-white outline-none transition-all font-serif italic text-lg`;
    btnCls = "w-full py-4 rounded-[30px] bg-[var(--colorPrimary)] text-white font-sans text-xs font-bold tracking-widest uppercase hover:opacity-80 transition-opacity shadow-lg";
  } else if (layout === 7) {
    inputCls = `w-full px-4 py-3 bg-white border-b-2 border-slate-200 focus:border-[var(--colorPrimary)] outline-none transition-all font-script text-xl`;
    btnCls = "w-full py-3 bg-slate-800 text-white font-script text-2xl hover:bg-[var(--colorPrimary)] transition-all rounded-sm shadow-md";
  } else if (layout === 8) {
    inputCls = `w-full px-4 py-3 rounded-lg border-2 border-[var(--colorPrimary)]/30 bg-white focus:border-[var(--colorPrimary)] outline-none transition-all font-sinhala text-base`;
    btnCls = "w-full py-4 rounded-xl bg-[var(--colorPrimary)] text-white font-sinhala text-lg hover:bg-[var(--colorTextDark)] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)]";
  }

  if (status === 'success') {
    return (
      <section
        id="rsvp"
        className="py-20 md:py-28 transition-colors duration-500"
        style={{
          backgroundColor: 'var(--colorBg)',
          ...(config?.sectionBackgrounds?.rsvp ? {
            backgroundImage: `url(${config.sectionBackgrounds.rsvp})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(255,255,255,0.8)'
          } : {})
        }}
      >
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className={`${layout === 4 ? 'bg-white text-[var(--colorTextDark)]' : 'bg-[var(--colorPrimary)]/10 text-[var(--colorTextDark)]'} border border-[var(--colorPrimary)]/25 rounded-2xl p-10 shadow-xl`}>
            <p className="text-4xl mb-4 text-[var(--colorPrimary)] drop-shadow-sm">🌿</p>
            <h2 className="font-serif text-3xl mb-4 italic text-[var(--colorTextDark)]">Thank You</h2>
            <p className="font-serif text-xl leading-relaxed text-[var(--colorTextDark)]/80">
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
      {/* ── SECTION BACKGROUND IMAGE ── */}
      {config?.sectionBackgrounds?.rsvp && (
        <div
          className="absolute inset-0 z-0 pointer-events-none transition-transform duration-1000"
          style={{
            backgroundImage: `url(${config.sectionBackgrounds.rsvp})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            transform: 'scale(1.02)',
            opacity: 0.85
          }}
        />
      )}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-white/5" />
      {layout === 1 && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 80%, var(--colorPrimary) 0%, transparent 55%), radial-gradient(circle at 80% 20%, var(--colorPrimary) 0%, transparent 55%)', opacity: 0.05 }} />
      )}
      {layout === 3 && (
        <>
          <div className="absolute inset-8 border border-[var(--colorPrimary)] pointer-events-none opacity-30 mix-blend-multiply" />
          <div className="absolute inset-12 border border-[var(--colorPrimary)] pointer-events-none opacity-20 outline outline-1 outline-offset-2 outline-[var(--colorPrimary)]" />
        </>
      )}

      <div className={`relative max-w-2xl mx-auto px-6 transition-all ${layout === 4 ? 'bg-white p-10 md:p-16 shadow-2xl border-t-[12px] border-[var(--colorPrimary)]'
        : layout === 3 ? 'bg-[var(--colorBg)] p-8 md:p-14 shadow-2xl border border-[var(--colorPrimary)]/30'
          : layout === 2 ? 'bg-white/40 p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[40px] border border-white/60 backdrop-blur-md'
            : 'bg-[var(--colorPrimary)]/5 p-6 md:p-10 border border-[var(--colorPrimary)]/20'
        }`}>

        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 opacity-0 translate-y-8 transition-all duration-1000">
          {layout === 4 ? (
            <>
              <h2 className="font-sans text-5xl md:text-6xl font-bold text-[var(--colorTextDark)] mb-4 tracking-tighter">Please Confirm</h2>
              <p className="font-sans text-xs md:text-sm text-[var(--colorTextDark)] opacity-70">Kindly respond by {rsvp?.deadline || ''}</p>
            </>
          ) : layout === 3 ? (
            <>
              <span className="text-3xl text-[var(--colorPrimary)] mb-4 block">❀</span>
              <h2 className="font-serif text-4xl md:text-5xl text-[var(--colorTextDark)] mb-4 tracking-wide">Please Confirm</h2>
              <div className="w-24 h-0.5 bg-[var(--colorPrimary)] mx-auto opacity-60 mb-4" />
              <p className="font-sans text-xs tracking-widest uppercase text-[var(--colorTextDark)]/80">Please respond by {rsvp?.deadline || ''}</p>
            </>
          ) : layout === 2 ? (
            <>
              <h2 className="font-serif text-4xl md:text-6xl font-bold uppercase tracking-widest text-[var(--colorTextDark)] mb-4 drop-shadow-sm">Please Confirm</h2>
              <p className="font-script text-3xl text-[var(--colorPrimary)] mb-6">We would love to see you</p>
              <div className="w-16 h-px bg-[var(--colorPrimary)] mx-auto opacity-70" />
              <p className="font-sans text-xs tracking-widest uppercase text-[var(--colorTextDark)]/70 mt-6">Respond by {rsvp?.deadline || ''}</p>
            </>
          ) : (
            <>
              <p className="font-sans text-[0.7rem] tracking-[0.3em] uppercase text-[var(--colorPrimary)] mb-3">{layout === 8 ? 'අපි ඔබ එනතුරු බලා සිටිමු' : 'We Hope to See You'}</p>
              <h2 className={layout === 8 ? 'font-sinhala text-4xl md:text-5xl font-normal text-[var(--colorTextDark)] mb-3' : 'font-serif text-4xl md:text-5xl font-normal text-[var(--colorTextDark)] mb-3'}>
                {layout === 8 ? 'ඔබේ සහභාගීත්වය තහවුරු කරන්න' : 'Please Confirm'}
              </h2>
              <span className="text-[var(--colorPrimary)]/60 text-2xl">❧</span>
              <p className="font-sans text-sm text-[var(--colorTextDark)]/55 mt-3">
                {layout === 8 ? 'කරුණාකර ' : 'Kindly respond by '}
                <strong className="text-[var(--colorPrimary)]">{rsvp?.deadline || ''}</strong>
                {layout === 8 ? ' දිනට පෙර දන්වන්න' : ''}
              </p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8 relative z-10 w-full max-w-lg mx-auto">
          {fieldsToRender.map((field, idx) => (
            <div key={field.id || idx} className="flex flex-col">
              <label className={labelCls}>
                {field.label} {field.required && "*"}
              </label>

              {field.type === 'textarea' ? (
                <textarea name={field.id} required={field.required} placeholder={field.placeholder} className={`${inputCls} resize-y min-h-[100px]`} value={formData[field.id] || ''} onChange={e => setFormData({ ...formData, [field.id]: e.target.value })} />
              ) : field.type === 'button-group' ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  {field.options?.split(',').map((opt, i) => {
                    const active = formData[field.id] === opt.trim();
                    return (
                      <label key={i} className={optionBtnCls(active) + " flex-1 justify-center text-center"}>
                        <input type="radio" name={field.id} value={opt.trim()} className="hidden" required={field.required && !formData[field.id]} onChange={e => setFormData({ ...formData, [field.id]: e.target.value })} />
                        {opt.trim()}
                      </label>
                    );
                  })}
                </div>
              ) : field.type === 'checkbox-group' ? (
                <div className="flex flex-col gap-2 mt-1">
                  {field.options?.split(',').map((opt, i) => {
                    const isChecked = (formData[field.id] || '').includes(opt.trim());
                    return (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-[var(--colorPrimary)] border-[var(--colorPrimary)] text-white' : 'bg-white border-slate-300'}`}>
                          {isChecked && <CheckIcon size={12} />}
                        </div>
                        <input type="checkbox" className="hidden" value={opt.trim()} onChange={e => handleCheckboxChange(field.id, opt.trim(), e.target.checked)} />
                        <span className="font-sans text-sm text-[var(--colorTextDark)]/80 group-hover:text-[var(--colorTextDark)]">{opt.trim()}</span>
                      </label>
                    );
                  })}
                </div>
              ) : field.type === 'guest-count' ? (
                <select name={field.id} required={field.required} className={`${inputCls} appearance-none cursor-pointer`} value={formData[field.id] || ''} onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}>
                  <option value="">-- Number of Guests --</option>
                  {Array.from({ length: config?.rsvp?.maxGuests || 5 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              ) : field.type === 'select' ? (
                <div className="relative">
                  <select name={field.id} required={field.required} className={`${inputCls} appearance-none cursor-pointer`} value={formData[field.id] || ''} onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}>
                    <option value="">-- Please Select --</option>
                    {field.options?.split(',').map((opt, i) => (
                      <option key={i} value={opt.trim()}>{opt.trim()}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <input type={field.type} name={field.id} required={field.required} placeholder={field.placeholder} className={inputCls} value={formData[field.id] || ''} onChange={e => setFormData({ ...formData, [field.id]: e.target.value })} />
              )}
              {errors[field.id] && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-widest">{errors[field.id]}</p>}
            </div>
          ))}

          <button
            type="submit"
            disabled={status === 'loading'}
            className={btnCls}
          >
            {status === 'loading' ? (
              <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : status === 'success' ? (
              <>{layout === 8 ? 'සාර්ථකයි ✨' : 'Sent ✨'}</>
            ) : (
              <>{layout === 8 ? 'සහභාගීත්වය දන්වන්න (WhatsApp)' : 'Confirm via WhatsApp'}</>
            )}
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

// ── CheckIcon Helper ──
function CheckIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
