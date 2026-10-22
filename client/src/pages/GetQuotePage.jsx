import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  HelpCircle,
  Layers,
  Mail,
  MapPin,
  Phone,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { API_BASE } from '../admin/adminConstants';

const propertyTypes = [
  'Residential Garage / Workshop',
  'Commercial Facility / Factory',
  'Warehouse / Logistics Hub',
  'Retail Showroom / Office',
  'Commercial Kitchen / Food Prep',
  'Outdoor Patio / Driveway',
  'Other / Custom Space',
];

const flooringSystems = [
  'APC Ultra Flake® Seamless System (Most Popular)',
  'APC Hyper Flake® Polished Concrete Look',
  'EPO100T® High-Build Industrial Epoxy',
  'Quartz Shield® Heavy Industrial (P5 Non-Slip)',
  'Sparta-Guard® Fast 1-Day Polyaspartic',
  'Metallic Marble & Swirl Artistry',
  'Diamond Grinding & Clear Seal',
  'Unsure / Need Expert Advice',
];

const areaOptions = [
  { label: 'Under 35 m²', desc: 'Single Garage / Small Area', value: 30 },
  { label: '35 – 55 m²', desc: 'Double Garage / Standard Workshop', value: 50 },
  { label: '55 – 100 m²', desc: 'Triple Garage / Large Workshop', value: 80 },
  { label: '100 – 250 m²', desc: 'Commercial Facility / Showroom', value: 160 },
  { label: '250+ m²', desc: 'Industrial Warehouse / Factory', value: 350 },
];

const slabConditions = [
  'Bare Concrete (Good Condition)',
  'Stained with Motor Oil / Grease',
  'Cracked Slab / Spalled Expansion Joints',
  'Existing Paint or Failed DIY Sealer',
  'Newly Poured Concrete (< 28 Days Old)',
  'Unsure / Needs On-Site Inspection',
];

const timelines = [
  'Urgent — Ready Within Next 7 Days',
  'Within 2 to 4 Weeks',
  'Within 1 to 3 Months',
  'Flexible / Planning & Budgeting Stage',
];

