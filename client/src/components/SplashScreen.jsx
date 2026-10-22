import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

/**
 * Floor Shield Australia - Luxury Light Flash Screen (Splash Screen)
 * Clean, architectural light-themed startup & refresh screen with animated
 * brand logo emblem and seamless exit reveal (Zero loading bars/spinners).
 */
export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const isPreview = typeof window !== 'undefined' && window.location.search.includes('splash=preview');

  useEffect(() => {
    // Lock body scroll while splash screen is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Remove static HTML fallback loader once React is live
    const htmlLoader = document.getElementById('initial-splash-screen');
    if (htmlLoader) {
      htmlLoader.remove();
    }

    if (isPreview) {
      // In preview mode (?splash=preview), stay open for inspection
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }

    // Display for a clean, elegant ~1.2s then smoothly dissolve
    const timer = setTimeout(() => {
      setIsExiting(true);
      document.body.style.overflow = originalOverflow || '';
      setTimeout(() => {
        setVisible(false);
      }, 500);
    }, 1200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow || '';
    };
  }, [isPreview]);

  const handleDismiss = () => {
    setIsExiting(true);
    document.body.style.overflow = '';
    setTimeout(() => setVisible(false), 450);
  };

  if (!visible) return null;

  return (
    <aside
      className={`fs-splash-overlay ${isExiting ? 'is-exiting' : ''}`}
      onClick={handleDismiss}
      aria-label="Floor Shield Australia"
      role="presentation"
    >
      {/* Background Architectural Grid Pattern */}
      <div className="fs-splash-grid" />

      {/* Ambient Warm Glow */}
      <div className="fs-splash-ambient-aura" />

      {/* Center Content */}
      <div className="fs-splash-content">
        {/* Emblem with animated orbit border */}
        <div className="fs-splash-emblem-wrapper">
          <div className="fs-splash-orbit-ring" />

          <div className="fs-splash-logo-card">
            {!logoError ? (
              <img
                src="/logo.png"
                alt="Floor Shield Australia"
                className="fs-splash-logo-img"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="fs-splash-fallback-logo">
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#ea580c',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 3px 0 #9a3412'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '800', fontSize: '1.3rem', color: '#0f172a', lineHeight: 1 }}>
                    FLOOR SHIELD
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#ea580c', letterSpacing: '0.12em', fontWeight: '800' }}>
                    AUSTRALIA
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Brand Badges */}
        <div className="fs-splash-badge-row">
          <span className="fs-splash-badge">
            <span className="fs-splash-badge-dot" />
            AUSTRALIAN ENGINEERED
          </span>
          <span className="fs-splash-badge fs-splash-badge-blue">
            10-YEAR WARRANTY
          </span>
        </div>

        {/* Tagline */}
        <p className="fs-splash-subtitle">
          Commercial • Industrial • Garage Epoxy Flooring
        </p>
      </div>

      {/* Quality Hallmark Footer */}
      <div className="fs-splash-footer">
        <span className="fs-splash-footer-shield">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </span>
        <span>All Purpose Coatings (APC) Certified Systems Installer Victoria</span>
      </div>
    </aside>
  );
}
