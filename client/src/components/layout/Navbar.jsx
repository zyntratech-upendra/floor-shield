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
                onClick={() => goTo('/services')}
                className={`nav-link-btn ${activeDropdown === 'services' || location.pathname.startsWith('/services') ? 'active' : ''}`}
              >
                Services
              </button>
              <button
                type="button"
                className="nav-menu-toggle"
                aria-label="Open services menu"
                aria-expanded={activeDropdown === 'services'}
                onClick={() => setActiveDropdown(activeDropdown === 'services' ? null : 'services')}
              >
                <ChevronDown size={14} style={{ transform: activeDropdown === 'services' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>
            </div>

            {/* 4. Industry with Mega Menu (Safecoat style) */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => handleNavHover('industry')}
              onMouseLeave={handleNavLeave}
            >
              <button
                onClick={() => goTo('/industry')}
                className={`nav-link-btn ${activeDropdown === 'industry' || location.pathname === '/industry' ? 'active' : ''}`}
              >
                Industry
              </button>
              <button
                type="button"
                className="nav-menu-toggle"
                aria-label="Open industry menu"
                aria-expanded={activeDropdown === 'industry'}
                onClick={() => setActiveDropdown(activeDropdown === 'industry' ? null : 'industry')}
              >
                <ChevronDown size={14} style={{ transform: activeDropdown === 'industry' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>
            </div>

            {/* 5. About Dropdown (Safecoat style) */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => handleNavHover('about')}
              onMouseLeave={handleNavLeave}
            >
              <button
                onClick={() => goTo('/about')}
                className={`nav-link-btn ${activeDropdown === 'about' || location.pathname === '/about' ? 'active' : ''}`}
              >
                About
              </button>
              <button
                type="button"
                className="nav-menu-toggle"
                aria-label="Open about menu"
                aria-expanded={activeDropdown === 'about'}
                onClick={() => setActiveDropdown(activeDropdown === 'about' ? null : 'about')}
              >
                <ChevronDown size={14} style={{ transform: activeDropdown === 'about' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>
            </div>

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
              onClick={() => goTo('/calculator')}
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
                gridTemplateColumns: '2.4fr 1fr',
                gap: '24px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ea580c' }}>
                    TURNKEY RESIN FLOORING SYSTEMS & SPECIFICATIONS
                  </span>
                  <button 
                    onClick={() => goTo('/services')}
                    style={{ fontSize: '0.82rem', fontWeight: '700', color: '#64748b', background: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                  >
                    <span>View All Systems</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {navFlooringSystems.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="service-nav-card"
                      onClick={() => goTo(item.route)}
                    >
                      <img src={item.image} alt={item.name} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Callout Card */}
              <div style={{
                backgroundColor: '#fff7ed',
                border: '1px solid #fed7aa',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    height: '120px',
                    marginBottom: '12px',
                    border: '1px solid #fdba74'
                  }}>
                    <img 
                      src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80" 
                      alt="Industrial Floor System" 
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
                      borderRadius: '9999px',
                      textTransform: 'uppercase'
                    }}>
                      APC Certified Applicator
                    </div>
                  </div>
                  <div style={{ fontSize: '0.96rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.25, marginBottom: '6px' }}>
                    Turnkey Project Engineering & Specification
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45, marginBottom: '12px' }}>
                    Industrial resin systems formulated for harsh chemical washdowns, forklift traffic, and HACCP compliance. Backed by up to 10-Year Warranty.
                  </p>
                </div>

                <button 
                  onClick={() => goTo('/calculator')}
                  className="btn-primary"
                  style={{ width: '100%', fontSize: '0.84rem', padding: '9px 12px' }}
                >
                  <span>Get Free System Spec</span>
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
                  onClick={() => goTo('/calculator')}
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
                  <span>Consult an Engineer</span>
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
                onClick={() => goTo('/calculator')}
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
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              <button 
                onClick={() => setMobileExpandedSection(mobileExpandedSection === 'services' ? null : 'services')}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', fontWeight: '800', color: '#0f172a', border: 'none', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers3 size={18} color="#ea580c" />
                  <span>Flooring Systems & Services</span>
                </div>
                <ChevronDown size={16} style={{ transform: mobileExpandedSection === 'services' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {mobileExpandedSection === 'services' && (
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#ffffff' }}>
                  {navFlooringSystems.map((item, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => goTo(item.route)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', border: '1px solid #f1f5f9', background: '#fff', textAlign: 'left' }}
                    >
                      <img src={item.image} alt={item.name} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a' }}>{item.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.desc}</div>
                      </div>
                    </button>
                  ))}
                  <button type="button" className="industry-card-link" onClick={() => goTo('/services')} style={{ padding: '8px 6px' }}>
                    View all services <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </div>

            {/* Industry Accordion */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              <button 
                onClick={() => setMobileExpandedSection(mobileExpandedSection === 'industry' ? null : 'industry')}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', fontWeight: '800', color: '#0f172a', border: 'none', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Factory size={18} color="#ea580c" />
                  <span>Industries Served</span>
                </div>
                <ChevronDown size={16} style={{ transform: mobileExpandedSection === 'industry' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {mobileExpandedSection === 'industry' && (
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#ffffff' }}>
                  {navIndustries.map((ind, idx) => (
                    <div key={idx}>
                      <button
                        type="button"
                        onClick={() => goTo(`/industry?category=${encodeURIComponent(ind.category)}`)}
                        style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ea580c', marginBottom: '4px', background: 'none', padding: 0, textAlign: 'left' }}
                      >
                        {ind.category}
                      </button>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {ind.items.map((sub, sIdx) => (
                          <button
                            type="button"
                            key={sIdx}
                            onClick={() => goTo(`/industry?category=${encodeURIComponent(ind.category)}`)}
                            style={{ fontSize: '0.78rem', color: '#334155', padding: '4px 6px', borderRadius: '4px', background: '#f8fafc', cursor: 'pointer', textAlign: 'left' }}
                          >
                            • {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
