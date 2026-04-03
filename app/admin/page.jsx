'use client';
import { useState, useCallback, useEffect } from 'react';
import AdminLogin from './components/AdminLogin';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCropper from './components/ImageCropper';
import imageCompression from 'browser-image-compression';

const PRESET_THEMES = [
  {
    id: 'gold',
    name: 'Golden Elegance',
    colors: {
      colorPrimary: '#C9956A',
      colorSecondary: '#E8D5B7',
      colorTextLight: '#8A7F6A',
      colorTextDark: '#2C2018',
      colorBg: '#FAF7F2',
      colorSurface: '#FFFFFF',
      heroOverlayStart: 'rgba(18, 12, 6, 0.55)',
      heroOverlayEnd: 'rgba(18, 12, 6, 0.25)'
    }
  },
  {
    id: 'rose',
    name: 'Rose Blush',
    colors: {
      colorPrimary: '#D4A5A5',
      colorSecondary: '#E9D5D5',
      colorTextLight: '#9A7F7F',
      colorTextDark: '#3A2828',
      colorBg: '#FAF5F5',
      colorSurface: '#FFFFFF',
      heroOverlayStart: 'rgba(40, 20, 20, 0.55)',
      heroOverlayEnd: 'rgba(40, 20, 20, 0.25)'
    }
  },
  {
    id: 'navy',
    name: 'Midnight Royal',
    colors: {
      colorPrimary: '#1A365D',
      colorSecondary: '#C9956A',
      colorTextLight: '#4A5568',
      colorTextDark: '#171923',
      colorBg: '#F7FAFC',
      colorSurface: '#FFFFFF',
      heroOverlayStart: 'rgba(10, 20, 40, 0.6)',
      heroOverlayEnd: 'rgba(10, 20, 40, 0.3)'
    }
  },
  {
    id: 'emerald',
    name: 'Emerald Garden',
    colors: {
      colorPrimary: '#2D5A27',
      colorSecondary: '#A3B18A',
      colorTextLight: '#344E41',
      colorTextDark: '#1B261B',
      colorBg: '#F0F4EF',
      colorSurface: '#FFFFFF',
      heroOverlayStart: 'rgba(15, 30, 15, 0.55)',
      heroOverlayEnd: 'rgba(15, 30, 15, 0.25)'
    }
  },
  {
    id: 'noir',
    name: 'Modern Noir',
    colors: {
      colorPrimary: '#2D2D2D',
      colorSecondary: '#999999',
      colorTextLight: '#666666',
      colorTextDark: '#111111',
      colorBg: '#F5F5F5',
      colorSurface: '#FFFFFF',
      heroOverlayStart: 'rgba(0, 0, 0, 0.65)',
      heroOverlayEnd: 'rgba(0, 0, 0, 0.35)'
    }
  },
  {
    id: 'sunset',
    name: 'Sun-kissed Peach',
    colors: {
      colorPrimary: '#E67E22',
      colorSecondary: '#F39C12',
      colorTextLight: '#7F8C8D',
      colorTextDark: '#2C3E50',
      colorBg: '#FEF9E7',
      colorSurface: '#FFFFFF',
      heroOverlayStart: 'rgba(40, 20, 0, 0.5)',
      heroOverlayEnd: 'rgba(40, 20, 0, 0.2)'
    }
  }
];

