import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, CheckCircle2, 
  ArrowRight, Star, Award, Layers3, Check, HelpCircle, 
  ChevronDown, ChevronLeft, ChevronRight, Phone, Mail, MapPin, Sparkles,
  Building2, Eye, Wrench, Package, SlidersHorizontal, Flame, Droplets
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { 
  featuredProcessImages, apcSwatches, engineeringProcess, faqs, brandLogos,
  apcProductLines
} from '../utils/siteData';
import { fadeInUp, staggerContainer } from '../utils/constants';
import { calculateEstimatedPrice } from '../utils/pricing';
import { getProjectFallbackImage, getProjectPath } from '../utils/projectRoutes';

export default function HomePage() {
  const navigate = useNavigate();
  const { 
    settings, services, projects, reviews, brands, 
    quoteForm, setQuoteForm
  } = useSite();

  // Carousel & UI states local to Home
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [beforeAfterPos, setBeforeAfterPos] = useState(50);
  const [activeSwatchId, setActiveSwatchId] = useState('silver-ash');
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const defaultHeroSlides = [
    {
      image: '/images/epoxy-flake-garage.jpg',
      alt: 'Decorative flake epoxy garage floor with a clean premium finish',
    },
    {
      image: '/images/industrial-epoxy-warehouse.jpg',
      alt: 'Industrial epoxy flooring installed across a large warehouse',
    },
    {
      image: '/images/concrete-diamond-grinding.jpg',
      alt: 'Concrete surface being diamond ground before epoxy installation',
    },
  ];
  const heroSlides = Array.isArray(settings.heroSlides) && settings.heroSlides.length > 0
    ? settings.heroSlides
    : defaultHeroSlides;
  const heroSlide = heroSlides[activeHeroSlide] || heroSlides[0];
  const heroTitle = settings.heroTitle || 'Premium epoxy floors installed fast, built to last.';
  const heroSubtitle = settings.heroSubtitle || 'Transform tired concrete into a seamless, non-slip floor with Australian-made coating systems, certified installers and a clear quote before work begins.';
  const heroBenefits = [
    'Most garage floors completed in 2 days',
    'Australian-made APC epoxy, flake and polyaspartic systems',
    'Residential, commercial and heavy-duty industrial finishes',
  ];

  // Carousel auto-slide loops
  useEffect(() => {
    if (projects.length === 0) return;
    const interval = setInterval(() => {
      setActiveProjectIndex((prev) => (prev + 1) % projects.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [projects.length]);

  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 7500);
    return () => clearInterval(interval);
  }, [reviews.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const currentProject = projects[activeProjectIndex] || projects[0];
  const testimonialReviews = reviews.length > 0 ? reviews : [
    {
      id: 'r1',
      name: 'Craig Mathers',
      location: 'Knoxfield, VIC',
      rating: 5,
      comment: 'We specified APC Ultra Flake® with Sparta-Guard® for our 3-bay workshop. Incredible durability, zero tyre marks, and genuine Australian certified products.',
      date: 'October 2026',
      service: 'APC Ultra Flake®'
    },
    {
      id: 'r2',
      name: 'Sarah Jenkins',
      location: 'Port Melbourne',
      rating: 5,
      comment: 'Installed EPO100T® with yellow safety zoning lines in our assembly plant. The team was fast, professional, and left zero dust.',
      date: 'September 2026',
      service: 'EPO100T® Plain Coat'
    },
    {
      id: 'r3',
      name: "Tim O'Connor",
      location: 'Dandenong Industrial Estate',
      rating: 5,
      comment: 'Quartz Shield is the only flooring that holds up to boiling kettle discharge and high-pressure steam cleaning. 5 stars all the way.',
      date: 'August 2026',
      service: 'Quartz Shield®'
    }
  ];
  const visibleReviews = Array.from(
    { length: Math.min(3, testimonialReviews.length) },
    (_, offset) => testimonialReviews[(activeReviewIndex + offset) % testimonialReviews.length]
  );
  const estimate = calculateEstimatedPrice(quoteForm);

  return (
          <div className="homepage">
            <section className="home-hero">
              <div className="home-hero-bg" aria-hidden="true">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={heroSlide.image}
                    src={heroSlide.image || '/images/epoxy-flake-garage.jpg'}
                    alt=""
                    fetchPriority="high"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                  />
                </AnimatePresence>
              </div>
              <div className="home-hero-copy">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                  className="home-hero-content"
                >
                  <div className="home-hero-trust">
                    <span className="home-hero-trust-icon"><ShieldCheck size={18} /></span>
                    <span>APC-certified coating systems · Victoria</span>
                  </div>
                  <span className="home-hero-eyebrow">Garage, commercial and industrial epoxy flooring</span>
                  <h1>
                    {heroTitle}
                  </h1>
                  <p className="home-hero-description">
                    {heroSubtitle}
                  </p>
                  <ul className="home-hero-benefits">
                    {heroBenefits.map((benefit, idx) => (
                      <li key={idx}><CheckCircle2 size={20} /> <span>{benefit}</span></li>
                    ))}
                  </ul>
                  <div className="home-hero-actions">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/calculator')}
                      className="home-hero-quote"
                    >
                      Get a free quote <ArrowRight size={18} />
                    </motion.button>
                    <button
                      onClick={() => navigate('/products')}
                      className="home-hero-products"
                    >
                      Explore flooring systems
                    </button>
                  </div>
                  <div className="home-hero-service-types">
                    Residential <span /> Commercial <span /> Industrial
                  </div>
                </motion.div>
              </div>
              <div className="home-hero-carousel-controls" aria-label="Hero carousel controls">
                <button
                  type="button"
                  onClick={() => setActiveHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                  aria-label="Previous hero slide"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="home-hero-dots">
                  {heroSlides.map((slide, idx) => (
                    <button
                      key={`${slide.image}-${idx}`}
                      type="button"
                      className={idx === activeHeroSlide ? 'active' : ''}
                      onClick={() => setActiveHeroSlide(idx)}
                      aria-label={`Show hero slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length)}
                  aria-label="Next hero slide"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </section>

            {/* BRAND LOGO SCROLLER (Coles, Woolworths, Bulla, CFA, Victoria Police, etc.) */}
            <section className="marquee-wrapper" style={{ padding: '24px 0', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
              <div style={{ width: '100%' }}>
                <div className="container" style={{ marginBottom: '18px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    Trusted By Australia's Leading Retail, Industrial & Emergency Services
                  </div>
                </div>

                {/* Infinite Marquee of Client Logos */}
                <div className="marquee-track" style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
                  {(brands.length > 0 ? [...brands, ...brands, ...brands] : [
                    { name: 'Coles', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coles_Supermarkets_logo.svg/1200px-Coles_Supermarkets_logo.svg.png' },
                    { name: 'Woolworths', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Woolworths_Supermarkets_logo.svg/1200px-Woolworths_Supermarkets_logo.svg.png' },
                    { name: 'Bulla', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Bulla_Dairy_Foods_Logo.png' },
                    { name: 'CFA', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/23/Country_Fire_Authority_Logo.svg/1200px-Country_Fire_Authority_Logo.svg.png' },
                    { name: 'Ambulance Victoria', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Ambulance_Victoria_logo.svg/1200px-Ambulance_Victoria_logo.svg.png' },
                    { name: 'Pepsi', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Pepsi_logo_2014.svg/1200px-Pepsi_logo_2014.svg.png' },
                    { name: 'CSIRO', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/db/CSIRO_Logo.svg/1200px-CSIRO_Logo.svg.png' },
                    { name: 'Melbourne University', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/The_University_of_Melbourne_logo.svg/1200px-The_University_of_Melbourne_logo.svg.png' }
                  ]).map((brand, idx) => (
                    <div
                      key={idx}
                      style={{
                        height: '52px',
                        minWidth: '130px',
                        maxWidth: '180px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px 14px',
                        transition: 'transform 0.25s ease',
                        cursor: 'default'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.08)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      title={brand.name}
                    >
                      {brand.logoUrl && (
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          style={{ maxHeight: '42px', maxWidth: '100%', objectFit: 'contain' }}
                          onError={e => {
                            e.currentTarget.hidden = true;
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.hidden = false;
                            }
                          }}
                        />
                      )}
                      <span hidden={Boolean(brand.logoUrl)} style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155' }}>{brand.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ========================================================
                FEATURED ON-SITE APPLICATION GALLERY
                ======================================================== */}
            <section style={{ padding: '80px 0', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
              <div className="container">
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={fadeInUp}
                  style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 48px' }}
                >
                  <span className="badge badge-orange">ON-SITE PROCESS GALLERY</span>
                  <h2 style={{ fontSize: '2.4rem', marginTop: '10px', marginBottom: '14px', color: '#0f172a' }}>
                    See How We Engineer Long-Lasting Floors
                  </h2>
                  <p>
                    Explore the preparation, coating and finishing stages behind resilient floors for Australian workplaces.
                  </p>
                </motion.div>

                <motion.div 
                  className="grid-cols-3"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={staggerContainer}
                >
                  {featuredProcessImages.map((image) => (
                    <motion.div 
                      key={image.id}
                      variants={fadeInUp}
                      whileHover={{ y: -8 }}
                      className="card-clean"
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ position: 'relative', height: '240px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                        <img 
                          src={image.thumbnail} 
                          alt={image.title} 
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '800'
                        }}>
                          {image.tag}
                        </div>
                      </div>

                      <div style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#0f172a' }}>{image.title}</h3>
                        <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: 0 }}>{image.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* ========================================================
                INTERACTIVE BEFORE & AFTER TRANSFORMATION SLIDER
                ======================================================== */}
            <section style={{ padding: '80px 0', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <div className="container">
                <motion.div 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                  style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}
                >
                  <span className="badge badge-orange">INTERACTIVE VISUAL COMPARISON</span>
                  <h2 style={{ fontSize: '2.4rem', marginTop: '10px', marginBottom: '14px', color: '#0f172a' }}>
                    See The Difference: Raw Concrete vs APC Armor
                  </h2>
                  <p>
                    Slide left and right to inspect how planetary diamond grinding and APC Ultra Flake® transforms stained, unsealed concrete into a lifetime seamless industrial floor.
                  </p>
                </motion.div>

                <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                  {/* Before/After Split Viewer */}
                  <div className="comparison-container" style={{ position: 'relative', height: '420px', borderRadius: '20px', overflow: 'hidden', border: '2px solid #cbd5e1', boxShadow: '0 16px 36px rgba(15,23,42,0.1)' }}>
                    {/* AFTER Image (Full background) */}
                    <img 
                      src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80" 
                      alt="After APC Ultra Flake Installation" 
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                      zIndex: 5
                    }}>
                      AFTER: APC Ultra Flake® + Sparta-Guard®
                    </div>

                    {/* BEFORE Image (Clipped overlay) */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      width: `${beforeAfterPos}%`,
                      overflow: 'hidden',
                      zIndex: 4,
                      borderRight: '3px solid #ea580c'
                    }}>
                      <img 
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80" 
                        alt="Before: Stained Unsealed Concrete" 
                        style={{ position: 'absolute', top: 0, left: 0, width: '960px', height: '100%', objectFit: 'cover', maxWidth: 'none' }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                      }}>
                        BEFORE: Porous & Stained Slab
                      </div>
                    </div>

                    {/* Split Divider Handle */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: `${beforeAfterPos}%`,
                      transform: 'translateX(-50%)',
                      width: '4px',
                      backgroundColor: '#ea580c',
                      zIndex: 6,
                      pointerEvents: 'none'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: '#ea580c',
                        border: '3px solid #ffffff',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
                      }}>
                        <SlidersHorizontal size={18} />
                      </div>
                    </div>
                  </div>

                  {/* Slider Control Bar & Quick Toggle Presets */}
                  <div style={{
                    marginTop: '20px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '16px',
                    padding: '16px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '240px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>DRAG SLIDER:</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={beforeAfterPos} 
                        onChange={(e) => setBeforeAfterPos(Number(e.target.value))}
                        style={{
                          flex: 1,
                          accentColor: '#ea580c',
                          height: '8px',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#ea580c', width: '45px', textAlign: 'right' }}>
                        {beforeAfterPos}%
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => setBeforeAfterPos(100)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          backgroundColor: beforeAfterPos === 100 ? '#ea580c' : '#f1f5f9',
                          color: beforeAfterPos === 100 ? '#ffffff' : '#334155'
                        }}
                      >
                        Show 100% Before
                      </button>
                      <button 
                        onClick={() => setBeforeAfterPos(50)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          backgroundColor: beforeAfterPos === 50 ? '#ea580c' : '#f1f5f9',
                          color: beforeAfterPos === 50 ? '#ffffff' : '#334155'
                        }}
                      >
                        50/50 Split
                      </button>
                      <button 
                        onClick={() => setBeforeAfterPos(0)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          backgroundColor: beforeAfterPos === 0 ? '#ea580c' : '#f1f5f9',
                          color: beforeAfterPos === 0 ? '#ffffff' : '#334155'
                        }}
                      >
                        Show 100% After
                      </button>
                    </div>
                  </div>

                  {/* 4 Performance Metric Cards */}
                  <div style={{
                    marginTop: '24px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                  }}>
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <ShieldCheck size={24} color="#ea580c" />
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#0f172a' }}>+400% Bond Strength</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Diamond grinding CSP-3 anchor</div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <Flame size={24} color="#ea580c" />
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#0f172a' }}>100% Hot Tyre Safe</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Zero pick-up under hot tyres</div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <Droplets size={24} color="#0284c7" />
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#0f172a' }}>Non-Porous Shield</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Repels oils, chemicals & brake fluids</div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <CheckCircle2 size={24} color="#059669" />
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#0f172a' }}>10-Year Written Guarantee</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Commercial grade certified system</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================================
                INTERACTIVE APC SYSTEM & COLOR SWATCH VISUALIZER
                ======================================================== */}
            <section style={{ padding: '80px 0', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
              <div className="container">
                <motion.div 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                  style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 44px' }}
                >
                  <span className="badge badge-blue">INTERACTIVE FINISH SELECTOR</span>
                  <h2 style={{ fontSize: '2.4rem', marginTop: '10px', marginBottom: '14px', color: '#0f172a' }}>
                    Explore All Purpose Coatings (APC) Finishes
                  </h2>
                  <p>
                    Select an APC coating system below to preview authentic colors, aggregate texture, and slip-resistance specifications.
                  </p>
                </motion.div>

                {/* Swatch Selector Pills */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '36px'
                }}>
                  {apcSwatches.map((swatch) => (
                    <button
                      key={swatch.id}
                      onClick={() => setActiveSwatchId(swatch.id)}
                      className={`swatch-card ${activeSwatchId === swatch.id ? 'active' : ''}`}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: swatch.colorHex,
                        border: '2px solid #cbd5e1'
                      }} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>{swatch.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{swatch.system.split(' ')[0]}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Dynamic Preview Card for Selected Swatch */}
                {(() => {
                  const currentSwatch = apcSwatches.find(s => s.id === activeSwatchId) || apcSwatches[0];
                  return (
                    <motion.div
                      key={currentSwatch.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35 }}
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '2px solid #ea580c',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        maxWidth: '960px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)'
                      }}
                    >
                      <div style={{ height: '340px', backgroundColor: '#e2e8f0', position: 'relative' }}>
                        <img 
                          src={currentSwatch.image} 
                          alt={currentSwatch.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontWeight: '800',
                          fontSize: '0.8rem'
                        }}>
                          {currentSwatch.tag}
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: '16px',
                          left: '16px',
                          backgroundColor: '#ffffff',
                          color: '#ea580c',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontWeight: '800',
                          fontSize: '0.82rem',
                          border: '1px solid #cbd5e1'
                        }}>
                          {currentSwatch.rating}
                        </div>
                      </div>

                      <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <span className="badge badge-orange" style={{ marginBottom: '12px' }}>{currentSwatch.system}</span>
                          <h3 style={{ fontSize: '1.9rem', color: '#0f172a', marginBottom: '12px' }}>
                            {currentSwatch.name}
                          </h3>
                          <p style={{ fontSize: '0.96rem', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
                            {currentSwatch.desc}
                          </p>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#1e293b' }}>
                              <CheckCircle2 size={16} color="#059669" />
                              <span>Dual Sparta-Guard® UV Non-Yellowing Polyaspartic Seal</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#1e293b' }}>
                              <CheckCircle2 size={16} color="#059669" />
                              <span>Mechanical Husqvarna Diamond Surface Preparation Included</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#1e293b' }}>
                              <CheckCircle2 size={16} color="#059669" />
                              <span>10-Year Written Guarantee Against Delamination</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <button 
                            onClick={() => {
                              setQuoteForm({ ...quoteForm, serviceType: currentSwatch.system });
                              navigate('/calculator');
                            }}
                            className="btn-primary"
                          >
                            <span>Calculate Cost For This Finish</span>
                            <ArrowRight size={16} />
                          </button>
                          <button 
                            onClick={() => navigate('/products')}
                            className="btn-secondary"
                          >
                            <span>View Full APC Spec Sheet</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>
            </section>

            {/* ========================================================
                INTERACTIVE 5-STAGE ENGINEERING PROCESS TIMELINE
                ======================================================== */}
            <section style={{ padding: '80px 0', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <div className="container">
                <motion.div 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                  style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}
                >
                  <span className="badge badge-orange">APPLICATION STANDARDS</span>
                  <h2 style={{ fontSize: '2.4rem', marginTop: '10px', marginBottom: '14px', color: '#0f172a' }}>
                    The 5-Stage Engineering Methodology
                  </h2>
                  <p>
                    Why do Floor Shield floors outlast conventional epoxies? We follow the exact manufacturer specification laid out by All Purpose Coatings.
                  </p>
                </motion.div>

                {/* 5-Step Selectable Tabs */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  marginBottom: '28px'
                }}>
                  {engineeringProcess.map((item, idx) => (
                    <div 
                      key={item.step}
                      onClick={() => setActiveProcessStep(idx)}
                      className={`process-step-pill ${activeProcessStep === idx ? 'active' : ''}`}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: activeProcessStep === idx ? '#ea580c' : '#e2e8f0',
                          color: activeProcessStep === idx ? '#ffffff' : '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '0.85rem'
                        }}>
                          {item.step}
                        </span>
                        {activeProcessStep === idx && (
                          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#ea580c' }}>ACTIVE</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.25 }}>
                        {item.title}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active Step Detailed Card */}
                {(() => {
                  const curStep = engineeringProcess[activeProcessStep] || engineeringProcess[0];
                  return (
                    <motion.div
                      key={curStep.step}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '2px solid #cbd5e1',
                        borderRadius: '20px',
                        padding: '36px',
                        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
                        maxWidth: '960px',
                        margin: '0 auto'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                        <div>
                          <span className="badge badge-orange" style={{ marginBottom: '8px' }}>
                            STAGE {curStep.step} OF 5
                          </span>
                          <h3 style={{ fontSize: '1.8rem', color: '#0f172a' }}>{curStep.title}</h3>
                          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ea580c', marginTop: '4px' }}>
                            {curStep.subtitle}
                          </div>
                        </div>

                        <div style={{
                          backgroundColor: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          color: '#166534',
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontWeight: '800',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <CheckCircle2 size={16} />
                          <span>{curStep.highlight}</span>
                        </div>
                      </div>

                      <p style={{ fontSize: '1.05rem', lineHeight: 1.65, color: '#334155', marginBottom: '28px' }}>
                        {curStep.desc}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '20px', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          Standardised to Victorian Building Code & AS 4586 Slip Compliance
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button 
                            disabled={activeProcessStep === 0}
                            onClick={() => setActiveProcessStep(prev => Math.max(0, prev - 1))}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              backgroundColor: '#f1f5f9',
                              color: activeProcessStep === 0 ? '#94a3b8' : '#0f172a',
                              fontWeight: '700',
                              fontSize: '0.85rem'
                            }}
                          >
                            ← Previous Stage
                          </button>
                          <button 
                            disabled={activeProcessStep === 4}
                            onClick={() => setActiveProcessStep(prev => Math.min(4, prev + 1))}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              backgroundColor: '#ea580c',
                              color: '#ffffff',
                              fontWeight: '700',
                              fontSize: '0.85rem'
                            }}
                          >
                            Next Stage →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>
            </section>

            {/* ALL PURPOSE COATINGS PRODUCT HIGHLIGHT TILES */}
            <section style={{ padding: '80px 0', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
              <div className="container">
                <motion.div 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}
                >
                  <div>
                    <span className="badge badge-orange">ALL PURPOSE COATINGS CATALOG</span>
                    <h2 style={{ fontSize: '2.3rem', marginTop: '10px', color: '#0f172a' }}>
                      Certified APC Flooring Chemistries
                    </h2>
                    <p>Designed and manufactured in Australia for severe traffic, chemical attack, and architectural beauty.</p>
                  </div>
                  <button 
                    onClick={() => navigate('/products')}
                    className="btn-secondary"
                  >
                    <span>View All APC Systems</span>
                    <ChevronRight size={16} />
                  </button>
                </motion.div>

                <div className="grid-cols-3">
                  {apcProductLines.slice(0, 3).map((prod) => (
                    <motion.div 
                      key={prod.id} 
                      whileHover={{ y: -8 }}
                      className="card-clean" 
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ height: '200px', backgroundColor: '#e2e8f0', position: 'relative' }}>
                        <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#0f172a', color: '#ffffff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800' }}>
                          {prod.badge}
                        </div>
                      </div>
                      <div style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '6px', color: '#0f172a' }}>{prod.name}</h3>
                        <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '16px' }}>{prod.description}</p>
                        <button 
                          onClick={() => {
                            setQuoteForm({ ...quoteForm, serviceType: prod.name });
                            navigate('/calculator');
                          }}
                          className="btn-primary"
                          style={{ width: '100%', padding: '10px 18px', fontSize: '0.88rem' }}
                        >
                          <span>Get Free Ballpark Quote</span>
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* FEATURED PROJECT CAROUSEL */}
            <section className="featured-projects-section">
              <div className="container">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45 }}
                  className="featured-projects-heading"
                >
                  <span className="badge badge-blue">VICTORIAN CASE STUDIES</span>
                  <h2>See Our Projects</h2>
                  <p>Real flooring projects, delivered for homes and workplaces across Victoria.</p>
                </motion.div>

                {currentProject ? (
                  <motion.article
                    key={activeProjectIndex}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="featured-project-card"
                  >
                    <Link
                      className="featured-project-image-link"
                      to={getProjectPath(currentProject)}
                      aria-label={`View project: ${currentProject.title}`}
                    >
                      <img
                        src={currentProject.imageAfter || getProjectFallbackImage(currentProject)}
                        alt={currentProject.title}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = getProjectFallbackImage(currentProject);
                        }}
                      />
                    </Link>
                    <div className="featured-project-overlay">
                      <span className="featured-project-kicker">CLIENT RESULTS</span>
                      <h3>{currentProject.title}</h3>
                      <p>
                        {currentProject.testimonial
                          ? `“${currentProject.testimonial}”`
                          : `${currentProject.category || currentProject.finish || 'Flooring'} project${currentProject.location ? ` in ${currentProject.location}` : ''}, completed by Floor Shield.`}
                      </p>
                      <div className="featured-project-meta">
                        {currentProject.location && <span><MapPin size={15} /> {currentProject.location}</span>}
                        {currentProject.squareMeters && <span>{currentProject.squareMeters}</span>}
                        {currentProject.duration && <span>{currentProject.duration}</span>}
                      </div>
                      <div className="featured-project-actions">
                        <Link className="featured-project-view" to={getProjectPath(currentProject)}>
                          View project <ArrowRight size={17} />
                        </Link>
                        <div className="featured-project-controls">
                          <button
                            type="button"
                            disabled={projects.length < 2}
                            aria-label="Previous project"
                            onClick={() => setActiveProjectIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1))}
                          >
                            <ChevronLeft size={22} />
                          </button>
                          <button
                            type="button"
                            disabled={projects.length < 2}
                            aria-label="Next project"
                            onClick={() => setActiveProjectIndex((prev) => (prev + 1) % projects.length)}
                          >
                            <ChevronRight size={22} />
                          </button>
                          <span>{activeProjectIndex + 1} / {projects.length}</span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ) : (
                  <div className="featured-project-empty">
                    Projects will be featured here soon.
                  </div>
                )}
              </div>
            </section>

            {/* ========================================================
                VERIFIED CUSTOMER REVIEWS & TESTIMONIALS CAROUSEL
                ======================================================== */}
            <section className="testimonials-section">
              <div className="container">
                <motion.div
                  className="testimonials-heading"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="testimonials-intro">
                    <span className="testimonials-eyebrow">VERIFIED CLIENT SATISFACTION</span>
                    <h2>
                      What Victorian Facility Managers Say
                    </h2>
                    <p>Real feedback from commercial distribution hubs, factories, and garage transformations across Victoria.</p>
                  </div>

                  <div className="testimonials-controls" aria-label="Testimonial carousel controls">
                    <button
                      type="button"
                      aria-label="Previous testimonials"
                      disabled={testimonialReviews.length < 2}
                      onClick={() => setActiveReviewIndex((prev) => (
                        prev === 0 ? testimonialReviews.length - 1 : prev - 1
                      ))}
                    >
                      <ChevronLeft size={21} />
                    </button>
                    <span aria-live="polite">
                      {testimonialReviews.length ? (activeReviewIndex % testimonialReviews.length) + 1 : 0}
                      <i>/</i>
                      {testimonialReviews.length}
                    </span>
                    <button
                      type="button"
                      aria-label="Next testimonials"
                      disabled={testimonialReviews.length < 2}
                      onClick={() => setActiveReviewIndex((prev) => (
                        (prev + 1) % testimonialReviews.length
                      ))}
                    >
                      <ChevronRight size={21} />
                    </button>
                  </div>
                </motion.div>

                <div className="testimonials-slider" aria-label="Customer testimonials">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeReviewIndex}
                      className="testimonials-track"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                    >
                      {visibleReviews.map((review, index) => {
                        const rating = Math.max(0, Math.min(5, Number(review.rating) || 5));
                        return (
                          <motion.article
                            key={`${review.id || review._id || review.name}-${activeReviewIndex}-${index}`}
                            className={`testimonial-card testimonial-card-${index + 1}`}
                            whileHover={{ y: -4 }}
                          >
                            <div className="testimonial-card-topline">
                              <div className="testimonial-stars" aria-label={`${rating} out of 5 stars`}>
                                {[...Array(5)].map((_, starIndex) => (
                                  <Star
                                    key={starIndex}
                                    size={19}
                                    fill={starIndex < rating ? 'currentColor' : 'none'}
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                              {review.verified && <span className="testimonial-verified">VERIFIED</span>}
                            </div>
                            <p className="testimonial-quote">“{review.comment}”</p>
                            <div className="testimonial-card-footer">
                              <div className="testimonial-client">
                                <span className="testimonial-avatar">
                                  {(review.name || 'C').trim().charAt(0).toUpperCase()}
                                </span>
                                <span>
                                  <strong>{review.name || 'Verified client'}</strong>
                                  {review.location && <small>{review.location}</small>}
                                </span>
                              </div>
                              {review.service && <span className="testimonial-service">{review.service}</span>}
                            </div>
                          </motion.article>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* INTERACTIVE INSTANT ESTIMATOR SECTION */}
            <section id="estimator-section" style={{ padding: '80px 0', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <div className="container">
                <motion.div 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #ea580c',
                    borderRadius: '24px',
                    padding: '40px',
                    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)'
                  }}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '40px',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span className="badge badge-orange">TRANSPARENT FIXED ESTIMATOR</span>
                      <h2 style={{ fontSize: '2.4rem', marginTop: '10px', marginBottom: '16px', color: '#0f172a' }}>
                        Calculate Your Floor Cost in 30 Seconds
                      </h2>
                      <p style={{ marginBottom: '24px', color: '#475569' }}>
                        Direct estimating built around Victorian commercial square-meter rates and All Purpose Coatings manufacturer warranties.
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b' }}>
                          <CheckCircle2 size={18} color="#059669" />
                          <span>Genuine All Purpose Coatings (APC) industrial resin</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b' }}>
                          <CheckCircle2 size={18} color="#059669" />
                          <span>Planetary diamond grinding mechanical concrete prep</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b' }}>
                          <CheckCircle2 size={18} color="#059669" />
                          <span>Compliant with AS 4586 slip resistance ratings</span>
                        </div>
                      </div>
                    </div>

                    {/* Estimator Interactive Box */}
                    <div style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '16px',
                      padding: '28px',
                      boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)'
                    }}>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>
                          Select All Purpose Coatings System
                        </label>
                        <select 
                          value={quoteForm.serviceType}
                          onChange={(e) => setQuoteForm({ ...quoteForm, serviceType: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            color: '#0f172a',
                            fontWeight: '600'
                          }}
                        >
                          <option value="APC Ultra Flake® Architectural System">APC Ultra Flake® System (Residential & Commercial)</option>
                          <option value="APC Hyper Flake® Polished Stone Alternative">APC Hyper Flake® (Honed Stone / Terrazzo Alternative)</option>
                          <option value="EPO100T® High-Build Solid Epoxy">EPO100T® High-Build Epoxy (Warehouses & Factories)</option>
                          <option value="Quartz Shield® Heavy Industrial System">Quartz Shield® Heavy Industrial System (P5 Slip Rated)</option>
                          <option value="Sparta-Guard® Fast-Return Polyaspartic">Sparta-Guard® Fast 1-Day Return Polyaspartic</option>
                          <option value="Metallic Marble & Swirl Coat Artistry">Metallic Marble & Swirl Coat Artistry</option>
                        </select>
                      </div>

                      <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>
                            Floor Area: <span style={{ color: '#ea580c' }}>{quoteForm.areaApproxSqm} m²</span>
                          </label>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {quoteForm.areaApproxSqm <= 50 ? '(Double Garage / Workshop)' : quoteForm.areaApproxSqm <= 120 ? '(Commercial Kitchen / Retail)' : '(Industrial Warehouse / Factory)'}
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min="20" 
                          max="400" 
                          step="10"
                          value={quoteForm.areaApproxSqm}
                          onChange={(e) => setQuoteForm({ ...quoteForm, areaApproxSqm: Number(e.target.value) })}
                          style={{
                            width: '100%',
                            accentColor: '#ea580c',
                            height: '8px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        />
                      </div>

                      {/* Output Estimate Box */}
                      <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '18px',
                        textAlign: 'center',
                        marginBottom: '20px'
                      }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
                          Estimated Project Investment
                        </div>
                        <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#059669', margin: '4px 0' }}>
                          ${estimate.min.toLocaleString()} – ${estimate.max.toLocaleString()} AUD
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Includes planetary diamond surface prep, materials, and 10-year warranty.
                        </div>
                      </div>

                      <button 
                        onClick={() => navigate('/calculator')}
                        className="btn-primary"
                        style={{ width: '100%' }}
                      >
                        <span>Lock In This Online Estimate</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ========================================================
                INTERACTIVE FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION
                ======================================================== */}
            <section style={{ padding: '80px 0', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
              <div className="container" style={{ maxWidth: '850px' }}>
                <motion.div 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                  style={{ textAlign: 'center', marginBottom: '40px' }}
                >
                  <span className="badge badge-orange">TECHNICAL QUESTIONS ANSWERED</span>
                  <h2 style={{ fontSize: '2.3rem', marginTop: '10px', marginBottom: '14px', color: '#0f172a' }}>
                    Frequently Asked Questions
                  </h2>
                  <p>
                    Everything you need to know about surface preparation, resin chemistry, tyre resistance, and turnaround times.
                  </p>
                </motion.div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {faqs.map((faq, idx) => (
                    <div 
                      key={idx}
                      style={{
                        backgroundColor: activeFaqIndex === idx ? '#fff7ed' : '#f8fafc',
                        border: activeFaqIndex === idx ? '2px solid #ea580c' : '1px solid #cbd5e1',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <button
                        onClick={() => setActiveFaqIndex(activeFaqIndex === idx ? null : idx)}
                        style={{
                          width: '100%',
                          padding: '20px 24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          textAlign: 'left',
                          background: 'none',
                          color: '#0f172a',
                          fontWeight: '800',
                          fontSize: '1.05rem',
                          gap: '16px'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <HelpCircle size={20} color={activeFaqIndex === idx ? '#ea580c' : '#64748b'} />
                          <span>{faq.q}</span>
                        </span>
                        <ChevronDown 
                          size={20} 
                          color={activeFaqIndex === idx ? '#ea580c' : '#64748b'}
                          style={{
                            transform: activeFaqIndex === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                          }}
                        />
                      </button>

                      {activeFaqIndex === idx && (
                        <div style={{
                          padding: '0 24px 22px 54px',
                          color: '#334155',
                          fontSize: '0.95rem',
                          lineHeight: 1.65,
                          borderTop: '1px solid #ffedd5',
                          paddingTop: '14px'
                        }}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
  );
}
