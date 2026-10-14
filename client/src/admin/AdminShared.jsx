import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { STATUS } from './adminConstants';

export const Pill = ({ status }) => {
  const s = STATUS[status] || STATUS.New;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '700',
      backgroundColor: s.bg, color: s.text, border: `1px solid ${s.border}`
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
};

/* ─── REUSABLE LIQUID GLASS PAGINATION ─── */
export function GlassPagination({ currentPage, totalItems, pageSize, onPageChange, onPageSizeChange, pageSizeOptions = [6, 12, 24] }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalItems === 0) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
      gap: '12px', marginTop: '24px', padding: '14px 20px',
      background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(16px)',
      borderRadius: '16px', border: '1px solid rgba(226, 232, 240, 0.85)',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.03)'
    }}>
      {/* Left: Summary text and rows per page selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>
          Showing <strong style={{ color: '#0f172a' }}>{startIdx}–{endIdx}</strong> of <strong style={{ color: '#0f172a' }}>{totalItems}</strong> entries
        </span>
        {onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Per page:</span>
            <select
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              style={{
                padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1',
                fontSize: '0.78rem', fontWeight: '700', color: '#334155',
                backgroundColor: '#ffffff', outline: 'none', cursor: 'pointer'
              }}
            >
              {pageSizeOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Page navigation buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          style={{
            width: '32px', height: '32px', borderRadius: '8px',
            border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: currentPage <= 1 ? '#cbd5e1' : '#334155',
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease'
          }}
          title="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`dots-${idx}`} style={{ padding: '0 4px', color: '#94a3b8', fontSize: '0.8rem' }}>
                …
              </span>
            );
          }
          const isCur = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              style={{
                minWidth: '32px', height: '32px', padding: '0 8px', borderRadius: '8px',
                border: isCur ? '1px solid #ea580c' : '1px solid #e2e8f0',
                backgroundColor: isCur ? '#ea580c' : '#ffffff',
                color: isCur ? '#ffffff' : '#475569',
                fontSize: '0.8rem', fontWeight: isCur ? '800' : '600',
                cursor: 'pointer', transition: 'all 0.15s ease',
                boxShadow: isCur ? '0 2px 8px rgba(234, 88, 12, 0.3)' : 'none'
              }}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          style={{
            width: '32px', height: '32px', borderRadius: '8px',
            border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: currentPage >= totalPages ? '#cbd5e1' : '#334155',
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease'
          }}
          title="Next Page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── TOAST ─── */
export function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3800); return () => clearTimeout(t); }, []);
  const isErr = msg.type === 'error';
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      style={{
        position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '13px 18px', borderRadius: '12px', maxWidth: '340px',
        backgroundColor: '#ffffff',
        border: `1px solid ${isErr ? '#fecaca' : '#bbf7d0'}`,
        boxShadow: '0 8px 30px rgba(15,23,42,0.12)',
        color: isErr ? '#dc2626' : '#059669',
        fontSize: '0.875rem', fontWeight: '600'
      }}
    >
      {isErr ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
      <span style={{ color: '#0f172a', flex: 1 }}>{msg.text}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, display: 'flex' }}><X size={14} /></button>
    </motion.div>
  );
}

/* ─── STAT CARD ─── */
export function StatCard({ label, value, icon: Icon, color, bg, sub, delta }) {
  return (
    <motion.div whileHover={{ y: -3 }} style={{
      backgroundColor: '#ffffff',
      border: '1px solid #f1f5f9',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(15,23,42,0.05), 0 4px 12px rgba(15,23,42,0.03)',
      display: 'flex', flexDirection: 'column', gap: '16px',
      transition: 'box-shadow 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,23,42,0.1)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(15,23,42,0.05), 0 4px 12px rgba(15,23,42,0.03)'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={22} color={color} />
        </div>
        {delta !== undefined && (
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: delta >= 0 ? '#16a34a' : '#dc2626', backgroundColor: delta >= 0 ? '#f0fdf4' : '#fef2f2', padding: '3px 8px', borderRadius: '999px' }}>
            {delta >= 0 ? '+' : ''}{delta}%
          </span>
        )}
      </div>
      <div>
        <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.04em', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '5px', fontWeight: '500' }}>{label}</div>
        {sub && <div style={{ fontSize: '0.75rem', color: color, fontWeight: '700', marginTop: '4px' }}>{sub}</div>}
      </div>
    </motion.div>
  );
}

/* ─── INPUT FIELD ─── */
export function Field({ label, value, onChange, placeholder, type = 'text', multiline, rows = 2 }) {
  const [focused, setFocused] = useState(false);
  const base = {
    width: '100%', padding: '10px 13px',
    backgroundColor: focused ? '#fff7ed' : '#f8fafc',
    border: `1.5px solid ${focused ? '#ea580c' : '#e2e8f0'}`,
    borderRadius: '9px', color: '#0f172a', fontSize: '0.875rem',
    fontFamily: "'Inter', sans-serif", outline: 'none',
    transition: 'all 0.18s ease', boxSizing: 'border-box',
    boxShadow: focused ? '0 0 0 3px rgba(234,88,12,0.08)' : 'none',
    resize: multiline ? 'vertical' : undefined,
  };
  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '6px', letterSpacing: '0.02em' }}>{label}</label>}
      {multiline
        ? <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder} style={base} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={base} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      }
    </div>
  );
}

/* ════════════════════════════════════════
   DASHBOARD PAGE
════════════════════════════════════════ */
