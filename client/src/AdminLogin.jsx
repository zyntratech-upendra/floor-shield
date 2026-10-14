import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('fs_admin_token');
    if (token) navigate('/admin', { replace: true });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('fs_admin_token', data.token);
        localStorage.setItem('fs_admin_email', data.admin.email);
        navigate('/admin', { replace: true });
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Connection failed. Please check the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'Manage quote requests & leads',
    'Edit services catalog in real-time',
    'Update site content & settings',
    'Track project pipeline status',
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      backgroundColor: '#f8fafc',
    }}>
      {/* LEFT BRAND PANEL */}
      <div style={{
        width: '44%',
        background: 'linear-gradient(145deg, #ea580c 0%, #c2410c 50%, #9a3412 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '280px', height: '280px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '220px', height: '220px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-40px', width: '140px', height: '140px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.25)'
            }}>
              <ShieldCheck size={26} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: '800', fontSize: '1.3rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                Floor Shield
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)', fontWeight: '600', letterSpacing: '0.12em' }}>
                AUSTRALIA
              </div>
            </div>
          </div>
        </div>

        {/* Center copy */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              display: 'inline-block',
              backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              fontSize: '0.72rem',
              fontWeight: '800',
              letterSpacing: '0.1em',
              padding: '5px 12px',
              borderRadius: '999px',
              marginBottom: '20px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              OPERATIONS DASHBOARD
            </div>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '2.6rem',
              fontWeight: '800',
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-0.035em',
              marginBottom: '16px'
            }}>
              Manage your<br />business in one<br />place.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
              Full control over your quotes, services, and website content — all from a single clean dashboard.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <CheckCircle2 size={13} color="#fff" />
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontWeight: '500' }}>{f}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
            © 2026 Floor Shield Australia · ABN 84 629 184 921
          </p>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
        backgroundColor: '#ffffff',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '1.9rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.03em',
              marginBottom: '8px'
            }}>
              Welcome back 👋
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Sign in to your admin portal to continue.
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '20px',
                color: '#dc2626',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#374151', marginBottom: '7px' }}>
                Admin Email
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}>
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  id="admin-email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@floorshield.au"
                  style={{
                    width: '100%', padding: '12px 14px 12px 40px',
                    backgroundColor: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '10px',
                    color: '#0f172a', fontSize: '0.9rem',
                    outline: 'none', fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#ea580c'; e.target.style.backgroundColor = '#fff7ed'; e.target.style.boxShadow = '0 0 0 3px rgba(234,88,12,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#374151', marginBottom: '7px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}>
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  style={{
                    width: '100%', padding: '12px 40px 12px 40px',
                    backgroundColor: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '10px',
                    color: '#0f172a', fontSize: '0.9rem',
                    outline: 'none', fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#ea580c'; e.target.style.backgroundColor = '#fff7ed'; e.target.style.boxShadow = '0 0 0 3px rgba(234,88,12,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              style={{
                width: '100%', padding: '13px 24px',
                background: loading ? '#f97316' : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                border: 'none', borderRadius: '10px',
                color: '#ffffff', fontSize: '0.95rem', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                marginTop: '6px',
                boxShadow: '0 4px 14px rgba(234,88,12,0.35)',
                fontFamily: 'inherit', transition: 'all 0.2s ease',
              }}
            >
              {loading ? (
                <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /><span>Signing in...</span></>
              ) : (
                <><span>Sign In to Dashboard</span><ArrowRight size={17} /></>
              )}
            </motion.button>
          </form>

          {/* Back link */}
          <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
            <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ea580c'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
            >
              ← Back to Floor Shield website
            </a>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #cbd5e1; }
        @media (max-width: 768px) {
          div[style*="width: 44%"] { display: none !important; }
        }
      `}</style>
    </div>
  );
}
