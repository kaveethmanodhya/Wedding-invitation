'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Calendar, MapPin, Music, Coffee, Clock, Check, ChevronDown,
  ArrowRight, Mail, Phone, ExternalLink, Plane, Navigation, Info, Users
} from 'lucide-react';
import { PRESET_THEMES } from '../../lib/themes';

// ── Main Page Layout Component ──
export default function LayoutEight({ config }) {
  const themeId = config.themeId || config.theme || 'gold';
  const theme = PRESET_THEMES.find(t => t.id === themeId)?.colors || config.theme || PRESET_THEMES[0].colors;

  const [formData, setFormData] = useState({
    name: '', phone: '', attendance: '', guests: '1',
    dietary: { vegetarian: false, vegan: false, glutenFree: false, nutAllergy: false },
    otherDietary: '', message: ''
  });
  const [rsvpStatus, setRsvpStatus] = useState('idle');

  // RSVP Submission logic
  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    setRsvpStatus('loading');

    // Construct WA message
    const dietaryList = Object.entries(formData.dietary)
      .filter(([_, v]) => v)
      .map(([k]) => k === 'glutenFree' ? 'Gluten-Free' : k.charAt(0).toUpperCase() + k.slice(1))
      .concat(formData.otherDietary ? [formData.otherDietary] : [])
      .join(', ') || 'None';

    const waMessage =
      `💍 *New RSVP - Layout 8 Premium* 💍\n\n` +
      `*Guest:* ${formData.name}\n` +
      `*Status:* ${formData.attendance === 'Accept' ? '✅ Joyfully Accepts' : '❌ Regretfully Declines'}\n` +
      `${formData.attendance === 'Accept' ? `*Guests:* ${formData.guests}\n*Dietary:* ${dietaryList}\n` : ''}` +
      `*Message:* ${formData.message || 'None'}`;

    const cleanNumber = config?.rsvp?.whatsappNumber?.replace(/[+\s-]/g, '') || '';
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(waMessage)}`, '_blank');
    setRsvpStatus('success');
  };

  return (
    <div 
      className="relative min-h-screen overflow-x-hidden"
      style={{ 
        backgroundColor: theme.colorBg || '#fdfaf5', 
        color: theme.colorTextDark || '#1e293b'
      }}
    >
      {/* ── HERO SECTION: Dynamic Breathing Feel ── */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Ken Burns Background */}
        <div className="absolute inset-0 z-0">
          {config?.heroVideo ? (
            <video
              src={config.heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <motion.div
              animate={{
                scale: [1.1, 1.25, 1.1],
                x: [0, -20, 0],
                y: [0, -10, 0]
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-full h-full"
            >
              <img
                src={config?.heroImage || ''}
                className="w-full h-full object-cover"
                alt="Wedding Hero"
              />
            </motion.div>
          )}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
          <div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.1), ${theme.colorBg || '#fdfaf5'})` 
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.2 }}
          >
            <p className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-white/80 mb-6 drop-shadow-md">
              Join us for the wedding of
            </p>
            <h1 className="font-serif text-[clamp(48px,10vw,120px)] leading-tight text-white drop-shadow-2xl mb-4 italic px-2">
              {config?.couple?.bride?.firstName || ''} <span className="font-sans text-2xl md:text-5xl not-italic block md:inline mx-2">&</span> {config?.couple?.groom?.firstName || ''}
            </h1>
            <div className="w-16 h-px bg-white/40 mx-auto my-8" />
            <p className="font-serif text-xl md:text-2xl text-white/90 tracking-widest uppercase drop-shadow-lg">
              {config?.wedding?.date || ''}
            </p>
          </motion.div>
        </div>

        {/* Slow Floating Decor */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/40 animate-bounce cursor-pointer">
          <ChevronDown size={32} strokeWidth={1} />
        </div>
      </section>

      {/* ── STORY SECTION: Elegant Typography ── */}
      <section 
        className="px-6 py-24 md:py-40 relative"
        style={{ backgroundColor: `${theme.colorSurface || '#ffffff'}80` }} // 80 is roughly 50% opacity
      >
        <div className="max-w-3xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <span 
              className="font-sans text-[10px] font-black uppercase tracking-[0.4em]"
              style={{ color: theme.colorPrimary || '#C9956A' }}
            >
              Our Journey
            </span>
            <h2 
              className="font-serif text-4xl md:text-6xl tracking-tight leading-none italic"
              style={{ color: theme.colorTextDark || '#1e293b' }}
            >
              Eternal Love
            </h2>
          </div>
          <div className="relative px-8 md:px-16">
            <div 
              className="absolute -top-6 -left-0 text-7xl font-serif opacity-10"
              style={{ color: theme.colorPrimary || '#C9956A' }}
            >
              “
            </div>
            <p 
              className="font-serif text-xl md:text-2xl leading-relaxed italic"
              style={{ color: theme.colorTextLight || '#4A5568' }}
            >
              {config?.story?.invitationText || "We invite you to share our joy as we exchange vows. Your presence will make our celebration truly special."}
            </p>
            <div 
              className="absolute -bottom-12 -right-0 text-7xl font-serif opacity-10"
              style={{ color: theme.colorPrimary || '#C9956A' }}
            >
              ”
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE: Vertical Programme du jour ── */}
      <section 
        className="px-6 py-24 md:py-32"
        style={{ backgroundColor: theme.colorSecondary || '#f9f6f1' }}
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="text-center mb-20 space-y-4">
            <span 
              className="font-sans text-[10px] font-bold uppercase tracking-[0.4em]"
              style={{ color: theme.colorTextLight || '#4A5568' }}
            >
              Programme du jour
            </span>
            <h2 
              className="font-serif text-4xl md:text-5xl italic"
              style={{ color: theme.colorTextDark || '#1e293b' }}
            >
              Wedding Timeline
            </h2>
          </div>

          <div className="relative w-full max-w-lg">
            {/* The Line */}
            <div 
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 opacity-20"
              style={{ backgroundColor: theme.colorTextDark || '#1e293b' }}
            />

            <div className="space-y-16">
              {/* Timeline Items (Static refined mockup based on typical event structure) */}
              {(config.timeline || []).map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center justify-between w-full ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Icon Dot */}
                  <div 
                    className="absolute left-4 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full shadow-lg flex items-center justify-center z-10"
                    style={{ 
                      backgroundColor: theme.colorSurface || '#ffffff',
                      border: `1px solid ${theme.colorSecondary || '#f9f6f1'}`,
                      color: theme.colorPrimary || '#C9956A'
                    }}
                  >
                    <span className="text-sm">{item.icon || '✨'}</span>
                  </div>

                  {/* Content Card */}
                  <div className="ml-16 md:ml-0 md:w-[42%] text-left md:text-right space-y-1">
                    <span 
                      className="font-sans text-[10px] font-black tracking-widest uppercase"
                      style={{ color: theme.colorPrimary || '#C9956A' }}
                    >
                      {item.time}
                    </span>
                    <h3 
                      className="font-serif text-xl font-bold"
                      style={{ color: theme.colorTextDark || '#1e293b' }}
                    >
                      {item.title}
                    </h3>
                    <p 
                      className="font-serif text-sm italic"
                      style={{ color: theme.colorTextLight || '#4A5568' }}
                    >
                      {item.description || item.desc}
                    </p>
                  </div>

                  {/* Spacer for other side */}
                  <div className="hidden md:block w-[42%]" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY: Premium Collection ── */}
      {config?.gallery && config.gallery.length > 0 && (
        <section 
          className="px-6 py-24 md:py-32 relative overflow-hidden"
          style={{ backgroundColor: theme.colorBg || '#fdfaf5' }}
        >
          <div className="max-w-6xl mx-auto flex flex-col items-center">
            <div className="text-center mb-16 space-y-4">
              <span 
                className="font-sans text-[10px] font-bold uppercase tracking-[0.4em]"
                style={{ color: theme.colorTextLight || '#4A5568' }}
              >
                Captured Moments
              </span>
              <h2 
                className="font-serif text-4xl md:text-5xl italic"
                style={{ color: theme.colorTextDark || '#1e293b' }}
              >
                Love In Frames
              </h2>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 w-full">
              {config.gallery.map((photo, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: (idx % 3) * 0.1 }}
                  className="group relative overflow-hidden rounded-[20px] break-inside-avoid shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-700 border-4 border-white"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt || 'Gallery photo'}
                    className="w-full h-auto block object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 z-10 flex flex-col items-center text-center">
                    <Heart size={20} className="text-white mb-2" strokeWidth={1} />
                    <p className="font-serif text-lg md:text-xl text-white italic drop-shadow-md">Beautiful Moment</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MAP & LOCATION: Interactive Display ── */}
      <section 
        className="px-6 py-24 md:py-32"
        style={{ backgroundColor: theme.colorSurface || '#ffffff' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-3">
                <span 
                  className="font-sans text-[10px] font-black uppercase tracking-[0.4em]"
                  style={{ color: theme.colorPrimary || '#C9956A' }}
                >
                  Join Us At
                </span>
                <h2 
                  className="font-serif text-4xl md:text-5xl leading-tight italic"
                  style={{ color: theme.colorTextDark || '#1e293b' }}
                >
                  Our Venue
                </h2>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div 
                    className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ 
                      backgroundColor: theme.colorBg || '#fdfaf5',
                      color: theme.colorPrimary || '#C9956A'
                    }}
                  >
                    <MapPin size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 
                      className="font-serif text-xl font-bold"
                      style={{ color: theme.colorTextDark || '#1e293b' }}
                    >
                      {config?.events?.ceremony?.venueName || ''}
                    </h4>
                    <p 
                      className="font-sans text-xs uppercase tracking-widest mt-1"
                      style={{ color: theme.colorTextLight || '#4A5568' }}
                    >
                      {config?.events?.ceremony?.address || ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => window.open(config.events.ceremony?.mapsUrl, '_blank')}
                  className="flex-1 flex items-center justify-center gap-3 py-4 text-white font-sans text-[10px] font-bold uppercase tracking-widest transition-all duration-500 shadow-xl rounded-xl"
                  style={{ backgroundColor: theme.colorTextDark || '#1e293b' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colorPrimary || '#C9956A'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colorTextDark || '#1e293b'}
                >
                  <Navigation size={14} /> Open in Maps
                </button>
                <button
                  onClick={() => console.log('Calendar clicked')}
                  className="flex-1 flex items-center justify-center gap-3 py-4 border font-sans text-[10px] font-bold uppercase tracking-widest transition-all duration-500 rounded-xl"
                  style={{ 
                    borderColor: theme.colorSecondary || '#f9f6f1',
                    color: theme.colorTextLight || '#4A5568'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.colorPrimary || '#C9956A';
                    e.currentTarget.style.color = theme.colorPrimary || '#C9956A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.colorSecondary || '#f9f6f1';
                    e.currentTarget.style.color = theme.colorTextLight || '#4A5568';
                  }}
                >
                  <Calendar size={14} /> Add to Calendar
                </button>
              </div>
            </div>

            {/* Google Maps Preview Illusion */}
            <div 
              className="relative aspect-video md:aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl group border-[12px]"
              style={{ backgroundColor: theme.colorSecondary || '#f9f6f1', borderColor: theme.colorSurface || '#ffffff' }}
            >
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?mx=auto&q=80&w=1000"
                className="w-full h-full object-cover grayscale-[0.2] opacity-70 group-hover:scale-105 transition-transform duration-1000"
                alt="Venue Location"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#C9956A]/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl animate-pulse"
                  style={{ backgroundColor: theme.colorSurface || '#ffffff' }}
                >
                  <MapPin size={32} style={{ color: theme.colorPrimary || '#C9956A' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ADVANCED RSVP SECTION ── */}
      <section 
        className="px-6 py-24 md:py-40 relative"
        style={{ backgroundColor: theme.colorBg || '#fdfaf5' }}
      >
        <div 
          className="max-w-2xl mx-auto p-10 md:p-20 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border text-center relative"
          style={{ backgroundColor: theme.colorSurface || '#ffffff', borderColor: theme.colorSecondary || '#f9f6f1' }}
        >
          {/* Decor */}
          <div 
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 border rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: theme.colorBg || '#fdfaf5', borderColor: theme.colorSecondary || '#f9f6f1' }}
          >
            <Mail size={32} strokeWidth={1} style={{ color: theme.colorPrimary || '#C9956A' }} />
          </div>

          <div className="space-y-6 mb-12">
            <h2 
              className="font-serif text-4xl md:text-5xl leading-tight italic"
              style={{ color: theme.colorTextDark || '#1e293b' }}
            >
              Please Confirm
            </h2>
            <p 
              className="font-sans text-[10px] font-black uppercase tracking-[0.4em]"
              style={{ color: theme.colorTextLight || '#4A5568' }}
            >
              Kindly Reply by {config?.rsvp?.deadline || ''}
            </p>
            <div 
              className="w-12 h-px mx-auto opacity-30"
              style={{ backgroundColor: theme.colorPrimary || '#C9956A' }}
            />
          </div>

          {rsvpStatus === 'success' ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={32} className="text-green-500" />
              </div>
              <h3 className="font-serif text-2xl italic">Thank You!</h3>
              <p className="font-serif text-lg text-slate-500">Your reply has been sent via WhatsApp. We can't wait to see you!</p>
            </motion.div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-8">
               {/* Attendance Select */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'Accept', label: 'Joyfully Accept', icon: '🎉' },
                  { id: 'Decline', label: 'Regretfully Decline', icon: '🕊️' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, attendance: opt.id })}
                    className="p-6 rounded-2xl border transition-all duration-500 flex flex-col items-center gap-2 group"
                    style={{
                      backgroundColor: formData.attendance === opt.id ? (theme.colorTextDark || '#1e293b') : (theme.colorBg || '#FAF7F2'),
                      borderColor: formData.attendance === opt.id ? (theme.colorTextDark || '#1e293b') : (theme.colorSecondary || '#E8D5B7'),
                      boxShadow: formData.attendance === opt.id ? '0 10px 20px rgba(0,0,0,0.1)' : 'none',
                      transform: formData.attendance === opt.id ? 'scale(1.02)' : 'scale(1)'
                    }}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span 
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: formData.attendance === opt.id ? (theme.colorSurface || '#ffffff') : (theme.colorTextLight || '#8A7F6A') }}
                    >
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {formData.attendance === 'Accept' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-8 pt-4"
                  >
                    {/* Guest Count */}
                    <div 
                      className="flex flex-col items-center gap-3 p-6 rounded-2xl border"
                      style={{ backgroundColor: theme.colorBg || '#FAF7F2', borderColor: theme.colorSecondary || '#E8D5B7' }}
                    >
                      <label 
                        className="font-sans text-[10px] font-black uppercase tracking-widest"
                        style={{ color: theme.colorTextLight || '#8A7F6A' }}
                      >
                        Total Guests Attending?
                      </label>
                      <div className="flex gap-4">
                        {Array.from({ length: config?.rsvp?.maxGuests || 5 }, (_, i) => i + 1).map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setFormData({ ...formData, guests: String(num) })}
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm"
                            style={{
                              backgroundColor: formData.guests === String(num) ? (theme.colorPrimary || '#C9956A') : (theme.colorSurface || '#ffffff'),
                              color: formData.guests === String(num) ? (theme.colorSurface || '#ffffff') : (theme.colorTextLight || '#8A7F6A')
                            }}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dietary Requirements - Advanced Box */}
                    <div 
                      className="p-8 rounded-[30px] border text-left space-y-4"
                      style={{ backgroundColor: theme.colorBg || '#FAF7F2', borderColor: theme.colorSecondary || '#E8D5B7' }}
                    >
                      <h4 
                        className="font-serif text-lg italic flex items-center gap-2"
                        style={{ color: theme.colorTextDark || '#3A2828' }}
                      >
                        <Info size={16} style={{ color: theme.colorPrimary || '#C9956A' }} /> Dietary Requirements
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: 'vegetarian', label: 'Vegetarian' },
                          { id: 'vegan', label: 'Vegan' },
                          { id: 'glutenFree', label: 'Gluten-Free' },
                          { id: 'nutAllergy', label: 'Nut Allergy' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              dietary: { ...formData.dietary, [opt.id]: !formData.dietary[opt.id] }
                            })}
                            className="flex items-center gap-3 group"
                          >
                            <div 
                              className="w-5 h-5 rounded-md border flex items-center justify-center transition-all"
                              style={{ 
                                backgroundColor: formData.dietary[opt.id] ? (theme.colorPrimary || '#C9956A') : (theme.colorSurface || '#ffffff'),
                                borderColor: formData.dietary[opt.id] ? (theme.colorPrimary || '#C9956A') : (theme.colorSecondary || '#E8D5B7')
                              }}
                            >
                              {formData.dietary[opt.id] && <Check size={12} style={{ color: theme.colorSurface || '#ffffff' }} />}
                            </div>
                            <span 
                              className="text-xs font-serif italic transition-colors uppercase tracking-widest"
                              style={{ color: theme.colorTextLight || '#8A7F6A' }}
                            >
                              {opt.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Name Input */}
              <div className="space-y-6">
                <div className="group relative">
                  <input
                    required
                    type="text"
                    placeholder="Your Full Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b-2 py-4 font-serif text-2xl italic outline-none transition-all placeholder:text-slate-200"
                    style={{ borderBottomColor: theme.colorSecondary || '#E8D5B7' }}
                    onFocus={(e) => e.target.style.borderBottomColor = theme.colorPrimary || '#C9956A'}
                    onBlur={(e) => e.target.style.borderBottomColor = theme.colorSecondary || '#E8D5B7'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!formData.name || !formData.attendance || rsvpStatus === 'loading'}
                  className="w-full py-5 text-white font-sans text-xs font-black uppercase tracking-[0.5em] shadow-2xl transition-all duration-500 disabled:opacity-30 rounded-2xl group flex items-center justify-center gap-3"
                  style={{ backgroundColor: theme.colorTextDark || '#1e293b' }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = theme.colorPrimary || '#C9956A';
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = theme.colorTextDark || '#1e293b';
                  }}
                >
                  {rsvpStatus === 'loading' ? (
                    <span 
                      className="w-5 h-5 border-2 rounded-full animate-spin" 
                      style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#ffffff' }}
                    />
                  ) : (
                    <>Send Reply <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" /></>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER: Simple Elegant ── */}
      <section 
        className="py-32 text-center border-t"
        style={{ backgroundColor: theme.colorBg || '#FAF7F2', borderTopColor: theme.colorSecondary || '#E8D5B7' }}
      >
        <div className="space-y-8 px-6">
          <div 
            className="text-4xl opacity-20"
            style={{ color: theme.colorPrimary || '#C9956A' }}
          >
            ❦
          </div>
          <h2 
            className="font-serif text-5xl md:text-7xl italic leading-none opacity-20"
            style={{ color: theme.colorTextDark || '#2C2018' }}
          >
            See you there
          </h2>
          <p 
            className="font-sans text-[10px] font-black uppercase tracking-[0.6em]"
            style={{ color: theme.colorTextLight || '#8A7F6A' }}
          >
            {config?.couple?.bride?.firstName || ''} & {config?.couple?.groom?.firstName || ''} • {config?.wedding?.date || ''}
          </p>
        </div>
      </section>
    </div>
  );
}
