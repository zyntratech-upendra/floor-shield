import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ShieldCheck, ArrowRight, Check, Award, Compass, HelpCircle, ChevronDown } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { API_BASE } from '../admin/adminConstants';
import { faqs } from '../utils/siteData';

const melbourneSuburbs = [
  'Melbourne Metro', 'Camberwell', 'Knoxfield', 'Yarraville',
  'Dandenong', 'Richmond', 'Frankston', 'Geelong',
  'Mornington Peninsula', 'Werribee', 'Box Hill', 'Ringwood'
];

export default function ContactPage() {
  const { settings } = useSite();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    suburb: '',
    serviceType: 'APC Ultra Flake® Seamless Garage System',
    areaApproxSqm: '50',
    conditionNotes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);

  const phonePrimary = settings.phone || '0489 074 340';
  const emailPrimary = settings.email || 'floorshieldptyltd@gmail.com';
  const abn = settings.abn || '75 688 496 166';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    try {
      const res = await fetch(`${API_BASE}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to submit inquiry. Please call us directly.');
      }
    } catch {
      setErrorMessage(`Connection failed. Please call ${phonePrimary} directly.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Header */}
      <section className="landing-hero" style={{ paddingBottom: '36px' }}>
        <div className="container landing-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="landing-hero-copy"
            style={{ maxWidth: '820px' }}
          >
            <span className="badge badge-orange">DIRECT CONTACT &amp; ESTIMATES</span>
            <h1>Get in touch with Melbourne's premier epoxy &amp; concrete coating specialists.</h1>
            <p>
              From residential double-garage flake transformations to heavy-duty industrial polyaspartic coatings, Floor Shield Pty Ltd provides free on-site inspections, $0 deposit bookings, and transparent fixed-price quotes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content: Info & Form */}
      <section className="landing-section" style={{ paddingTop: '10px', paddingBottom: '40px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'start'
          }}>
            {/* Left: Direct Contact Cards & Interactive Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span className="badge badge-orange" style={{ padding: '3px 10px', fontSize: '0.72rem' }}>
                    MELBOURNE &amp; VICTORIA WIDE
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                  Floor Shield Pty Ltd
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, marginBottom: '22px' }}>
                  Specialist resin applicators servicing Melbourne metropolitan and regional Victoria. Mechanical diamond grinding, commercial slip rating, and rapid 2-day installations.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Phone Primary */}
                  <a
                    href={`tel:${phonePrimary.replace(/\s+/g, '')}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      textDecoration: 'none', color: '#0f172a',
                      padding: '14px', borderRadius: '12px',
                      backgroundColor: '#fff7ed', border: '1.5px solid #fed7aa',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                      <Phone size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Call Direct / SMS
                      </div>
                      <div style={{ fontSize: '1.08rem', fontWeight: '800', color: '#0f172a' }}>
                        {phonePrimary}
                      </div>
                    </div>
                  </a>

                  {/* Secondary Phone if available */}
                  <a
                    href="tel:0483926308"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      textDecoration: 'none', color: '#0f172a',
                      padding: '12px 14px', borderRadius: '10px',
                      backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                      <Phone size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                        Alternative Estimator Line
                      </div>
                      <div style={{ fontSize: '0.96rem', fontWeight: '700', color: '#0f172a' }}>
                        0483 926 308
                      </div>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${emailPrimary}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      textDecoration: 'none', color: '#0f172a',
                      padding: '12px 14px', borderRadius: '10px',
                      backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                        Direct Quotes &amp; Plans Email
                      </div>
                      <div style={{ fontSize: '0.94rem', fontWeight: '700', color: '#0f172a' }}>
                        {emailPrimary}
                      </div>
                    </div>
                  </a>

                  {/* Address & Operational Areas */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '12px 14px', borderRadius: '10px',
                    backgroundColor: '#f8fafc', border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                        Service Region &amp; Office
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>
                        Melbourne VIC 3000
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                        Victoria, Australia
                      </div>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '12px 14px', borderRadius: '10px',
                    backgroundColor: '#f8fafc', border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                      <Clock size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                        Operating Hours
                      </div>
                      <div style={{ fontSize: '0.86rem', fontWeight: '600', color: '#0f172a' }}>
                        Monday – Saturday: 7:00 AM – 6:00 PM AEST
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '700' }}>
                        Emergency &amp; Weekend Commercial Turnarounds Available
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Areas Coverage Chips */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Compass size={18} color="#ea580c" />
                  <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    Active Melbourne Service Hubs
                  </h4>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '14px', lineHeight: 1.4 }}>
                  Our fully equipped mobile rigs travel directly to your site across Greater Melbourne:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {melbourneSuburbs.map((sub, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '5px 12px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        color: '#334155',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Warranty badge card */}
              <div style={{
                backgroundColor: '#0f172a',
                color: '#fff',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <ShieldCheck size={36} color="#ea580c" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.98rem', fontWeight: '800', marginBottom: '4px' }}>
                    $0 Deposit &amp; 10-Year Warranty
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.45 }}>
                    Pay nothing until your job is complete and inspected. Backed by certified APC manufacturer adhesion guarantees.
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Interactive Message & Quote Form */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '32px',
              boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)'
            }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    backgroundColor: '#f0fdf4', border: '2px solid #bbf7d0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 18px', color: '#16a34a'
                  }}>
                    <CheckCircle2 size={34} />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                    Inquiry Received!
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 24px' }}>
                    Thank you, <strong>{form.name}</strong>. A Floor Shield senior estimator will review your slab details and reach out within 2 hours with pricing and availability.
                  </p>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: '', email: '', phone: '', suburb: '',
                        serviceType: 'APC Ultra Flake® Seamless Garage System', areaApproxSqm: '50', conditionNotes: ''
                      });
                    }}
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                      Request a Free Quote &amp; Specification
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                      Complete the details below or call <strong>{phonePrimary}</strong> for immediate booking assistance.
                    </p>
                  </div>

                  {errorMessage && (
                    <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.85rem' }}>
                      {errorMessage}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. David Miller"
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 0400 123 456"
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="e.g. david@example.com.au"
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                        Job Suburb / Postcode
                      </label>
                      <input
                        type="text"
                        name="suburb"
                        value={form.suburb}
                        onChange={handleChange}
                        placeholder="e.g. Camberwell, VIC 3124"
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                        Flooring System Interest
                      </label>
                      <select
                        name="serviceType"
                        value={form.serviceType}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', backgroundColor: '#ffffff' }}
                      >
                        <option value="APC Ultra Flake® Seamless Garage System">APC Ultra Flake® Garage System (From $2,499)</option>
                        <option value="Hyper Flake® Stone Finish">Hyper Flake® Polished Stone Look</option>
                        <option value="EPO100T® Plain Industrial Epoxy">EPO100T® Heavy Industrial Plain Epoxy</option>
                        <option value="Sparta-Guard® Fast-Cure Polyaspartic">Sparta-Guard® Rapid 1-Day Polyaspartic</option>
                        <option value="Commercial Kitchen Resin Floor (HACCP)">Commercial Kitchen Resin Floor (HACCP Non-Slip)</option>
                        <option value="Concrete Diamond Grinding & Mechanical Prep">Concrete Diamond Grinding &amp; Surface Prep</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                        Approximate Floor Area (m²)
                      </label>
                      <input
                        type="number"
                        name="areaApproxSqm"
                        value={form.areaApproxSqm}
                        onChange={handleChange}
                        min="1"
                        placeholder="50"
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Project Scope &amp; Slab Details
                    </label>
                    <textarea
                      rows={4}
                      name="conditionNotes"
                      value={form.conditionNotes}
                      onChange={handleChange}
                      placeholder="e.g. Double garage, bare concrete with some surface oil stains, ready within 2 weeks..."
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '6px', fontSize: '0.96rem' }}
                  >
                    <Send size={16} />
                    <span>{submitting ? 'Submitting Inquiry...' : 'Submit Quote Request'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section style={{ padding: '70px 0 80px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '36px' }}
          >
            <span className="badge badge-orange">TECHNICAL QUESTIONS ANSWERED</span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '10px', marginBottom: '12px', color: '#0f172a', fontWeight: '850' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.94rem', margin: 0, maxWidth: '640px', marginInline: 'auto' }}>
              Everything you need to know about surface preparation, resin chemistry, tyre resistance, warranties, and turnaround times.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = activeFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  style={{
                    backgroundColor: isOpen ? '#fff7ed' : '#f8fafc',
                    border: isOpen ? '2px solid #ea580c' : '1px solid #cbd5e1',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    boxShadow: isOpen ? '0 4px 14px rgba(234, 88, 12, 0.08)' : 'none'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '18px 22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      background: 'none',
                      color: '#0f172a',
                      fontWeight: '800',
                      fontSize: '1rem',
                      gap: '16px',
                      cursor: 'pointer',
                      border: 0
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <HelpCircle size={19} color={isOpen ? '#ea580c' : '#64748b'} style={{ flexShrink: 0 }} />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown 
                      size={18} 
                      color={isOpen ? '#ea580c' : '#64748b'}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0
                      }}
                    />
                  </button>

                  {isOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        padding: '0 22px 20px 52px',
                        color: '#334155',
                        fontSize: '0.92rem',
                        lineHeight: 1.65,
                        borderTop: '1px solid #ffedd5',
                        paddingTop: '12px'
                      }}
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Embedded Melbourne Victoria Map Section */}
      <section style={{ backgroundColor: '#f8fafc', padding: '50px 0 60px', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 28px' }}>
            <span className="landing-eyebrow">OUR SERVICE FOOTPRINT</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: '6px 0 10px' }}>
              Servicing All of Greater Melbourne &amp; VIC
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              We bring commercial-grade machinery and certified Australian-made coatings directly to your residential or commercial site.
            </p>
          </div>

          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid #e2e8f0',
            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
            position: 'relative',
            backgroundColor: '#ffffff'
          }}>
            <iframe
              title="Floor Shield Victoria Service Area Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d805170.0496601658!2d145.05313529999998!3d-37.9725665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad646b5d2ba4df7%3A0x4045675218ccd90!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sin!4v1792664582690!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            
            {/* Overlay Info Card on Map */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              color: '#ffffff',
              padding: '16px 20px',
              borderRadius: '12px',
              maxWidth: '340px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="#ea580c" />
                <span style={{ fontWeight: '800', fontSize: '0.94rem' }}>Floor Shield Pty Ltd</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                Melbourne, Victoria &amp; Surrounds
              </div>
              <a
                href={`tel:${phonePrimary.replace(/\s+/g, '')}`}
                style={{
                  color: '#ea580c',
                  fontWeight: '700',
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '4px'
                }}
              >
                <Phone size={14} />
                <span>{phonePrimary}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
