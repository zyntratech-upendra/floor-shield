import { motion } from 'framer-motion';
import { Bell, CheckCircle2, ChevronRight, DollarSign, Inbox, ExternalLink, Plus } from 'lucide-react';
import { STATUS, fmt } from '../adminConstants';
import { Pill, StatCard } from '../AdminShared';

export default function DashboardPage({ quotes, services, onTabChange }) {
  const stats = {
    total: quotes.length,
    newCount: quotes.filter(q => q.status === 'New').length,
    booked: quotes.filter(q => q.status === 'Booked' || q.status === 'Completed').length,
    revenue: quotes.filter(q => q.status === 'Completed').length * 4200,
  };
  const recent = [...quotes].slice(0, 6);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Greeting banner */}
      <div style={{
        background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
        borderRadius: '18px', padding: '28px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
        boxShadow: '0 8px 28px rgba(234,88,12,0.22)'
      }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
            Good day, Administrator 👋
          </p>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            Floor Shield Operations Hub
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginTop: '6px' }}>
            {stats.newCount > 0 ? `You have ${stats.newCount} new quote${stats.newCount > 1 ? 's' : ''} awaiting review.` : 'All caught up! No new pending quotes.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a href="/" target="_blank" style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '10px 18px', borderRadius: '10px',
            backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff',
            fontSize: '0.85rem', fontWeight: '700', textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <ExternalLink size={15} /> View Live Site
          </a>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <StatCard label="Total Quote Requests" value={stats.total} icon={Inbox} color="#ea580c" bg="#fff7ed" delta={12} />
        <StatCard label="New / Pending Leads" value={stats.newCount} icon={Bell} color="#d97706" bg="#fffbeb" sub="Awaiting contact" />
        <StatCard label="Booked & Completed" value={stats.booked} icon={CheckCircle2} color="#16a34a" bg="#f0fdf4" delta={8} />
        <StatCard label="Estimated Revenue" value={'$' + fmt(stats.revenue)} icon={DollarSign} color="#7c3aed" bg="#faf5ff" delta={5} />
      </div>

      {/* Recent quotes + quick info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>

        {/* Recent Quotes */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(15,23,42,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Recent Quotes</h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>Latest customer inquiries</p>
            </div>
            <button onClick={() => onTabChange('quotes')} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#ea580c', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer' }}>
              View all <ChevronRight size={14} />
            </button>
          </div>
          {recent.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
              <Inbox size={36} style={{ opacity: 0.3, marginBottom: '10px' }} />
              <p style={{ fontSize: '0.9rem' }}>No quotes yet — they'll appear here once customers submit inquiries.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  {['Customer', 'Service', 'Area', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((q, i) => (
                  <tr key={q.id || q._id || i} style={{ borderTop: '1px solid #f8fafc', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #ea580c, #c2410c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800', color: '#fff', flexShrink: 0 }}>
                          {q.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a' }}>{q.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{q.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '0.8rem', color: '#334155', maxWidth: '140px' }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.serviceType?.split('®')[0] || '-'}</span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>{q.areaApproxSqm}m²</td>
                    <td style={{ padding: '13px 16px' }}><Pill status={q.status || 'New'} /></td>
                    <td style={{ padding: '13px 16px', fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {q.createdAt ? new Date(q.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick info column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Status breakdown */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(15,23,42,0.04)', padding: '20px 22px' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>Quote Pipeline</h3>
            {Object.keys(STATUS).map(s => {
              const count = quotes.filter(q => (q.status || 'New') === s).length;
              const pct = quotes.length ? Math.round((count / quotes.length) * 100) : 0;
              return (
                <div key={s} style={{ marginBottom: '11px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#334155' }}>{s}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: STATUS[s].text }}>{count}</span>
                  </div>
                  <div style={{ height: '5px', borderRadius: '999px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      style={{ height: '100%', borderRadius: '999px', backgroundColor: STATUS[s].dot }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Services count */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(15,23,42,0.04)', padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Catalog</h3>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#ea580c', backgroundColor: '#fff7ed', padding: '2px 8px', borderRadius: '999px', border: '1px solid #fed7aa' }}>
                {services.length} services
              </span>
            </div>
            {services.slice(0, 3).map((s, i) => (
              <div key={s.id || i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderTop: i > 0 ? '1px solid #f8fafc' : 'none' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f1f5f9' }}>
                  {s.image && <img src={s.image} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title?.split('®')[0]}®</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{s.priceStarting}</div>
                </div>
                {s.popular && <span style={{ fontSize: '0.62rem', fontWeight: '800', color: '#ea580c', backgroundColor: '#fff7ed', padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}>HOT</span>}
              </div>
            ))}
            <button onClick={() => onTabChange('services')} style={{ marginTop: '12px', width: '100%', padding: '9px', border: '1.5px dashed #e2e8f0', borderRadius: '8px', backgroundColor: 'transparent', color: '#64748b', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Plus size={13} /> Manage Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   QUOTES PAGE
════════════════════════════════════════ */
