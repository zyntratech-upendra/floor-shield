import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Phone, Mail, CheckCircle2, ArrowRight, ShieldCheck, 
  Clock, MapPin, Award, ChevronDown, ChevronRight, 
  Sparkles, Layers, FileText, Check, HelpCircle
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(0);

  // Quote Quick Form State
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    suburb: '',
    areaApproxSqm: '',
    conditionNotes: ''
  });
  const [quoteSent, setQuoteSent] = useState(false);
  const [submittingQuote, setSubmittingQuote] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const [resService, resList] = await Promise.all([
          fetch(`${API_BASE}/services/${slug}`).then(r => r.json()).catch(() => null),
          fetch(`${API_BASE}/services`).then(r => r.json()).catch(() => [])
        ]);

        if (resService && !resService.error) {
          setService(resService);
        }
        if (Array.isArray(resList)) {
          setAllServices(resList);
        }
      } catch (err) {
        console.error('Failed fetching service:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [slug]);

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setSubmittingQuote(true);
    try {
      const res = await fetch(`${API_BASE}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quoteForm,
          serviceType: service?.title || slug
        })
      });
      const data = await res.json();
      if (data.success) {
        setQuoteSent(true);
        setQuoteForm({ name: '', email: '', phone: '', suburb: '', areaApproxSqm: '', conditionNotes: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingQuote(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid #e2e8f0', borderTopColor: '#ea580c', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontWeight: '600' }}>Loading Service Details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '24px', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>Service Not Found</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>The requested flooring system could not be located or may have been updated.</p>
          <Link to="/" style={{ padding: '12px 24px', backgroundColor: '#ea580c', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: '700' }}>Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#1e293b', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      
      {/* ── TOP HEADER / NAVBAR ── */}
      <header style={{ height: '76px', backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/logo.png" alt="Floor Shield" style={{ height: '46px', objectFit: 'contain' }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#475569', fontWeight: '600', fontSize: '0.9rem' }}>Home</Link>
          <a href="#quote-section" style={{ padding: '10px 20px', backgroundColor: '#ea580c', color: '#ffffff', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(234,88,12,0.25)' }}>
            Get Free Quote
          </a>
        </div>
      </header>

      {/* ── HERO BANNER (Safecoat Style) ── */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #090d16 0%, #0f172a 65%, #1e1528 100%)',
        color: '#ffffff',
        padding: '70px 24px 80px',
        overflow: 'hidden'
      }}>
        {/* Background ambient lighting */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,88,12,0.22) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '20px' }}>
            <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <span>Services</span>
            <span>›</span>
            <span style={{ color: '#ea580c', fontWeight: '600' }}>{service.title}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '48px', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', backgroundColor: 'rgba(234,88,12,0.18)', color: '#fb923c', border: '1px solid rgba(234,88,12,0.3)', padding: '5px 14px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
                {service.category || 'Commercial Concrete Specialists'}
              </span>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '2.75rem', fontWeight: '900', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '20px' }}>
                {service.title}
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '32px' }}>
                {service.shortDesc}
              </p>

              {/* Quick Trust Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#f1f5f9', fontWeight: '600' }}>
                  <ShieldCheck size={18} color="#22c55e" /> 10-Year Warranty
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#f1f5f9', fontWeight: '600' }}>
                  <Award size={18} color="#f59e0b" /> AS 4586 Certified
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#f1f5f9', fontWeight: '600' }}>
                  <Clock size={18} color="#38bdf8" /> Fast Return to Service
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a href="#quote-section" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', backgroundColor: '#ea580c', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '0.95rem', boxShadow: '0 4px 18px rgba(234,88,12,0.45)' }}>
                  Request Free On-Site Quote <ArrowRight size={17} />
                </a>
                <a href="tel:1800231907" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 24px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem' }}>
                  <Phone size={17} /> Call 1800 231 907
                </a>
              </div>
            </div>

            {/* Hero Main Image */}
            <div style={{ position: 'relative' }}>
              <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.1)', height: '380px' }}>
                <img src={service.image || '/images/epoxy-flake-garage.jpg'} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '-15px', right: '20px', backgroundColor: '#ffffff', color: '#0f172a', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', fontWeight: '800', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#ea580c' }}>Starting From</span>
                <span style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '900' }}>{service.priceStarting || '$35/m²'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT & SIDEBAR GRID (Safecoat 2-Column Standard) ── */}
      <section style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '48px', alignItems: 'start' }}>
          
          {/* LEFT: DETAILED SPECIFICATIONS & CONTENT */}
          <div>
            {/* Overview Section */}
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
                About This Flooring Solution
              </h2>
              <div style={{ height: '4px', width: '56px', backgroundColor: '#ea580c', borderRadius: '2px', marginBottom: '20px' }} />
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#475569', marginBottom: '20px' }}>
                {service.fullDesc || service.shortDesc}
              </p>
            </div>

            {/* ── PROJECT GALLERY (Multi-Image Showcase from Cloudinary) ── */}
            {service.gallery && service.gallery.length > 0 && (
              <div style={{ marginBottom: '48px' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                  System Installation Showcase & Project Gallery
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '18px' }}>
                  Real finished floors, surface preparation, and seamless finishes installed across Melbourne sites.
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '16px'
                }}>
                  {service.gallery.map((imgUrl, gIdx) => (
                    <div
                      key={gIdx}
                      style={{
                        position: 'relative', height: '190px', borderRadius: '14px',
                        overflow: 'hidden', border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 14px rgba(15,23,42,0.06)'
                      }}
                    >
                      <img
                        src={imgUrl}
                        alt={`${service.title} project ${gIdx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features Bullet List */}
            {service.features && service.features.length > 0 && (
              <div style={{ marginBottom: '48px', backgroundColor: '#f8fafc', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '18px' }}>
                  Key System Performance Features
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {service.features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <CheckCircle2 size={18} color="#ea580c" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '0.92rem', color: '#334155', fontWeight: '600' }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Applications List */}
            {service.applications && service.applications.length > 0 && (
              <div style={{ marginBottom: '48px' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '18px' }}>
                  Ideal Commercial & Industrial Applications
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {service.applications.map((app, i) => (
                    <span key={i} style={{ backgroundColor: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5', padding: '8px 16px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '700' }}>
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Installation Process Steps */}
            {service.processSteps && service.processSteps.length > 0 && (
              <div style={{ marginBottom: '48px' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '24px' }}>
                  Our Certified Installation Process
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {service.processSteps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '18px', padding: '20px', borderRadius: '12px', border: '1px solid #f1f5f9', backgroundColor: '#fafafa' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ea580c', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem', flexShrink: 0 }}>
                        {step.stepNumber || idx + 1}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>{step.title}</h4>
                        <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why Choose Floor Shield / Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <div style={{ marginBottom: '48px' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                  Why Safecoat & Floor Shield Standards Matter
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {service.benefits.map((b, i) => (
                    <div key={i} style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                      <div style={{ color: '#ea580c', fontWeight: '800', fontSize: '0.98rem', marginBottom: '8px' }}>{b.title}</div>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>{b.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Accordion */}
            {service.faqs && service.faqs.length > 0 && (
              <div style={{ marginBottom: '48px' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                  Frequently Asked Questions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {service.faqs.map((faq, i) => {
                    const isOpen = activeFaq === i;
                    return (
                      <div key={i} style={{ borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <button onClick={() => setActiveFaq(isOpen ? -1 : i)} style={{ width: '100%', padding: '16px 20px', backgroundColor: isOpen ? '#fff7ed' : '#ffffff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.92rem', color: isOpen ? '#ea580c' : '#0f172a' }}>{faq.question}</span>
                          <ChevronDown size={18} color={isOpen ? '#ea580c' : '#94a3b8'} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                        </button>
                        {isOpen && (
                          <div style={{ padding: '16px 20px', backgroundColor: '#ffffff', color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, borderTop: '1px solid #fee2e2' }}>
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR (Sticky Quick Quote + All Services Navigation) */}
          <div style={{ position: 'sticky', top: '96px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Quick Quote Form Card */}
            <div id="quote-section" style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 8px 30px rgba(15,23,42,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Instant Quote Request</h3>
                  <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: '700' }}>✓ 2-Hour Response Time</span>
                </div>
              </div>

              {quoteSent ? (
                <div style={{ padding: '24px 16px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                  <CheckCircle2 size={36} color="#16a34a" style={{ margin: '0 auto 10px' }} />
                  <h4 style={{ color: '#166534', fontWeight: '800', fontSize: '1rem', marginBottom: '6px' }}>Request Received!</h4>
                  <p style={{ color: '#15803d', fontSize: '0.82rem', margin: 0 }}>Our estimator will call you with a detailed quote estimate.</p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Your Name *</label>
                    <input type="text" required value={quoteForm.name} onChange={e => setQuoteForm({...quoteForm, name: e.target.value})} placeholder="e.g. Michael Smith" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.88rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Phone Number *</label>
                    <input type="tel" required value={quoteForm.phone} onChange={e => setQuoteForm({...quoteForm, phone: e.target.value})} placeholder="0400 000 000" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.88rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Email Address *</label>
                    <input type="email" required value={quoteForm.email} onChange={e => setQuoteForm({...quoteForm, email: e.target.value})} placeholder="name@company.com" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.88rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Suburb / Location</label>
                    <input type="text" value={quoteForm.suburb} onChange={e => setQuoteForm({...quoteForm, suburb: e.target.value})} placeholder="e.g. Clayton, VIC" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.88rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Approx Area (sqm)</label>
                    <input type="number" value={quoteForm.areaApproxSqm} onChange={e => setQuoteForm({...quoteForm, areaApproxSqm: e.target.value})} placeholder="e.g. 150" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.88rem' }} />
                  </div>
                  <button type="submit" disabled={submittingQuote} style={{ marginTop: '6px', width: '100%', padding: '12px', backgroundColor: '#ea580c', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '0.92rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(234,88,12,0.35)' }}>
                    {submittingQuote ? 'Submitting...' : 'Get Free Quote Estimate'}
                  </button>
                </form>
              )}
            </div>

            {/* Other Services Navigation List */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>All Flooring Services</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {allServices.map(s => {
                  const isCurrent = s.slug === slug || s.id === slug;
                  return (
                    <Link
                      key={s.slug || s.id}
                      to={`/services/${s.slug || s.id}`}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', borderRadius: '8px',
                        textDecoration: 'none',
                        backgroundColor: isCurrent ? '#fff7ed' : 'transparent',
                        color: isCurrent ? '#ea580c' : '#475569',
                        fontWeight: isCurrent ? '700' : '500',
                        fontSize: '0.85rem',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span>{s.title}</span>
                      <ChevronRight size={14} color={isCurrent ? '#ea580c' : '#cbd5e1'} />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Direct Phone Assistance */}
            <div style={{ padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: '#fff', textAlign: 'center' }}>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 6px' }}>Need immediate technical advice?</p>
              <a href="tel:1800231907" style={{ color: '#fff', fontSize: '1.25rem', fontWeight: '900', textDecoration: 'none', display: 'block', letterSpacing: '-0.02em' }}>1800 231 907</a>
              <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: '700', marginTop: '4px', display: 'block' }}>● Melbourne Estimators Available</span>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: '#090d16', color: '#94a3b8', padding: '40px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.85rem' }}>
        <p>© 2026 Floor Shield Australia. All Rights Reserved. Engineered with All Purpose Coatings certified chemistries.</p>
      </footer>
    </div>
  );
}
