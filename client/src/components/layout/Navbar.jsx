import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, Mail, Award, ShieldCheck, ChevronDown, Layers3, Home, 
  ArrowRight, Utensils, Factory, Building2, BadgeCheck, CheckCircle2, ChevronRight, Menu, X
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { navFlooringSystems, navIndustries, navAboutItems } from '../../utils/siteData';

export default function Navbar() {
  const { settings } = useSite();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState(null);
  const navTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavHover = (menu) => {
    if (navTimer.current) clearTimeout(navTimer.current);
    setActiveDropdown(menu);
  };

  const handleNavLeave = () => {
    if (navTimer.current) clearTimeout(navTimer.current);
    navTimer.current = setTimeout(() => setActiveDropdown(null), 220);
  };

  const goTo = (path) => {
    if (navTimer.current) clearTimeout(navTimer.current);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setMobileExpandedSection(null);
    navigate(path);
  };

  useEffect(() => () => {
    if (navTimer.current) clearTimeout(navTimer.current);
  }, []);

  return (
    <>
      {/* ========================================================
          1. TOP NOTIFICATION BAR
          ======================================================== */}
      <div className="site-announcement-bar" style={{
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '10px 0',
        fontSize: '0.84rem',
        borderBottom: '2px solid #ea580c'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={15} color="#ea580c" />
            <span style={{ fontWeight: '600' }}>All Purpose Coatings (APC) Certified Systems Installer Victoria</span>
            <span style={{ color: '#475569' }}>|</span>
            <span style={{ backgroundColor: '#ea580c', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '800' }}>
              10-YEAR WARRANTY
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff', fontWeight: '700' }}>
              <Phone size={14} color="#ea580c" />
              <span>{settings.phone}</span>
            </a>
            <span style={{ color: '#475569' }}>|</span>
            <a href={`mailto:${settings.email}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
              <Mail size={14} />
              <span>{settings.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. STICKY NAVBAR (CRISP WHITE WITH USER LOGO)
          ======================================================== */}
      <header 
        className={`site-navbar ${scrolled ? 'is-scrolled' : ''}`}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '2px solid #ea580c' : '1px solid #e2e8f0',
          boxShadow: scrolled ? '0 10px 30px rgba(15, 23, 42, 0.08)' : '0 1px 3px rgba(15, 23, 42, 0.03)',
          transition: 'all 0.25s ease'
        }}
      >
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '84px',
          position: 'relative'
        }}>
          {/* Brand Logo Using public/logo.png */}
          <button
            type="button"
            onClick={() => goTo('/')}
            aria-label="Floor Shield Australia home"
            style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', background: 'none', border: 0, padding: 0 }}
          >
            <img 
              src="/logo.png" 
              alt="Floor Shield Australia Logo" 
              style={{
                height: '52px',
                width: 'auto',
                maxHeight: '52px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                const fb = document.getElementById('logo-fallback');
                if (fb) fb.style.display = 'flex';
              }}
            />
            <div id="logo-fallback" style={{ display: 'none', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#ea580c',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 0 #9a3412'
              }}>
                <ShieldCheck size={26} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.4rem', color: '#0f172a', lineHeight: 1.1 }}>
                  FLOOR SHIELD
                </div>
                <div style={{ fontSize: '0.72rem', color: '#ea580c', letterSpacing: '0.12em', fontWeight: '800' }}>
                  AUSTRALIA
                </div>
              </div>
            </div>
          </button>

          {/* Desktop Nav Links (Safecoat Navigation Architecture) */}
          <nav style={{ display: 'none', gap: '4px', alignItems: 'center' }} className="desktop-nav">
            <style>{`
              @media (min-width: 1040px) {
                .desktop-nav { display: flex !important; }
                .mobile-toggle { display: none !important; }
              }
            `}</style>

            {/* 1. Home Icon (Safecoat style) */}
            <button 
              onClick={() => goTo('/')}
              className={`nav-link-btn ${location.pathname === '/' && !activeDropdown ? 'active' : ''}`}
              title="Home"
              style={{ padding: '8px 12px' }}
            >
              <Home size={18} />
            </button>

            {/* 2. Projects (Safecoat style) */}
            <button 
              onClick={() => goTo('/projects')}
              className={`nav-link-btn ${location.pathname === '/projects' ? 'active' : ''}`}
            >
              Projects
            </button>

            {/* 3. Services with Mega Menu (Safecoat style) */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => handleNavHover('services')}
              onMouseLeave={handleNavLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'services' ? null : 'services')}
                className={`nav-link-btn ${activeDropdown === 'services' || location.pathname.startsWith('/services') ? 'active' : ''}`}
                aria-expanded={activeDropdown === 'services'}
                style={{ cursor: 'pointer' }}
              >
                <span>Services</span>
                <ChevronDown size={14} style={{ transform: activeDropdown === 'services' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', opacity: 0.7 }} />
              </button>
            </div>

            {/* 4. About Dropdown (Safecoat style) */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => handleNavHover('about')}
              onMouseLeave={handleNavLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'about' ? null : 'about')}
                className={`nav-link-btn ${activeDropdown === 'about' || location.pathname === '/about' ? 'active' : ''}`}
                aria-expanded={activeDropdown === 'about'}
                style={{ cursor: 'pointer' }}
              >
                <span>About</span>
                <ChevronDown size={14} style={{ transform: activeDropdown === 'about' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', opacity: 0.7 }} />
              </button>
            </div>

            {/* 5. Contact */}
            <button
              onClick={() => goTo('/contact')}
              className={`nav-link-btn ${location.pathname === '/contact' ? 'active' : ''}`}
            >
              Contact
            </button>

          </nav>

          {/* Header Right (Safecoat style: Clickable Phone Badge + GET A QUOTE Button) */}
          <div style={{ display: 'none', alignItems: 'center', gap: '12px' }} className="desktop-nav">
            <a 
              href={`tel:${settings.phone.replace(/\s+/g, '')}`} 
              className="phone-nav-link"
              title="Call Floor Shield Australia"
            >
              <Phone size={14} color="#ea580c" />
              <span>{settings.phone}</span>
            </a>

            <button 
              onClick={() => goTo('/get-a-quote')}
              className="quote-pill-btn"
            >
              <span>GET A QUOTE</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '8px',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* ========================================================
              SERVICES FLOATING MEGA MENU (Safecoat Style)
              ======================================================== */}
          {activeDropdown === 'services' && (
            <div 
              className="mega-menu-box mega-menu-full"
              onMouseEnter={() => handleNavHover('services')}
              onMouseLeave={handleNavLeave}
              style={{
                top: 'calc(100% + 2px)',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 280px',
                gap: '24px'
              }}
            >
              <div>
                {/* Header Sub-bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ea580c' }}>
                      Certified Systems &amp; Concrete Solutions
                    </span>
                    <span style={{ fontSize: '0.72rem', backgroundColor: '#fff7ed', color: '#ea580c', padding: '2px 8px', borderRadius: '4px', fontWeight: '800' }}>
                      9 AVAILABLE
                    </span>
                  </div>
                  <button 
                    onClick={() => goTo('/services')}
                    style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ea580c', background: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', border: 0 }}
                  >
                    <span>View All Services Overview</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* 3-Column Grid for Items */}
                <div className="mega-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px' }}>
                  {navFlooringSystems.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="service-nav-card"
                      onClick={() => goTo(item.route)}
                    >
                      <img src={item.image} alt={item.name} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                          <span className="service-nav-card-title">
                            {item.name}
                          </span>
                          <ChevronRight size={14} className="service-nav-card-arrow" />
                        </div>
                        <div className="service-nav-card-desc">
                          {item.desc}
                        </div>
                        {item.badge && (
                          <div style={{ marginTop: '5px' }}>
                            <span className="service-nav-card-badge">
                              {item.badge}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Sidebar: Featured System & Rapid Quote Callout */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '14px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)'
              }}>
                <div>
                  <div style={{
                    position: 'relative',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    height: '130px',
                    marginBottom: '14px',
                    border: '1px solid #cbd5e1'
                  }}>
                    <img 
                      src="/images/epoxy-flake-garage.jpg" 
                      alt="Floor Shield Turnkey Garage System" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: '#ea580c',
                      color: '#ffffff',
                      fontSize: '0.66rem',
                      fontWeight: '800',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}>
                      APC Certified Installers
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.88)',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      From $2,499
                    </div>
                  </div>

                  <div style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.25, marginBottom: '6px' }}>
                    Seamless Resin Engineering
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.45, marginBottom: '14px' }}>
                    Heavy diamond prep with CSP-2 profiling. 100% solids epoxy basecoats, decorative flake broadcast &amp; non-yellowing polyaspartic protection.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', fontSize: '0.76rem', color: '#334155', fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={13} color="#ea580c" />
                      <span>$0 Upfront Deposit Needed</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={13} color="#ea580c" />
                      <span>Rapid 2-Day Turnaround</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={13} color="#ea580c" />
                      <span>10-Year Coating Warranty</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => goTo('/get-a-quote')}
                  className="btn-primary"
                  style={{ width: '100%', fontSize: '0.84rem', padding: '10px 14px', justifyContent: 'center' }}
                >
                  <span>Request a Fast Quote</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              INDUSTRY FLOATING MEGA MENU (Safecoat Style)
              ======================================================== */}
          {activeDropdown === 'industry' && (
            <div 
              className="mega-menu-box mega-menu-full"
              onMouseEnter={() => handleNavHover('industry')}
              onMouseLeave={handleNavLeave}
              style={{
                top: 'calc(100% + 2px)'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '16px' }}>
                {navIndustries.map((ind, idx) => {
                  const Icon = ind.icon;
                  return (
                    <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <button
                        type="button"
                        onClick={() => goTo(`/industry?category=${encodeURIComponent(ind.category)}`)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', padding: '0 0 8px', border: 0, borderBottom: '2px solid #ea580c', background: 'none', textAlign: 'left', cursor: 'pointer' }}
                      >
                        <Icon size={18} color="#ea580c" />
                        <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                          {ind.category}
                        </h4>
                      </button>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {ind.items.map((sub, sIdx) => (
                          <button
                            type="button"
                            key={sIdx} 
                            className="industry-nav-item"
                            onClick={() => goTo(`/industry?category=${encodeURIComponent(ind.category)}`)}
                          >
                            <CheckCircle2 size={13} color="#ea580c" />
                            <span>{sub}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom CTA Banner (Safecoat style) */}
              <div style={{
                backgroundColor: '#0f172a',
                borderRadius: '10px',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={20} color="#ea580c" />
                  <span style={{ fontSize: '0.86rem', fontWeight: '600', color: '#f1f5f9' }}>
                    Need AS 4586 Slip Testing (P0–P5) or Turnkey HACCP Certification for your commercial floor?
                  </span>
                </div>
                <button 
                  onClick={() => goTo('/get-a-quote')}
                  style={{
                    backgroundColor: '#ea580c',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '0.82rem',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Request Engineering Quote</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              ABOUT FLOATING DROPDOWN (Safecoat Style)
              ======================================================== */}
          {activeDropdown === 'about' && (
            <div 
              className="mega-menu-box"
              onMouseEnter={() => handleNavHover('about')}
              onMouseLeave={handleNavLeave}
              style={{
                top: 'calc(100% + 2px)',
                right: '260px',
                width: '320px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {navAboutItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => goTo(item.route)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fff7ed';
                      e.currentTarget.style.borderColor = '#ea580c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={16} color="#ea580c" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#0f172a' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', lineHeight: 1.35 }}>
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================
            RESPONSIVE MOBILE DRAWER WITH ACCORDIONS
            ======================================================== */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: '#ffffff',
            borderBottom: '3px solid #ea580c',
            padding: '18px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            maxHeight: '82vh',
            overflowY: 'auto'
          }}>
            {/* Quick Actions at Top */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '6px' }}>
              <a 
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="phone-nav-link"
                style={{ justifyContent: 'center', fontSize: '0.82rem', padding: '9px 6px' }}
              >
                <Phone size={14} color="#ea580c" />
                <span>Call Now</span>
              </a>
              <button 
                onClick={() => goTo('/get-a-quote')}
                className="quote-pill-btn"
                style={{ fontSize: '0.8rem', padding: '9px 6px' }}
              >
                <span>GET A QUOTE</span>
              </button>
            </div>

            {/* Home */}
            <button 
              onClick={() => goTo('/')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: location.pathname === '/' ? '#fff7ed' : '#f8fafc', color: location.pathname === '/' ? '#ea580c' : '#0f172a', fontWeight: '800', border: '1px solid #e2e8f0', textAlign: 'left', cursor: 'pointer' }}
            >
              <Home size={18} color="#ea580c" />
              <span>Home Overview</span>
            </button>

            {/* Projects */}
            <button 
              onClick={() => goTo('/projects')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: location.pathname === '/projects' ? '#fff7ed' : '#f8fafc', color: location.pathname === '/projects' ? '#ea580c' : '#0f172a', fontWeight: '800', border: '1px solid #e2e8f0', textAlign: 'left', cursor: 'pointer' }}
            >
              <Award size={18} color="#ea580c" />
              <span>Projects & Case Studies</span>
            </button>

            {/* Services Accordion */}
            <div style={{ border: '1.5px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
              <button 
                onClick={() => setMobileExpandedSection(mobileExpandedSection === 'services' ? null : 'services')}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: mobileExpandedSection === 'services' ? '#fff7ed' : '#f8fafc', fontWeight: '800', color: mobileExpandedSection === 'services' ? '#ea580c' : '#0f172a', border: 'none', cursor: 'pointer', transition: 'all 0.15s ease' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Layers3 size={20} color="#ea580c" />
                  <span style={{ fontSize: '0.94rem' }}>Flooring Systems &amp; Services</span>
                </div>
                <ChevronDown size={18} style={{ transform: mobileExpandedSection === 'services' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#ea580c' }} />
              </button>
              {mobileExpandedSection === 'services' && (
                <div style={{ padding: '10px 12px 14px', display: 'flex', flexDirection: 'column', gap: '6px', background: '#ffffff', borderTop: '1px solid #fed7aa' }}>
                  <div style={{ padding: '6px 4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Certified Systems
                    </span>
                    <button 
                      onClick={() => goTo('/services')} 
                      style={{ fontSize: '0.76rem', fontWeight: '700', color: '#0f172a', background: 'none', border: 0, display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}
                    >
                      <span>View All</span>
                      <ChevronRight size={13} color="#ea580c" />
                    </button>
                  </div>

                  {navFlooringSystems.map((item, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => goTo(item.route)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 10px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        border: '1px solid #f1f5f9',
                        background: '#ffffff',
                        textAlign: 'left',
                        transition: 'background-color 0.15s ease'
                      }}
                      onTouchStart={(e) => { e.currentTarget.style.backgroundColor = '#fff7ed'; }}
                      onTouchEnd={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                    >
                      <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, border: '1px solid #e2e8f0' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                          <span style={{ fontSize: '0.86rem', fontWeight: '800', color: '#0f172a' }}>{item.name}</span>
                          {item.badge && (
                            <span style={{ fontSize: '0.62rem', fontWeight: '800', backgroundColor: '#f1f5f9', color: '#475569', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.desc}
                        </div>
                      </div>
                      <ChevronRight size={14} color="#cbd5e1" style={{ flexShrink: 0 }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Contact */}
            <button 
              onClick={() => goTo('/contact')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: location.pathname === '/contact' ? '#fff7ed' : '#f8fafc', color: location.pathname === '/contact' ? '#ea580c' : '#0f172a', fontWeight: '800', border: '1px solid #e2e8f0', textAlign: 'left', cursor: 'pointer' }}
            >
              <Phone size={18} color="#ea580c" />
              <span>Contact Us &amp; Support</span>
            </button>

            {/* About / Certifications */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              <button 
                onClick={() => setMobileExpandedSection(mobileExpandedSection === 'about' ? null : 'about')}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', fontWeight: '800', color: '#0f172a', border: 'none', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} color="#ea580c" />
                  <span>About Floor Shield & Warranty</span>
                </div>
                <ChevronDown size={16} style={{ transform: mobileExpandedSection === 'about' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {mobileExpandedSection === 'about' && (
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', background: '#ffffff' }}>
                  <button type="button" className="industry-card-link" onClick={() => goTo('/about')} style={{ padding: '8px 6px' }}>
                    About Floor Shield <ChevronRight size={15} />
                  </button>
                  {navAboutItems.map((item, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => goTo(item.route)}
                      style={{ padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', background: '#f8fafc', textAlign: 'left', border: 0 }}
                    >
                      <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>{item.title}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.desc}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
