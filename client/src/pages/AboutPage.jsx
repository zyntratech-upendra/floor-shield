import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Award, BadgeCheck, ShieldCheck, CheckCircle2, DollarSign, Clock, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

export default function AboutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSite();

  useEffect(() => {
    const sectionId = decodeURIComponent(location.hash.slice(1));
    if (!sectionId) return undefined;
    const frame = requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.hash]);

  const phonePrimary = settings.phone || '0489 074 340';

  const corePillars = [
    {
      icon: DollarSign,
      title: '$0 Upfront Deposit',
      desc: 'We back our quality with complete confidence. You pay zero deposit upfront—only paying once your floor is mechanically finished, sealed, and approved to your complete satisfaction.'
    },
    {
      icon: Clock,
      title: '2-Day Turnaround',
      desc: 'Our streamlined multi-step process minimizes downtime. Most standard double garages and commercial workshops are completely transformed and return-to-service within 48 hours.'
    },
    {
      icon: ShieldCheck,
      title: '10-Year System Warranty',
      desc: 'All installations use premium All Purpose Coatings (APC) industrial resin, basecoats, and UV-stable polyaspartics formulated specifically for the tough Australian climate.'
    },
    {
      icon: Award,
      title: 'Diamond Mechanical Preparation',
      desc: 'We never acid wash. Every concrete slab is aggressively diamond ground with industrial HEPA dust-extracted grinders to CSP-2/3 profile, ensuring unbreakable resin adhesion.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero about-hero">
        <div className="container landing-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="landing-hero-copy"
          >
            <span className="badge badge-orange">ABOUT FLOOR SHIELD PTY LTD</span>
            <h1>Built on thorough preparation. Backed by Australian-made coatings.</h1>
            <p>
              Floor Shield Pty Ltd is Melbourne's specialist epoxy and concrete coating installer. From luxury flake garages to commercial workshops and food-grade kitchens, we deliver durable, seamless, and slip-compliant finishes tailored to your property.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
              <button className="btn-primary" onClick={() => navigate('/contact')}>
                Book Free Site Inspection <ArrowRight size={17} />
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => navigate('/projects')}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '12px 22px',
                  fontWeight: '700',
                  color: '#0f172a',
                  cursor: 'pointer'
                }}
              >
                View Before &amp; Afters
              </button>
            </div>
          </motion.div>
          <div className="landing-hero-photo">
            <img src="/images/concrete-diamond-grinding.jpg" alt="Concrete floor being mechanically prepared before coating" />
            <div className="landing-photo-caption">
              <ShieldCheck size={19} />
              <span>Heavy Diamond Mechanical Preparation — Never Acid Washed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Bar */}
      <section className="about-stats">
        <div className="container about-stats-grid">
          <div><strong>15+</strong><span>years coating mastery</span></div>
          <div><strong>2,450+</strong><span>floors completed across VIC</span></div>
          <div><strong>$0</strong><span>upfront deposit required</span></div>
          <div><strong>10 Years</strong><span>manufacturer warranty</span></div>
        </div>
      </section>

      {/* Core Promises / Floorshield Pillars */}
      <section className="landing-section">
        <div className="container">
          <div className="landing-section-heading">
            <span className="landing-eyebrow">THE FLOOR SHIELD DIFFERENCE</span>
            <h2>Why Melbourne property owners choose Floor Shield</h2>
            <p>Proven resin systems, precision grinding, and zero financial risk before completion.</p>
          </div>
          
          <div className="about-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {corePillars.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  className="about-card"
                  key={item.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '28px',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
                  }}
                >
                  <span className="about-card-icon" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>
                    <Icon size={24} />
                  </span>
                  <span className="landing-eyebrow" style={{ marginTop: '12px' }}>PROMISE 0{index + 1}</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: '8px 0' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Narrative Section: What Makes APC Coatings Superior */}
      <section style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '60px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}>
            <div>
              <span className="badge badge-orange" style={{ marginBottom: '14px' }}>
                AUSTRALIAN FORMULATED
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1.25, marginBottom: '16px' }}>
                Engineered specifically for hot tires, chemical spills, and heavy wear.
              </h2>
              <p style={{ color: '#94a3b8', lineHeight: 1.65, fontSize: '0.95rem', marginBottom: '20px' }}>
                Off-the-shelf single-part DIY paints peel under hot car tires within months. At Floor Shield Pty Ltd, we only install 100% solids epoxy basecoats locked in with industrial polyaspartic and polyurethane clear topcoats.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Zero hot tire pickup guaranteed',
                  '100% UV stable non-yellowing polyaspartic topcoat',
                  'High chemical and stain resistance against oils and brake fluids',
                  'Certified AS 4586 slip-resistance ratings (P1 to P5)'
                ].map((point, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#f1f5f9' }}>
                    <CheckCircle2 size={18} color="#ea580c" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '30px'
            }}>
              <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                OUR STANDARD INSTALLATION SEQUENCE
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '18px' }}>
                How We Deliver a 10-Year Floor in 2 Days
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ea580c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0, fontSize: '0.85rem' }}>1</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Mechanical Diamond Grinding</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Open concrete pores and profile the surface to CSP-2 standard with vacuum extraction.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ea580c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0, fontSize: '0.85rem' }}>2</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Epoxy Joint &amp; Crack Repair</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Repair divots and cracks with high-tensile epoxy filler for a seamless foundation.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ea580c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0, fontSize: '0.85rem' }}>3</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Prime &amp; Deep-Pour Epoxy Basecoat</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Apply 100% solids epoxy resin to penetrate and fuse permanently with the slab.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ea580c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0, fontSize: '0.85rem' }}>4</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Full Flake Broadcast &amp; Polyaspartic Seal</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Broadcast custom color flakes to rejection and seal with dual coats of UV-stable clear shield.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bar */}
      <section className="landing-cta">
        <div className="container landing-cta-inner">
          <div>
            <span className="landing-eyebrow">READY TO TRANSFORM YOUR CONCRETE?</span>
            <h2>Speak with a Floor Shield specialist today.</h2>
            <p>Direct line: <strong>{phonePrimary}</strong> or request your instant free estimate online.</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/contact')}>
            Get in touch <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}
