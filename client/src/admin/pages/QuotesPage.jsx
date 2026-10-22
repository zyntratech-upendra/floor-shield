import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, X, Phone, Mail, MapPin, Calendar, Search, Hash, Send, MessageSquareQuote, CheckCircle2, Clock } from 'lucide-react';
import { STATUS, API_BASE } from '../adminConstants';
import { GlassPagination, Pill } from '../AdminShared';

export default function QuotesPage({ quotes, onStatusUpdate, onQuoteUpdated }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'areaDesc' | 'areaAsc'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Reply modal state
  const [replyModalQuote, setReplyModalQuote] = useState(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replying, setReplying] = useState(false);
  const [replyFeedback, setReplyFeedback] = useState(null);

  const statuses = ['All', ...Object.keys(STATUS)];

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus, sortBy, pageSize]);

  const filtered = quotes.filter(q => {
    const matchSearch = !search ||
      q.name?.toLowerCase().includes(search.toLowerCase()) ||
      q.email?.toLowerCase().includes(search.toLowerCase()) ||
      q.serviceType?.toLowerCase().includes(search.toLowerCase()) ||
      q.suburb?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || (q.status || 'New') === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    if (sortBy === 'areaDesc') return (Number(b.areaApproxSqm) || 0) - (Number(a.areaApproxSqm) || 0);
    if (sortBy === 'areaAsc') return (Number(a.areaApproxSqm) || 0) - (Number(b.areaApproxSqm) || 0);
    return 0;
  });

  // Paginated slice
  const paginatedQuotes = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      {/* Toolbar with Search, Status, Sort & Count */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(16px)',
        borderRadius: '16px', border: '1px solid rgba(226, 232, 240, 0.85)',
        boxShadow: '0 4px 20px -2px rgba(15,23,42,0.04)',
        padding: '16px 20px', marginBottom: '18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '14px', flexWrap: 'wrap'
      }}>
        {/* Left: Search input */}
        <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '220px', maxWidth: '380px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search name, email, suburb, service..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 36px',
              backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0',
              borderRadius: '10px', color: '#0f172a', fontSize: '0.84rem',
              outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Center: Status filter pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {statuses.map(s => {
            const active = filterStatus === s;
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  padding: '7px 13px', borderRadius: '8px', fontSize: '0.78rem',
                  fontWeight: active ? '800' : '600', cursor: 'pointer', border: 'none',
                  fontFamily: 'inherit', transition: 'all 0.15s ease',
                  backgroundColor: active ? '#ea580c' : 'rgba(241, 245, 249, 0.8)',
                  color: active ? '#ffffff' : '#64748b',
                  boxShadow: active ? '0 2px 8px rgba(234, 88, 12, 0.25)' : 'none'
                }}
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* Right: Sort Dropdown & Quick Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              <option value="oldest">Oldest First</option>
              <option value="areaDesc">Largest Area (m²)</option>
              <option value="areaAsc">Smallest Area (m²)</option>
            </select>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '600', paddingLeft: '4px' }}>
            {filtered.length} lead{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {paginatedQuotes.map((q, i) => (
          <motion.div
            key={q.id || q._id || i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            style={{
              backgroundColor: '#ffffff', borderRadius: '14px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
              padding: '18px 22px',
              display: 'grid',
              gridTemplateColumns: '40px 1fr auto',
              gap: '14px', alignItems: 'center',
              transition: 'box-shadow 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,23,42,0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(15,23,42,0.04)'}
          >
            {/* Avatar */}
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #ea580c, #c2410c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: '800', color: '#fff', flexShrink: 0 }}>
              {q.name?.charAt(0)?.toUpperCase() || '?'}
            </div>

            {/* Info */}
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '5px' }}>
                <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.925rem' }}>{q.name}</span>
                <Pill status={q.status || 'New'} />
                {q.createdAt && (
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={11} /> {new Date(q.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '0.8rem', color: '#64748b', marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {q.email}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {q.phone}</span>
                {q.suburb && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {q.suburb}</span>}
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.78rem' }}>
                <span style={{ color: '#ea580c', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Layers size={12} /> {q.serviceType}
                </span>
                <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Hash size={11} /> {q.areaApproxSqm}m²
                </span>
              </div>
              {q.conditionNotes && (
                <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', borderLeft: '2px solid #f1f5f9', paddingLeft: '8px' }}>
                  "{q.conditionNotes?.slice(0, 80)}{q.conditionNotes?.length > 80 ? '...' : ''}"
                </div>
              )}

              {/* Past replies preview */}
              {q.replies && q.replies.length > 0 && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#16a34a', fontWeight: '600' }}>
                  <CheckCircle2 size={12} />
                  <span>{q.replies.length} repl{q.replies.length === 1 ? 'y' : 'ies'} sent</span>
                </div>
              )}
            </div>

            {/* Actions: Reply button & Status select */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setReplyModalQuote(q);
                  setReplySubject(`Floor Shield Australia Quote & Estimate: ${q.serviceType || 'Epoxy Flooring'}`);
                  setReplyMessage(`Hi ${q.name},\n\nThank you for reaching out to Floor Shield Australia regarding your flooring project (${q.serviceType || 'Resin Flooring System'}, ~${q.areaApproxSqm || 40}m²).\n\nBased on your requirements, we are pleased to offer our commercial-grade APC certified installation.\n\nPlease find our estimation notes below:\n• System: ${q.serviceType || 'APC Coating System'}\n• Location: ${q.suburb || 'Melbourne Metro'}\n\nOur senior flooring specialist is available to visit your site or discuss next steps at your convenience.\n\nWarm regards,\nFloor Shield Australia Team\nTel: 0489 074 340\nWeb: https://floorshield.au`);
                  setReplyFeedback(null);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 12px',
                  backgroundColor: '#fff7ed', border: '1px solid #fed7aa',
                  borderRadius: '8px', color: '#ea580c',
                  fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ea580c'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff7ed'; e.currentTarget.style.color = '#ea580c'; }}
              >
                <Send size={13} />
                <span>Reply / Send Email</span>
              </button>

              <select
                value={q.status || 'New'}
                onChange={e => onStatusUpdate(q.id || q._id, e.target.value)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: STATUS[q.status]?.bg || STATUS.New.bg,
                  border: `1.5px solid ${STATUS[q.status]?.border || STATUS.New.border}`,
                  borderRadius: '8px',
                  color: STATUS[q.status]?.text || STATUS.New.text,
                  fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer',
                  fontFamily: 'inherit', outline: 'none', minWidth: '130px'
                }}
              >
                {Object.keys(STATUS).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #f1f5f9', padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <Search size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ fontWeight: '600', fontSize: '0.95rem', color: '#64748b' }}>
              {search || filterStatus !== 'All' ? `No quotes match your filters.` : 'No quote requests yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <GlassPagination
        currentPage={currentPage}
        totalItems={filtered.length}
        pageSize={pageSize}
        pageSizeOptions={[6, 12, 24, 50]}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* ── EMAIL REPLY MODAL ── */}
      <AnimatePresence>
        {replyModalQuote && (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setReplyModalQuote(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              style={{
                backgroundColor: '#ffffff', borderRadius: '18px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                width: '100%', maxWidth: '640px', maxHeight: '90vh',
                display: 'flex', flexDirection: 'column', overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{
                padding: '20px 24px', borderBottom: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                  }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                      Reply & Send Email
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                      Recipient: <strong style={{ color: '#ea580c' }}>{replyModalQuote.name}</strong> ({replyModalQuote.email})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setReplyModalQuote(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {replyFeedback && (
                  <div style={{
                    padding: '12px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600',
                    backgroundColor: replyFeedback.type === 'success' ? '#f0fdf4' : '#fef2f2',
                    color: replyFeedback.type === 'success' ? '#16a34a' : '#dc2626',
                    border: `1px solid ${replyFeedback.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}>
                    <CheckCircle2 size={16} />
                    <span>{replyFeedback.message}</span>
                  </div>
                )}

                {/* Lead Summary Card */}
                <div style={{ backgroundColor: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', fontSize: '0.78rem' }}>
                  <div><span style={{ color: '#94a3b8' }}>Service:</span> <div style={{ fontWeight: '700', color: '#0f172a' }}>{replyModalQuote.serviceType}</div></div>
                  <div><span style={{ color: '#94a3b8' }}>Area:</span> <div style={{ fontWeight: '700', color: '#0f172a' }}>{replyModalQuote.areaApproxSqm}m²</div></div>
                  <div><span style={{ color: '#94a3b8' }}>Suburb:</span> <div style={{ fontWeight: '700', color: '#0f172a' }}>{replyModalQuote.suburb || 'Melbourne Metro'}</div></div>
                  <div><span style={{ color: '#94a3b8' }}>Phone:</span> <div style={{ fontWeight: '700', color: '#0f172a' }}>{replyModalQuote.phone}</div></div>
                </div>

                {/* Email Subject */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Email Subject
                  </label>
                  <input
                    type="text"
                    value={replySubject}
                    onChange={e => setReplySubject(e.target.value)}
                    placeholder="Subject..."
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '10px',
                      border: '1.5px solid #e2e8f0', fontSize: '0.86rem', outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Email Message */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Email Message
                  </label>
                  <textarea
                    rows={8}
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    placeholder="Type your response to the customer..."
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '10px',
                      border: '1.5px solid #e2e8f0', fontSize: '0.86rem', outline: 'none',
                      boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical'
                    }}
                  />
                </div>

                {/* History of replies */}
                {replyModalQuote.replies && replyModalQuote.replies.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="#ea580c" />
                      <span>Previous Replies Sent ({replyModalQuote.replies.length})</span>
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {replyModalQuote.replies.map((rep, rIdx) => (
                        <div key={rIdx} style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.72rem', marginBottom: '4px' }}>
                            <strong>{rep.subject}</strong>
                            <span>{new Date(rep.sentAt).toLocaleString('en-AU')}</span>
                          </div>
                          <p style={{ margin: 0, color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.45 }}>
                            {rep.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '16px 24px', borderTop: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px',
                backgroundColor: '#fafafa'
              }}>
                <button
                  type="button"
                  onClick={() => setReplyModalQuote(null)}
                  style={{
                    padding: '9px 18px', borderRadius: '8px', border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff', color: '#475569', fontSize: '0.85rem', fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={replying || !replyMessage.trim()}
                  onClick={async () => {
                    setReplying(true);
                    setReplyFeedback(null);
                    try {
                      const quoteId = replyModalQuote.id || replyModalQuote._id;
                      const res = await fetch(`${API_BASE}/quotes/${quoteId}/reply`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${localStorage.getItem('fs_admin_token')}`
                        },
                        body: JSON.stringify({
                          subject: replySubject,
                          message: replyMessage
                        })
                      });
                      const data = await res.json();
                      if (data.success && data.quote) {
                        setReplyFeedback({ type: 'success', message: data.message || 'Reply sent successfully!' });
                        if (onQuoteUpdated) onQuoteUpdated(data.quote);
                        setReplyModalQuote(data.quote);
                      } else {
                        setReplyFeedback({ type: 'error', message: data.error || 'Failed to dispatch email.' });
                      }
                    } catch (err) {
                      setReplyFeedback({ type: 'error', message: 'Failed to connect to email server.' });
                    } finally {
                      setReplying(false);
                    }
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '9px 20px', borderRadius: '8px', border: 'none',
                    background: replying ? '#94a3b8' : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                    color: '#ffffff', fontSize: '0.85rem', fontWeight: '700',
                    cursor: replying ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)'
                  }}
                >
                  <Send size={15} />
                  <span>{replying ? 'Sending...' : 'Send Reply via Email'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════
   SERVICES PAGE (Safecoat-Style CMS)
════════════════════════════════════════ */
