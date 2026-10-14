import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Trash2, X, Plus, MapPin, Star, Edit3, Search, Zap, MessageSquareQuote } from 'lucide-react';
import { GlassPagination, Field } from '../AdminShared';

export default function TestimonialsPage({ testimonials, onDelete, onAdd, onUpdate }) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState('All');

  const initialForm = {
    name: '',
    avatar: '',
    location: 'Melbourne, VIC',
    rating: 5,
    date: 'October 2026',
    verified: true,
    source: 'Google',
    service: 'APC Ultra Flake®',
    comment: '',
    featured: false
  };

  const [form, setForm] = useState(initialForm);
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const openAdd = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowDrawer(true);
  };

  const openEdit = (t) => {
    setEditingId(t.id || t._id);
    setForm({
      name: t.name || '',
      avatar: t.avatar || '',
      location: t.location || 'Melbourne, VIC',
      rating: t.rating || 5,
      date: t.date || 'October 2026',
      verified: t.verified !== undefined ? t.verified : true,
      source: t.source || 'Google',
      service: t.service || 'APC Ultra Flake®',
      comment: t.comment || '',
      featured: !!t.featured
    });
    setShowDrawer(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.comment) return;
    if (editingId) {
      await onUpdate(editingId, form);
    } else {
      await onAdd(form);
    }
    setShowDrawer(false);
  };

  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'highest' | 'lowest' | 'featured'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRating, sortBy, pageSize]);

  const filtered = testimonials.filter(t => {
    const matchesRating = selectedRating === 'All' || t.rating === Number(selectedRating);
    const matchesSearch = !searchQuery ||
      t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.service?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    if (sortBy === 'highest') return (b.rating || 5) - (a.rating || 5);
    if (sortBy === 'lowest') return (a.rating || 5) - (b.rating || 5);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const paginatedTestimonials = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((acc, cur) => acc + (cur.rating || 5), 0) / testimonials.length).toFixed(1)
    : '5.0';

  const fiveStarCount = testimonials.filter(t => (t.rating || 5) === 5).length;
  const verifiedCount = testimonials.filter(t => t.verified).length;

  return (
    <div style={{ position: 'relative' }}>
      {/* ── AMBIENT GLASS BACKDROP ACCENTS ── */}
      <div style={{
        position: 'absolute', top: '-10px', right: '5%', width: '380px', height: '240px',
        background: 'radial-gradient(circle, rgba(234, 88, 12, 0.08) 0%, rgba(249, 115, 22, 0.02) 60%, transparent 80%)',
        borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0
      }} />

      {/* ── STATS CARDS ROW ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px',
        marginBottom: '22px', position: 'relative', zIndex: 1
      }}>
        <div style={{
          padding: '16px 20px', borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Reviews</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: '2px' }}>{testimonials.length}</div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <MessageSquareQuote size={20} />
          </div>
        </div>

        <div style={{
          padding: '16px 20px', borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Average Rating</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#ea580c', fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {avgRating} <Star size={20} fill="#ea580c" color="#ea580c" />
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
            <Star size={20} />
          </div>
        </div>

        <div style={{
          padding: '16px 20px', borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>5-Star Ratings</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: '2px' }}>{fiveStarCount}</div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #fefce8, #fef08a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ca8a04' }}>
            <Zap size={20} />
          </div>
        </div>

        <div style={{
          padding: '16px 20px', borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Verified Clients</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#10b981', fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: '2px' }}>{verifiedCount}</div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* ── CONTROLS TOOLBAR ── */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(18px)',
        borderRadius: '18px', border: '1px solid rgba(226, 232, 240, 0.85)',
        boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.03)',
        padding: '16px 20px', marginBottom: '24px',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        position: 'relative', zIndex: 1
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', minWidth: '240px', maxWidth: '340px', flex: '1 1 240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search reviewer, location, comment..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '9px 12px 9px 36px',
                borderRadius: '10px', border: '1px solid #e2e8f0',
                background: '#ffffff', color: '#0f172a',
                fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Rating filter pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {['All', '5', '4'].map(r => {
              const active = selectedRating === r;
              return (
                <button
                  key={r}
                  onClick={() => setSelectedRating(r)}
                  style={{
                    padding: '7px 14px', borderRadius: '30px', fontSize: '0.74rem',
                    fontWeight: active ? '800' : '600', cursor: 'pointer',
                    background: active ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 'rgba(241, 245, 249, 0.75)',
                    color: active ? '#fff' : '#475569',
                    border: active ? '1px solid #ea580c' : '1px solid rgba(226, 232, 240, 0.8)',
                  }}
                >
                  {r === 'All' ? 'All Ratings' : `${r} Stars ★`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Actions: Sort Selector & Add Testimonial */}
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
              <option value="newest">Newest First</option>
              <option value="featured">Featured First</option>
              <option value="highest">Highest Rating (5★)</option>
              <option value="lowest">Lowest Rating</option>
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
              boxShadow: '0 4px 16px rgba(234,88,12,0.25)', flexShrink: 0
            }}
          >
            <Plus size={18} strokeWidth={2.8} /> Add Testimonial
          </motion.button>
        </div>
      </div>

      {/* ── TESTIMONIALS CARDS GRID (Safecoat Google Review Carousel Style) ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px',
        position: 'relative', zIndex: 1
      }}>
        {paginatedTestimonials.map((t, idx) => (
          <motion.div
            key={t.id || t._id || idx}
            whileHover={{ y: -5 }}
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(226, 232, 240, 0.95)',
              boxShadow: '0 8px 25px -4px rgba(15, 23, 42, 0.05)',
              padding: '24px',
              display: 'flex', flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Top Reviewer Header with Avatar & Google badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      alt={t.name}
                      loading="lazy"
                      decoding="async"
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ea580c' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #fed7aa, #ea580c)',
                      color: '#fff', fontWeight: '800', fontSize: '1.1rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {t.name ? t.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                  )}
                  {/* Google Icon Badge Overlay */}
                  <div style={{
                    position: 'absolute', bottom: '-2px', right: '-4px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    backgroundColor: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                  </div>
                </div>

                <div>
                  <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: '800', color: '#0f172a' }}>{t.name}</h4>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={11} /> {t.location || 'Melbourne, VIC'} · {t.date}
                  </div>
                </div>
              </div>

              {/* Verified Check Badge */}
              {t.verified && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  backgroundColor: '#ecfdf5', color: '#059669',
                  border: '1px solid #a7f3d0', padding: '3px 8px',
                  borderRadius: '6px', fontSize: '0.68rem', fontWeight: '800'
                }}>
                  <CheckCircle2 size={12} /> Verified
                </div>
              )}
            </div>

            {/* Stars Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
              {[...Array(5)].map((_, s) => (
                <Star
                  key={s}
                  size={16}
                  fill={s < (t.rating || 5) ? '#f59e0b' : 'none'}
                  color={s < (t.rating || 5) ? '#f59e0b' : '#cbd5e1'}
                />
              ))}
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700', marginLeft: '6px' }}>
                {t.rating || 5}.0 Google Review
              </span>
            </div>

            {/* Service Tag */}
            <div style={{ marginBottom: '12px' }}>
              <span style={{
                fontSize: '0.7rem', fontWeight: '800', color: '#ea580c',
                backgroundColor: 'rgba(255, 247, 237, 0.9)',
                border: '1px solid #fed7aa', padding: '3px 9px', borderRadius: '6px'
              }}>
                {t.service || 'APC Ultra Flake®'}
              </span>
            </div>

            {/* Comment */}
            <p style={{
              fontSize: '0.85rem', color: '#334155', lineHeight: 1.6,
              fontStyle: 'italic', flex: 1, margin: '0 0 20px 0'
            }}>
              "{t.comment}"
            </p>

            {/* Card Footer Actions */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderTop: '1px solid #f1f5f9', paddingTop: '14px'
            }}>
              <span style={{ fontSize: '0.72rem', color: t.featured ? '#ea580c' : '#94a3b8', fontWeight: '700' }}>
                {t.featured ? '★ Featured on Homepage' : 'Standard display'}
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => openEdit(t)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '6px 12px', borderRadius: '8px',
                    backgroundColor: '#fff7ed', border: '1px solid #fed7aa',
                    color: '#ea580c', fontSize: '0.76rem', fontWeight: '700',
                    cursor: 'pointer', fontFamily: 'inherit'
                  }}
                >
                  <Edit3 size={13} /> Edit
                </button>
                <button
                  onClick={() => onDelete(t.id || t._id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '6px 10px', borderRadius: '8px',
                    backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                    color: '#dc2626', cursor: 'pointer'
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Footer */}
      <GlassPagination
        currentPage={currentPage}
        totalItems={filtered.length}
        pageSize={pageSize}
        pageSizeOptions={[6, 9, 12, 24]}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* ── LIQUID GLASS SLIDE-OVER DRAWER FOR TESTIMONIAL CMS ── */}
      <AnimatePresence>
        {showDrawer && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', justifyContent: 'flex-end', overflow: 'hidden' }}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
              style={{
                position: 'absolute', inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.45)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)'
              }}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              style={{
                position: 'relative', width: '100%', maxWidth: '580px', height: '100%',
                background: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '-10px 0 50px rgba(15, 23, 42, 0.15)',
                display: 'flex', flexDirection: 'column', zIndex: 1
              }}
            >
              {/* Drawer Header */}
              <div style={{
                padding: '24px 28px', borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.5)'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {editingId ? 'Edit Customer Review' : 'Add New Testimonial'}
                  </h2>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0' }}>
                    Control verified Google & client reviews featured on Floor Shield Australia.
                  </p>
                </div>
                <button
                  onClick={() => setShowDrawer(false)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    border: '1px solid #e2e8f0', background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#64748b', cursor: 'pointer'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Form Body */}
              <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <Field label="Customer / Reviewer Name *" value={form.name} onChange={e => upd('name', e.target.value)} placeholder="e.g. Jovie Villarma" />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <Field label="Location (Suburb, State)" value={form.location} onChange={e => upd('location', e.target.value)} placeholder="e.g. Brighton, VIC" />
                  <Field label="Date / Timeline" value={form.date} onChange={e => upd('date', e.target.value)} placeholder="e.g. October 2026" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Star Rating</label>
                    <select
                      value={form.rating}
                      onChange={e => upd('rating', Number(e.target.value))}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: '10px',
                        border: '1px solid #cbd5e1', backgroundColor: '#fff',
                        fontSize: '0.85rem', fontFamily: 'inherit'
                      }}
                    >
                      <option value={5}>5 Stars ★★★★★ (Exceptional)</option>
                      <option value={4}>4 Stars ★★★★☆ (Great)</option>
                      <option value={3}>3 Stars ★★★☆☆ (Good)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Review Source</label>
                    <select
                      value={form.source}
                      onChange={e => upd('source', e.target.value)}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: '10px',
                        border: '1px solid #cbd5e1', backgroundColor: '#fff',
                        fontSize: '0.85rem', fontFamily: 'inherit'
                      }}
                    >
                      <option value="Google">Google Reviews</option>
                      <option value="Direct">Direct Client Feedback</option>
                      <option value="ProductReview">ProductReview.com.au</option>
                      <option value="Facebook">Facebook Recommendations</option>
                    </select>
                  </div>
                </div>

                <Field label="System / Service Completed" value={form.service} onChange={e => upd('service', e.target.value)} placeholder="e.g. APC Ultra Flake® or EPO100T® Plain Coat" />

                <Field label="Customer Avatar Photo (URL)" value={form.avatar} onChange={e => upd('avatar', e.target.value)} placeholder="https://images.unsplash.com/photo-..." />

                <Field label="Review / Testimonial Comment *" value={form.comment} onChange={e => upd('comment', e.target.value)} placeholder="What did the customer say about the flooring craftsmanship, speed, and finish?" multiline rows={4} />

                {/* Checkboxes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.84rem', fontWeight: '700', color: '#0f172a' }}>
                    <input type="checkbox" checked={form.verified} onChange={e => upd('verified', e.target.checked)} style={{ accentColor: '#10b981', width: '16px', height: '16px' }} />
                    Verified Customer Purchase Badge
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.84rem', fontWeight: '700', color: '#0f172a' }}>
                    <input type="checkbox" checked={form.featured} onChange={e => upd('featured', e.target.checked)} style={{ accentColor: '#ea580c', width: '16px', height: '16px' }} />
                    Feature in Homepage Reviews Carousel
                  </label>
                </div>

                {/* Footer Save */}
                <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowDrawer(false)}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '10px',
                      border: '1px solid #cbd5e1', backgroundColor: '#fff',
                      color: '#475569', fontWeight: '700', fontSize: '0.86rem', cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 2, padding: '12px', borderRadius: '10px',
                      border: 'none', background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                      color: '#fff', fontWeight: '800', fontSize: '0.86rem', cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(234,88,12,0.3)'
                    }}
                  >
                    {editingId ? 'Save Changes' : 'Create Testimonial'}
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
   BRAND LOGOS & CLIENTS CAROUSEL CMS
════════════════════════════════════════ */
