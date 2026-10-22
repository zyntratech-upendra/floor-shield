import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

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
    'Live Quotes Management & Direct Email Replies',
    'Full Projects CMS with Before/After Imagery',
    'Services & Products Catalog Management',
    'Customer Testimonials & Brand Partner Carousel',
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #090d16 0%, #0f172a 45%, #1e1b4b 100%)',
    }}>
      {/* ── Glassmorphism Animated Ambient Background Orbs ── */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '20%',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(234, 88, 12, 0.42) 0%, rgba(234, 88, 12, 0) 70%)',
        filter: 'blur(75px)',
        pointerEvents: 'none',
        animation: 'ambientFloat1 18s ease-in-out infinite alternate',
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-12%',
        right: '10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.35) 0%, rgba(99, 102, 241, 0.25) 50%, rgba(0, 0, 0, 0) 75%)',
        filter: 'blur(85px)',
        pointerEvents: 'none',
        animation: 'ambientFloat2 22s ease-in-out infinite alternate',
      }} />

      <div style={{
        position: 'absolute',
        top: '40%',
        right: '42%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(194, 65, 12, 0.3) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* Decorative Grid Mesh */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
        pointerEvents: 'none',
        opacity: 0.7,
      }} />

      {/* ══ LEFT HERO BRAND PANEL ══ */}
      <div className="login-left-panel" style={{
        width: '46%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 48px',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Brand Logo */}
        <div>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
            <img 
              src="/logo.png" 
              alt="Floor Shield Australia" 
              style={{
                height: '56px',
                width: 'auto',
                maxWidth: '240px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.4))'
              }}
              onError={e => {
                e.target.style.display = 'none';
              }}
            />
          </a>
        </div>

        {/* Center Pitch Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(234, 88, 12, 0.18)',
              backdropFilter: 'blur(12px)',
              color: '#ffedd5',
              fontSize: '0.74rem',
              fontWeight: '800',
              letterSpacing: '0.1em',
              padding: '6px 14px',
              borderRadius: '999px',
              marginBottom: '22px',
              border: '1px solid rgba(249, 115, 22, 0.35)'
            }}>
              <Sparkles size={13} color="#ea580c" />
              <span>COMMAND &amp; OPERATIONS CMS</span>
            </div>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '2.8rem',
              fontWeight: '800',
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-0.035em',
              marginBottom: '18px',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              Real-time control.<br />
              <span style={{
                background: 'linear-gradient(90deg, #f97316 0%, #fed7aa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Effortless management.
              </span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '36px', maxWidth: '440px' }}>
              Full administrative power over quote replies, commercial projects, brand carousels, verified reviews, and site catalogs.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.4), rgba(234, 88, 12, 0.15))',
                    border: '1px solid rgba(249, 115, 22, 0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <CheckCircle2 size={13} color="#f97316" />
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.88)', fontSize: '0.92rem', fontWeight: '500' }}>{f}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
            © 2026 Floor Shield Australia · Certified APC Coating Systems
          </p>
        </div>
      </div>

      {/* ══ RIGHT FORM PANEL WITH GLASSMORPHISM CONTAINER ══ */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 24px',
        position: 'relative',
        zIndex: 3,
      }}>
        {/* Glassmorphic Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: '430px',
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.65)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
            padding: '42px 36px',
            position: 'relative',
          }}
        >
          {/* Top subtle highlight */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '20%',
            right: '20%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(234, 88, 12, 0.8), transparent)',
            borderRadius: '2px',
          }} />

          <div style={{ marginBottom: '28px', textAlign: 'center' }}>
            <div style={{ marginBottom: '18px', display: 'flex', justifyContent: 'center' }}>
              <a href="/" title="Floor Shield Australia" style={{ display: 'inline-block' }}>
                <img 
                  src="/logo.png" 
                  alt="Floor Shield Australia" 
                  style={{
                    height: '52px',
                    width: 'auto',
                    maxWidth: '220px',
                    objectFit: 'contain'
                  }}
                />
              </a>
            </div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '1.9rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.035em',
              marginBottom: '6px'
            }}>
              Welcome back 👋
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
              Sign in to your admin portal to manage Floor Shield Australia.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '20px',
                color: '#dc2626',
                fontSize: '0.86rem',
                fontWeight: '600'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#1e293b', marginBottom: '7px' }}>
                Admin Email
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}>
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
                    width: '100%', padding: '13px 14px 13px 42px',
                    backgroundColor: 'rgba(248, 250, 252, 0.85)',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    color: '#0f172a', fontSize: '0.92rem',
                    outline: 'none', fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#ea580c';
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(234, 88, 12, 0.12)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.backgroundColor = 'rgba(248, 250, 252, 0.85)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#1e293b', marginBottom: '7px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}>
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
                    width: '100%', padding: '13px 44px 13px 42px',
                    backgroundColor: 'rgba(248, 250, 252, 0.85)',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    color: '#0f172a', fontSize: '0.92rem',
                    outline: 'none', fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#ea580c';
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(234, 88, 12, 0.12)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.backgroundColor = 'rgba(248, 250, 252, 0.85)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer',
                    padding: '4px', display: 'flex', alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.015 }}
              whileTap={{ scale: loading ? 1 : 0.985 }}
              style={{
                width: '100%', padding: '14px 24px',
                background: loading ? '#f97316' : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                border: 'none', borderRadius: '12px',
                color: '#ffffff', fontSize: '0.96rem', fontWeight: '800',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                marginTop: '8px',
                boxShadow: '0 6px 20px rgba(234, 88, 12, 0.4)',
                fontFamily: 'inherit', transition: 'all 0.2s ease',
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={17} />
                </>
              )}
            </motion.button>
          </form>

          {/* Back link */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(226, 232, 240, 0.8)', textAlign: 'center' }}>
            <a
              href="/"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '0.85rem', color: '#64748b', textDecoration: 'none',
                fontWeight: '600', transition: 'color 0.2s'
              }}
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
        @keyframes ambientFloat1 {
          0% { transform: translate(0px, 0px) scale(1); }
          100% { transform: translate(60px, 40px) scale(1.15); }
        }
        @keyframes ambientFloat2 {
          0% { transform: translate(0px, 0px) scale(1); }
          100% { transform: translate(-50px, -30px) scale(1.12); }
        }
        input::placeholder { color: #94a3b8; }
        @media (max-width: 900px) {
          .login-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
