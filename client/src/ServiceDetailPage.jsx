import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, Mail, CheckCircle2, ArrowRight, ShieldCheck, 
  Clock, MapPin, Award, ChevronDown, ChevronRight, 
  Sparkles, Layers, FileText, Check, HelpCircle,
  Flame, CheckCircle, Calculator, Droplets, Hammer, Star
} from 'lucide-react';
import { API_BASE } from './utils/constants';
import { useSite } from './context/SiteContext';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { settings, quoteForm: globalQuoteForm, setQuoteForm: setGlobalQuoteForm } = useSite();

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
    areaApproxSqm: '50',
    conditionNotes: ''
  });
  const [quoteSent, setQuoteSent] = useState(false);
  const [submittingQuote, setSubmittingQuote] = useState(false);

  const phonePrimary = settings?.phone || '0489 074 340';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        setQuoteForm({ name: '', email: '', phone: '', suburb: '', areaApproxSqm: '50', conditionNotes: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingQuote(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', border: '3.5px solid #fed7aa', borderTopColor: '#ea580c', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#0f172a', fontWeight: '800', fontSize: '1rem' }}>Loading Flooring System Specifications…</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', backgroundColor: '#fff', padding: '36px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>System Not Found</h2>
          <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '0.92rem', lineHeight: 1.5 }}>The requested flooring specification could not be located. Explore our certified systems catalog.</p>
          <Link to="/services" className="btn-primary" style={{ display: 'inline-flex', padding: '12px 24px', borderRadius: '9999px' }}>
            Explore All Flooring Systems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>
      
      {/* ── 1. CINEMATIC HERO BANNER WITH GRADIENT & AMBIENT GLOW ── */}
      <section style={{
        position: 'relative',
        background: 'radial-gradient(ellipse at top left, #1e293b 0%, #0f172a 60%, #090d16 100%)',
        color: '#ffffff',
        padding: '50px 0 70px',
        overflow: 'hidden',
        borderBottom: '3px solid #ea580c'
      }}>
        {/* Ambient Glows */}
        <div style={{ position: 'absolute', top: '-140px', right: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,88,12,0.25) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '10%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Breadcrumb Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#94a3b8', marginBottom: '24px', flexWrap: 'wrap' }}
          >
            <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} color="#64748b" />
            <Link to="/services" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Services</Link>
            <ChevronRight size={14} color="#64748b" />
            <span style={{ color: '#ea580c', fontWeight: '700' }}>{service.title}</span>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}>
            {/* Left Copy Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span className="badge badge-orange" style={{ padding: '4px 12px', fontSize: '0.74rem' }}>
                  {service.category || 'COMMERCIAL RESIN SPECIALISTS'}
                </span>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#f1f5f9', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.74rem', fontWeight: '700' }}>
                  APC CERTIFIED INSTALLATION
                </span>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: '900',
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                marginBottom: '18px',
                color: '#ffffff'
              }}>
                {service.title}
              </h1>

              <p style={{
                fontSize: '1.05rem',
                color: '#cbd5e1',
                lineHeight: 1.65,
                marginBottom: '28px',
                maxWidth: '620px'
              }}>
                {service.shortDesc}
              </p>

              {/* Trust Value Pillars */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '14px',
                marginBottom: '32px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={22} color="#ea580c" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Warranty</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#ffffff' }}>10-Year Coverage</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={22} color="#38bdf8" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Turnaround</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#ffffff' }}>2-Day Rapid Cure</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Award size={22} color="#eab308" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Australian Std</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#ffffff' }}>AS 4586 Certified</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href="#quote-section"
                  className="btn-primary"
                  style={{ padding: '13px 26px', fontSize: '0.95rem' }}
                >
                  <span>Request Free On-Site Quote</span>
                  <ArrowRight size={16} />
                </a>
                <a
                  href={`tel:${phonePrimary.replace(/\s+/g, '')}`}
                  className="btn-secondary"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    padding: '13px 22px',
                    fontSize: '0.95rem'
                  }}
                >
                  <Phone size={16} color="#ea580c" />
                  <span>Call {phonePrimary}</span>
                </a>
              </div>
            </motion.div>

            {/* Right Hero Image Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{ position: 'relative' }}
            >
              <div style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.12)',
                boxShadow: '0 25px 60px -12px rgba(0,0,0,0.6)',
                height: '380px',
                position: 'relative'
              }}>
                <img
                  src={service.image || '/images/epoxy-flake-garage.jpg'}
                  alt={service.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15,23,42,0.75) 0%, transparent 50%)'
                }} />
                
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    backdropFilter: 'blur(8px)',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '0.82rem',
                    color: '#f1f5f9',
                    fontWeight: '700'
                  }}>
                    {service.brand || 'All Purpose Coatings (APC)'}
                  </div>
                  <div style={{
                    backgroundColor: '#ea580c',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '900',
                    fontSize: '0.98rem',
                    boxShadow: '0 4px 14px rgba(234,88,12,0.4)'
                  }}>
                    {service.priceStarting || 'From $2,499'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* ── 3. MAIN SPECIFICATIONS & SIDEBAR GRID ── */}
      <section className="landing-section" style={{ paddingTop: '40px', paddingBottom: '70px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'start'
          }}>

            {/* LEFT: DETAILED SYSTEM SPECS & WORKFLOW */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

              {/* A. System Overview Card */}
              <div id="specs" style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '18px',
                padding: '32px',
                boxShadow: '0 4px 20px rgba(15,23,42,0.03)'
              }}>
                <span className="landing-eyebrow">AUSTRALIAN RESIN FORMULATION</span>
                <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a', margin: '6px 0 16px' }}>
                  System Architecture &amp; Performance
                </h2>
                <div style={{ height: '3.5px', width: '54px', backgroundColor: '#ea580c', borderRadius: '2px', marginBottom: '20px' }} />
                
                <p style={{ fontSize: '1.02rem', lineHeight: 1.75, color: '#475569', marginBottom: '24px' }}>
                  {service.fullDesc || service.shortDesc}
                </p>

                {/* Key Benefits Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  marginTop: '20px'
                }}>
                  <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ea580c', fontWeight: '800', fontSize: '0.94rem', marginBottom: '6px' }}>
                      <Flame size={18} /> Zero Hot Tire Pickup
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                      Chemically cross-linked cycloaliphatic epoxy locks permanently into the diamond-ground slab.
                    </p>
                  </div>

                  <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: '800', fontSize: '0.94rem', marginBottom: '6px' }}>
                      <Sparkles size={18} /> Non-Yellowing Polyaspartic
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                      UV-stable dual clear topcoats maintain showroom crystal clarity even in open sunlit bays.
                    </p>
                  </div>
                </div>
              </div>

              {/* B. Gallery Showcase */}
              {service.gallery && service.gallery.length > 0 && (
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '18px',
                  padding: '32px',
                  boxShadow: '0 4px 20px rgba(15,23,42,0.03)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <span className="landing-eyebrow">VISUAL PROOF</span>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '4px 0 0' }}>
                        Finished Floors &amp; Project Showcase
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: '800', backgroundColor: '#fff7ed', padding: '4px 10px', borderRadius: '6px' }}>
                      {service.gallery.length} PHOTOS
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '14px'
                  }}>
                    {service.gallery.map((imgUrl, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.03 }}
                        style={{
                          height: '160px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 12px rgba(15,23,42,0.05)',
                          position: 'relative'
                        }}
                      >
                        <img
                          src={imgUrl}
                          alt={`${service.title} proof ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* C. Features List */}
              {service.features && service.features.length > 0 && (
                <div id="features" style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '18px',
                  padding: '32px',
                  boxShadow: '0 4px 20px rgba(15,23,42,0.03)'
                }}>
                  <span className="landing-eyebrow">CERTIFIED CRITERIA</span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '4px 0 20px' }}>
                    Engineered Features &amp; Slip Ratings
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                    {service.features.map((feat, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        <CheckCircle2 size={18} color="#ea580c" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#334155' }}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>

                  {service.applications && service.applications.length > 0 && (
                    <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', marginBottom: '10px' }}>
                        Ideal Site Applications:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {service.applications.map((app, i) => (
                          <span
                            key={i}
                            style={{
                              backgroundColor: '#fff7ed',
                              color: '#ea580c',
                              border: '1px solid #fed7aa',
                              padding: '5px 12px',
                              borderRadius: '20px',
                              fontSize: '0.78rem',
                              fontWeight: '700'
                            }}
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* D. Process Steps */}
              {service.processSteps && service.processSteps.length > 0 && (
                <div id="process" style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '18px',
                  padding: '32px',
                  boxShadow: '0 4px 20px rgba(15,23,42,0.03)'
                }}>
                  <span className="landing-eyebrow">STEP-BY-STEP METHODOLOGY</span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '4px 0 20px' }}>
                    Certified Installation Process
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {service.processSteps.map((step, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          gap: '18px',
                          padding: '18px',
                          borderRadius: '12px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          backgroundColor: '#ea580c',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '900',
                          fontSize: '1.05rem',
                          flexShrink: 0
                        }}>
                          {step.stepNumber || idx + 1}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>
                            {step.title}
                          </h4>
                          <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* E. FAQ Accordion */}
              {service.faqs && service.faqs.length > 0 && (
                <div id="faqs" style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '18px',
                  padding: '32px',
                  boxShadow: '0 4px 20px rgba(15,23,42,0.03)'
                }}>
                  <span className="landing-eyebrow">FREQUENTLY ASKED QUESTIONS</span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '4px 0 20px' }}>
                    Common Questions About {service.title}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {service.faqs.map((faq, i) => {
                      const isOpen = activeFaq === i;
                      return (
                        <div
                          key={i}
                          style={{
                            borderRadius: '10px',
                            border: isOpen ? '1.5px solid #ea580c' : '1px solid #e2e8f0',
                            overflow: 'hidden',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <button
                            onClick={() => setActiveFaq(isOpen ? -1 : i)}
                            style={{
                              width: '100%',
                              padding: '16px 20px',
                              backgroundColor: isOpen ? '#fff7ed' : '#ffffff',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <span style={{ fontWeight: '800', fontSize: '0.92rem', color: isOpen ? '#ea580c' : '#0f172a' }}>
                              {faq.question}
                            </span>
                            <ChevronDown
                              size={18}
                              color={isOpen ? '#ea580c' : '#94a3b8'}
                              style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }}
                            />
                          </button>
                          {isOpen && (
                            <div style={{ padding: '16px 20px', backgroundColor: '#ffffff', color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, borderTop: '1px solid #fed7aa' }}>
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

            {/* RIGHT SIDEBAR (Interactive Quote Estimator & Service Navigation) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '100px' }}>

              {/* Instant Quote Request Form Card */}
              <div id="quote-section" style={{
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                border: '1.5px solid #e2e8f0',
                padding: '28px',
                boxShadow: '0 10px 30px rgba(15,23,42,0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c', flexShrink: 0 }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      Quick Quote Request
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: '800' }}>
                      ● 2-Hour Response Time Guaranteed
                    </span>
                  </div>
                </div>

                {quoteSent ? (
                  <div style={{ padding: '24px 16px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                    <CheckCircle2 size={38} color="#16a34a" style={{ margin: '0 auto 10px' }} />
                    <h4 style={{ color: '#166534', fontWeight: '800', fontSize: '1.05rem', marginBottom: '6px' }}>Request Received!</h4>
                    <p style={{ color: '#15803d', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 16px' }}>
                      A Floor Shield estimator will call you with a tailored price guide.
                    </p>
                    <button
                      className="btn-primary"
                      onClick={() => setQuoteSent(false)}
                      style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                    >
                      New Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Your Name *</label>
                      <input type="text" required value={quoteForm.name} onChange={e => setQuoteForm({...quoteForm, name: e.target.value})} placeholder="e.g. David Miller" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.88rem', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Phone Number *</label>
                      <input type="tel" required value={quoteForm.phone} onChange={e => setQuoteForm({...quoteForm, phone: e.target.value})} placeholder="0400 000 000" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.88rem', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Email Address *</label>
                      <input type="email" required value={quoteForm.email} onChange={e => setQuoteForm({...quoteForm, email: e.target.value})} placeholder="david@example.com.au" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.88rem', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Suburb / Postcode</label>
                      <input type="text" value={quoteForm.suburb} onChange={e => setQuoteForm({...quoteForm, suburb: e.target.value})} placeholder="e.g. Melbourne VIC 3000" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.88rem', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Approx Area (m²)</label>
                      <input type="number" min="1" value={quoteForm.areaApproxSqm} onChange={e => setQuoteForm({...quoteForm, areaApproxSqm: e.target.value})} placeholder="50" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.88rem', outline: 'none' }} />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingQuote}
                      className="btn-primary"
                      style={{ marginTop: '6px', width: '100%', justifyContent: 'center', padding: '12px' }}
                    >
                      {submittingQuote ? 'Submitting…' : 'Get Free Quote Estimate'}
                    </button>
                  </form>
                )}
              </div>

              {/* Direct Calling Emergency & Estimator Hotline */}
              <div style={{
                padding: '22px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                color: '#fff',
                textAlign: 'center',
                boxShadow: '0 8px 25px rgba(15,23,42,0.1)'
              }}>
                <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                  Speak Directly With an Applicator
                </div>
                <a
                  href={`tel:${phonePrimary.replace(/\s+/g, '')}`}
                  style={{ color: '#fff', fontSize: '1.35rem', fontWeight: '900', textDecoration: 'none', display: 'block', margin: '4px 0 6px' }}
                >
                  {phonePrimary}
                </a>
                <span style={{ fontSize: '0.74rem', color: '#22c55e', fontWeight: '700' }}>
                  ● Melbourne Estimators On-Call
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── 4. EXPLORE OTHER SPECIALIST SYSTEMS (Clean, Rich Grid Layout) ── */}
      <section style={{ backgroundColor: '#f8fafc', padding: '60px 0 70px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="landing-eyebrow">OUR RESIN SPECIFICATIONS</span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', margin: '4px 0 0' }}>
                Explore Other Specialist Systems
              </h2>
            </div>
            <Link
              to="/services"
              className="industry-card-link"
              style={{ fontSize: '0.88rem', fontWeight: '800' }}
            >
              <span>View All Systems Overview</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {allServices
              .filter(item => (item.slug || item.id) !== (service.slug || service.id))
              .slice(0, 4)
              .map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(`/services/${item.slug || item.id}`)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ea580c';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(234, 88, 12, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = '0 4px 18px rgba(15, 23, 42, 0.04)';
                  }}
                >
                  <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                    <img
                      src={item.image || '/images/epoxy-flake-garage.jpg'}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {item.category && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(15, 23, 42, 0.88)',
                        color: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        padding: '3px 9px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                      }}>
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px', lineHeight: 1.3 }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                        {item.shortDesc ? (item.shortDesc.slice(0, 95) + '…') : 'High-durability seamless concrete coating system.'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ea580c' }}>
                        View Details
                      </span>
                      <ArrowRight size={15} color="#ea580c" />
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* ── 5. BOTTOM VALUE CTA ── */}
      <section className="landing-cta">
        <div className="container landing-cta-inner">
          <div>
            <span className="landing-eyebrow">READY TO TRANSFORM YOUR FLOOR?</span>
            <h2>Book your free on-site measure &amp; estimate.</h2>
            <p>Melbourne Metro, Dandenong, Knoxfield, Camberwell &amp; Victoria Wide. Call <strong>{phonePrimary}</strong>.</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/contact')}>
            Contact Our Team <ArrowRight size={17} />
          </button>
        </div>
      </section>

    </div>
  );
}
