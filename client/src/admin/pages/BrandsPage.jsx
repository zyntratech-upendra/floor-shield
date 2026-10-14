import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Trash2, X, Plus, Edit3, Search, Upload, ImageIcon, Loader2, Award } from 'lucide-react';
import { API_BASE } from '../adminConstants';
import { GlassPagination, Field } from '../AdminShared';

export default function BrandsPage({ brands, onAdd, onUpdate, onDelete }) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', logoUrl: '', order: 0, active: true });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [unavailableLogos, setUnavailableLogos] = useState({});

  const token = localStorage.getItem('fs_admin_token');

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: '', logoUrl: '', order: brands.length + 1, active: true });
    setShowDrawer(true);
  };

  const openEdit = (b) => {
    setEditingId(b.id || b._id);
    setForm({
      name: b.name || '',
      logoUrl: b.logoUrl || '',
      order: b.order !== undefined ? b.order : 0,
      active: b.active !== undefined ? b.active : true
    });
    setShowDrawer(true);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
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
        setForm(p => ({ ...p, logoUrl: result.url }));
      } else {
        alert(result.message || 'Logo upload failed');
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploadingLogo(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.logoUrl) return;
    if (editingId) {
      await onUpdate(editingId, form);
    } else {
      await onAdd(form);
    }
    setShowDrawer(false);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Active' | 'Hidden'
  const [sortBy, setSortBy] = useState('orderAsc'); // 'orderAsc' | 'orderDesc' | 'nameAsc' | 'nameDesc'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, sortBy, pageSize]);

  const filteredBrands = brands.filter(b => {
    const matchesSearch = !searchQuery || b.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || 
      (filterStatus === 'Active' && b.active !== false) ||
      (filterStatus === 'Hidden' && b.active === false);
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'orderAsc') return (a.order ?? 0) - (b.order ?? 0);
    if (sortBy === 'orderDesc') return (b.order ?? 0) - (a.order ?? 0);
    if (sortBy === 'nameAsc') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'nameDesc') return (b.name || '').localeCompare(a.name || '');
    return 0;
  });

  const paginatedBrands = filteredBrands.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ position: 'relative' }}>
      {/* ── HEADER TOOLBAR ── */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(18px)',
        borderRadius: '18px', border: '1px solid rgba(226, 232, 240, 0.85)',
        padding: '18px 24px', marginBottom: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
        boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.03)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Brand & Client Logo Marquee Carousel
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
            Upload logos of clients & industry specifiers (e.g. Coles, Woolworths, Bulla, CFA, CSIRO). Live on the homepage.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
            background: 'linear-gradient(135deg, #ea580c, #c2410c)', border: 'none',
            borderRadius: '10px', color: '#fff', fontSize: '0.85rem', fontWeight: '700',
            cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(234,88,12,0.3)'
          }}
        >
          <Plus size={16} /> Add Brand Logo
        </motion.button>
      </div>

      {/* ── SEARCH, FILTER & SORT BAR ── */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(16px)',
        borderRadius: '16px', border: '1px solid rgba(226, 232, 240, 0.85)',
        padding: '14px 20px', marginBottom: '22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '14px'
      }}>
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '200px', maxWidth: '340px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search brand partner..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 36px',
              backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0',
              borderRadius: '10px', color: '#0f172a', fontSize: '0.84rem',
              outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status filter pills */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {['All', 'Active', 'Hidden'].map(st => {
            const active = filterStatus === st;
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '7px 13px', borderRadius: '8px', fontSize: '0.78rem',
                  fontWeight: active ? '800' : '600', cursor: 'pointer', border: 'none',
                  fontFamily: 'inherit', transition: 'all 0.15s ease',
                  backgroundColor: active ? '#ea580c' : 'rgba(241, 245, 249, 0.8)',
                  color: active ? '#ffffff' : '#64748b',
                  boxShadow: active ? '0 2px 8px rgba(234, 88, 12, 0.25)' : 'none'
                }}
              >
                {st}
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            <option value="orderAsc">Sequence (#1 First)</option>
            <option value="orderDesc">Sequence (Highest First)</option>
            <option value="nameAsc">Brand Name (A–Z)</option>
            <option value="nameDesc">Brand Name (Z–A)</option>
          </select>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '600', paddingLeft: '4px' }}>
            {filteredBrands.length} brand{filteredBrands.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── EMPTY STATE ── */}
      {filteredBrands.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)',
          borderRadius: '20px', border: '1px dashed #cbd5e1', margin: '20px 0'
        }}>
          <Award size={40} style={{ color: '#94a3b8', margin: '0 auto 14px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 6px' }}>No brand logos found</h3>
          <p style={{ fontSize: '0.84rem', color: '#64748b', maxWidth: '380px', margin: '0 auto 16px' }}>
            No brand partners match your query. Clear filters or add a new partner logo.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setFilterStatus('All'); }}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1',
              background: '#fff', color: '#ea580c', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer'
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ── LOGOS GRID ── */}
      <div className="brand-card-grid">
        {paginatedBrands.map((b, idx) => {
          const brandKey = b.id || b._id || `${b.name}-${idx}`;
          return (
          <motion.div
            key={brandKey}
            className="brand-card"
            whileHover={{ y: -3 }}
          >
            <div className="brand-card-topline">
              <span className="brand-order">PARTNER <strong>#{b.order || idx + 1}</strong></span>
              <span className={`brand-status ${b.active ? 'is-active' : 'is-hidden'}`}>
                <span className="brand-status-dot" />
                {b.active ? 'Active' : 'Hidden'}
              </span>
            </div>

            <div className="brand-logo-stage">
              <span className="brand-logo-caption">CLIENT PARTNER</span>
              {b.logoUrl && !unavailableLogos[brandKey] ? (
                <img
                  src={b.logoUrl}
                  alt={`${b.name} logo`}
                  loading="lazy"
                  decoding="async"
                  className="brand-logo-image"
                  onError={() => setUnavailableLogos(current => ({ ...current, [brandKey]: true }))}
                />
              ) : (
                <div className="brand-logo-fallback" aria-label={`${b.name} logo unavailable`}>
                  <span>{b.name?.trim()?.charAt(0)?.toUpperCase() || '?'}</span>
                  <strong>{b.name}</strong>
                </div>
              )}
              <div className="brand-logo-rule" />
            </div>

            <div className="brand-card-details">
              <h3 title={b.name}>{b.name}</h3>
              <p>Displayed in homepage partner carousel</p>
            </div>

            <div className="brand-card-actions">
              <button
                className="brand-edit-button"
                onClick={() => openEdit(b)}
              >
                <Edit3 size={14} /> Edit details
              </button>
              <button
                className="brand-delete-button"
                onClick={() => onDelete(b.id || b._id)}
                aria-label={`Delete ${b.name}`}
                title={`Delete ${b.name}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </motion.div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      <GlassPagination
        currentPage={currentPage}
        totalItems={filteredBrands.length}
        pageSize={pageSize}
        pageSizeOptions={[4, 8, 12, 24]}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* ── SLIDE-OVER LIQUID GLASS DRAWER FOR BRAND LOGOS ── */}
      <AnimatePresence>
        {showDrawer && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', justifyContent: 'flex-end', overflow: 'hidden' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(10px)' }}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              style={{
                position: 'relative', width: '100%', maxWidth: '540px', height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(30px) saturate(210%)',
                WebkitBackdropFilter: 'blur(30px) saturate(210%)',
                borderLeft: '1.5px solid rgba(255, 255, 255, 0.85)',
                boxShadow: '-15px 0 60px rgba(15, 23, 42, 0.2), inset 1px 0 0 rgba(255, 255, 255, 0.9)',
                display: 'flex', flexDirection: 'column', zIndex: 1, overflow: 'hidden'
              }}
            >
              {/* ── AMBIENT LIQUID MORPHING ORBS ── */}
              <div style={{
                position: 'absolute', top: '-80px', right: '-60px',
                width: '320px', height: '320px', borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%',
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.35) 0%, rgba(234, 88, 12, 0.2) 100%)',
                filter: 'blur(40px)', animation: 'liquidFloat1 18s ease-in-out infinite', pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute', bottom: '10%', left: '-80px',
                width: '300px', height: '300px', borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(99, 102, 241, 0.18) 100%)',
                filter: 'blur(45px)', animation: 'liquidFloat2 22s ease-in-out infinite', pointerEvents: 'none'
              }} />

              {/* Glass Header */}
              <div style={{
                padding: '22px 28px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                backgroundColor: 'rgba(255, 255, 255, 0.55)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                position: 'relative', zIndex: 2
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.18), rgba(234, 88, 12, 0.06))',
                    border: '1.5px solid rgba(234, 88, 12, 0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c'
                  }}>
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}>
                      {editingId ? 'Edit Brand Logo' : 'Add Brand Partner Logo'}
                    </h3>
                    <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                      Syncs directly with Cloudinary & Homepage Partner Marquee
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDrawer(false)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.85)',
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

              {/* Glass Body Form */}
              <form onSubmit={handleSubmit} style={{ flex: 1, padding: '24px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative', zIndex: 2 }}>
                {/* Brand Name Input Card */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  border: '1.5px solid rgba(255, 255, 255, 0.85)',
                  borderRadius: '16px', padding: '18px',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                }}>
                  <Field
                    label="Brand / Company Name *"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Coles, Woolworths, Bulla Dairy, CFA Victoria..."
                  />
                </div>

                {/* Cloudinary Logo Uploader Card */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  border: '1.5px solid rgba(255, 255, 255, 0.85)',
                  borderRadius: '16px', padding: '18px',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>Brand Logo</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '2px 7px', borderRadius: '6px', background: 'rgba(234, 88, 12, 0.12)', color: '#ea580c' }}>Cloudinary Fast CDN</span>
                    </div>
                    {uploadingLogo && (
                      <span style={{ fontSize: '0.74rem', color: '#ea580c', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Loader2 size={13} className="animate-spin" /> Uploading to Cloudinary...
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={form.logoUrl}
                      onChange={e => setForm(p => ({ ...p, logoUrl: e.target.value }))}
                      placeholder="Paste Image URL or choose file to upload..."
                      style={{
                        flex: 1, padding: '11px 14px', borderRadius: '10px',
                        border: '1.5px solid rgba(203, 213, 225, 0.8)',
                        fontSize: '0.84rem', fontFamily: 'inherit',
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(6px)', outline: 'none'
                      }}
                    />
                    <label style={{
                      padding: '11px 18px', borderRadius: '10px',
                      background: uploadingLogo ? '#94a3b8' : 'linear-gradient(135deg, #ea580c, #c2410c)',
                      color: '#fff', fontSize: '0.82rem', fontWeight: '800', cursor: uploadingLogo ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: '7px', whiteSpace: 'nowrap',
                      boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)', transition: 'all 0.15s ease'
                    }}>
                      {uploadingLogo ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                      {uploadingLogo ? 'Uploading...' : 'Upload File'}
                      <input type="file" accept="image/*" disabled={uploadingLogo} onChange={handleLogoUpload} style={{ display: 'none' }} />
                    </label>
                  </div>

                  {/* Logo Preview with Frosted Canvas */}
                  {form.logoUrl ? (
                    <div style={{
                      marginTop: '12px', height: '110px', borderRadius: '12px',
                      border: '1px dashed rgba(203, 213, 225, 0.9)',
                      backgroundColor: 'rgba(255, 255, 255, 0.75)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '16px', position: 'relative', overflow: 'hidden'
                    }}>
                      <img src={form.logoUrl} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                      <button
                        type="button"
                        onClick={() => setForm(p => ({ ...p, logoUrl: '' }))}
                        title="Remove Logo"
                        style={{
                          position: 'absolute', top: '8px', right: '8px',
                          width: '24px', height: '24px', borderRadius: '6px',
                          border: 'none', backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      marginTop: '12px', height: '80px', borderRadius: '12px',
                      border: '1px dashed rgba(203, 213, 225, 0.8)',
                      backgroundColor: 'rgba(248, 250, 252, 0.5)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      color: '#94a3b8', fontSize: '0.75rem', gap: '4px'
                    }}>
                      <ImageIcon size={20} style={{ opacity: 0.6 }} />
                      <span>PNG, SVG, or JPG with transparent background recommended</span>
                    </div>
                  )}
                </div>

                {/* Display Sequence & Homepage Marquee Toggle Card */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  border: '1.5px solid rgba(255, 255, 255, 0.85)',
                  borderRadius: '16px', padding: '18px',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'center'
                }}>
                  <Field
                    label="Display Sequence"
                    type="number"
                    value={form.order}
                    onChange={e => setForm(p => ({ ...p, order: e.target.value }))}
                    placeholder="1"
                  />
                  <div style={{
                    padding: '12px 14px', borderRadius: '12px',
                    backgroundColor: 'rgba(255, 247, 237, 0.7)',
                    border: '1px solid rgba(254, 215, 170, 0.8)',
                    display: 'flex', alignItems: 'center', marginTop: '16px'
                  }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '800', color: '#9a3412', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={form.active}
                        onChange={e => setForm(p => ({ ...p, active: e.target.checked }))}
                        style={{ accentColor: '#ea580c', width: '17px', height: '17px' }}
                      />
                      Homepage Marquee
                    </label>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div style={{
                  marginTop: 'auto', paddingTop: '18px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.6)',
                  display: 'flex', gap: '12px'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowDrawer(false)}
                    style={{
                      flex: 1, padding: '13px', borderRadius: '12px',
                      border: '1.5px solid rgba(203, 213, 225, 0.8)',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      color: '#475569', fontWeight: '700', fontSize: '0.86rem',
                      cursor: 'pointer', backdropFilter: 'blur(8px)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingLogo}
                    style={{
                      flex: 2, padding: '13px', borderRadius: '12px', border: 'none',
                      background: 'linear-gradient(135deg, #ea580c, #c2410c)', color: '#fff',
                      fontWeight: '800', fontSize: '0.88rem', cursor: uploadingLogo ? 'not-allowed' : 'pointer',
                      boxShadow: '0 8px 24px rgba(234, 88, 12, 0.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    {editingId ? 'Save Changes' : 'Add Brand Partner'}
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
   MAIN ADMIN PANEL
════════════════════════════════════════ */
