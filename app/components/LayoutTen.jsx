'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Calendar, MapPin, Music, Clock, Check, ChevronDown,
  ArrowRight, Mail, Navigation, Info, Users
} from 'lucide-react';
import { PRESET_THEMES } from '../../lib/themes';

// ── Elaborate SVG Mandalas ──
const TopMandala = ({ className = "" }) => (
  <svg 
    viewBox="0 0 1000 300" 
    preserveAspectRatio="xMidYMin slice" 
    className={`fill-current ${className}`}
  >
    <path d="M500 300 C400 300, 300 200, 250 100 C200 0, 100 0, 0 0 L1000 0 C900 0, 800 0, 750 100 C700 200, 600 300, 500 300 Z" opacity="0.05" />
    <path d="M500 250 C420 250, 340 170, 300 80 C260 0, 150 0, 0 0 L1000 0 C850 0, 740 0, 700 80 C660 170, 580 250, 500 250 Z" opacity="0.1" />
    <path d="M500 200 C450 200, 400 140, 360 80 C320 20, 200 0, 0 0 L1000 0 C800 0, 680 20, 640 80 C600 140, 550 200, 500 200 Z" opacity="0.15" />
    <circle cx="500" cy="0" r="160" fill="transparent" stroke="currentColor" strokeWidth="2" opacity="0.4" />
    <circle cx="500" cy="0" r="210" fill="transparent" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" opacity="0.5" />
    <circle cx="500" cy="0" r="260" fill="transparent" stroke="currentColor" strokeWidth="3" opacity="0.2" />
    <path d="M340 0 A 160 160 0 0 0 660 0" fill="transparent" stroke="currentColor" strokeWidth="2" opacity="0.2" />
    {[...Array(17)].map((_, i) => {
      const angle1 = (Math.PI / 16) * i;
      const angle2 = (Math.PI / 16) * (i + 0.5);
      const c = Math.cos, s = Math.sin;
      return (
        <polygon
          key={i}
          points={`500,0 ${500 + c(angle1) * 140},${s(angle1) * 140} ${500 + c(angle2) * 160},${s(angle2) * 160}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.6"
        />
      )
    })}
    {[...Array(25)].map((_, i) => {
      const angle = (Math.PI / 24) * i;
      const pointX = 500 + Math.cos(angle) * 230;
      const pointY = Math.sin(angle) * 230;
      return <circle key={`dot-${i}`} cx={pointX} cy={pointY} r="3" fill="currentColor" opacity="0.7" />
    })}
  </svg>
);

const BottomMandala = ({ className = "" }) => (
  <div className={`rotate-180 transform ${className}`}>
    <TopMandala className="w-full h-full" />
  </div>
);



// ── Shared Blurred Background Layer ──
const SectionBackground = ({ image, opacity = 0.4 }) => {
  if (!image) return null;
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute inset-0 bg-cover bg-center blur-[6px] scale-[1.05]" 
        style={{ 
          backgroundImage: `url(${image})`,
          opacity: opacity
        }} 
      />
      {/* Subtle white/base gradient to help text pop */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20" />
    </div>
  );
};

export default function LayoutTen({ config }) {
  // Use admin panel theme setting
  const themeId = config.themeId || config.theme || 'gold';
  const theme = PRESET_THEMES.find(t => t.id === themeId)?.colors || config.theme || PRESET_THEMES[0].colors;

  const [formData, setFormData] = useState({
    name: '', phone: '', attendance: '', guests: '1',
    dietary: { vegetarian: false, vegan: false, glutenFree: false, noPorkBeef: false },
    message: ''
  });
  const [rsvpStatus, setRsvpStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.attendance) {
      setErrors({
        name: !formData.name.trim() ? 'Name required' : '',
        attendance: !formData.attendance ? 'Attendance required' : ''
      });
      return;
    }
    setRsvpStatus('loading');

    let dietaryNotes = Object.entries(formData.dietary)
      .filter(([_, value]) => value)
      .map(([key, _]) => key === 'noPorkBeef' ? 'No Pork/Beef' : key)
      .join(', ');

    const selectedEvents = formData.attendance === 'Accept' ? 'Yes' : 'No';

    const waMessage = `💍 *Wedding RSVP* 💍\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone || 'N/A'}\n*Attendance:* ${formData.attendance === 'Accept' ? 'Joyfully Accept' : 'Regret Decline'}\n${formData.attendance === 'Accept' ? `*Guests:* ${formData.guests}\n*Dietary:* ${dietaryNotes || 'None'}\n` : ''}*Message:* ${formData.message || 'N/A'}`;
    const cleanNumber = config?.rsvp?.whatsappNumber?.replace(/[+\s-]/g, '') || '';
    if (cleanNumber) {
      window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(waMessage)}`, '_blank');
    }
    setRsvpStatus('success');
  };

  let hDay = 'WEDNESDAY', hMonth = 'APR', hDate = '15', hYear = '2026', hTime = 'AT 10:00 AM';
  if (config?.wedding?.dateTimeISO) {
    const d = new Date(config.wedding.dateTimeISO);
    if (!isNaN(d.getTime())) {
      hDay = d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
      hMonth = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      hDate = d.getDate().toString();
      hYear = d.getFullYear().toString();
      hTime = 'AT ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toUpperCase();
    }
  }

  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 8, minutes: 45, seconds: 22 });

  useEffect(() => {
    if (!config?.wedding?.dateTimeISO) return;
    const targetDate = new Date(config.wedding.dateTimeISO).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [config?.wedding?.dateTimeISO]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="relative min-h-screen font-serif"
      style={{ backgroundColor: theme.colorBg, color: theme.colorTextDark }}
    >


      {/* //  no need clode button */}

      {/* ── HERO SECTION ── */}
      <section 
        className="relative min-h-screen w-full flex flex-col items-center justify-center py-12 md:py-24 px-4 overflow-hidden z-20" 
        style={{ backgroundColor: theme.colorBg }}
      >
        <SectionBackground image={config.sectionBackgrounds?.hero} opacity={0.3} />
        
        {/* The White Card Container */}
        <div className="relative w-full max-w-[850px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.08)] rounded-[40px] overflow-hidden flex flex-col items-center justify-start pb-20 z-10 border border-[rgba(0,0,0,0.02)]">
            
            {/* Hero Background - 3:4 Aspect Ratio relative container */}
            {config?.heroImage && (
                <div className="relative w-full aspect-[3/4] z-0 overflow-hidden">
                   {/* Sharp Layer (Top) */}
                   <div className="absolute inset-0 z-0" style={{ maskImage: 'linear-gradient(to bottom, black 0%, transparent 65%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 65%)' }}>
                      <img src={config.heroImage} className="w-full h-full object-cover object-top" alt="Hero Background Sharp" />
                   </div>
                   {/* Blurred Layer (Bottom) */}
                   <div className="absolute inset-0 z-[1]" style={{ maskImage: 'linear-gradient(to top, black 0%, transparent 90%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 90%)' }}>
                      <img src={config.heroImage} className="w-full h-full object-cover object-top blur-[10px] scale-105" alt="Hero Background Blurred" />
                   </div>
                   {/* Fade to White at bottom */}
                   <div className="absolute inset-0 z-[2] bg-gradient-to-b from-transparent via-white/10 to-white" />
                </div>
            )}

             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] pointer-events-none z-30 opacity-40" style={{ color: theme.colorPrimary }}>
                <TopMandala className="w-full" />
             </div>

            <div className="relative z-20 flex-1 flex flex-col items-center justify-start px-4 w-full">






          {/* Content Over Background - Overlapping the blurred bottom */}
          <div className="mt-[-25%] md:mt-[-15%] text-center max-w-2xl mx-auto w-full z-20 px-4">
            
            <h1 className="flex flex-col items-center justify-center text-[3.5rem] md:text-[5.5rem] leading-[0.9] font-serif uppercase tracking-[0.2em] mb-12 drop-shadow-md" style={{ color: theme.colorTextDark }}>
              <span>{config?.couple?.groom?.firstName || 'Groom'}</span>
              <span className="text-2xl md:text-3xl font-sans font-light opacity-50 my-1">&</span>
              <span>{config?.couple?.bride?.firstName || 'Bride'}</span>
            </h1>

            {/* Date Banner Now Below Names */}
            <div className="flex items-center justify-center gap-6 md:gap-10 mb-12 z-30 opacity-90 scale-90 md:scale-100" style={{ color: theme.colorTextDark }}>
                <span className="font-sans text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase font-bold opacity-60">{hDay}</span>
                <div className="bg-white/80 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-xl flex flex-col items-center justify-center p-4 md:p-5 min-w-[70px] md:min-w-[90px] border border-black/5">
                    <span className="font-sans text-[8px] md:text-[9px] uppercase font-bold tracking-[0.2em] mb-1" style={{ color: theme.colorPrimary }}>{hMonth}</span>
                    <span className="text-3xl md:text-4xl font-serif leading-none">{hDate}</span>
                    <span className="font-sans text-[8px] md:text-[9px] uppercase tracking-[0.2em] mt-1 font-bold opacity-60">{hYear}</span>
                </div>
                <span className="font-sans text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase font-bold opacity-60">{hTime}</span>
            </div>

            <div className="flex items-center justify-center gap-4 mb-8 w-[80%] mx-auto" style={{ color: theme.colorTextLight }}>
              <div className="flex-1 h-[1px] bg-current opacity-30" />
              <span className="font-sans text-[8px] md:text-[10px] tracking-[0.4em] uppercase font-bold opacity-80">The Celebration Of</span>
              <div className="flex-1 h-[1px] bg-current opacity-30" />
            </div>

            <p className="font-serif italic text-xl md:text-2xl opacity-90 mx-auto max-w-[450px] leading-relaxed" style={{ color: theme.colorTextLight }}>
              Together with their families invite you to their wedding
            </p>
          </div>
        </div>
        {/* Global Bottom Mandala moved to absolute card bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] pointer-events-none z-30 opacity-40" style={{ color: theme.colorPrimary }}>
            <BottomMandala className="w-full" />
        </div>
      </div>
    </section>

      <section 
        className="py-20 px-6 relative overflow-visible" 
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl italic mb-16 drop-shadow-sm" style={{ color: theme.colorPrimary }}>The Celebration Begins In</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours.toString().padStart(2, '0') },
              { label: 'Minutes', value: timeLeft.minutes.toString().padStart(2, '0') },
              { label: 'Seconds', value: timeLeft.seconds.toString().padStart(2, '0') }
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-8 md:p-10 relative overflow-hidden group shadow-[0_20px_40px_rgba(0,0,0,0.15)] rounded-3xl"
                style={{ backgroundColor: theme.colorSurface }}
              >
                <div className="absolute inset-0 opacity-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" style={{ backgroundColor: theme.colorPrimary }} />
                <span className="relative z-10 block text-4xl md:text-6xl mb-3 font-medium drop-shadow-sm" style={{ color: theme.colorTextDark }}>
                  {item.value}
                </span>
                <span className="relative z-10 font-sans text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: theme.colorPrimary }}>{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section 
        className="py-16 px-6 text-center relative overflow-visible" 
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 md:w-96 z-40 opacity-40 pointer-events-none" style={{ color: theme.colorPrimary }}>
           <TopMandala className="w-full" />
        </div>
        <SectionBackground image={config.sectionBackgrounds?.story || config.story?.bgImage} opacity={0.4} />
        <div className="max-w-3xl mx-auto relative p-12 md:p-16 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)]" style={{ backgroundColor: theme.colorSurface }}>
          <span className="font-sans text-[10px] uppercase tracking-[0.5em] font-bold block mb-12" style={{ color: theme.colorPrimary }}>Our Story</span>

          <div className="absolute top-8 left-4 md:left-8 text-[120px] leading-none font-serif opacity-10" style={{ color: theme.colorTextDark }}>"</div>
          <p className="text-2xl md:text-3xl italic leading-relaxed px-6 relative z-10 drop-shadow-sm" style={{ color: theme.colorTextDark }}>
            {config?.story?.invitationText || "In the presence of our family and friends, we will share our vows and embark on an eternal journey of love."}
          </p>
          <div className="absolute bottom-[20%] right-4 md:right-8 text-[120px] leading-none font-serif opacity-10" style={{ color: theme.colorTextDark }}>"</div>

          <div className="w-16 h-[2px] mx-auto my-12 opacity-50 rounded-full" style={{ backgroundColor: theme.colorPrimary }} />

          {config?.story?.paragraphs && config.story.paragraphs.length > 0 && (
            <div className="space-y-6 text-center max-w-2xl mx-auto px-4 mt-8">
              {config.story.paragraphs.map((p, i) => (
                <p key={i} className="font-sans text-sm tracking-wide leading-relaxed opacity-80" style={{ color: theme.colorTextLight }}>{p}</p>
              ))}
            </div>
          )}
        </div>
      </section>

      {config?.gallery && config.gallery.length > 0 && (
        <section 
          className="py-16 px-6 relative overflow-visible" 
          style={{ backgroundColor: 'transparent' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 md:w-96 z-40 opacity-40 pointer-events-none" style={{ color: theme.colorPrimary }}>
             <TopMandala className="w-full" />
          </div>
          <SectionBackground image={config.sectionBackgrounds?.gallery || config.galleryConfig?.bgImage} opacity={0.4} />
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold" style={{ color: theme.colorPrimary }}>Captured Moments</span>
              <h2 className="text-4xl md:text-5xl italic mt-6 drop-shadow-sm" style={{ color: theme.colorPrimary }}>Photo Gallery</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {config.gallery.map((img, idx) => (
                <div key={idx} className="w-[calc(50%-0.5rem)] md:w-[calc(25%-1.2rem)] max-w-[280px] aspect-[4/5] relative overflow-hidden group rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.2)] border" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <img
                    src={typeof img === 'string' ? img : (img.src || img.url)}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading="lazy"
                    alt={`Gallery capture ${idx + 1}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t to-transparent opacity-90 translate-y-8 group-hover:translate-y-0 transition-transform duration-500" style={{ '--tw-gradient-from': theme.colorBg }} />
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex justify-center">
                    <Heart size={20} fill="currentColor" style={{ color: theme.colorPrimary }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EVENTS SECTION (Replaces Dummy Timeline) ── */}
      <section 
        className="py-16 px-6 relative overflow-visible" 
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 md:w-96 z-40 opacity-40 pointer-events-none" style={{ color: theme.colorPrimary }}>
           <TopMandala className="w-full" />
        </div>
        <SectionBackground image={config.sectionBackgrounds?.events || config.timelineConfig?.bgImage} opacity={0.4} />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          {config?.events?.ceremony?.image ? (
              <div className="w-full h-64 md:h-80 relative overflow-hidden mb-16 md:mb-24 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] isolate">
                <img src={config.events.ceremony.image} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-2">
                  <p className="font-sans text-[0.7rem] md:text-[10px] tracking-[0.4em] uppercase font-bold drop-shadow-md mb-2" style={{ color: theme.colorTextDark }}>Mark Your Calendar</p>
                  <h2 className="font-serif text-5xl md:text-7xl font-normal drop-shadow-lg tracking-wide" style={{ color: theme.colorBg }}>Event Details</h2>
                </div>
              </div>
          ) : (
             <div className="mb-20">
               <span className="font-sans text-[10px] uppercase tracking-[0.5em] font-bold block mb-4" style={{ color: theme.colorPrimary }}>The Celebration</span>
               <h2 className="text-4xl md:text-5xl italic drop-shadow-sm" style={{ color: theme.colorPrimary }}>Event Details</h2>
             </div>
          )}

          <div className={`flex flex-wrap justify-center gap-8 ${!config?.events || Object.keys(config.events).length === 0 ? 'hidden' : ''}`}>
            {Object.entries(config?.events || {}).map(([key, event], idx) => {
              const handleAddToCalendar = () => {
                const title = encodeURIComponent(`${config?.couple?.bride?.firstName || 'Wedding'}'s ${event?.title || 'Event'}`);
                const details = encodeURIComponent(`We would love to see you at our ${event?.title || 'Event'}! \n\nVenue: ${event?.venueName || ''}\nAddress: ${event?.address || ''}`);
                const location = encodeURIComponent(event?.address || event?.venueName || '');
                const dateStr = config?.wedding?.dateTimeISO || '';
                const start = dateStr.replace(/[-:]/g, '').split('.')[0] || '';
                const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${start}/${start}`;
                window.open(googleUrl, '_blank');
              };

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  viewport={{ once: true }}
                  className="w-full max-w-sm md:max-w-md bg-white p-2 shadow-[0_45px_100px_rgba(0,0,0,0.12)] rounded-[3rem] transition-transform hover:scale-[1.01]"
                >
                  <div className="w-full h-full border-2 flex flex-col items-center justify-between p-10 relative overflow-hidden rounded-[2.8rem] backdrop-blur-sm" style={{ borderColor: `${theme.colorPrimary}20` }}>
                      {/* Decorative corner mandala */}
                      <div className="absolute top-[-20%] left-[-20%] w-32 h-32 opacity-10 pointer-events-none" style={{ color: theme.colorPrimary }}>
                        <div className="rotate-45 scale-150"><TopMandala /></div>
                      </div>
                      {/* Decorative corner pieces optional */}
                      <span className="text-4xl mb-6 block opacity-80 drop-shadow-sm" style={{ color: theme.colorPrimary }}>✧</span>
                      <h3 className="font-serif text-3xl md:text-4xl mb-4 drop-shadow-sm text-center" style={{ color: theme.colorTextDark }}>{event.title}</h3>
                      
                      <div className="w-12 h-[1px] mx-auto mb-6 opacity-30" style={{ backgroundColor: theme.colorPrimary }} />
                      
                      <p className="font-sans text-[10px] md:text-xs tracking-[0.3em] font-bold mb-6 italic" style={{ color: theme.colorPrimary }}>{event.time}</p>

                      <div className="space-y-2 mb-10 text-center flex-1">
                        <p className="font-serif text-xl leading-snug font-bold" style={{ color: theme.colorTextDark }}>{event.venueName}</p>
                        <p className="font-sans text-[10px] uppercase tracking-[0.2em] opacity-60 leading-relaxed max-w-[200px] mx-auto" style={{ color: theme.colorTextDark }}>{event.address}</p>
                        {event.dressCode && event.dressCode !== 'none' && (
                          <div className="mt-6 flex items-center justify-center">
                            <span className="font-serif text-[11px] italic" style={{ color: theme.colorTextDark }}>Dress Code: {event.dressCode}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row w-full gap-2 mt-auto">
                        <a
                          href={event.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 font-sans text-[8px] md:text-[9px] font-bold tracking-[0.2rem] uppercase transition-all rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:translate-y-[-2px]"
                          style={{ backgroundColor: theme.colorTextDark, color: theme.colorBg }}
                        >
                          Google Maps
                        </a>
                        <button
                          onClick={handleAddToCalendar}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 font-sans text-[8px] md:text-[9px] font-bold tracking-[0.2rem] uppercase border-2 transition-all rounded-full hover:bg-slate-50 hover:translate-y-[-2px]"
                          style={{ borderColor: theme.colorTextDark, color: theme.colorTextDark, backgroundColor: 'transparent' }}
                        >
                          Add Event
                        </button>
                      </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section 
        className="py-20 px-6 relative overflow-visible" 
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 md:w-96 z-40 opacity-40 pointer-events-none" style={{ color: theme.colorPrimary }}>
           <TopMandala className="w-full" />
        </div>
        <SectionBackground image={config.sectionBackgrounds?.rsvp || config.rsvp?.bgImage} opacity={0.4} />
        <div className="max-w-2xl mx-auto p-10 md:p-16 shadow-[0_40px_80px_rgba(0,0,0,0.15)] rounded-[3rem]" style={{ backgroundColor: theme.colorSurface }}>
          <div className="text-center mb-12 relative z-10">
            <Mail className="mx-auto mb-8 drop-shadow-md" size={36} strokeWidth={1} style={{ color: theme.colorPrimary }} />
            <h2 className="text-4xl md:text-5xl italic mb-4 drop-shadow-sm" style={{ color: theme.colorPrimary }}>Be Our Guest</h2>
            <p className="font-sans text-[10px] uppercase tracking-widest opacity-80" style={{ color: theme.colorTextLight }}>Kindly respond by {config?.rsvp?.deadline || 'May 1st'}</p>
          </div>

          <form onSubmit={handleRsvpSubmit} className="space-y-6 relative z-10 text-left">
            {!formData.name.trim() && errors.name && <p className="text-red-500 text-[10px] uppercase text-center font-bold">{errors.name}</p>}
            {!formData.attendance && errors.attendance && <p className="text-red-500 text-[10px] uppercase text-center font-bold">{errors.attendance}</p>}
            
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Full Name *"
                className="w-full border-b-2 px-4 py-4 text-lg font-serif outline-none transition-shadow focus:border-b-4 bg-transparent"
                style={{ borderColor: theme.colorPrimary, color: theme.colorTextDark }}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone Number (e.g. 071 234 5678)"
                className="w-full border-b-2 px-4 py-4 text-lg font-serif outline-none transition-shadow focus:border-b-4 bg-transparent"
                style={{ borderColor: theme.colorPrimary, color: theme.colorTextDark }}
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {['Accept', 'Decline'].map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData({ ...formData, attendance: status, guests: status === 'Decline' ? '0' : '1' })}
                  className="py-5 font-sans text-[9px] font-bold uppercase tracking-[0.2em] border transition-all rounded-full shadow-md hover:scale-[1.02]"
                  style={{
                    backgroundColor: formData.attendance === status ? theme.colorPrimary : theme.colorBg,
                    color: formData.attendance === status ? theme.colorSurface : theme.colorTextDark,
                    borderColor: theme.colorPrimary
                  }}
                >
                  {status === 'Accept' ? 'Joyfully Accept' : 'Regret Decline'}
                </button>
              ))}
            </div>

            {formData.attendance === 'Accept' && (
               <div className="bg-white/40 p-8 rounded-3xl mt-6 border border-black/5 space-y-8 backdrop-blur-sm">
                 <div className="flex items-center justify-between gap-4">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.colorTextDark }}>Guests Attending</span>
                    <select
                      className="w-20 h-10 border rounded-full text-center font-sans font-bold text-[10px] bg-white cursor-pointer shadow-inner"
                      style={{ color: theme.colorTextDark, borderColor: theme.colorPrimary }}
                      value={formData.guests}
                      onChange={e => setFormData(f => ({ ...f, guests: e.target.value }))}
                    >
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                 </div>

                 <div className="space-y-5">
                   <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: theme.colorTextDark }}>Dietary Restrictions</p>
                   <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                     {[{key: 'vegetarian', label: 'Vegetarian'}, {key: 'vegan', label: 'Vegan'}, {key: 'glutenFree', label: 'Gluten-Free'}, {key: 'noPorkBeef', label: 'No Pork / Beef'}].map(opt => (
                        <label key={opt.key} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${formData.dietary[opt.key] ? '' : 'bg-transparent'}`} style={{ backgroundColor: formData.dietary[opt.key] ? theme.colorPrimary : 'transparent', borderColor: theme.colorPrimary }}>
                             {formData.dietary[opt.key] && <Check size={12} color="white" />}
                          </div>
                          <input type="checkbox" className="sr-only" checked={formData.dietary[opt.key]} onChange={() => setFormData(f => ({ ...f, dietary: { ...f.dietary, [opt.key]: !f.dietary[opt.key] } }))} />
                          <span className="font-serif text-[14px] opacity-80 transition-colors group-hover:opacity-100" style={{ color: theme.colorTextDark }}>{opt.label}</span>
                        </label>
                     ))}
                   </div>
                 </div>
               </div>
            )}

            <div className="pt-4">
              <textarea
                rows={3}
                placeholder="Message to the couple..."
                className="w-full border-b-2 px-4 py-4 text-lg font-serif outline-none transition-shadow focus:border-b-4 bg-transparent resize-y"
                style={{ borderColor: theme.colorPrimary, color: theme.colorTextDark }}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={rsvpStatus === 'loading'}
              className="w-full py-6 mt-4 font-sans text-[10px] uppercase tracking-[0.4em] font-bold transition-all rounded-full border shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.2)] hover:-translate-y-1"
              style={{ 
                  backgroundColor: rsvpStatus === 'success' ? theme.colorBg : theme.colorPrimary, 
                  color: rsvpStatus === 'success' ? theme.colorPrimary : theme.colorSurface,
                  borderColor: theme.colorPrimary
              }}
            >
              {rsvpStatus === 'loading' ? 'Loading...' : rsvpStatus === 'success' ? 'Sent ✨' : 'Confirm via WhatsApp'}
            </button>
          </form>
        </div>
      </section>

      <section 
        className="pt-16 pb-16 text-center relative overflow-visible" 
        style={{ 
          backgroundColor: theme.colorTextDark
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 md:w-96 z-40 opacity-40 pointer-events-none" style={{ color: theme.colorPrimary }}>
           <TopMandala className="w-full" />
        </div>
        <SectionBackground image={config.sectionBackgrounds?.footer} opacity={0.25} />
        <div className="absolute bottom-0 left-0 w-full pointer-events-none -translate-y-[20%] md:-translate-y-[45%] opacity-10 z-0" style={{ color: theme.colorBg }}>
          <TopMandala className="w-full max-w-[1200px] mx-auto" />
        </div>
        <div className="relative z-10 px-6">
          <h2 className="font-script text-5xl mb-4 drop-shadow-md" style={{ color: theme.colorPrimary }}>
            {config?.couple?.displayNames || ((config?.couple?.bride?.firstName && config?.couple?.groom?.firstName) ? `${config?.couple?.bride?.firstName} & ${config?.couple?.groom?.firstName}` : '')}
          </h2>
          <p className="font-serif text-sm tracking-[0.3em] uppercase mb-10" style={{ color: theme.colorBg, opacity: 0.8 }}>
            {config?.wedding?.displayDate || config?.wedding?.date || ''}
          </p>

          <div className="w-12 h-[1px] mx-auto mb-10" style={{ backgroundColor: theme.colorPrimary, opacity: 0.3 }} />

          <p className="font-sans text-[9px] md:text-[10px] tracking-[0.4em] uppercase font-bold" style={{ color: theme.colorBg, opacity: 0.4 }}>
            Handcrafted with Love — &copy; {config?.wedding?.year || new Date().getFullYear()} KodeX
          </p>
        </div>
      </section>
    </motion.div>
  );
}