export default function GetQuotePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { settings, quoteForm, setQuoteForm } = useSite();

  const queryService = searchParams.get('service') || searchParams.get('system') || '';
  const initialService = queryService 
    ? (flooringSystems.find(s => s.toLowerCase().includes(queryService.toLowerCase())) || queryService)
    : (quoteForm.serviceType || 'APC Ultra Flake® Seamless System (Most Popular)');

  const [form, setForm] = useState({
    name: quoteForm.name || '',
    phone: quoteForm.phone || '',
    email: quoteForm.email || '',
    suburb: quoteForm.suburb || '',
    propertyType: 'Residential Garage / Workshop',
    serviceType: initialService,
    areaApproxSqm: quoteForm.areaApproxSqm || 50,
    currentFloorState: quoteForm.currentFloorState || 'Bare Concrete (Good Condition)',
    preferredTimeline: 'Within 2 to 4 Weeks',
    conditionNotes: quoteForm.conditionNotes || '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [quoteReference, setQuoteReference] = useState('');

  const phonePrimary = settings?.phone || '0489 074 340';
  const cleanPhone = phonePrimary.replace(/\s+/g, '');
  const emailPrimary = settings?.email || 'floorshieldptyltd@gmail.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setErrorMessage('Please provide your name, phone number, and email address.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      // Build comprehensive notes for admin
      const combinedNotes = [
        `Property Type: ${form.propertyType}`,
        `Current Slab: ${form.currentFloorState}`,
        `Timeline: ${form.preferredTimeline}`,
        form.conditionNotes ? `Customer Notes: ${form.conditionNotes}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        suburb: form.suburb.trim() || 'Melbourne Metro',
        serviceType: form.serviceType,
        areaApproxSqm: Number(form.areaApproxSqm) || 50,
        conditionNotes: combinedNotes,
      };

      const res = await fetch(`${API_BASE}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && (data.success || data._id || data.quoteId)) {
        setSubmitted(true);
        setQuoteReference(data.quoteId || data.id || `FS-${Date.now().toString().slice(-6)}`);
        // update global context form state as well
        setQuoteForm((prev) => ({ ...prev, ...form }));
      } else {
        setErrorMessage(data.error || 'Failed to submit quote request. Please call us directly.');
      }
    } catch (err) {
      setErrorMessage(`Connection error. Please call ${phonePrimary} directly or try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="landing-page" style={{ backgroundColor: '#f8fafc', minHeight: '85vh', paddingBottom: '80px' }}>
      {/* ── 1. Hero Header ── */}
      <section className="landing-hero" style={{ padding: '48px 0 36px', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container landing-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="landing-hero-copy"
            style={{ maxWidth: '860px', marginInline: 'auto', textAlign: 'center' }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <span className="badge badge-orange" style={{ fontSize: '0.74rem' }}>
                FREE ON-SITE MEASURE &amp; QUOTE
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <BadgeCheck size={13} /> Melbourne Certified Applicators
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', background: '#fef3c7', color: '#b45309', padding: '3px 10px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={13} /> 10-Year Written Guarantee
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.025em', margin: '0 0 16px', lineHeight: 1.15 }}>
              Request a Free Fixed-Price Quote
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              Tell us about your space. Our senior Melbourne flooring estimator will review your concrete specifications and provide a clear, transparent proposal with zero hidden extras.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Form & Guarantees Layout ── */}
      <div className="container" style={{ maxWidth: '1180px', marginTop: '36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'start' }}>
          {/* ── Left Column: The Form Card ── */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 12px 36px rgba(15, 23, 42, 0.06)',
              padding: 'clamp(24px, 4vw, 40px)',
              gridColumn: 'span 2',
            }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '36px 16px' }}
              >
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>
                <span className="badge badge-orange" style={{ marginBottom: '10px' }}>
                  QUOTE INQUIRY RECEIVED
                </span>
                <h2 style={{ fontSize: '1.9rem', fontWeight: '850', color: '#0f172a', margin: '0 0 10px' }}>
                  Thank you, {form.name}!
                </h2>
                <p style={{ color: '#475569', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                  Your quote request has been transmitted directly to our Melbourne estimating team.
                  We will review your specifications and contact you at <strong>{form.phone}</strong> within 2 business hours.
                </p>

                {quoteReference && (
                  <div style={{ background: '#f8fafc', padding: '12px 20px', borderRadius: '10px', display: 'inline-block', border: '1px solid #e2e8f0', marginBottom: '28px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700' }}>Reference Code: </span>
                    <strong style={{ color: '#ea580c', fontSize: '0.92rem' }}>{quoteReference}</strong>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <Link to="/projects" className="btn-secondary">
                    View Completed Projects <ArrowRight size={16} />
                  </Link>
                  <a href={`tel:${cleanPhone}`} className="btn-primary" style={{ background: '#ea580c', borderColor: '#ea580c' }}>
                    <Phone size={16} /> Call {phonePrimary}
                  </a>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {/* Section 01: Contact Details */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ea580c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800' }}>
                      1
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      Your Contact Information
                    </h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Julian Thorne"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="e.g. 0489 074 340"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="e.g. julian@example.com.au"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                        Property Suburb / Postcode *
                      </label>
                      <input
                        type="text"
                        name="suburb"
                        required
                        value={form.suburb}
                        onChange={handleChange}
                        placeholder="e.g. Brighton, VIC 3186"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 02: Floor & Property Scope */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ea580c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800' }}>
                      2
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      Project Specifications &amp; Area
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {/* Property Type */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                        Type of Property
                      </label>
                      <select
                        name="propertyType"
                        value={form.propertyType}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
                      >
                        {propertyTypes.map((pt, idx) => (
                          <option key={idx} value={pt}>{pt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Flooring System */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                        Desired Flooring System
                      </label>
                      <select
                        name="serviceType"
                        value={form.serviceType}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
                      >
                        {flooringSystems.map((fs, idx) => (
                          <option key={idx} value={fs}>{fs}</option>
                        ))}
                      </select>
                    </div>

                    {/* Estimated Area Selector */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                        Approximate Floor Area
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px', marginBottom: '10px' }}>
                        {areaOptions.map((opt, idx) => {
                          const isSelected = Number(form.areaApproxSqm) === opt.value;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setForm((prev) => ({ ...prev, areaApproxSqm: opt.value }))}
                              style={{
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: isSelected ? '2px solid #ea580c' : '1px solid #cbd5e1',
                                background: isSelected ? '#fff7ed' : '#ffffff',
                                color: isSelected ? '#ea580c' : '#0f172a',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <div style={{ fontWeight: '800', fontSize: '0.88rem' }}>{opt.label}</div>
                              <div style={{ fontSize: '0.72rem', color: isSelected ? '#ea580c' : '#64748b' }}>{opt.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Or enter custom sqm:</span>
                        <input
                          type="number"
                          name="areaApproxSqm"
                          min="10"
                          max="5000"
                          value={form.areaApproxSqm}
                          onChange={handleChange}
                          style={{ width: '90px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                        />
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>m²</span>
                      </div>
                    </div>

                    {/* Substrate Condition & Timeline */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                          Current Concrete Slab State
                        </label>
                        <select
                          name="currentFloorState"
                          value={form.currentFloorState}
                          onChange={handleChange}
                          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', background: '#fff' }}
                        >
                          {slabConditions.map((sc, idx) => (
                            <option key={idx} value={sc}>{sc}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                          Preferred Timeline
                        </label>
                        <select
                          name="preferredTimeline"
                          value={form.preferredTimeline}
                          onChange={handleChange}
                          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', background: '#fff' }}
                        >
                          {timelines.map((tl, idx) => (
                            <option key={idx} value={tl}>{tl}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 03: Notes */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ea580c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800' }}>
                      3
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      Additional Details &amp; Specifics (Optional)
                    </h3>
                  </div>

                  <textarea
                    name="conditionNotes"
                    rows={4}
                    value={form.conditionNotes}
                    onChange={handleChange}
                    placeholder="Tell us about special requirements (e.g. heavy forklift usage, expansion joint repairs needed, coving skirting, or preferred installation dates)..."
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', lineHeight: 1.6 }}
                  />
                </div>

                {errorMessage && (
                  <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', fontSize: '0.86rem', fontWeight: '700' }}>
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '16px',
                    fontSize: '1.05rem',
                    background: '#ea580c',
                    borderColor: '#ea580c',
                    boxShadow: '0 4px 16px rgba(234, 88, 12, 0.3)',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Send size={18} />
                  <span>{submitting ? 'Submitting to Floor Shield Specialists…' : 'Submit Free Quote Request'}</span>
                </button>
              </form>
            )}
          </div>

          {/* ── Right Column: Trust Guarantees & Direct Help ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Call Direct Box */}
            <div
              style={{
                background: '#ffffff',
                border: '1.5px solid #ea580c',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
              }}
            >
              <span className="badge badge-orange" style={{ marginBottom: '8px', display: 'inline-block' }}>
                IMMEDIATE ASSISTANCE
              </span>
              <h3 style={{ fontSize: '1.18rem', fontWeight: '850', color: '#0f172a', margin: '0 0 6px' }}>
                Need An Instant Ballpark?
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '0 0 16px', lineHeight: 1.5 }}>
                Speak directly with our Melbourne head technician for instant guidance and measure bookings.
              </p>

              <a
                href={`tel:${cleanPhone}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  background: '#ea580c',
                  color: '#ffffff',
                  fontWeight: '800',
                  textDecoration: 'none',
                  fontSize: '0.96rem',
                }}
              >
                <Phone size={17} />
                <span>Call {phonePrimary}</span>
              </a>
            </div>

            {/* Why Floor Shield Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} color="#ea580c" />
                The Floor Shield Standard
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block' }}>10-Year Written Guarantee</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Full warranty covering hot-tyre pickup, peeling, and delamination.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block' }}>100% Australian-Made APC Resins</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Formulated specifically for Victorian temperature swings and UV exposure.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block' }}>Diamond Grinding Concrete Prep</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Husqvarna planetary grinders create CSP 2-3 mechanical fusion without acid.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block' }}>Rapid 1-2 Day Turnaround</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Walk on in 6-8 hours, park vehicles in 24 hours with Sparta-Guard®.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What happens next box */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
              }}
            >
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', margin: '0 0 10px' }}>
                What Happens Next?
              </h4>
              <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6 }}>
                <li>Estimator assesses your concrete specifications</li>
                <li>You receive a fixed transparent quote proposal</li>
                <li>Free on-site sample inspection &amp; laser measurement</li>
                <li>Zero deposit required to lock in your booking</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
