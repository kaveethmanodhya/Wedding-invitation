'use client';
import { useState, useCallback, useEffect } from 'react';
import AdminLogin from './components/AdminLogin';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCropper from './components/ImageCropper';
import imageCompression from 'browser-image-compression';
import { Trash2, ImageIcon, Upload, X, Heart, Calendar, Book, MapPin, Image, Mail, Palette, Search, Layers, Sparkles, CheckCircle, AlertCircle, Save, ExternalLink, Music, Crop } from 'lucide-react';
import { PRESET_THEMES } from '../../lib/themes';

const ImageField = ({ label, hint, value, path, type, onUpload, onDelete, onCrop, accept = "image/*" }) => {
  const isVideo = value?.toLowerCase()?.endsWith('.mp4') || value?.includes('video/upload');
  
  return (
    <FieldGroup label={label} hint={hint}>
      <div className="flex flex-col gap-3">
        {value ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
            {isVideo ? (
              <video src={value} className="w-full h-full object-cover" muted playsInline />
            ) : (
              <img src={value} className="w-full h-full object-cover" alt={label} />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {onCrop && (
                <button
                  type="button"
                  onClick={() => onCrop(path, value, type)}
                  className="w-8 h-8 flex items-center justify-center bg-white text-slate-700 rounded-full shadow-lg hover:bg-slate-50 transition-colors"
                  title="Crop Image"
                >
                  <Crop size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDelete(path, value);
                }}
                className="w-8 h-8 flex items-center justify-center bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-colors"
                title="Remove Image"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-4 text-slate-400">
            <ImageIcon size={24} className="mb-2 opacity-20" />
            <p className="text-[10px] uppercase tracking-widest font-bold">No Image Selected</p>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter image URL..."
            className={inputCls}
            value={value || ''}
            onChange={e => onUpload(null, path, type, e.target.value)}
            maxLength={2000}
            title={value || ''}
          />
          <label className="shrink-0 cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
            <Upload size={14} />
            Upload
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={e => onUpload(e.target.files[0], path, type)}
            />
          </label>
        </div>
      </div>
    </FieldGroup>
  );
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//  Tiny reusable field components
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
          <path d="M6 9l6 6 6-6" />
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

function ColourField({ label, value, onChange }) {
  return (
    <FieldGroup label={label}>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-10 h-10 p-0.5 rounded-lg border border-slate-200 cursor-pointer bg-white"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={inputCls}
        />
      </div>
    </FieldGroup>
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//  Toast
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Toast({ type, message, onClose }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3
        px-5 py-4 rounded-xl shadow-lg max-w-sm
        ${type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          : 'bg-red-50 border border-red-200 text-red-800'}`}
    >
      <span className="text-lg">
        {type === 'success' ? <CheckCircle size={20} className="text-emerald-500" /> : <AlertCircle size={20} className="text-red-500" />}
      </span>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="text-current opacity-50 hover:opacity-100 transition-opacity"><X size={16} /></button>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//  Gallery row editor
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function GalleryEditor({ gallery, onChange, onUpload, onDelete }) {
  const addPhoto = () => onChange([...gallery, { src: '', alt: '' }]);
  const removePhoto = (i) => {
    const photo = gallery[i];
    if (photo.src && photo.src.startsWith('/images/')) {
      onDelete(`gallery.${i}.src`, photo.src, true, i);
    } else {
      onChange(gallery.filter((_, idx) => idx !== i));
    }
  };
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
                  <ImageIcon size={24} className="opacity-20" />
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
            >--</button>
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

// ------------------------------------------------------------------------------------------------------------------------------------------------------------// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//  MAIN ADMIN PAGE (Multi-Tenant Container)
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('list'); // 'list' or 'edit'
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

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

  return (
    <>
      {view === 'list' ? (
        <InvitationList
          onEdit={(slug) => {
            setSelectedSlug(slug);
            setView('edit');
          }}
          showToast={showToast}
        />
      ) : (
        <AdminDashboard
          slug={selectedSlug}
          onBack={() => setView('list')}
          showToast={showToast}
        />
      )}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

function InvitationList({ onEdit, showToast }) {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newSlug, setNewSlug] = useState('');
  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState(null);

  const fetchInvitations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      
      if (!Array.isArray(data)) {
        throw new Error(data.error || 'Server returned invalid data format');
      }

      setInvitations(data.map(item => ({
        ...item,
        slug: item.slug || 'global_config',
        displayNames: item.couple?.displayNames || item.displayNames || 'Legacy Invitation'
      })));
    } catch (err) {
      console.error('[InvitationList] Fetch error:', err);
      setError(err.message);
      showToast('error', 'Failed to load invitations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvitations(); }, []);

  const handleDeleteInvitation = async (slug) => {
    setLoading(true);
    try {
      const url = `/api/config?${new URLSearchParams({ slug }).toString()}`;
      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        setInvitations(prev => prev.filter(inv => inv.slug !== slug));
        setConfirmDeleteSlug(null);
        showToast('success', 'Invitation deleted successfully.');
      } else {
        showToast('error', data.error || 'Failed to delete invitation.');
      }
    } catch (err) {
      console.error('[InvitationList] Deletion Error:', err);
      showToast('error', 'Deletion failed due to a server error.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newSlug) return;
    setLoading(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: newSlug }),
      });
      const data = await res.json();
      if (data.success) {
        setCreating(false);
        setNewSlug('');
        fetchInvitations();
        onEdit(newSlug);
        showToast('success', 'New invitation created!');
      } else {
        showToast('error', data.error);
      }
    } catch (err) {
      showToast('error', 'Creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-serif text-slate-800">Wedding Invitations</h1>
            <p className="text-slate-500 text-sm">Manage all your client invitations from one place.</p>
          </div>
          <button
            onClick={() => setCreating(true)}
            className="px-6 py-3 bg-[#C9956A] text-white rounded-xl font-bold uppercase text-xs shadow-lg hover:bg-[#b5845a] transition-all"
          >
            + Create New Invitation
          </button>
        </header>

        {loading && !invitations.length ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 border-4 border-[#C9956A]/20 border-t-[#C9956A] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 font-medium">Loading invitations...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-rose-100 shadow-sm">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-serif text-slate-800 mb-2">Failed to Load</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">{error}</p>
            <button
              onClick={fetchInvitations}
              className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-serif text-slate-800 mb-2">No Invitations Yet</h3>
            <p className="text-slate-400 text-sm mb-8">Get started by creating your first wedding invitation.</p>
            <button
              onClick={() => setCreating(true)}
              className="px-8 py-3 bg-[#C9956A] text-white rounded-xl font-bold uppercase text-xs shadow-lg hover:bg-[#b5845a] transition-all"
            >
              + Create First Invitation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((inv) => (
              <div key={inv.slug} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-[#C9956A]/10 rounded-2xl flex items-center justify-center text-2xl"><Heart size={20} className="text-[#C9956A]" /></div>
                  <span className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
                    {inv.slug === 'global_config' ? 'Legacy' : 'Active'}
                  </span>
                </div>
                <h3 className="text-lg font-serif text-slate-800 mb-1 line-clamp-1">{inv.displayNames || 'Untitled Wedding'}</h3>
                <p className="text-slate-400 text-xs mb-6">Slug: <span className="text-slate-600 font-mono tracking-tighter">/{inv.slug}</span></p>

                <div className="flex gap-2 relative z-10">
                  <button
                    onClick={() => onEdit(inv.slug)}
                    className="flex-[2] py-2.5 bg-slate-50 text-slate-700 text-[0.65rem] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Edit Config
                  </button>
                  <a
                    href={`/${inv.slug}`}
                    target="_blank"
                    className="flex-[2] py-2.5 bg-[#C9956A]/5 text-[#C9956A] text-[0.65rem] font-bold uppercase tracking-widest rounded-lg hover:bg-[#C9956A]/15 transition-colors text-center"
                  >
                    Live View
                  </a>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setConfirmDeleteSlug(inv.slug);
                    }}
                    className="flex-1 flex items-center justify-center py-2.5 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {confirmDeleteSlug && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
              {/* Premium Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setConfirmDeleteSlug(null)}
                className="absolute inset-0 bg-black/50 backdrop-blur-md"
              />
              
              {/* Premium Modal Box */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative bg-white/95 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-xl p-8 max-w-md w-full text-center"
              >
                <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                  <AlertCircle size={32} />
                </div>
                <h2 className="text-2xl font-serif text-neutral-800 dark:text-neutral-100 mb-3">Delete Invitation?</h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8 leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-neutral-700 dark:text-neutral-200">/{confirmDeleteSlug}</span>? This will permanently remove all data and linked photos. This action cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteSlug(null)}
                    className="flex-1 py-3 px-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-lg font-bold uppercase text-[10px] tracking-widest hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteInvitation(confirmDeleteSlug);
                    }}
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-rose-500 text-white rounded-lg font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-600 disabled:opacity-50 transition-all"
                  >
                    {loading ? 'Deleting...' : 'Yes, Delete Permanently'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {creating && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            >
              <h2 className="text-2xl font-serif text-slate-800 mb-2">New Invitation</h2>
              <p className="text-slate-400 text-sm mb-6">Enter a unique URL slug for this wedding (only lowercase letters and hyphens).</p>
              <form onSubmit={handleCreate}>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. kasun-nimesha-2026"
                  className={inputCls}
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  required
                />
                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setCreating(false)}
                    className="flex-1 py-3 text-slate-400 text-xs font-bold uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-[#C9956A] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#C9956A]/40"
                  >
                    {loading ? 'Creating...' : 'Initialize'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminDashboard({ slug, onBack, showToast }) {
  // ------ Data State ------------------------------------------------------------------------------------------------------------------------------------------------
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [activeTab, setActiveTab] = useState('couple');
  const [confirmDelete, setConfirmDelete] = useState(null); // { path, url, isGallery, index }

  // ------ Cropper State ------------------------------------------------------------------------------------------------------------------------------
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


  const handleUpload = async (file, path, type = 'general', manualValue = null) => {
    if (manualValue !== null) {
      setPath(path, manualValue);
      return;
    }
    if (!file) return;

    // Reject files larger than 10MB
    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'File too large! Maximum file size is 10MB.');
      return;
    }

    // Determine oldImage based on path
    const keys = path.split('.');
    let currentVal = config;
    try {
      for (let k of keys) currentVal = currentVal[k];
    } catch (e) { currentVal = null; }
    const oldImage = typeof currentVal === 'string' ? currentVal : null;

    // 1. Initial Compression (Reduce huge files before cropping/sending)
    let processedFile = file;
    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
    const isVideo = file.type.startsWith('video/') || file.name.toLowerCase().endsWith('.mp4');
    const isAudio = type === 'audio' || file.type.startsWith('audio/') || file.name.toLowerCase().endsWith('.mp3');

    if (!isGif && !isVideo && !isAudio && file.size > 1024 * 1024) { // Only compress non-GIFs/non-Audio/non-Video > 1MB
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

    // 2. Determine if cropping is needed (But skip for GIFs, Videos, and Audio)
    if ((type === 'hero' || type === 'gallery' || type === 'banner') && !isGif && !isVideo && !isAudio) {
      let aspect = 1.0;
      if (type === 'hero') {
        aspect = 3 / 4;
      } else if (type === 'gallery') {
        aspect = 0.75; // Standard 3:4 Portrait for masonry
      } else if (type === 'banner') {
        aspect = 3 / 1; // Default to Banner 3:1
      }

      setCropping({
        file: URL.createObjectURL(processedFile),
        path,
        type,
        aspect,
        oldImage
      });
      return;
    }

    // 3. Direct upload for other types
    await performUpload(processedFile, path, type, oldImage);
  };

  const performUpload = async (file, path, type, oldImage) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (oldImage) {
      formData.append('oldImage', oldImage);
    }

    setLoading(true);
    showToast('success', 'Uploading to server...');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        // Update config with new URL
        setPath(path, data.url);
        return data;
      } else {
        showToast('error', data.error || 'Upload failed');
      }
    } catch (err) {
      showToast('error', 'Upload error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCropExisting = (path, imageUrl, type) => {
    let aspect = 1.0;
    if (type === 'hero') aspect = 3 / 4;
    else if (type === 'gallery') aspect = 0.75;
    else if (type === 'banner') aspect = 3 / 1;

    setCropping({
      file: imageUrl,
      path,
      type,
      aspect,
      isExisting: true
    });
  };

  const onCropComplete = async (croppedBlob) => {
    if (!cropping) return;
    if (cropping.isExisting) {
      await performUpload(croppedBlob, cropping.path, cropping.type, cropping.file);
    } else {
      await performUpload(croppedBlob, cropping.path, cropping.type, cropping.oldImage);
    }
    setCropping(null);
  };

  const loadConfig = useCallback(async () => {
    setFetching(true);
    setFetchError(null);
    try {
      const res = await fetch(`/api/config?slug=${slug}`);
      const data = await res.json();
      if (data.success === false) throw new Error(data.error || 'Failed to fetch invitation config');
      setConfig(data);
    } catch (err) {
      console.error('[AdminDashboard] Load error:', err);
      setFetchError(err.message);
      showToast('error', `Failed to load invitation '${slug}': ${err.message}`);
    } finally {
      setFetching(false);
    }
  }, [slug, showToast]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    if (activeTab === 'edit' || activeTab === 'list') {
      // no-op here now
    }
  }, [activeTab]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/config?slug=${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Config saved successfully!');
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      showToast('error', `Save failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (path, oldImageUrl, isGallery = false, index = -1) => {
    if (!oldImageUrl) return;

    // We only perform server-side delete if it's a Cloudinary URL
    // If it's a local placeholder /images/..., we just clear it from the state
    if (!oldImageUrl.includes('cloudinary.com')) {
      if (isGallery && index > -1) {
        const newGallery = [...(config?.gallery || [])];
        newGallery.splice(index, 1);
        setConfig(prev => ({ ...prev, gallery: newGallery }));
      } else {
        setPath(path, '');
      }
      showToast('success', 'Image reference removed.');
      return;
    }

    // For Cloudinary images, we use our premium custom confirmation modal.
    setConfirmDelete({ path, url: oldImageUrl, isGallery, index });
  };

  const executeDeleteImage = async () => {
    if (!confirmDelete) return;
    const { path, url, isGallery, index } = confirmDelete;

    try {
      setLoading(true);
      const res = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: url }),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error || 'Failed to delete image');

      if (isGallery && index > -1) {
        const newGallery = [...config.gallery];
        newGallery.splice(index, 1);
        setConfig(prev => ({ ...prev, gallery: newGallery }));
      } else {
        setPath(path, '');
      }
      
      // CRITICAL: We must auto-save the config after a successful cloud deletion 
      // to ensure the null/empty value is persisted to the database.
      setTimeout(() => {
        const btn = document.getElementById('save-config-btn');
        if (btn) btn.click();
      }, 500);

      showToast('success', 'Image permanently deleted from cloud!');
    } catch (err) {
      showToast('error', `Delete failed: ${err.message}`);
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  if (fetching || (!config && !fetchError)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#C9956A]/30 border-t-[#C9956A] animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-sans">Loading Dashboard Data...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !config || !config.couple) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-serif text-slate-800 mb-2">Editor Error</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-sm">
          We couldn't load the configuration for <span className="font-bold text-slate-700">/{slug}</span>. 
          {fetchError || 'Configuration data is missing or incomplete.'}
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={loadConfig}
            className="w-full py-4 bg-[#C9956A] text-white rounded-2xl font-bold uppercase text-xs tracking-widest shadow-lg hover:bg-[#b5845a] transition-all"
          >
            Try Again
          </button>
          <button
            onClick={onBack}
            className="w-full py-4 bg-white text-slate-400 rounded-2xl font-bold uppercase text-xs tracking-widest border border-slate-100 hover:bg-slate-50 transition-all"
          >
            Go Back to Dashboard
          </button>
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
    { id: 'timeline', label: '⏳ Timeline' },
    { id: 'rsvp', label: '✉️ RSVP Settings' },
    { id: 'theme', label: '🎨 Theme' },
    { id: 'meta', label: '🔍 SEO' },
    { id: 'backgrounds', label: '🖼️ Backgrounds' },
    { id: 'decor', label: '✨ Decoration' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

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
            <button
              onClick={onBack}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
            <h1 className="font-bold text-slate-800 text-sm hidden sm:block">Editor: /{slug}</h1>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noopener"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
              View Live
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
                <>
                  <Save size={14} /> Save Config
                </>
              )}
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-0.5 overflow-x-auto pb-0 scrollbar-hide">
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`shrink-0 px-3 sm:px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-all duration-200 whitespace-nowrap ${activeTab === t.id ? 'border-[#C9956A] text-[#C9956A]' : 'border-transparent text-slate-500 hover:text-slate-700'
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
            <SectionCard title="Couple Information" icon={<Heart size={18} className="text-rose-400" />}>
              <FieldGroup label="Bride First Name">
                <input
                  type="text"
                  className={inputCls}
                  value={config?.couple?.bride?.firstName || ''}
                  onChange={e => setPath('couple.bride.firstName', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Bride Last Name">
                <input
                  type="text"
                  className={inputCls}
                  value={config?.couple?.bride?.lastName || ''}
                  onChange={e => setPath('couple.bride.lastName', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Bride Full Name">
                <input
                  type="text"
                  className={inputCls}
                  value={config?.couple?.bride?.fullName || ''}
                  onChange={e => setPath('couple.bride.fullName', e.target.value)}
                />
              </FieldGroup>
              <div className="hidden md:block" />
              <FieldGroup label="Groom First Name">
                <input
                  type="text"
                  className={inputCls}
                  value={config?.couple?.groom?.firstName || ''}
                  onChange={e => setPath('couple.groom.firstName', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Groom Last Name">
                <input
                  type="text"
                  className={inputCls}
                  value={config?.couple?.groom?.lastName || ''}
                  onChange={e => setPath('couple.groom.lastName', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Groom Full Name">
                <input
                  type="text"
                  className={inputCls}
                  value={config?.couple?.groom?.fullName || ''}
                  onChange={e => setPath('couple.groom.fullName', e.target.value)}
                />
              </FieldGroup>
              <div className="hidden md:block" />
              <FieldGroup label="Display Names (used in Hero & Nav)" hint='e.g. "Amara & Kaveen"'>
                <input
                  type="text"
                  className={inputCls}
                  value={config?.couple?.displayNames || ''}
                  onChange={e => setPath('couple.displayNames', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Tagline" hint='e.g. "Together Forever"'>
                <input type="text" className={inputCls} value={config?.couple?.tagline || ''} onChange={e => setPath('couple.tagline', e.target.value)} />
              </FieldGroup>
            </SectionCard>
          )}

          {activeTab === 'wedding' && (
            <SectionCard title="Hero Style" icon={<Sparkles size={18} className="text-amber-400" />}>
              <div
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden mb-5 transition-all duration-500"
                style={{ aspectRatio: '3 / 4' }}
              >
                {config?.heroImage ? (
                  <img src={config.heroImage} className="w-full h-full object-cover" alt="Hero Preview" />
                ) : (
                  <div className="text-center p-6">
                    <ImageIcon size={32} className="opacity-20 mx-auto" />
                    <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">No Hero Image</p>
                  </div>
                )}
              </div>
              <FieldGroup label="Hero Image" hint="The primary photo shown at the top of the invitation.">
                <ImageField
                  label="Hero Photo"
                  hint="Portrait (3:4) aspect recommended"
                  value={config?.heroImage || ''}
                  path="heroImage"
                  type="hero"
                  onUpload={handleUpload}
                  onDelete={handleDeleteImage}
                  onCrop={handleCropExisting}
                />
              </FieldGroup>
              <FieldGroup label="Hero Background Video" hint="Autplaying loop for the hero background. Recommended: Lightweight .mp4">
                <ImageField
                  label="Hero Video Loop"
                  hint="Provide a direct URL or upload a file"
                  value={config?.heroVideo || ''}
                  path="heroVideo"
                  type="video"
                  accept="video/*,image/*"
                  onUpload={handleUpload}
                  onDelete={handleDeleteImage}
                />
              </FieldGroup>
              <FieldGroup label="Wedding Date & Time (ISO 8601)" hint="Format: YYYY-MM-DDTHH:MM:SS">
                <input
                  type="datetime-local"
                  className={inputCls}
                  value={config?.wedding?.dateTimeISO?.slice(0, 16) || ''}
                  onChange={e => setPath('wedding.dateTimeISO', e.target.value + ':00')}
                />
              </FieldGroup>
              <FieldGroup label="Display Date" hint='Human-readable, shown on the invitation'>
                <input
                  type="text"
                  placeholder="December 19, 2026"
                  className={inputCls}
                  value={config?.wedding?.displayDate || ''}
                  onChange={e => setPath('wedding.displayDate', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Year (for footer copyright)">
                <input
                  type="text"
                  placeholder="2026"
                  className={inputCls}
                  value={config?.wedding?.year || ''}
                  onChange={e => setPath('wedding.year', e.target.value)}
                />
              </FieldGroup>

              <FieldGroup label="Invitation Card Layout" hint="Choose the hero card style for your invitation">
                <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  {[
                    { id: 1, label: 'Layout 1: Script Overlay', desc: 'Classic cursive styling with photo and details' },
                    { id: 2, label: 'Layout 2: Clean Fade', desc: 'Names on photo with large numeric date' },
                    { id: 3, label: 'Layout 3: Royal Arch', desc: 'Traditional borders and elegant arches' },
                    { id: 4, label: 'Layout 4: Nature Arch', desc: 'Premium forest-inspired archway' },
                    { id: 5, label: 'Layout 5: Minimalist', desc: 'Modern high-contrast typography' },
                    { id: 6, label: 'Layout 6: Floral Garden', desc: 'Watercolor blooms and garden theme' },
                    { id: 7, label: 'Layout 7: Polaroid', desc: 'Retro scrapbook style with taped photo' },
                    { id: 8, label: 'Layout 8: Premium 3D Reveal', desc: 'Immersive envelope opening with high-end typography' },
                    { id: 9, label: 'Layout 9: Modern Full Cover', desc: 'Natural height background with no text; modern dark/gradient UI' },
                  ].map(layout => {
                    const active = (config?.heroLayout ?? 1) === layout.id;
                    return (
                      <button
                        key={layout.id}
                        type="button"
                        onClick={() => setPath('heroLayout', layout.id)}
                        className={`flex flex-col items-start gap-1.5 p-4 rounded-xl border-2 text-left transition-all ${active ? 'border-[#C9956A] bg-[#fdf6ef] shadow-sm' : 'border-slate-100 hover:border-slate-300 bg-white'
                          }`}
                      >
                        <span className={`text-xs font-bold tracking-wide ${active ? 'text-[#C9956A]' : 'text-slate-600'}`}>{layout.label}</span>
                        <span className="text-[0.65rem] text-slate-400 leading-snug">{layout.desc}</span>
                        {active && <span className="mt-1 flex items-center gap-1 text-[0.6rem] font-bold text-[#C9956A] uppercase tracking-widest"><CheckCircle size={10} /> Active</span>}
                      </button>
                    );
                  })}
                </div>
              </FieldGroup>

              {config?.heroLayout === 9 && (
                <div className="col-span-2 mt-4 pt-6 border-t border-slate-50">
                  <ImageField
                    label="Layout 9 Full-Cover Background (Large Image)"
                    hint="For Layout 9, upload the large background image here. It will be shown in full height."
                    value={config.sectionBackgrounds?.hero}
                    path="sectionBackgrounds.hero"
                    type="hero"
                    onUpload={handleUpload}
                    onDelete={handleDeleteImage}
                    onCrop={handleCropExisting}
                  />
                </div>
              )}
            </SectionCard>
          )}

          {activeTab === 'story' && (
            <SectionCard title="Our Story & Invitation Text" icon={<Book size={18} className="text-indigo-400" />}>
              <FieldGroup label="Formal Invitation Text" hint="Shown in an elegant bordered box">
                <textarea
                  className={`${textareaCls} col-span-2`}
                  value={config?.story?.invitationText || ''}
                  onChange={e => setPath('story.invitationText', e.target.value)}
                />
              </FieldGroup>
              <div className="col-span-2 flex flex-col gap-3">
                <p className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-slate-500">Story Paragraphs</p>
                {(config?.story?.paragraphs || []).map((p, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <textarea
                      rows={3}
                      className={`${textareaCls} flex-1`}
                      value={p}
                      onChange={e => {
                        const updated = [...(config?.story?.paragraphs || [])];
                        updated[i] = e.target.value;
                        setPath('story.paragraphs', updated);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setPath('story.paragraphs', (config?.story?.paragraphs || []).filter((_, idx) => idx !== i))}
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-colors text-lg mt-0.5"
                    >
                      --
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setPath('story.paragraphs', [...(config?.story?.paragraphs || []), ''])}
                  className="self-start text-xs font-semibold text-[#C9956A] flex items-center gap-1 hover:underline"
                >
                  + Add Paragraph
                </button>
              </div>
            </SectionCard>
          )}

          {activeTab === 'events' && (
            <SectionCard title="Ceremony Details" icon={<MapPin size={18} className="text-emerald-400" />}>
              <FieldGroup label="Title">
                <input
                  type="text"
                  className={inputCls}
                  value={config?.events?.ceremony?.title || ''}
                  onChange={e => setPath('events.ceremony.title', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Emoji Icon">
                <input
                  type="text"
                  className={inputCls}
                  value={config?.events?.ceremony?.icon || ''}
                  onChange={e => setPath('events.ceremony.icon', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Time">
                <input
                  type="text"
                  className={inputCls}
                  placeholder="10:00 AM"
                  value={config?.events?.ceremony?.time || ''}
                  onChange={e => setPath('events.ceremony.time', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Venue Name">
                <input
                  type="text"
                  className={inputCls}
                  value={config?.events?.ceremony?.venueName || ''}
                  onChange={e => setPath('events.ceremony.venueName', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Address">
                <input
                  type="text"
                  className={inputCls}
                  value={config?.events?.ceremony?.address || ''}
                  onChange={e => setPath('events.ceremony.address', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Dress Code">
                <input
                  type="text"
                  className={inputCls}
                  value={config?.events?.ceremony?.dressCode || ''}
                  onChange={e => setPath('events.ceremony.dressCode', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="Google Maps URL">
                <input
                  type="url"
                  className={inputCls}
                  value={config?.events?.ceremony?.mapsUrl || ''}
                  onChange={e => setPath('events.ceremony.mapsUrl', e.target.value)}
                />
              </FieldGroup>
              <ImageField
                label="Event Image"
                hint="Upload a photo for this event (appears on the left in Layout 4)"
                value={config?.events?.ceremony?.image || ''}
                path="events.ceremony.image"
                type="general"
                onUpload={handleUpload}
                onDelete={handleDeleteImage}
              />
            </SectionCard>
          )}

          {activeTab === 'gallery' && (
            <SectionCard title="Gallery Photos" icon={<Image size={18} className="text-sky-400" />}>
              <GalleryEditor
                gallery={config?.gallery || []}
                onChange={val => setPath('gallery', val)}
                onUpload={handleUpload}
                onDelete={handleDeleteImage}
              />
            </SectionCard>
          )}

          {activeTab === 'rsvp' && (
            <>
              <SectionCard title="RSVP Settings" icon={<Mail size={18} className="text-blue-400" />}>
                <FieldGroup label="WhatsApp Number" hint="Phone number for receiving RSVPs">
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="94771234567"
                    value={config?.rsvp?.whatsappNumber || ''}
                    onChange={e => setPath('rsvp.whatsappNumber', e.target.value)}
                  />
                </FieldGroup>
                <FieldGroup label="RSVP Deadline">
                  <input type="text" className={inputCls} value={config?.rsvp?.deadline || ''} onChange={e => setPath('rsvp.deadline', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Max Guests per RSVP">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    className={inputCls}
                    value={config?.rsvp?.maxGuests || 2}
                    onChange={e => setPath('rsvp.maxGuests', Number(e.target.value))}
                  />
                </FieldGroup>
              </SectionCard>

              <SectionCard title="Opening Animation" icon={<Sparkles size={18} className="text-purple-400" />}>
                <FieldGroup label="Animation Style" hint="Choose how guests first see your invitation">
                  <div className="flex flex-wrap gap-x-6 gap-y-4 mt-1">
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
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${config.revealStyle === 'cover' ? 'border-[#C9956A]' : 'border-slate-300 group-hover:border-slate-400'}`}>
                        {config.revealStyle === 'cover' && <div className="w-2.5 h-2.5 rounded-full bg-[#C9956A]" />}
                      </div>
                      <input
                        type="radio"
                        className="hidden"
                        name="revealStyle"
                        value="cover"
                        checked={config.revealStyle === 'cover'}
                        onChange={() => setPath('revealStyle', 'cover')}
                      />
                      <span className={`text-sm font-medium ${config.revealStyle === 'cover' ? 'text-slate-900' : 'text-slate-500'}`}>Cover Page</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${config.revealStyle === 'fade' ? 'border-[#C9956A]' : 'border-slate-300 group-hover:border-slate-400'}`}>
                        {config.revealStyle === 'fade' && <div className="w-2.5 h-2.5 rounded-full bg-[#C9956A]" />}
                      </div>
                      <input
                        type="radio"
                        className="hidden"
                        name="revealStyle"
                        value="fade"
                        checked={config.revealStyle === 'fade'}
                        onChange={() => setPath('revealStyle', 'fade')}
                      />
                      <span className={`text-sm font-medium ${config.revealStyle === 'fade' ? 'text-slate-900' : 'text-slate-500'}`}>Auto Fade Reveal</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${config.revealStyle === 'premium-envelope' ? 'border-[#C9956A]' : 'border-slate-300 group-hover:border-slate-400'}`}>
                        {config.revealStyle === 'premium-envelope' && <div className="w-2.5 h-2.5 rounded-full bg-[#C9956A]" />}
                      </div>
                      <input
                        type="radio"
                        className="hidden"
                        name="revealStyle" 
                        value="premium-envelope" 
                        checked={config.revealStyle === 'premium-envelope' || config.revealStyle === 'premium_envelope'} 
                        onChange={() => setPath('revealStyle', 'premium-envelope')} 

                      />
                      <span className={`text-sm font-medium ${config.revealStyle === 'premium-envelope' ? 'text-slate-900' : 'text-slate-500'}`}>Premium Wax Seal Envelope</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${config.revealStyle === 'royal_envelope' ? 'border-[#C9956A]' : 'border-slate-300 group-hover:border-slate-400'}`}>
                        {config.revealStyle === 'royal_envelope' && <div className="w-2.5 h-2.5 rounded-full bg-[#C9956A]" />}
                      </div>
                      <input
                        type="radio"
                        className="hidden"
                        name="revealStyle"
                        value="royal_envelope"
                        checked={config.revealStyle === 'royal_envelope'}
                        onChange={() => setPath('revealStyle', 'royal_envelope')}
                      />
                      <span className={`text-sm font-medium ${config.revealStyle === 'royal_envelope' ? 'text-slate-900' : 'text-slate-500'}`}>Royal Envelope</span>
                    </label>
                  </div>
                </FieldGroup>

                <ImageField
                  label="Cover Image"
                  hint="Upload a high-quality photo for the cover page"
                  value={config?.revealCoverImage || ''}
                  path="revealCoverImage"
                  type="general"
                  onUpload={handleUpload}
                  onDelete={handleDeleteImage}
                />

                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-6 border-t border-slate-50">
                  <ImageField
                    label="Groom Cartoon (Running)"
                    hint="Transparent PNG recommended"
                    value={config.coupleImages?.groom}
                    path="coupleImages.groom"
                    type="general"
                    onUpload={handleUpload}
                    onDelete={handleDeleteImage}
                    onCrop={handleCropExisting}
                  />

                  <ImageField
                    label="Bride Cartoon (Running)"
                    hint="Transparent PNG recommended"
                    value={config.coupleImages?.bride}
                    path="coupleImages.bride"
                    type="general"
                    onUpload={handleUpload}
                    onDelete={handleDeleteImage}
                    onCrop={handleCropExisting}
                  />
                </div>
              </SectionCard>

              <SectionCard title="Envelope Cover" icon={<Layers size={18} className="text-slate-400" />}>
                <ImageField
                  label="Inner Card Background Image"
                  hint="Upload directly or enter a URL"
                  value={config.envelope?.bgImage}
                  path="envelope.bgImage"
                  type="general"
                  onUpload={handleUpload}
                  onDelete={handleDeleteImage}
                />
                <ImageField
                  label="Outer Background Image"
                  hint="Upload directly or enter a URL"
                  value={config.envelope?.outerBgImage}
                  path="envelope.outerBgImage"
                  type="general"
                  onUpload={handleUpload}
                  onDelete={handleDeleteImage}
                />
                <FieldGroup label="Cover Title">
                  <input type="text" className={inputCls} value={config?.envelope?.title || ''} onChange={e => setPath('envelope.title', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Cover Subtitle">
                  <input
                    type="text"
                    className={inputCls}
                    value={config?.envelope?.subtitle || ''}
                    onChange={e => setPath('envelope.subtitle', e.target.value)}
                  />
                </FieldGroup>
                <FieldGroup label="Button Text">
                  <input
                    type="text"
                    className={inputCls}
                    value={config?.envelope?.buttonText || ''}
                    onChange={e => setPath('envelope.buttonText', e.target.value)}
                  />
                </FieldGroup>

                {config.revealStyle === 'royal_envelope' && (
                  <div className="col-span-2 mt-6 pt-6 border-t border-slate-100">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-1 grid grid-cols-1 gap-4 w-full">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">Royal Envelope Tuning</p>
                          <button
                            type="button"
                            onClick={() => {
                              setPath('envelope.royal.envelopeColor', config?.theme?.colorPrimary || '#91091E');
                              setPath('envelope.royal.bgColor1', config?.theme?.colorBg || '#3D0010');
                              setPath('envelope.royal.bgColor2', config?.theme?.colorPrimary || '#91091E');
                              setPath('envelope.royal.sealColor', config?.theme?.colorPrimary || '#91091E');
                            }}
                            className="text-[0.6rem] text-[#C9956A] font-bold hover:underline"
                          >
                            Reset to Theme Colors
                          </button>
                        </div>
                        <ColourField
                          label="Envelope Paper"
                          value={config.envelope?.royal?.envelopeColor || config.theme?.colorPrimary || '#91091E'}
                          onChange={val => setPath('envelope.royal.envelopeColor', val)}
                        />
                        <ColourField
                          label="Background Base (1)"
                          value={config.envelope?.royal?.bgColor1 || config.theme?.colorBg || '#3D0010'}
                          onChange={val => setPath('envelope.royal.bgColor1', val)}
                        />
                        <ColourField
                          label="Background Accent (2)"
                          value={config.envelope?.royal?.bgColor2 || config.theme?.colorPrimary || '#91091E'}
                          onChange={val => setPath('envelope.royal.bgColor2', val)}
                        />
                        <ColourField
                          label="Wax Seal Color"
                          value={config.envelope?.royal?.sealColor || config.theme?.colorPrimary || '#91091E'}
                          onChange={val => setPath('envelope.royal.sealColor', val)}
                        />
                        <p className="text-[0.6rem] text-slate-400 italic mt-2">
                          * Defaults to theme colors if not explicitly set. The background creates a repeating diamond mosaic pattern.
                        </p>
                      </div>

                      <div className="shrink-0 w-full md:w-64">
                        <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest mb-3">Live Preview</p>
                        <div
                          className="w-full aspect-[4/3] rounded-xl shadow-inner flex items-center justify-center overflow-hidden border border-slate-200 relative"
                          style={{
                            background: `radial-gradient(circle at center, ${config.envelope?.royal?.bgColor2 || config.theme?.colorPrimary || '#91091E'} 0%, ${config.envelope?.royal?.bgColor1 || config.theme?.colorBg || '#3D0010'} 100%)`,
                          }}
                        >
                          <div
                            className="relative w-4/5 h-4/5 rounded shadow-xl overflow-hidden border border-black/5 z-10"
                            style={{ backgroundColor: config.envelope?.royal?.envelopeColor || config.theme?.colorPrimary || '#91091E' }}
                          >
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-full h-3 md:h-4 z-40 shadow-sm overflow-hidden flex flex-col justify-between py-[0.5px]"
                              style={{
                                background: 'linear-gradient(to right, #5d401a 0%, #b8860b 20%, #f7e48b 45%, #ffffff 50%, #f7e48b 55%, #b8860b 80%, #5d401a 100%)',
                              }}
                            >
                              <div className="w-full h-[0.2px] bg-white/40" />
                              <div className="w-full h-[0.2px] bg-white/40" />
                            </div>
                            <div
                              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-[#D4AF37] shadow-md flex items-center justify-center text-[5px] font-serif text-[#D4AF37] font-bold overflow-hidden"
                              style={{
                                backgroundColor: config.envelope?.royal?.sealColor || config.theme?.colorPrimary || '#91091E',
                                borderRadius: '41% 59% 41% 59% / 53% 45% 55% 47%',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.2)'
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/10 rounded-inherit" />
                              <div
                                className="w-[70%] h-[70%] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center font-serif font-black italic text-[#D4AF37]"
                                style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                              >
                                <div className="relative z-10 flex items-center gap-0.5 scale-75">
                                  <span>{(config.couple?.bride?.firstName?.[0] || 'D').toUpperCase()}</span>
                                  <span className="scale-75 text-[4px] not-italic font-normal font-script">&</span>
                                  <span>{(config.couple?.groom?.firstName?.[0] || 'C').toUpperCase()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 50%)', border: '1px solid black' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {(config?.revealStyle === 'premium-envelope' || config?.revealStyle === 'premium_envelope') && (
                  <div className="col-span-2 mt-6 pt-6 border-t border-slate-100">
                    <div className="mb-4 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <Palette size={16} className="text-[#C9956A]" />
                         <h4 className="text-sm font-semibold text-slate-700">Premium Envelope Details</h4>
                       </div>
                       <button
                         type="button"
                         onClick={() => {
                           setPath('envelopeColors.seal', config?.theme?.colorPrimary || '#dc2626');
                           setPath('envelopeColors.back', config?.theme?.colorPrimary || '#064e3b');
                           setPath('envelopeColors.pocket', config?.theme?.colorSecondary || '#047857');
                           setPath('envelopeColors.flap', config?.theme?.colorPrimary || '#064e3b');
                           setPath('envelopeColors.card', config?.theme?.colorBg || '#fef3c7');
                         }}
                         className="text-[0.6rem] text-[#C9956A] font-bold hover:underline"
                       >
                         Reset to Theme Colors
                       </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                      <FieldGroup label="Card Title" hint="E.g. 'A Wedding Invitation'">
                        <input type="text" className={inputCls} value={config.envelope?.title || ''} onChange={e => setPath('envelope.title', e.target.value)} />
                      </FieldGroup>
                      <FieldGroup label="Card Names" hint="E.g. 'Kasun & Nimesha'">
                        <input type="text" className={inputCls} value={config.envelope?.subtitle || ''} onChange={e => setPath('envelope.subtitle', e.target.value)} />
                      </FieldGroup>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 mb-6">
                      <ColourField label="Wax Seal Color" value={config.envelopeColors?.seal || '#dc2626'} onChange={val => setPath('envelopeColors.seal', val)} />
                      <ColourField label="Envelope Back" value={config.envelopeColors?.back || '#064e3b'} onChange={val => setPath('envelopeColors.back', val)} />
                      <ColourField label="Front Pocket" value={config.envelopeColors?.pocket || '#047857'} onChange={val => setPath('envelopeColors.pocket', val)} />
                      <ColourField label="Top Flap" value={config.envelopeColors?.flap || '#064e3b'} onChange={val => setPath('envelopeColors.flap', val)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <ColourField label="Card Background" value={config.envelopeColors?.card || '#fef3c7'} onChange={val => setPath('envelopeColors.card', val)} />
                      <ImageField 
                        label="Envelope Opening Video"
                        hint="The opening animation (transparent background MP4 recommended)"
                        value={config.envelopeVideo}
                        path="envelopeVideo"
                        type="video"
                        accept="video/*"
                        onUpload={handleUpload}
                        onDelete={handleDeleteImage}
                      />
                    </div>
                  </div>
                )}
              </SectionCard>
            </>
          )}

          {activeTab === 'theme' && (
            <div className="flex flex-col gap-5">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden px-6 py-6">
                <div className="flex items-center gap-3 mb-6">
                  <Palette size={20} className="text-[#C9956A]" />
                  <h3 className="font-semibold text-slate-700 text-sm tracking-wide">Premium Theme Presets</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PRESET_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        setPath('theme', theme.colors);
                        // Sync Royal Envelope colors automatically when theme is selected
                        setPath('envelope.royal.envelopeColor', theme.colors.colorPrimary);
                        setPath('envelope.royal.bgColor1', theme.colors.colorBg);
                        setPath('envelope.royal.bgColor2', theme.colors.colorPrimary);
                        setPath('envelope.royal.sealColor', theme.colors.colorPrimary);
                        
                        // Sync Premium Envelope colors automatically when theme is selected
                        setPath('envelopeColors.seal', theme.colors.colorPrimary);
                        setPath('envelopeColors.back', theme.colors.colorPrimary);
                        setPath('envelopeColors.pocket', theme.colors.colorSecondary);
                        setPath('envelopeColors.flap', theme.colors.colorPrimary);
                        setPath('envelopeColors.card', theme.colors.colorBg);
                      }}
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

              <SectionCard title="Fine-tune Theme Colours" icon={<Palette size={18} className="text-[#C9956A]" />}>
                {[
                  ['colorPrimary', 'Primary Accent'],
                  ['colorSecondary', 'Secondary Accent'],
                  ['colorTextLight', 'Light Text'],
                  ['colorTextDark', 'Dark Text'],
                  ['colorBg', 'Page Background'],
                  ['colorSurface', 'Card Background'],
                ].map(([key, label]) => (
                  <ColourField key={key} label={label} value={config?.theme?.[key] || ''} onChange={val => setPath(`theme.${key}`, val)} />
                ))}
                <FieldGroup label="Hero Overlay Start (rgba)">
                  <input
                    type="text"
                    className={inputCls}
                    value={config?.theme?.heroOverlayStart || ''}
                    onChange={e => setPath('theme.heroOverlayStart', e.target.value)}
                  />
                </FieldGroup>
                <FieldGroup label="Hero Overlay End (rgba)">
                  <input type="text" className={inputCls} value={config?.theme?.heroOverlayEnd || ''} onChange={e => setPath('theme.heroOverlayEnd', e.target.value)} />
                </FieldGroup>

                <div className="col-span-2 mt-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[0.68rem] font-bold tracking-[0.1em] uppercase text-slate-400 mb-3">Live Colour Preview</p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.entries(config?.theme || {}))
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

          {activeTab === 'timeline' && (
            <SectionCard title="Wedding Timeline" icon={<Calendar size={18} className="text-amber-500" />}>
              <div className="col-span-2 flex flex-col gap-4">
                {config.timeline?.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 relative group">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...config.timeline];
                        updated.splice(idx, 1);
                        setPath('timeline', updated);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <FieldGroup label="Time">
                        <input type="text" className={inputCls} value={item.time} onChange={e => {
                          const updated = [...config.timeline];
                          updated[idx].time = e.target.value;
                          setPath('timeline', updated);
                        }} />
                      </FieldGroup>
                      <FieldGroup label="Title">
                        <input type="text" className={inputCls} value={item.title} onChange={e => {
                          const updated = [...config.timeline];
                          updated[idx].title = e.target.value;
                          setPath('timeline', updated);
                        }} />
                      </FieldGroup>
                      <FieldGroup label="Icon (Emoji)">
                        <input type="text" className={inputCls} value={item.icon} onChange={e => {
                          const updated = [...config.timeline];
                          updated[idx].icon = e.target.value;
                          setPath('timeline', updated);
                        }} />
                      </FieldGroup>
                      <div className="sm:col-span-3">
                        <FieldGroup label="Description">
                          <input type="text" className={inputCls} value={item.description} onChange={e => {
                            const updated = [...config.timeline];
                            updated[idx].description = e.target.value;
                            setPath('timeline', updated);
                          }} />
                        </FieldGroup>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setPath('timeline', [...(config.timeline || []), { time: '', title: '', description: '', icon: '✨' }])}
                  className="self-start px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors"
                >
                  + Add Timeline Event
                </button>
              </div>
            </SectionCard>
          )}

          {activeTab === 'meta' && (
            <SectionCard title="SEO & Social Sharing" icon={<Search size={18} className="text-slate-500" />}>
              <FieldGroup label="Page Title">
                <input type="text" className={inputCls} value={config?.meta?.title || ''} onChange={e => setPath('meta.title', e.target.value)} />
              </FieldGroup>
              <FieldGroup label="Description">
                <input
                  type="text"
                  className={inputCls}
                  value={config?.meta?.description || ''}
                  onChange={e => setPath('meta.description', e.target.value)}
                />
              </FieldGroup>
              <FieldGroup label="OG Image">
                <input type="text" className={inputCls} value={config?.meta?.ogImage || ''} onChange={e => setPath('meta.ogImage', e.target.value)} />
              </FieldGroup>
            </SectionCard>
          )}

          {activeTab === 'backgrounds' && (
            <SectionCard title="Section Backgrounds" icon={<Image size={18} className="text-slate-400" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['hero', 'story', 'events', 'gallery', 'rsvp', 'footer'].map(sec => (
                  <ImageField
                    key={sec}
                    label={`${sec.charAt(0).toUpperCase() + sec.slice(1)} Background`}
                    hint="Full-width background image"
                    value={config.sectionBackgrounds?.[sec]}
                    path={`sectionBackgrounds.${sec}`}
                    type="general"
                    onUpload={handleUpload}
                    onDelete={handleDeleteImage}
                    onCrop={handleCropExisting}
                  />
                ))}
              </div>
            </SectionCard>
          )}

          {activeTab === 'decor' && (
            <SectionCard title="Layout Decorations" icon={<Sparkles size={18} className="text-amber-500" />}>
              <FieldGroup label="Layout 1: Event Details Banner" hint="Custom header image for the Layout 1 event section (replaces gallery fallback)">
                <div className="flex flex-col gap-3">
                  {config.layout1EventBanner && (
                    <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img src={config.layout1EventBanner} className="w-full h-full object-cover" alt="Layout 1 Event Banner Preview" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="/images/event-banner.jpg"
                      className={inputCls}
                      value={config.layout1EventBanner || ''}
                      onChange={e => setPath('layout1EventBanner', e.target.value)}
                    />
                    <label className="shrink-0 cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center transition-colors">
                      Upload
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleUpload(e.target.files[0], 'layout1EventBanner', 'banner')} />
                    </label>
                    {config.layout1EventBanner && (
                      <button
                        type="button"
                        onClick={() => handleDeleteImage('layout1EventBanner', config.layout1EventBanner)}
                        className="shrink-0 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </FieldGroup>
            </SectionCard>
          )}

          {activeTab === 'decor' && (
            <SectionCard title="Background Music" icon={<Music size={18} className="text-purple-500" />}>
              <FieldGroup label="Audio File URL" hint="Paste a URL or upload an MP3 file. This music will play after common interaction.">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className={inputCls}
                      value={config.audioUrl || ''}
                      onChange={e => setPath('audioUrl', e.target.value)}
                      placeholder="https://example.com/music.mp3"
                    />
                    <label className="shrink-0 cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center transition-colors">
                      Upload
                      <input
                        type="file"
                        className="hidden"
                        accept="audio/*"
                        onChange={e => handleUpload(e.target.files[0], 'audioUrl', 'audio')}
                      />
                    </label>
                    {config.audioUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDeleteImage('audioUrl', config.audioUrl);
                        }}
                        className="shrink-0 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {config.audioUrl && (
                    <audio src={config.audioUrl} controls className="w-full h-8 mt-2" />
                  )}
                </div>
              </FieldGroup>
            </SectionCard>
          )}

          <details className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer text-xs font-bold tracking-wide text-slate-500 uppercase hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Layers size={14} className="opacity-50" /> Raw JSON Preview
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
                Saving...
              </>
            ) : (
              <span className="flex items-center gap-2">
                <Save size={18} /> Save & Update Config
              </span>
            )}
          </button>
        </main>
      </form>

      {/* Premium Media Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative bg-white/95 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-xl p-8 max-w-md w-full text-center"
            >
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-2xl font-serif text-neutral-800 dark:text-neutral-100 mb-3">Delete Media?</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8 leading-relaxed">
                Are you sure you want to permanently delete this file from the cloud? This action will remove the asset from all layouts.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 px-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-lg font-bold uppercase text-[10px] tracking-widest hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeDeleteImage}
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-rose-500 text-white rounded-lg font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-600 disabled:opacity-50 transition-all"
                >
                  {loading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
