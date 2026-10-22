import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function Footer() {
  const { settings } = useSite();
  const navigate = useNavigate();

  return (
      <footer style={{
        backgroundColor: '#0f172a',
        color: '#ffffff',
        borderTop: '3px solid #ea580c',
        padding: '60px 0 30px'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            {/* Col 1: Brand Info & Logo */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img 
                  src="/logo.png" 
                  alt="Floor Shield Australia" 
                  style={{
                    height: '44px',
                    width: 'auto',
                    objectFit: 'contain',
                    backgroundColor: '#ffffff',
                    padding: '4px',
                    borderRadius: '6px'
                  }} 
                />
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.25rem', color: '#ffffff' }}>
                  FLOOR SHIELD AU
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '20px' }}>
                Australia's premier installer of heavy-duty All Purpose Coatings (APC) resin, industrial polyaspartic coatings, and polished concrete. Guaranteed slip compliant.
              </p>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                ABN: {settings.abn}
              </div>
            </div>

            {/* Col 2: APC Systems Quick Links */}
            <div>
              <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                APC Systems Portfolio
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <li><a href="#products" onClick={(e) => { e.preventDefault(); navigate('/products'); }} style={{ color: '#94a3b8' }}>Ultra Flake® System</a></li>
                <li><a href="#products" onClick={(e) => { e.preventDefault(); navigate('/products'); }} style={{ color: '#94a3b8' }}>Hyper Flake® Stone Finish</a></li>
                <li><a href="#products" onClick={(e) => { e.preventDefault(); navigate('/products'); }} style={{ color: '#94a3b8' }}>EPO100T® Plain Coat Epoxy</a></li>
                <li><a href="#products" onClick={(e) => { e.preventDefault(); navigate('/products'); }} style={{ color: '#94a3b8' }}>Quartz Shield® Heavy Industrial</a></li>
                <li><a href="#products" onClick={(e) => { e.preventDefault(); navigate('/products'); }} style={{ color: '#94a3b8' }}>Sparta-Guard® Polyaspartic</a></li>
              </ul>
            </div>

            {/* Col 3: Direct Contact */}
            <div>
              <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Direct Contact
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ea580c', fontWeight: '700' }}>
                  <Phone size={16} />
                  <span>{settings.phone}</span>
                </a>
                <a href={`mailto:${settings.email}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={16} />
                  <span>{settings.email}</span>
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
                  <MapPin size={16} />
                  <span>{settings.address}</span>
                </div>
              </div>
            </div>

            {/* Col 4: Standards Guarantee */}
            <div>
              <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Standards & Warranties
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '14px' }}>
                Full compliance with AS 4586 Slip Resistance Standards and All Purpose Coatings Australian manufacturer warranties.
              </p>
              <div className="badge badge-orange" style={{ width: '100%', justifyContent: 'center', padding: '8px' }}>
                10-YEAR MANUFACTURER WARRANTY
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8rem',
            color: '#64748b'
          }}>
            <div>
              © 2026 Floor Shield Australia. Featuring All Purpose Coatings (APC) industrial resin chemistries.
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="/admin/login" style={{ color: '#ea580c', fontWeight: '600', textDecoration: 'none' }}>
                Admin Portal
              </a>
              <Link to="/privacy-policy" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                Privacy Policy
              </Link>
              <Link to="/terms-and-conditions" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
  );
}
