import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calculator, CheckCircle2, ArrowRight, UserCheck, Lock, SlidersHorizontal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSite } from '../context/SiteContext';
import { API_BASE } from '../utils/constants';
import { calculateEstimatedPrice } from '../utils/pricing';

export default function CalculatorPage() {
  const navigate = useNavigate();
  const { settings, quoteForm, setQuoteForm } = useSite();
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setQuoteSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteForm)
      });
      const data = await res.json();
      if (data.success) {
        setQuoteSubmitted(true);
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      alert('Unable to submit inquiry right now. Please call ' + settings.phone);
    } finally {
      setQuoteSubmitting(false);
    }
  };

  const estimate = calculateEstimatedPrice(quoteForm);

  return (
          <div className="container" style={{ paddingTop: '50px', paddingBottom: '90px' }}>
            <div style={{ maxWidth: '850px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <span className="badge badge-orange">ALL PURPOSE COATINGS ESTIMATOR</span>
                <h1 style={{ fontSize: '2.5rem', marginTop: '10px', marginBottom: '12px', color: '#0f172a' }}>
                  Floor Shield Project Cost Calculator
                </h1>
                <p style={{ color: '#475569' }}>
                  Get an accurate transparent price range and schedule a free Melbourne on-site diamond test.
                </p>
              </div>

              {quoteSubmitted ? (
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #059669',
                  borderRadius: '20px',
                  padding: '48px',
                  textAlign: 'center',
                  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)'
                }}>
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    border: '2px solid #059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <CheckCircle2 size={40} color="#059669" />
                  </div>
                  <h2 style={{ fontSize: '2rem', marginBottom: '12px', color: '#0f172a' }}>Quote Inquiry Registered!</h2>
                  <p style={{ fontSize: '1.1rem', maxWidth: '580px', margin: '0 auto 24px', color: '#334155' }}>
                    Thank you <strong>{quoteForm.name}</strong>. Your estimate of <strong>${estimate.min} – ${estimate.max} AUD</strong> for <strong>{quoteForm.areaApproxSqm}m² ({quoteForm.serviceType})</strong> has been routed to our senior flooring estimator.
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '32px' }}>
                    We will call you on <strong>{quoteForm.phone}</strong> shortly to answer questions or confirm an obligation-free moisture check.
                  </p>
                  <button 
                    onClick={() => { setQuoteSubmitted(false); navigate('/'); }}
                    className="btn-primary"
                  >
                    <span>Return To Homepage</span>
                  </button>
                </div>
              ) : (
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '24px',
                  padding: '36px',
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.06)'
                }}>
                  <form onSubmit={handleQuoteSubmit}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '32px',
                      marginBottom: '32px'
                    }}>
                      {/* Step 1: Specifications */}
                      <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '18px', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
                          <SlidersHorizontal size={18} />
                          <span>1. Floor Specifications</span>
                        </h3>

                        <div style={{ marginBottom: '18px' }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', marginBottom: '6px', color: '#0f172a' }}>
                            Selected APC Coating System
                          </label>
                          <select 
                            value={quoteForm.serviceType}
                            onChange={(e) => setQuoteForm({ ...quoteForm, serviceType: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '12px',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              color: '#0f172a',
                              fontWeight: '600'
                            }}
                          >
                            <option value="APC Ultra Flake® Architectural System">APC Ultra Flake® Architectural System</option>
                            <option value="APC Hyper Flake® Polished Stone Alternative">APC Hyper Flake® Polished Stone Alternative</option>
                            <option value="EPO100T® High-Build Solid Epoxy">EPO100T® High-Build Solid Epoxy (Industrial)</option>
                            <option value="Quartz Shield® Heavy Industrial System">Quartz Shield® Heavy Industrial System (P5 Traction)</option>
                            <option value="Sparta-Guard® Fast-Return Polyaspartic">Sparta-Guard® Fast-Return Polyaspartic</option>
                            <option value="Metallic Marble & Swirl Coat Artistry">Metallic Marble & Swirl Coat Artistry</option>
                          </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>
                              Floor Area: <span style={{ color: '#ea580c' }}>{quoteForm.areaApproxSqm} m²</span>
                            </label>
                          </div>
                          <input 
                            type="range" 
                            min="20" 
                            max="400" 
                            step="10"
                            value={quoteForm.areaApproxSqm}
                            onChange={(e) => setQuoteForm({ ...quoteForm, areaApproxSqm: Number(e.target.value) })}
                            style={{ width: '100%', accentColor: '#ea580c' }}
                          />
                        </div>

                        {/* Live Price Tag */}
                        <div style={{
                          backgroundColor: '#f8fafc',
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '18px',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                            Live Calculated Ballpark
                          </div>
                          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#059669', margin: '4px 0' }}>
                            ${estimate.min.toLocaleString()} – ${estimate.max.toLocaleString()} AUD
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Includes All Purpose Coatings resins, surface prep & warranty.
                          </div>
                        </div>
                      </div>

                      {/* Step 2: Contact Details */}
                      <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '18px', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
                          <UserCheck size={18} />
                          <span>2. Your Details For The Formal Proposal</span>
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px', color: '#0f172a' }}>
                              Full Name *
                            </label>
                            <input 
                              type="text" 
                              required
                              placeholder="e.g. Liam Anderson"
                              value={quoteForm.name}
                              onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                              style={{ width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                            />
                          </div>

                          <div className="grid-cols-2">
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px', color: '#0f172a' }}>
                                Phone Number *
                              </label>
                              <input 
                                type="tel" 
                                required
                                placeholder="0400 000 000"
                                value={quoteForm.phone}
                                onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                                style={{ width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px', color: '#0f172a' }}>
                                Suburb (VIC)
                              </label>
                              <input 
                                type="text" 
                                placeholder="e.g. Knoxfield / Dandenong"
                                value={quoteForm.suburb}
                                onChange={(e) => setQuoteForm({ ...quoteForm, suburb: e.target.value })}
                                style={{ width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                              />
                            </div>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px', color: '#0f172a' }}>
                              Email Address *
                            </label>
                            <input 
                              type="email" 
                              required
                              placeholder="liam@example.com"
                              value={quoteForm.email}
                              onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                              style={{ width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px', color: '#0f172a' }}>
                              Existing Concrete Notes / Operational Requirements
                            </label>
                            <textarea 
                              rows={2}
                              value={quoteForm.conditionNotes}
                              onChange={(e) => setQuoteForm({ ...quoteForm, conditionNotes: e.target.value })}
                              style={{ width: '100%', padding: '10px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                        <Lock size={16} color="#059669" />
                        <span>Privacy Protected. We never sell your contact info.</span>
                      </div>

                      <button 
                        type="submit" 
                        disabled={quoteSubmitting}
                        className="btn-primary"
                        style={{ padding: '16px 36px', fontSize: '1.05rem' }}
                      >
                        <span>{quoteSubmitting ? 'Transmitting Request...' : 'Send Inquiry & Book Free Inspection'}</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
  );
}
