import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, CheckCircle2, Trash2, Save, X, Plus, Eye, Package, Edit3, Search, ExternalLink, Zap, Upload } from 'lucide-react';
import { API_BASE } from '../adminConstants';
import { GlassPagination, Field } from '../AdminShared';

export default function ServicesPage({ services, onDelete, onAdd, onUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'content' | 'steps' | 'faqs'

  const initialForm = {
    title: '',
    slug: '',
    category: 'Commercial & Industrial',
    priceStarting: '$35/m²',
    image: '',
    gallery: [],
    shortDesc: '',
    fullDesc: '',
    featuresText: '',
    applicationsText: '',
    processSteps: [
      { stepNumber: 1, title: 'Surface Assessment & Testing', description: 'Evaluate slab hardness, moisture levels, and existing substrate condition.' },
      { stepNumber: 2, title: 'Diamond Grinding & Profiling', description: 'Planetary grinding with Husqvarna equipment to achieve CSP 2-3 mechanical bond.' },
      { stepNumber: 3, title: 'Crack & Joint Remediation', description: 'Epoxy pressure-routing and patching of stress fractures and expansion joints.' },
      { stepNumber: 4, title: 'Protective Sealer Application', description: 'Multiple coats of high-solids UV-stable polyurethane or polyaspartic sealer.' }
    ],
    faqs: [
      { question: 'What is the turnaround time for installation?', answer: 'Most commercial areas up to 300m² are completed in 1-2 days with light foot traffic in 8 hours.' },
      { question: 'Is this floor resistant to chemicals and hot tyres?', answer: 'Yes, certified commercial grade sealers eliminate hot-tyre pickup and resist automotive chemicals.' }
    ],
    popular: false
  };

  const [form, setForm] = useState(initialForm);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const token = localStorage.getItem('fs_admin_token');

  // Cloudinary Upload: Card Thumbnail
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumb(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });
      const result = await res.json();
      if (result.success && result.url) {
        upd('image', result.url);
      } else {
        alert(result.message || 'Image upload failed');
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploadingThumb(false);
  };

  // Cloudinary Upload: Multiple Service Detail Gallery Images
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingGallery(true);
    try {
      const data = new FormData();
      files.forEach(f => data.append('images', f));
      const res = await fetch(`${API_BASE}/upload/multiple`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });
      const result = await res.json();
      if (result.success && Array.isArray(result.urls)) {
        setForm(p => ({ ...p, gallery: [...(p.gallery || []), ...result.urls] }));
      } else {
        alert(result.message || 'Gallery upload failed');
      }
    } catch (err) {
      alert('Gallery upload failed: ' + err.message);
    }
    setUploadingGallery(false);
  };

  const removeGalleryImage = (idx) => {
    setForm(p => ({ ...p, gallery: (p.gallery || []).filter((_, i) => i !== idx) }));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(initialForm);
    setActiveTab('basic');
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditingId(s.id || s._id);
    setForm({
      title: s.title || '',
      slug: s.slug || '',
      category: s.category || 'Commercial & Industrial',
      priceStarting: s.priceStarting || '$35/m²',
      image: s.image || '',
      gallery: Array.isArray(s.gallery) ? s.gallery : [],
      shortDesc: s.shortDesc || '',
      fullDesc: s.fullDesc || '',
      featuresText: Array.isArray(s.features) ? s.features.join('\n') : '',
      applicationsText: Array.isArray(s.applications) ? s.applications.join('\n') : '',
      processSteps: (s.processSteps && s.processSteps.length > 0) ? s.processSteps : initialForm.processSteps,
      faqs: (s.faqs && s.faqs.length > 0) ? s.faqs : initialForm.faqs,
      popular: !!s.popular
    });
    setActiveTab('basic');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      features: form.featuresText ? form.featuresText.split('\n').map(t => t.trim()).filter(Boolean) : [],
      applications: form.applicationsText ? form.applicationsText.split('\n').map(t => t.trim()).filter(Boolean) : []
    };

    if (editingId) {
      await onUpdate(editingId, payload);
    } else {
      await onAdd(payload);
    }
    setShowModal(false);
  };

  const updateStep = (idx, field, val) => {
    setForm(p => {
      const copy = [...p.processSteps];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...p, processSteps: copy };
    });
  };

  const addStep = () => {
    setForm(p => ({
      ...p,
      processSteps: [...p.processSteps, { stepNumber: p.processSteps.length + 1, title: '', description: '' }]
    }));
  };

  const removeStep = (idx) => {
    setForm(p => ({
      ...p,
      processSteps: p.processSteps.filter((_, i) => i !== idx).map((st, i) => ({ ...st, stepNumber: i + 1 }))
    }));
  };

  const updateFaq = (idx, field, val) => {
    setForm(p => {
      const copy = [...p.faqs];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...p, faqs: copy };
    });
  };

  const addFaq = () => {
    setForm(p => ({
      ...p,
      faqs: [...p.faqs, { question: '', answer: '' }]
    }));
  };

  const removeFaq = (idx) => {
    setForm(p => ({
      ...p,
      faqs: p.faqs.filter((_, i) => i !== idx)
    }));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popularFirst'); // 'popularFirst' | 'titleAsc' | 'titleDesc'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Extract categories dynamically
  const categories = ['All', ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))];

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy, pageSize]);

  // Filtered services
  const filteredServices = services.filter(s => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortDesc?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'popularFirst') return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    if (sortBy === 'titleAsc') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'titleDesc') return (b.title || '').localeCompare(a.title || '');
    return 0;
  });

  const paginatedServices = filteredServices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const popularCount = services.filter(s => s.popular).length;

  return (
    <div style={{ position: 'relative' }}>
      {/* ── AMBIENT GLASS BACKDROP ACCENTS ── */}
      <div style={{
        position: 'absolute', top: '-10px', right: '5%', width: '380px', height: '240px',
        background: 'radial-gradient(circle, rgba(234, 88, 12, 0.08) 0%, rgba(249, 115, 22, 0.02) 60%, transparent 80%)',
        borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'absolute', top: '220px', left: '-20px', width: '320px', height: '220px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0
      }} />

      {/* ── TOP STATS & QUICK METRICS BAR ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px',
        marginBottom: '22px', position: 'relative', zIndex: 1
      }}>
        <div style={{
          padding: '16px 20px', borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Systems</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: '2px' }}>{services.length}</div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <Layers size={20} />
          </div>
        </div>

        <div style={{
          padding: '16px 20px', borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Popular Flagships</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#ea580c', fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: '2px' }}>{popularCount}</div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
            <Zap size={20} />
          </div>
        </div>

        <div style={{
          padding: '16px 20px', borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Categories Active</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: '2px' }}>{categories.length - 1}</div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
            <Package size={20} />
          </div>
        </div>

        <div style={{
          padding: '16px 20px', borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live Pages</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#10b981', fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: '2px' }}>100% Sync</div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* ── CONTROLS TOOLBAR: SEARCH, FILTERS & ACTION BUTTON ── */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(18px)',
        borderRadius: '18px', border: '1px solid rgba(226, 232, 240, 0.85)',
        boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.03)',
        padding: '16px 20px', marginBottom: '24px',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        position: 'relative', zIndex: 1
      }}>
        {/* Search & Filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          {/* Search bar */}
          <div style={{
            position: 'relative', minWidth: '240px', maxWidth: '340px', flex: '1 1 240px'
          }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search systems, slugs, specs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '9px 12px 9px 36px',
                borderRadius: '10px', border: '1px solid #e2e8f0',
                background: '#ffffff', color: '#0f172a',
                fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none',
                transition: 'all 0.2s', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
              }}
              onFocus={e => { e.target.style.borderColor = '#ea580c'; e.target.style.boxShadow = '0 0 0 3px rgba(234,88,12,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
            {categories.map(cat => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '7px 14px', borderRadius: '30px', fontSize: '0.74rem',
                    fontWeight: active ? '800' : '600', cursor: 'pointer',
                    transition: 'all 0.2s ease', fontFamily: 'inherit',
                    background: active
                      ? 'linear-gradient(135deg, #ea580c, #c2410c)'
                      : 'rgba(241, 245, 249, 0.75)',
                    color: active ? '#ffffff' : '#475569',
                    border: active ? '1px solid #ea580c' : '1px solid rgba(226, 232, 240, 0.8)',
                    boxShadow: active ? '0 4px 12px rgba(234,88,12,0.25)' : 'none'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Actions: Sort Selector & Add New Service */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1',
                fontSize: '0.78rem', fontWeight: '700', color: '#334155',
                backgroundColor: '#ffffff', outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="popularFirst">Popular Flagships First</option>
              <option value="titleAsc">Title (A–Z)</option>
              <option value="titleDesc">Title (Z–A)</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(234,88,12,0.35)' }}
            whileTap={{ scale: 0.98 }}
            onClick={openAdd}
            style={{
              display: 'flex', alignItems: 'center', gap: '9px', padding: '11px 22px',
              background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', border: 'none',
              borderRadius: '12px', color: '#fff', fontSize: '0.86rem', fontWeight: '800',
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 16px rgba(234,88,12,0.25)', flexShrink: 0,
              letterSpacing: '0.01em'
            }}
          >
            <Plus size={18} strokeWidth={2.8} /> Add New Service
          </motion.button>
        </div>
      </div>

      {/* ── EMPTY STATE ── */}
      {filteredServices.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)',
          borderRadius: '20px', border: '1px dashed #cbd5e1', margin: '20px 0'
        }}>
          <Layers size={40} style={{ color: '#94a3b8', margin: '0 auto 14px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 6px' }}>No services found</h3>
          <p style={{ fontSize: '0.84rem', color: '#64748b', maxWidth: '380px', margin: '0 auto 16px' }}>
            No flooring systems match "{searchQuery || selectedCategory}". Clear filters or create a new service.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1',
              background: '#fff', color: '#ea580c', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer'
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ── LUXURY LIQUID GLASS SERVICES GRID ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px',
        position: 'relative', zIndex: 1
      }}>
        {paginatedServices.map((s, i) => (
          <motion.div
            key={s.id || s._id || i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            style={{
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '22px',
              border: '1px solid rgba(255, 255, 255, 0.95)',
              boxShadow: '0 8px 30px -4px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Top Image Showcase Banner */}
            <div style={{ height: '185px', position: 'relative', overflow: 'hidden', backgroundColor: '#0f172a' }}>
              <img
                src={s.image || '/images/concrete-diamond-grinding.jpg'}
                alt={s.title}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/industrial-epoxy-warehouse.jpg';
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.2) 40%, rgba(0,0,0,0.1) 100%)'
              }} />

              {/* Floating Badges (Frosted Liquid Pill Style) */}
              <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {s.popular && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    background: 'linear-gradient(135deg, rgba(234,88,12,0.92), rgba(194,65,12,0.95))',
                    backdropFilter: 'blur(8px)',
                    color: '#fff', fontSize: '0.66rem', fontWeight: '800',
                    padding: '4px 9px', borderRadius: '8px', letterSpacing: '0.04em',
                    boxShadow: '0 2px 8px rgba(234,88,12,0.4)'
                  }}>
                    <Zap size={11} fill="#fff" /> POPULAR
                  </span>
                )}
                <span style={{
                  background: 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(10px)',
                  color: '#0f172a', fontSize: '0.67rem', fontWeight: '800',
                  padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.8)'
                }}>
                  {s.category || 'Commercial'}
                </span>
              </div>

              {/* Price Tag Badge */}
              <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  background: 'rgba(16, 185, 129, 0.92)',
                  backdropFilter: 'blur(10px)',
                  color: '#ffffff', fontSize: '0.78rem', fontWeight: '800',
                  padding: '4px 12px', borderRadius: '10px',
                  boxShadow: '0 2px 10px rgba(16, 185, 129, 0.35)',
                  border: '1px solid rgba(255,255,255,0.25)'
                }}>
                  {s.priceStarting || '$35/m²'}
                </span>
              </div>

              {/* Steps / Specs count pill */}
              <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                <span style={{
                  fontSize: '0.66rem', color: '#e2e8f0', fontWeight: '700',
                  background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)',
                  padding: '3px 8px', borderRadius: '6px'
                }}>
                  {(s.processSteps?.length || 4)} Steps · {(s.faqs?.length || 2)} FAQs
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '1.02rem', fontWeight: '800', color: '#0f172a',
                  lineHeight: 1.35, margin: 0
                }}>
                  {s.title}
                </h3>
              </div>

              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                fontSize: '0.73rem', color: '#ea580c', fontWeight: '700',
                marginBottom: '10px'
              }}>
                <ExternalLink size={11} /> /services/{s.slug || s.id}
              </div>

              <p style={{
                fontSize: '0.82rem', color: '#64748b', lineHeight: 1.55,
                marginBottom: '16px', flex: 1,
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
              }}>
                {s.shortDesc || s.fullDesc || 'Professional commercial-grade epoxy flooring installation by Floor Shield Australia.'}
              </p>

              {/* Action Buttons: View Page, Edit, Delete */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 42px', gap: '9px',
                borderTop: '1px solid rgba(241, 245, 249, 0.95)', paddingTop: '14px'
              }}>
                <a
                  href={`/services/${s.slug || s.id}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '9px 12px', borderRadius: '10px',
                    background: 'rgba(248, 250, 252, 0.85)',
                    border: '1px solid #e2e8f0', color: '#334155', fontSize: '0.78rem',
                    fontWeight: '700', textDecoration: 'none', transition: 'all 0.18s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248, 250, 252, 0.85)'; e.currentTarget.style.color = '#334155'; }}
                >
                  <Eye size={14} /> View Page
                </a>

                <button
                  onClick={() => openEdit(s)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '9px 12px', borderRadius: '10px',
                    background: 'rgba(255, 247, 237, 0.9)',
                    border: '1px solid #fed7aa', color: '#ea580c', fontSize: '0.78rem',
                    fontWeight: '800', cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.18s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#ea580c'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 247, 237, 0.9)'; e.currentTarget.style.color = '#ea580c'; }}
                >
                  <Edit3 size={14} /> Edit CMS
                </button>

                <button
                  onClick={() => onDelete(s.id || s._id)}
                  title="Delete service"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '9px', borderRadius: '10px',
                    background: 'rgba(254, 242, 242, 0.85)',
                    border: '1px solid #fecaca', color: '#dc2626', cursor: 'pointer',
                    transition: 'all 0.18s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(254, 242, 242, 0.85)'; e.currentTarget.style.color = '#dc2626'; }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Footer */}
      <GlassPagination
        currentPage={currentPage}
        totalItems={filteredServices.length}
        pageSize={pageSize}
        pageSizeOptions={[6, 9, 12, 24]}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* ── LUXURY LIQUID GLASSMORPHISM SLIDE-OVER DRAWER ── */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', justifyContent: 'flex-end', overflow: 'hidden' }}>
            {/* Frosted dark ambient backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setShowModal(false)}
              style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.45)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            />

            {/* Sliding Liquid Glass Drawer */}
            <motion.div
              initial={{ x: '100%', opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              style={{
                position: 'relative',
                width: '100%', maxWidth: '750px', height: '100vh',
                backgroundColor: 'rgba(255, 255, 255, 0.72)',
                backdropFilter: 'blur(28px) saturate(210%)',
                WebkitBackdropFilter: 'blur(28px) saturate(210%)',
                borderLeft: '1.5px solid rgba(255, 255, 255, 0.75)',
                boxShadow: '-15px 0 60px rgba(15, 23, 42, 0.2), inset 1px 0 0 rgba(255, 255, 255, 0.8)',
                display: 'flex', flexDirection: 'column',
                zIndex: 501, overflow: 'hidden'
              }}
            >
              {/* ── AMBIENT LIQUID MORPHING ORBS (Floating behind the glass) ── */}
              <div style={{
                position: 'absolute', top: '-100px', right: '-80px',
                width: '380px', height: '380px', borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%',
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.35) 0%, rgba(234, 88, 12, 0.25) 100%)',
                filter: 'blur(40px)',
                animation: 'liquidFloat1 18s ease-in-out infinite',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute', top: '35%', left: '-120px',
                width: '360px', height: '360px', borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.22) 0%, rgba(99, 102, 241, 0.18) 100%)',
                filter: 'blur(45px)',
                animation: 'liquidFloat2 22s ease-in-out infinite',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute', bottom: '-80px', right: '15%',
                width: '320px', height: '320px', borderRadius: '50% 50% 40% 60% / 40% 60% 50% 50%',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(20, 184, 166, 0.2) 100%)',
                filter: 'blur(40px)',
                animation: 'liquidFloat3 16s ease-in-out infinite',
                pointerEvents: 'none'
              }} />

              {/* Glass Header */}
              <div style={{
                padding: '22px 28px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.55)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                position: 'relative', zIndex: 2
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px',
                      background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.2), rgba(234, 88, 12, 0.05))',
                      border: '1px solid rgba(234, 88, 12, 0.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ea580c', boxShadow: '0 0 10px #ea580c' }} />
                    </div>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                      {editingId ? 'Edit Flooring System' : 'Create New Flooring System'}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 38px' }}>
                    Live changes reflect directly on client service pages
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(8px)',
                    color: '#64748b', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)'; e.currentTarget.style.color = '#0f172a'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.6)'; e.currentTarget.style.color = '#64748b'; }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Glass Pill Navigation Tabs */}
              <div style={{
                display: 'flex', gap: '8px', padding: '12px 28px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(12px)',
                position: 'relative', zIndex: 2
              }}>
                {[
                  { id: 'basic', label: '1. General & Pricing' },
                  { id: 'content', label: '2. Features & Uses' },
                  { id: 'steps', label: '3. Work Process' },
                  { id: 'faqs', label: '4. Questions & Answers' },
                ].map(t => {
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      style={{
                        padding: '8px 16px', borderRadius: '10px',
                        border: isActive ? '1px solid rgba(234, 88, 12, 0.4)' : '1px solid rgba(255, 255, 255, 0.6)',
                        backgroundColor: isActive ? 'rgba(234, 88, 12, 0.15)' : 'rgba(255, 255, 255, 0.45)',
                        backdropFilter: 'blur(8px)',
                        color: isActive ? '#ea580c' : '#475569',
                        fontWeight: isActive ? '800' : '600',
                        fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit',
                        boxShadow: isActive ? '0 4px 14px rgba(234, 88, 12, 0.15)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Form Content in Glass Body */}
              <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 2 }}>
                {activeTab === 'basic' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.45)',
                      border: '1.5px solid rgba(255, 255, 255, 0.8)',
                      borderRadius: '16px', padding: '18px',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                    }}>
                      <Field label="Service Title *" value={form.title} onChange={e => upd('title', e.target.value)} placeholder="e.g. Concrete Grind & Seal Melbourne" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                      <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.45)',
                        border: '1.5px solid rgba(255, 255, 255, 0.8)',
                        borderRadius: '16px', padding: '16px',
                        backdropFilter: 'blur(16px)',
                        boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                      }}>
                        <Field label="URL Slug *" value={form.slug} onChange={e => upd('slug', e.target.value)} placeholder="e.g. concrete-grind-seal" />
                      </div>
                      <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.45)',
                        border: '1.5px solid rgba(255, 255, 255, 0.8)',
                        borderRadius: '16px', padding: '16px',
                        backdropFilter: 'blur(16px)',
                        boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                      }}>
                        <Field label="Category" value={form.category} onChange={e => upd('category', e.target.value)} placeholder="Commercial & Industrial" />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.45)',
                        border: '1.5px solid rgba(255, 255, 255, 0.8)',
                        borderRadius: '16px', padding: '16px',
                        backdropFilter: 'blur(16px)',
                        boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                      }}>
                        <Field label="Starting Price" value={form.priceStarting} onChange={e => upd('priceStarting', e.target.value)} placeholder="e.g. $35/m² or Custom Quote" />
                      </div>
                      
                      {/* Cloudinary Card Thumbnail */}
                      <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.45)',
                        border: '1.5px solid rgba(255, 255, 255, 0.8)',
                        borderRadius: '16px', padding: '16px',
                        backdropFilter: 'blur(16px)',
                        boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a' }}>Card Thumbnail (Cloudinary)</label>
                          {uploadingThumb && <span style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: '700' }}>Uploading...</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={form.image}
                            onChange={e => upd('image', e.target.value)}
                            placeholder="URL or Upload..."
                            style={{ flex: 1, padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#fff' }}
                          />
                          <label style={{
                            padding: '9px 14px', borderRadius: '10px', background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                            color: '#fff', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap'
                          }}>
                            <Upload size={14} /> Upload
                            <input type="file" accept="image/*" onChange={handleThumbnailUpload} style={{ display: 'none' }} />
                          </label>
                        </div>
                        {form.image && (
                          <div style={{ marginTop: '8px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                            <img src={form.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Service Details Multi-Image Gallery (Cloudinary) */}
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.45)',
                      border: '1.5px solid rgba(255, 255, 255, 0.8)',
                      borderRadius: '16px', padding: '18px',
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div>
                          <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', display: 'block' }}>
                            Service Detail Page Gallery (Multiple Images)
                          </label>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            Remaining images shown inside the service detail view.
                          </span>
                        </div>
                        <label style={{
                          padding: '8px 14px', borderRadius: '10px', background: '#0f172a',
                          color: '#fff', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                          <Upload size={14} /> Add Images
                          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: 'none' }} />
                        </label>
                      </div>

                      {uploadingGallery && (
                        <div style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: '700', marginBottom: '8px' }}>
                          Uploading images to Cloudinary...
                        </div>
                      )}

                      {/* Gallery Thumbnails List */}
                      {form.gallery && form.gallery.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px', marginTop: '10px' }}>
                          {form.gallery.map((imgUrl, idx) => (
                            <div key={idx} style={{ position: 'relative', height: '65px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                              <img src={imgUrl} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                style={{
                                  position: 'absolute', top: '2px', right: '2px', width: '20px', height: '20px', borderRadius: '50%',
                                  background: 'rgba(220, 38, 38, 0.9)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '6px' }}>
                          No additional gallery images added yet. Click "+ Add Images" to upload multiple photos.
                        </div>
                      )}
                    </div>

                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.45)',
                      border: '1.5px solid rgba(255, 255, 255, 0.8)',
                      borderRadius: '16px', padding: '18px',
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                    }}>
                      <Field label="Short Overview (Displayed on card & hero banner) *" value={form.shortDesc} onChange={e => upd('shortDesc', e.target.value)} placeholder="Concise overview description" multiline />
                    </div>

                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.45)',
                      border: '1.5px solid rgba(255, 255, 255, 0.8)',
                      borderRadius: '16px', padding: '18px',
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                    }}>
                      <Field label="Full Specification & Technical Description" value={form.fullDesc} onChange={e => upd('fullDesc', e.target.value)} placeholder="Detailed chemical specs, substrate requirements, and sealer finishes..." multiline />
                    </div>

                    <div style={{
                      padding: '14px 18px', borderRadius: '14px',
                      backgroundColor: 'rgba(254, 243, 199, 0.5)',
                      border: '1.5px solid rgba(253, 230, 138, 0.8)',
                      backdropFilter: 'blur(12px)',
                      display: 'flex', alignItems: 'center', gap: '12px'
                    }}>
                      <input type="checkbox" id="pop-check" checked={form.popular} onChange={e => upd('popular', e.target.checked)} style={{ accentColor: '#ea580c', width: '18px', height: '18px' }} />
                      <label htmlFor="pop-check" style={{ fontSize: '0.85rem', color: '#78350f', fontWeight: '800', cursor: 'pointer', margin: 0 }}>
                        Mark as Featured / Popular Service
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === 'content' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.45)',
                      border: '1.5px solid rgba(255, 255, 255, 0.8)',
                      borderRadius: '16px', padding: '18px',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                    }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                        Performance Features (Enter each point on a new line)
                      </label>
                      <textarea
                        rows={6}
                        value={form.featuresText}
                        onChange={e => upd('featuresText', e.target.value)}
                        placeholder="Cost-effective alternative to complete floor replacement&#10;High abrasion, oil & chemical resistance&#10;Available in Matte, Satin & High-Gloss finishes&#10;AS 4586 Slip rating compliance"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid rgba(203, 213, 225, 0.8)', fontSize: '0.85rem', fontFamily: 'inherit', resize: 'vertical', backgroundColor: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(4px)' }}
                      />
                    </div>

                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.45)',
                      border: '1.5px solid rgba(255, 255, 255, 0.8)',
                      borderRadius: '16px', padding: '18px',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                    }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                        Typical Commercial Applications (Enter each facility type on a new line)
                      </label>
                      <textarea
                        rows={5}
                        value={form.applicationsText}
                        onChange={e => upd('applicationsText', e.target.value)}
                        placeholder="Warehouses & Logistics Hubs&#10;Retail Showrooms & Cafes&#10;Automotive Workshops & Garages&#10;Commercial Office Foyers"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid rgba(203, 213, 225, 0.8)', fontSize: '0.85rem', fontFamily: 'inherit', resize: 'vertical', backgroundColor: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(4px)' }}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'steps' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>Step-by-Step Installation Stages</span>
                      <button type="button" onClick={addStep} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', backgroundColor: 'rgba(255, 247, 237, 0.85)', border: '1px solid rgba(254, 215, 170, 0.9)', color: '#ea580c', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                        <Plus size={14} /> Add Stage
                      </button>
                    </div>
                    {form.processSteps.map((st, i) => (
                      <div key={i} style={{ padding: '16px', borderRadius: '16px', border: '1.5px solid rgba(255, 255, 255, 0.85)', backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.03)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <span style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'linear-gradient(135deg, #ea580c, #c2410c)', color: '#fff', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                          <input type="text" value={st.title} onChange={e => updateStep(i, 'title', e.target.value)} placeholder="Stage Name" style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(203, 213, 225, 0.8)', fontSize: '0.82rem', fontWeight: '700', backgroundColor: 'rgba(255,255,255,0.7)' }} />
                          <button type="button" onClick={() => removeStep(i)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}><Trash2 size={16} /></button>
                        </div>
                        <textarea rows={2} value={st.description} onChange={e => updateStep(i, 'description', e.target.value)} placeholder="Description of this stage" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(203, 213, 225, 0.8)', fontSize: '0.8rem', fontFamily: 'inherit', backgroundColor: 'rgba(255,255,255,0.7)' }} />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'faqs' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>Frequently Asked Questions</span>
                      <button type="button" onClick={addFaq} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', backgroundColor: 'rgba(255, 247, 237, 0.85)', border: '1px solid rgba(254, 215, 170, 0.9)', color: '#ea580c', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                        <Plus size={14} /> Add FAQ
                      </button>
                    </div>
                    {form.faqs.map((f, i) => (
                      <div key={i} style={{ padding: '16px', borderRadius: '16px', border: '1.5px solid rgba(255, 255, 255, 0.85)', backgroundColor: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.03)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <input type="text" value={f.question} onChange={e => updateFaq(i, 'question', e.target.value)} placeholder="Question title" style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(203, 213, 225, 0.8)', fontSize: '0.82rem', fontWeight: '800', backgroundColor: 'rgba(255,255,255,0.7)' }} />
                          <button type="button" onClick={() => removeFaq(i)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}><Trash2 size={16} /></button>
                        </div>
                        <textarea rows={2} value={f.answer} onChange={e => updateFaq(i, 'answer', e.target.value)} placeholder="Answer explanation" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(203, 213, 225, 0.8)', fontSize: '0.8rem', fontFamily: 'inherit', backgroundColor: 'rgba(255,255,255,0.7)' }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit Bar pinned at bottom of liquid glass drawer */}
                <div style={{
                  display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '18px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'rgba(255, 255, 255, 0.35)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '12px', padding: '12px 14px'
                }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', border: '1.5px solid rgba(203, 213, 225, 0.8)', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)', color: '#64748b', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ flex: 1.6, padding: '12px', background: 'linear-gradient(135deg, #ea580c, #c2410c)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.875rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(234,88,12,0.45)' }}>
                    <Save size={16} /> Save & Publish System
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════
   SETTINGS PAGE
════════════════════════════════════════ */