// ─────────────────────────────────────────────────────────────────
//  Tiny reusable field components
// ─────────────────────────────────────────────────────────────────
function FieldGroup({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-slate-500">{label}</label>
      {hint && <p className="text-[0.68rem] text-slate-400 -mt-0.5">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls = `w-full px-3 py-2.5 rounded-lg border border-slate-200
  text-sm text-slate-800 bg-white outline-none
  focus:border-[#C9956A] focus:ring-2 focus:ring-[#C9956A]/15
  placeholder:text-slate-300 transition-all duration-200`;

const textareaCls = `${inputCls} resize-y min-h-[80px]`;

function SectionCard({ title, icon, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full px-6 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <h3 className="font-semibold text-slate-700 text-sm tracking-wide">{title}</h3>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? '' : '-rotate-90'}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-6 pt-1 border-t border-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  Toast
// ─────────────────────────────────────────────────────────────────
function Toast({ type, message, onClose }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3
        px-5 py-4 rounded-xl shadow-lg max-w-sm
        ${type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                             : 'bg-red-50 border border-red-200 text-red-800'}`}
    >
      <span className="text-lg">{type === 'success' ? '✅' : '❌'}</span>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="text-current opacity-50 hover:opacity-100 transition-opacity">×</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  Gallery row editor
// ─────────────────────────────────────────────────────────────────
function GalleryEditor({ gallery, onChange, onUpload }) {
  const addPhoto = () => onChange([...gallery, { src: '', alt: '' }]);
  const removePhoto = (i) => onChange(gallery.filter((_, idx) => idx !== i));
  const updatePhoto = (i, key, val) => {
    const updated = gallery.map((p, idx) => idx === i ? { ...p, [key]: val } : p);
    onChange(updated);
  };

  return (
    <div className="col-span-2 flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {gallery.map((photo, i) => (
          <div key={i} className="relative group bg-slate-50 rounded-xl border border-slate-200 overflow-hidden p-2">
            <div 
              className="w-full rounded-lg overflow-hidden mb-2 bg-white relative shadow-sm border border-slate-100"
              style={{ aspectRatio: '3 / 4' }}
            >
              {photo.src ? (
                <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                  <span className="text-xl">🖼</span>
                  <span className="text-[0.6rem] font-bold uppercase mt-1">No Image</span>
                </div>
              )}
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                <span className="text-[0.6rem] text-white font-bold uppercase">{photo.src ? 'Change' : 'Upload'}</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={e => onUpload(e.target.files[0], `gallery.${i}.src`, 'gallery')}
                />
              </label>
            </div>
            <input
              type="text"
              placeholder="URL"
              value={photo.src}
              onChange={e => updatePhoto(i, 'src', e.target.value)}
              className="text-[0.65rem] w-full p-1 border-b border-slate-200 outline-none mb-1 bg-transparent"
            />
            <input
              type="text"
              placeholder="Alt text"
              value={photo.alt}
              onChange={e => updatePhoto(i, 'alt', e.target.value)}
              className="text-[0.65rem] w-full p-1 outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="absolute top-1 right-1 w-6 h-6 bg-white/90 text-red-500 rounded-full shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >×</button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addPhoto}
        className="self-start text-xs font-semibold text-[#C9956A] flex items-center gap-1 hover:underline"
      >+ Add New Photo Entry</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  Colour swatch preview
// ─────────────────────────────────────────────────────────────────
function ColourField({ label, value, onChange }) {
  return (
    <FieldGroup label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value.startsWith('#') ? value : '#c9956a'}
          onChange={e => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`${inputCls} flex-1`}
          placeholder="#C9956A"
        />
      </div>
    </FieldGroup>
  );
}

// ─────────────────────────────────────────────────────────────────
//  MAIN ADMIN PAGE
// ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('wedding_admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLogin={() => {
          localStorage.setItem('wedding_admin_auth', 'true');
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  // ── Data State ────────────────────────────────────────────────
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('couple');

  // ── Cropper State ──────────────────────────────────────────
  const [cropping, setCropping] = useState(null); // { file, path, type, aspect }

  // Deep setter helper
  const setPath = useCallback((path, value) => {
    setConfig(prev => {
      const keys = path.split('.');
      const next = JSON.parse(JSON.stringify(prev));
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }, []);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleUpload = async (file, path, type = 'general') => {
    if (!file) return;

    // 1. Initial Compression (Reduce huge files before cropping/sending)
    let processedFile = file;
    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');

    if (!isGif && file.size > 1024 * 1024) { // Only compress non-GIFs > 1MB
      showToast('success', 'Optimizing file size...');
      try {
        const options = {
          maxSizeMB: 2,
          maxWidthOrHeight: 2560,
          useWebWorker: true
        };
        processedFile = await imageCompression(file, options);
      } catch (err) {
        console.error('Compression error:', err);
      }
    }

    // 2. Determine if cropping is needed
    if (type === 'hero' || type === 'gallery') {
      let aspect = 1.0;
      if (type === 'hero') {
        // Layout 1: ~1.81, Layout 2: ~1.66
        aspect = config.heroLayout === 2 ? 1.66 : 1.81;
      } else if (type === 'gallery') {
        aspect = 0.75; // Standard 3:4 Portrait for masonry
      }

      setCropping({
        file: URL.createObjectURL(processedFile),
        path,
        type,
        aspect
      });
      return;
    }

    // 3. Direct upload for other types
    await performUpload(processedFile, path, type);
  };

  const performUpload = async (file, path, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    setLoading(true);
    showToast('success', 'Uploading to server...');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setPath(path, data.url);
        showToast('success', 'Photo uploaded and saved!');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      showToast('error', `Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
      setCropping(null);
    }
  };

  const onCropComplete = async (croppedBlob) => {
    if (!cropping) return;
    await performUpload(croppedBlob, cropping.path, cropping.type);
  };

  const loadConfig = useCallback(async () => {
    setFetching(true);
    try {
      const res = await fetch('/api/get-config');
      const data = await res.json();
      setConfig(data);
    } catch {
      showToast('error', 'Failed to load config.json.');
    } finally {
      setFetching(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/save-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', '✅ Config saved! Refresh the invitation page to see changes.');
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      showToast('error', `Save failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching || !config) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#C9956A]/30 border-t-[#C9956A] animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-sans">Loading config…</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'couple', label: '💑 Couple' },
    { id: 'wedding', label: '📅 Wedding' },
    { id: 'story', label: '📖 Story' },
    { id: 'events', label: '📍 Events' },
    { id: 'gallery', label: '🖼 Gallery' },
    { id: 'rsvp', label: '✉️ RSVP' },
    { id: 'theme', label: '🎨 Theme' },
    { id: 'meta', label: '🔍 SEO' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {cropping && (
        <ImageCropper
          image={cropping.file}
          aspect={cropping.aspect}
          onCropComplete={onCropComplete}
          onCancel={() => setCropping(null)}
        />
      )}

      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <span className="text-xl">💍</span>
            <h1 className="font-bold text-slate-800 text-sm">Wedding Admin Dashboard</h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5">
              ⚡ Local Only
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
              Preview
            </a>
            <button
              form="config-form"
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C9956A] text-white text-xs font-bold tracking-wide uppercase shadow-[0_2px_10px_rgba(201,149,106,0.4)] hover:bg-[#b5845a] disabled:opacity-60 transition-all duration-200"
            >
              {loading ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              )}
              Save Config
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-0.5 overflow-x-auto pb-0 scrollbar-hide">
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`shrink-0 px-3 sm:px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-all duration-200 whitespace-nowrap ${
                activeTab === t.id ? 'border-[#C9956A] text-[#C9956A]' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <form id="config-form" onSubmit={handleSave}>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-5">
          {activeTab === 'couple' && (
            <SectionCard title="Couple Information" icon="💑">
              <FieldGroup label="Bride First Name">
                <input
                  type="text"
                  className={inputCls}
                  value={config.couple.bride.firstName}
                  onChange={e => setPath('couple.bride.firstName', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Bride Last Name">
                <input
                  type="text"
                  className={inputCls}
                  value={config.couple.bride.lastName}
                  onChange={e => setPath('couple.bride.lastName', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Bride Full Name">
                <input
                  type="text"
                  className={inputCls}
                  value={config.couple.bride.fullName}
                  onChange={e => setPath('couple.bride.fullName', e.target.value)}
                />
              </FieldGroup>
              <div className="hidden md:block" />
              <FieldGroup label="Groom First Name">
                <input
                  type="text"
                  className={inputCls}
                  value={config.couple.groom.firstName}
                  onChange={e => setPath('couple.groom.firstName', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Groom Last Name">
                <input
                  type="text"
                  className={inputCls}
                  value={config.couple.groom.lastName}
                  onChange={e => setPath('couple.groom.lastName', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Groom Full Name">
                <input
                  type="text"
                  className={inputCls}
                  value={config.couple.groom.fullName}
                  onChange={e => setPath('couple.groom.fullName', e.target.value)}
                />
              </FieldGroup>
              <div className="hidden md:block" />
              <FieldGroup label="Display Names (used in Hero & Nav)" hint='e.g. "Amara & Kaveen"'>
                <input
                  type="text"
                  className={inputCls}
                  value={config.couple.displayNames}
                  onChange={e => setPath('couple.displayNames', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Tagline" hint='e.g. "Together Forever"'>
                <input type="text" className={inputCls} value={config.couple.tagline} onChange={e => setPath('couple.tagline', e.target.value)} />
              </FieldGroup>
            </SectionCard>
          )}

          {activeTab === 'wedding' && (
            <SectionCard title="Hero Style" icon="✨">
              <div 
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden mb-5 transition-all duration-500"
                style={{ aspectRatio: config.heroLayout === 2 ? '1.66 / 1' : '1.81 / 1' }}
              >
                {config.heroImage ? (
                  <img src={config.heroImage} className="w-full h-full object-cover" alt="Hero Preview" />
                ) : (
                  <div className="text-center p-6">
                    <span className="text-3xl opacity-20">📸</span>
                    <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">No Hero Image</p>
                  </div>
                )}
              </div>
              <FieldGroup label="Wedding Date & Time (ISO 8601)" hint="Format: YYYY-MM-DDTHH:MM:SS">
                <input
                  type="datetime-local"
                  className={inputCls}
                  value={config.wedding.dateTimeISO.slice(0, 16)}
                  onChange={e => setPath('wedding.dateTimeISO', e.target.value + ':00')}
                />
              </FieldGroup>
              <FieldGroup label="Display Date" hint='Human-readable, shown on the invitation'>
                <input
                  type="text"
                  placeholder="December 19, 2026"
                  className={inputCls}
                  value={config.wedding.displayDate}
                  onChange={e => setPath('wedding.displayDate', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Year (for footer copyright)">
                <input
                  type="text"
                  placeholder="2026"
                  className={inputCls}
                  value={config.wedding.year}
                  onChange={e => setPath('wedding.year', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Hero Background Image" hint="Upload directly or enter a URL">
                <div className="flex flex-col gap-3">
                  {config.heroImage && (
                    <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img src={config.heroImage} className="w-full h-full object-cover" alt="Hero Preview" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="/images/hero.png"
                      className={inputCls}
                      value={config.heroImage}
                      onChange={e => setPath('heroImage', e.target.value)}
                    />
                    <label className="shrink-0 cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center transition-colors">
                      Upload
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleUpload(e.target.files[0], 'heroImage', 'hero')} />
                    </label>
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup label="Invitation Card Layout" hint="Choose the hero card style for your invitation">
                <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  {[
                    { id: 1, label: 'Layout 1 — Script Overlay', desc: 'Photo on top · "forever" cursive straddling photo & text · Clean details below' },
                    { id: 2, label: 'Layout 2 — Names on Photo', desc: 'Full-bleed photo fading to white · Names overlaid · Large numeric date below' },
                  ].map(layout => {
                    const active = (config.heroLayout ?? 1) === layout.id;
                    return (
                      <button
                        key={layout.id}
                        type="button"
                        onClick={() => setPath('heroLayout', layout.id)}
                        className={`flex flex-col items-start gap-1.5 p-4 rounded-xl border-2 text-left transition-all ${
                          active ? 'border-[#C9956A] bg-[#fdf6ef] shadow-sm' : 'border-slate-100 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className={`text-xs font-bold tracking-wide ${active ? 'text-[#C9956A]' : 'text-slate-600'}`}>{layout.label}</span>
                        <span className="text-[0.65rem] text-slate-400 leading-snug">{layout.desc}</span>
                        {active && <span className="mt-1 text-[0.6rem] font-bold text-[#C9956A] uppercase tracking-widest">✓ Active</span>}
                      </button>
                    );
                  })}
                </div>
              </FieldGroup>
            </SectionCard>
          )}

          {activeTab === 'story' && (
            <SectionCard title="Our Story & Invitation Text" icon="📖">
              <FieldGroup label="Formal Invitation Text" hint="Shown in an elegant bordered box">
                <textarea
                  className={`${textareaCls} col-span-2`}
                  value={config.story.invitationText}
                  onChange={e => setPath('story.invitationText', e.target.value)}
                />
              </FieldGroup>
              <div className="col-span-2 flex flex-col gap-3">
                <p className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-slate-500">Story Paragraphs</p>
                {config.story.paragraphs.map((p, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <textarea
                      rows={3}
                      className={`${textareaCls} flex-1`}
                      value={p}
                      onChange={e => {
                        const updated = [...config.story.paragraphs];
                        updated[i] = e.target.value;
                        setPath('story.paragraphs', updated);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setPath('story.paragraphs', config.story.paragraphs.filter((_, idx) => idx !== i))}
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-colors text-lg mt-0.5"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setPath('story.paragraphs', [...config.story.paragraphs, ''])}
                  className="self-start text-xs font-semibold text-[#C9956A] flex items-center gap-1 hover:underline"
                >
                  + Add Paragraph
                </button>
              </div>
            </SectionCard>
          )}

          {activeTab === 'events' && (
            <SectionCard title="Ceremony Details" icon="🌸">
              <FieldGroup label="Title">
                <input
                  type="text"
                  className={inputCls}
                  value={config.events.ceremony.title}
                  onChange={e => setPath('events.ceremony.title', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Emoji Icon">
                <input
                  type="text"
                  className={inputCls}
                  value={config.events.ceremony.icon}
                  onChange={e => setPath('events.ceremony.icon', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Time">
                <input
                  type="text"
                  className={inputCls}
                  placeholder="10:00 AM"
                  value={config.events.ceremony.time}
                  onChange={e => setPath('events.ceremony.time', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Venue Name">
                <input
                  type="text"
                  className={inputCls}
                  value={config.events.ceremony.venueName}
                  onChange={e => setPath('events.ceremony.venueName', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Address">
                <input
                  type="text"
                  className={inputCls}
                  value={config.events.ceremony.address}
                  onChange={e => setPath('events.ceremony.address', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Dress Code">
                <input
                  type="text"
                  className={inputCls}
                  value={config.events.ceremony.dressCode}
                  onChange={e => setPath('events.ceremony.dressCode', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Google Maps URL">
                <input
                  type="url"
                  className={inputCls}
                  value={config.events.ceremony.mapsUrl}
                  onChange={e => setPath('events.ceremony.mapsUrl', e.target.value)}
                />
              </FieldGroup>
            </SectionCard>
          )}

          {activeTab === 'gallery' && (
            <SectionCard title="Gallery Photos" icon="🖼">
              <GalleryEditor gallery={config.gallery} onChange={val => setPath('gallery', val)} onUpload={handleUpload} />
            </SectionCard>
          )}

          {activeTab === 'rsvp' && (
            <>
              <SectionCard title="RSVP Settings" icon="✉️">
                <FieldGroup label="WhatsApp Number" hint="Phone number for receiving RSVPs">
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="94771234567"
                    value={config.rsvp.whatsappNumber}
                    onChange={e => setPath('rsvp.whatsappNumber', e.target.value)}
                  />
                </FieldGroup>
                <FieldGroup label="RSVP Deadline">
                  <input type="text" className={inputCls} value={config.rsvp.deadline} onChange={e => setPath('rsvp.deadline', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Max Guests per RSVP">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    className={inputCls}
                    value={config.rsvp.maxGuests}
                    onChange={e => setPath('rsvp.maxGuests', Number(e.target.value))}
                  />
                </FieldGroup>
              </SectionCard>

              <SectionCard title="Opening Animation" icon="✨">
                <FieldGroup label="Animation Style" hint="Choose how guests first see your invitation">
                  <div className="flex gap-6 mt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${config.revealStyle === 'envelope' ? 'border-[#C9956A]' : 'border-slate-300 group-hover:border-slate-400'}`}>
                        {config.revealStyle === 'envelope' && <div className="w-2.5 h-2.5 rounded-full bg-[#C9956A]" />}
                      </div>
                      <input 
                        type="radio" 
                        className="hidden"
                        name="revealStyle" 
                        value="envelope" 
                        checked={config.revealStyle === 'envelope'} 
                        onChange={() => setPath('revealStyle', 'envelope')} 
                      />
                      <span className={`text-sm font-medium ${config.revealStyle === 'envelope' ? 'text-slate-900' : 'text-slate-500'}`}>Envelope Reveal</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${config.revealStyle === 'couple' ? 'border-[#C9956A]' : 'border-slate-300 group-hover:border-slate-400'}`}>
                        {config.revealStyle === 'couple' && <div className="w-2.5 h-2.5 rounded-full bg-[#C9956A]" />}
                      </div>
                      <input 
                        type="radio" 
                        className="hidden"
                        name="revealStyle" 
                        value="couple" 
                        checked={config.revealStyle === 'couple'} 
                        onChange={() => setPath('revealStyle', 'couple')} 
                      />
                      <span className={`text-sm font-medium ${config.revealStyle === 'couple' ? 'text-slate-900' : 'text-slate-500'}`}>Animated Couple</span>
                    </label>
                  </div>
                </FieldGroup>
                
                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-6 border-t border-slate-50">
                  <FieldGroup label="Groom Cartoon (Running)" hint="Transparent PNG recommended">
                    <div className="flex flex-col gap-3">
                      <div className="w-24 h-24 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                        {config.coupleImages?.groom ? (
                          <img src={config.coupleImages.groom} className="w-full h-full object-contain p-2" alt="Groom Preview" />
                        ) : (
                          <span className="text-4xl">🏃‍♂️</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="/images/groom.png"
                          className={inputCls}
                          value={config.coupleImages?.groom || ''}
                          onChange={e => setPath('coupleImages.groom', e.target.value)}
                        />
                        <label className="shrink-0 cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center transition-colors">
                          Upload
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleUpload(e.target.files[0], 'coupleImages.groom', 'general')} />
                        </label>
                      </div>
                    </div>
                  </FieldGroup>

                  <FieldGroup label="Bride Cartoon (Running)" hint="Transparent PNG recommended">
                    <div className="flex flex-col gap-3">
                      <div className="w-24 h-24 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                        {config.coupleImages?.bride ? (
                          <img src={config.coupleImages.bride} className="w-full h-full object-contain p-2" alt="Bride Preview" />
                        ) : (
                          <span className="text-4xl">🏃‍♀️</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="/images/bride.png"
                          className={inputCls}
                          value={config.coupleImages?.bride || ''}
                          onChange={e => setPath('coupleImages.bride', e.target.value)}
                        />
                        <label className="shrink-0 cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center transition-colors">
                          Upload
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleUpload(e.target.files[0], 'coupleImages.bride', 'general')} />
                        </label>
                      </div>
                    </div>
                  </FieldGroup>
                </div>
              </SectionCard>

              <SectionCard title="Envelope Cover" icon="✉️">
                <FieldGroup label="Cover Title">
                  <input type="text" className={inputCls} value={config.envelope.title} onChange={e => setPath('envelope.title', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Cover Subtitle">
                  <input
                    type="text"
                    className={inputCls}
                    value={config.envelope.subtitle}
                    onChange={e => setPath('envelope.subtitle', e.target.value)}
                  />
                </FieldGroup>
                <FieldGroup label="Button Text">
                  <input
                    type="text"
                    className={inputCls}
                    value={config.envelope.buttonText}
                    onChange={e => setPath('envelope.buttonText', e.target.value)}
                  />
                </FieldGroup>
              </SectionCard>
            </>
          )}

          {activeTab === 'theme' && (
            <div className="flex flex-col gap-5">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden px-6 py-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xl">🎨</span>
                  <h3 className="font-semibold text-slate-700 text-sm tracking-wide">Premium Theme Presets</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PRESET_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setPath('theme', theme.colors)}
                      className="group relative flex flex-col items-start p-4 rounded-xl border border-slate-100 hover:border-[#C9956A] hover:shadow-md transition-all text-left"
                    >
                      <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest mb-2">{theme.name}</span>
                      <div className="flex gap-1.5 w-full">
                        <div className="w-6 h-6 rounded-full shadow-sm" style={{ backgroundColor: theme.colors.colorPrimary }} title="Primary" />
                        <div className="w-6 h-6 rounded-full shadow-sm" style={{ backgroundColor: theme.colors.colorSecondary }} title="Secondary" />
                        <div className="w-6 h-6 rounded-full shadow-sm border border-slate-100" style={{ backgroundColor: theme.colors.colorBg }} title="Background" />
                        <div className="ml-auto flex -space-x-2">
                          <div className="w-6 h-6 rounded-full border border-white" style={{ backgroundColor: theme.colors.colorTextDark }} />
                          <div className="w-6 h-6 rounded-full border border-white" style={{ backgroundColor: theme.colors.colorTextLight }} />
                        </div>
                      </div>
                      <div className="mt-3 w-full h-1 rounded-full bg-slate-50 overflow-hidden">
                        <div className="h-full w-1/2" style={{ backgroundColor: theme.colors.colorPrimary }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <SectionCard title="Fine-tune Theme Colours" icon="🎨">
              {[
                ['colorPrimary', 'Primary Accent'],
                ['colorSecondary', 'Secondary Accent'],
                ['colorTextLight', 'Light Text'],
                ['colorTextDark', 'Dark Text'],
                ['colorBg', 'Page Background'],
                ['colorSurface', 'Card Background'],
              ].map(([key, label]) => (
                <ColourField key={key} label={label} value={config.theme[key]} onChange={val => setPath(`theme.${key}`, val)} />
              ))}
              <FieldGroup label="Hero Overlay Start (rgba)">
                <input
                  type="text"
                  className={inputCls}
                  value={config.theme.heroOverlayStart}
                  onChange={e => setPath('theme.heroOverlayStart', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Hero Overlay End (rgba)">
                <input type="text" className={inputCls} value={config.theme.heroOverlayEnd} onChange={e => setPath('theme.heroOverlayEnd', e.target.value)} />
              </FieldGroup>

              <div className="col-span-2 mt-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[0.68rem] font-bold tracking-[0.1em] uppercase text-slate-400 mb-3">Live Colour Preview</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(config.theme)
                    .filter(([k]) => k.startsWith('color'))
                    .map(([k, v]) => (
                      <div key={k} className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-lg border border-slate-200 shadow-sm" style={{ background: v }} />
                        <span className="text-[0.6rem] text-slate-400">{k.replace('color', '')}</span>
                      </div>
                    ))}
                </div>
              </div>
            </SectionCard>
          </div>
        )}

          {activeTab === 'meta' && (
            <SectionCard title="SEO & Social Sharing" icon="🔍">
              <FieldGroup label="Page Title">
                <input type="text" className={inputCls} value={config.meta.title} onChange={e => setPath('meta.title', e.target.value)} />
              </FieldGroup>
              <FieldGroup label="Description">
                <input
                  type="text"
                  className={inputCls}
                  value={config.meta.description}
                  onChange={e => setPath('meta.description', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="OG Image">
                <input type="text" className={inputCls} value={config.meta.ogImage} onChange={e => setPath('meta.ogImage', e.target.value)} />
              </FieldGroup>
            </SectionCard>
          )}

          <details className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer text-xs font-bold tracking-wide text-slate-500 uppercase hover:bg-slate-50 transition-colors flex items-center gap-2">
              <span>📋</span> Raw JSON Preview
            </summary>
            <pre className="text-xs text-slate-600 bg-slate-50 px-6 py-4 overflow-auto max-h-96 border-t border-slate-100">
              {JSON.stringify(config, null, 2)}
            </pre>
          </details>

          <button
            form="config-form"
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#C9956A] text-white font-bold text-sm tracking-widest uppercase shadow-[0_4px_20px_rgba(201,149,106,0.35)] hover:bg-[#b5845a] disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Saving…
              </>
            ) : (
              '💾 Save & Update Config'
            )}
          </button>
        </main>
      </form>
    </div>
  );
}
