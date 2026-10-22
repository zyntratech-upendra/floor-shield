import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Layers,
  MapPin,
  Maximize2,
  Phone,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserRound,
  Wrench,
  X,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import {
  getProjectFallbackImage,
  getProjectPath,
  getProjectRouteKey,
  getProjectSlug,
} from '../utils/projectRoutes';
import { API_BASE } from '../utils/constants';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, loadingData, quoteForm, setQuoteForm, settings } = useSite();

  const [remoteProject, setRemoteProject] = useState(null);
  const [loadingRemote, setLoadingRemote] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  const containerRef = useRef(null);

  // 1. Resolve project from SiteContext memory
  const localProject = useMemo(() => {
    return projects.find((item) => (
      getProjectSlug(item) === projectId ||
      getProjectRouteKey(item) === projectId ||
      String(item._id) === String(projectId) ||
      String(item.id) === String(projectId)
    ));
  }, [projects, projectId]);

  // 2. Fallback fetch if not available in local projects memory
  useEffect(() => {
    if (!localProject && !loadingData && projectId) {
      let isMounted = true;
      setLoadingRemote(true);
      fetch(`${API_BASE}/projects/${encodeURIComponent(projectId)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (isMounted && data && !data.error) {
            setRemoteProject(data);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setLoadingRemote(false);
        });
      return () => { isMounted = false; };
    }
  }, [localProject, loadingData, projectId]);

  const project = localProject || remoteProject;

  // 3. Keep URL route clean with project slug name
  useEffect(() => {
    if (project) {
      const canonicalSlug = getProjectSlug(project);
      if (canonicalSlug && projectId !== canonicalSlug && (projectId === project._id || projectId === project.id)) {
        navigate(`/projects/${encodeURIComponent(canonicalSlug)}`, { replace: true });
      }
    }
  }, [project, projectId, navigate]);

  // 4. Resolve multi-view comparison combinations
  const comparisonViews = useMemo(() => {
    if (!project) return [];
    if (Array.isArray(project.comparisonViews) && project.comparisonViews.length > 0) {
      return project.comparisonViews;
    }

    const beforeList = Array.isArray(project.beforeImages) && project.beforeImages.length > 0
      ? project.beforeImages
      : (project.imageBefore ? [project.imageBefore] : []);
    const afterList = Array.isArray(project.afterImages) && project.afterImages.length > 0
      ? project.afterImages
      : (project.imageAfter ? [project.imageAfter] : []);

    const maxViews = Math.max(beforeList.length, afterList.length, 1);
    const synthesized = [];

    for (let i = 0; i < maxViews; i++) {
      const beforeImg = beforeList[i] || beforeList[0] || project.imageBefore || getProjectFallbackImage(project);
      const afterImg = afterList[i] || afterList[0] || project.imageAfter || getProjectFallbackImage(project);
      synthesized.push({
        title: maxViews > 1 ? `View ${i + 1}: Angle & Detail` : 'Main Floor Installation',
        beforeImage: beforeImg,
        afterImage: afterImg,
        beforeLabel: i === 0 ? 'BEFORE: Porous & Stained Slab' : 'BEFORE: Unprepared Concrete',
        afterLabel: i === 0 ? 'AFTER: APC Ultra Flake® + Sparta-Guard®' : 'AFTER: Seamless Polyaspartic Finish',
      });
    }

    return synthesized;
  }, [project]);

  // Safe active view
  const currentView = comparisonViews[activeViewIndex] || comparisonViews[0] || {
    beforeImage: getProjectFallbackImage(project || {}),
    afterImage: getProjectFallbackImage(project || {}),
    beforeLabel: 'BEFORE: Porous & Stained Slab',
    afterLabel: 'AFTER: APC Ultra Flake® + Sparta-Guard®',
  };

  // 5. Interactive slider dragging logic (Mouse & Touch)
  const updateSliderFromClientX = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    updateSliderFromClientX(e.clientX || (e.touches && e.touches[0]?.clientX));
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e) => updateSliderFromClientX(e.clientX);
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) updateSliderFromClientX(e.touches[0].clientX);
    };
    const onStop = () => setIsDragging(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onStop);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onStop);
    window.addEventListener('touchcancel', onStop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onStop);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onStop);
      window.removeEventListener('touchcancel', onStop);
    };
  }, [isDragging, updateSliderFromClientX]);

  // 6. Dynamic Tag Opacity Calculation:
  // When sliding right towards 100% (completely before):
  // AFTER tag fades out between 84% and 96%, completely disappearing at 96%+!
  const afterBadgeOpacity = sliderPos > 84 ? Math.max(0, (96 - sliderPos) / 12) : 1;

  // When sliding left towards 0% (completely after):
  // BEFORE tag fades out between 16% and 4%, completely disappearing at 4% and below!
  const beforeBadgeOpacity = sliderPos < 16 ? Math.max(0, (sliderPos - 4) / 12) : 1;

  // Loading state
  if ((!project && loadingData) || loadingRemote) {
    return (
      <main className="project-detail-page">
        <div className="container project-detail-state" role="status">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '3px solid rgba(234, 88, 12, 0.2)',
                borderTopColor: '#ea580c',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
              Loading project case study…
            </span>
          </div>
        </div>
      </main>
    );
  }

  // Not found state
  if (!project) {
    return (
      <main className="project-detail-page">
        <div className="container project-detail-state">
          <h1>Project not found</h1>
          <p>This project may have been updated, renamed, or removed from our portfolio.</p>
          <Link className="btn-primary" to="/projects">
            <ArrowLeft size={17} /> View all completed projects
          </Link>
        </div>
      </main>
    );
  }

  // All additional gallery images
  const allGalleryImages = [
    ...(project.afterImages || []),
    ...(project.beforeImages || []),
  ].filter((img, idx, arr) => img && arr.indexOf(img) === idx);

  const contactPhone = settings?.phone || '0489 074 340';
  const cleanPhone = contactPhone.replace(/\s+/g, '');

  return (
    <main className="project-detail-page">
      <div className="container project-detail-container">
        {/* ── 1. Top Breadcrumb & Back Navigation ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <Link
            className="project-detail-back"
            to="/projects"
            style={{
              margin: 0,
              padding: '8px 16px',
              borderRadius: '9999px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowLeft size={16} /> All Completed Projects
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#64748b', fontWeight: '600' }}>
            <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link to="/projects" style={{ color: '#64748b', textDecoration: 'none' }}>Projects</Link>
            <span>/</span>
            <span style={{ color: '#0f172a', fontWeight: '800' }}>{project.category || 'Epoxy Flooring'}</span>
          </div>
        </div>

        {/* ── 2. Prominent Project Hero Header ── */}
        <header style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '850',
                letterSpacing: '0.08em',
                background: '#ffedd5',
                color: '#c2410c',
                padding: '4px 12px',
                borderRadius: '6px',
                textTransform: 'uppercase',
              }}
            >
              PROJECT CASE STUDY
            </span>
            {project.category && (
              <span style={{ fontSize: '0.78rem', fontWeight: '800', background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '6px' }}>
                {project.category}
              </span>
            )}
            <span style={{ fontSize: '0.78rem', fontWeight: '800', background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <BadgeCheck size={14} /> Melbourne Certified Installation
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', background: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <ShieldCheck size={14} /> 10-Year Australian Warranty
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.025em', margin: '0 0 16px', lineHeight: '1.2' }}>
            {project.title}
          </h1>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', fontSize: '0.9rem', color: '#475569', fontWeight: '600' }}>
            {project.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ea580c', fontWeight: '750' }}>
                <MapPin size={17} /> {project.location}
              </div>
            )}
            {project.squareMeters && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={16} color="#64748b" /> {project.squareMeters} Total Area
              </div>
            )}
            {project.duration && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock3 size={16} color="#64748b" /> {project.duration} Fast Turnaround
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: '750' }}>
              <Award size={16} /> AS 4586 Slip Resistance Certified
            </div>
          </div>
        </header>

        {/* ── 3. Interactive Before & After Manual Slider Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.1)',
            marginBottom: '36px',
          }}
        >
          <section className="project-slider-wrapper" aria-label="Interactive Before and After Comparison">
            {/* Multi-View Tabs Switcher */}
            {comparisonViews.length > 1 && (
              <div className="project-slider-views-bar">
                <span style={{ fontSize: '0.75rem', fontWeight: '850', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '6px' }}>
                  Camera Angles:
                </span>
                {comparisonViews.map((view, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`project-slider-view-btn ${activeViewIndex === idx ? 'is-active' : ''}`}
                    onClick={() => setActiveViewIndex(idx)}
                  >
                    <SlidersHorizontal size={13} />
                    <span>{view.title || `View ${idx + 1}`}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Slider Container with drag events */}
            <div
              ref={containerRef}
              className={`project-slider-container ${isDragging ? 'is-dragging' : ''}`}
              onMouseDown={handlePointerDown}
              onTouchStart={handlePointerDown}
              onClick={(e) => updateSliderFromClientX(e.clientX)}
              role="slider"
              aria-valuenow={Math.round(sliderPos)}
              aria-valuemin={0}
              aria-valuemax={100}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') setSliderPos((p) => Math.max(0, p - 5));
                if (e.key === 'ArrowRight') setSliderPos((p) => Math.min(100, p + 5));
              }}
            >
              {/* ── BEFORE IMAGE (Base Layer) ── */}
              <div className="project-slider-layer">
                <img
                  src={currentView.beforeImage || getProjectFallbackImage(project)}
                  alt="Before concrete slab preparation"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getProjectFallbackImage(project);
                  }}
                />
              </div>

              {/* BEFORE BADGE — Smoothly fades out when sliding to 100% AFTER */}
              <div
                className="project-slider-badge-before"
                style={{
                  opacity: beforeBadgeOpacity,
                  transform: `scale(${beforeBadgeOpacity > 0.05 ? 0.95 + 0.05 * beforeBadgeOpacity : 0.9})`,
                  pointerEvents: beforeBadgeOpacity > 0 ? 'auto' : 'none',
                }}
              >
                {currentView.beforeLabel || 'BEFORE: Porous & Stained Slab'}
              </div>

              {/* ── AFTER IMAGE (Clipped Overlay Layer) ── */}
              <div
                className="project-slider-layer"
                style={{
                  clipPath: `polygon(${sliderPos}% 0%, 100% 0%, 100% 100%, ${sliderPos}% 100%)`,
                  WebkitClipPath: `polygon(${sliderPos}% 0%, 100% 0%, 100% 100%, ${sliderPos}% 100%)`,
                }}
              >
                <img
                  src={currentView.afterImage || getProjectFallbackImage(project)}
                  alt="Completed epoxy flooring installation"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getProjectFallbackImage(project);
                  }}
                />
              </div>

              {/* AFTER BADGE — Smoothly fades out when sliding to 100% BEFORE */}
              <div
                className="project-slider-badge-after"
                style={{
                  opacity: afterBadgeOpacity,
                  transform: `scale(${afterBadgeOpacity > 0.05 ? 0.95 + 0.05 * afterBadgeOpacity : 0.9})`,
                  pointerEvents: afterBadgeOpacity > 0 ? 'auto' : 'none',
                }}
              >
                {currentView.afterLabel || 'AFTER: APC Ultra Flake® + Sparta-Guard®'}
              </div>

              {/* ── VERTICAL DIVIDER LINE ── */}
              <div
                className="project-slider-divider-line"
                style={{ left: `${sliderPos}%` }}
              />

              {/* ── DRAGGABLE CENTER HANDLE ── */}
              <div
                className="project-slider-drag-handle"
                style={{ left: `${sliderPos}%` }}
                title="Drag left or right to manually compare Before & After"
              >
                <SlidersHorizontal size={20} strokeWidth={2.4} />
              </div>
            </div>

            {/* Slider Bottom Toolbar with instructions & corrected quick buttons */}
            <div className="project-slider-toolbar">
              <div className="project-slider-hint">
                <SlidersHorizontal size={15} style={{ color: '#ea580c' }} />
                <span>Drag the orange handle horizontally or tap anywhere on the image to compare</span>
              </div>

              <div className="project-slider-quick-buttons">
                {/* 100% Before: Slider position 100 reveals the entire before image on the left */}
                <button
                  type="button"
                  className={`project-slider-quick-btn ${sliderPos >= 98 ? 'is-active' : ''}`}
                  onClick={() => setSliderPos(100)}
                >
                  100% Before
                </button>
                {/* 50/50 Split */}
                <button
                  type="button"
                  className={`project-slider-quick-btn ${sliderPos >= 45 && sliderPos <= 55 ? 'is-active' : ''}`}
                  onClick={() => setSliderPos(50)}
                >
                  50 / 50 Split
                </button>
                {/* 100% After: Slider position 0 reveals the entire after image on the right */}
                <button
                  type="button"
                  className={`project-slider-quick-btn ${sliderPos <= 2 ? 'is-active' : ''}`}
                  onClick={() => setSliderPos(0)}
                >
                  100% After
                </button>
              </div>
            </div>
          </section>
        </motion.div>

        {/* ── 4. Two-Column Comprehensive Layout: Main Content (Left) + Sticky Sidebar (Right) ── */}
        <div className="project-main-grid">
          {/* ── Left Column: Scope, Technical Steps, Gallery, Testimonial ── */}
          <div className="project-main-content">
            {/* Project Scope & Substrate Diagnosis */}
            <section className="project-scope-card">
              <span className="landing-eyebrow">SUBSTRATE DIAGNOSIS &amp; SCOPE</span>
              <h3>Project Overview &amp; Mechanical Scope</h3>
              <p style={{ fontSize: '0.96rem', lineHeight: '1.75', color: '#475569', margin: '0 0 20px', whiteSpace: 'pre-line' }}>
                {project.description || 'A comprehensive concrete slab preparation and polymer coating installation completed by Floor Shield Australia certified specialists.'}
              </p>

              {/* Problem vs Solution Comparison Box */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div>
                  <strong style={{ fontSize: '0.82rem', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <X size={14} /> Initial Substrate Challenges
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6' }}>
                    <li>Oil and chemical penetration from years of heavy vehicular use</li>
                    <li>Expansion joint edge spalling and micro-fissure concrete cracking</li>
                    <li>Unsealed porous surface generating fine alkaline dust</li>
                  </ul>
                </div>
                <div>
                  <strong style={{ fontSize: '0.82rem', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <CheckCircle2 size={14} /> Engineering Solution Installed
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6' }}>
                    <li>30-grit diamond grinding opening concrete pores to CSP 2-3 standard</li>
                    <li>100% solid epoxy primer creating deep mechanical fusion</li>
                    <li>Dual-coat Sparta-Guard® Polyaspartic topcoat (UV stable &amp; hot-tire proof)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 4-Stage Technical Installation Breakdown */}
            <section style={{ marginBottom: '32px' }}>
              <span className="landing-eyebrow">TECHNICAL INSTALLATION</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
                4-Stage Australian Coating Architecture
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 16px' }}>
                How Floor Shield transformed this concrete substrate using genuine Australian-made polymer technology:
              </p>

              <div className="project-tech-grid">
                <div className="project-tech-card">
                  <div className="project-tech-card-header">
                    <div className="project-tech-card-icon"><Wrench size={16} /></div>
                    <span className="project-tech-card-step">Stage 01</span>
                  </div>
                  <h4>Diamond Mechanical Prep</h4>
                  <p>Planetary diamond grinding opens concrete capillaries (CSP 2-3) and removes oil and failed sealers.</p>
                </div>

                <div className="project-tech-card">
                  <div className="project-tech-card-header">
                    <div className="project-tech-card-icon"><Shield size={16} /></div>
                    <span className="project-tech-card-step">Stage 02</span>
                  </div>
                  <h4>Deep Moisture Barrier</h4>
                  <p>100% solids epoxy primer bonds deep into concrete to prevent hydrostatic vapor bubbling.</p>
                </div>

                <div className="project-tech-card">
                  <div className="project-tech-card-header">
                    <div className="project-tech-card-icon"><Layers size={16} /></div>
                    <span className="project-tech-card-step">Stage 03</span>
                  </div>
                  <h4>Full Broadcast System</h4>
                  <p>100% full flake or metallic broadcast ensures high-impact durability and uniform coverage.</p>
                </div>

                <div className="project-tech-card">
                  <div className="project-tech-card-header">
                    <div className="project-tech-card-icon"><Sparkles size={16} /></div>
                    <span className="project-tech-card-step">Stage 04</span>
                  </div>
                  <h4>Sparta-Guard® Clear Seal</h4>
                  <p>Dual-coat polyaspartic topcoat delivers hot-tire pickup resistance, UV stability, and chemical proofing.</p>
                </div>
              </div>
            </section>

            {/* Additional Project Gallery Grid */}
            {allGalleryImages.length > 0 && (
              <section style={{ marginBottom: '32px' }}>
                <span className="landing-eyebrow">VISUAL PROOF</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>
                      Installation Photo Gallery ({allGalleryImages.length} High-Res Photos)
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                      Click any photo to inspect texture, gloss reflection, and diamond grinding details in full resolution.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
                  {allGalleryImages.map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveLightboxImg(img)}
                      style={{
                        height: '140px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '1.5px solid #e2e8f0',
                        position: 'relative',
                        background: '#f1f5f9',
                        boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                      }}
                    >
                      <img
                        src={img}
                        alt={`Project gallery photo ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(15,23,42,0.35)',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}
                      >
                        <Maximize2 size={22} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Client Attribution & Testimonial Quote */}
            {(project.clientName || project.clientCompany || project.testimonial) && (
              <section style={{ marginBottom: '28px' }}>
                {(project.clientName || project.clientCompany) && (
                  <div className="project-detail-client" aria-label="Project client" style={{ marginBottom: '14px' }}>
                    <span className="project-detail-client-icon"><Building2 size={19} /></span>
                    <div>
                      <span className="project-detail-client-label">PROJECT CLIENT &amp; FACILITY</span>
                      {project.clientCompany && <strong>{project.clientCompany}</strong>}
                      {project.clientName && (
                        <span className="project-detail-client-name">
                          <UserRound size={14} /> {project.clientName}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {project.testimonial && (
                  <blockquote className="project-detail-testimonial" style={{ margin: 0 }}>
                    <span className="project-detail-review-label">
                      <Star size={14} fill="currentColor" /> VERIFIED CUSTOMER STORY
                    </span>
                    <p style={{ fontSize: '1.05rem', margin: '8px 0 10px', fontStyle: 'italic', color: '#1e293b' }}>
                      “{project.testimonial}”
                    </p>
                    {project.clientName && <cite>— {project.clientName}</cite>}
                  </blockquote>
                )}
              </section>
            )}
          </div>

          {/* ── Right Column: Sticky Sidebar (Specifications + Instant Quote CTA) ── */}
          <aside className="project-sticky-sidebar">
            {/* System Specifications Card */}
            <div className="project-sidebar-card">
              <h3>
                <Layers size={18} color="#ea580c" />
                Flooring Specifications
              </h3>
              <div className="project-spec-list">
                {project.finish && (
                  <div className="project-spec-item">
                    <span>System Finish</span>
                    <strong>{project.finish}</strong>
                  </div>
                )}
                {project.category && (
                  <div className="project-spec-item">
                    <span>Category</span>
                    <strong>{project.category}</strong>
                  </div>
                )}
                {project.squareMeters && (
                  <div className="project-spec-item">
                    <span>Floor Area</span>
                    <strong>{project.squareMeters}</strong>
                  </div>
                )}
                {project.duration && (
                  <div className="project-spec-item">
                    <span>Turnaround Time</span>
                    <strong>{project.duration}</strong>
                  </div>
                )}
                <div className="project-spec-item">
                  <span>Substrate Prep</span>
                  <strong>30-Grit Diamond Grind</strong>
                </div>
                <div className="project-spec-item">
                  <span>Slip Rating</span>
                  <strong>AS 4586 R10 / R11</strong>
                </div>
                <div className="project-spec-item">
                  <span>Warranty</span>
                  <strong style={{ color: '#059669' }}>10 Years Workmanship</strong>
                </div>
                <div className="project-spec-item">
                  <span>Maintenance</span>
                  <strong>Seamless Mop Clean</strong>
                </div>
              </div>
            </div>

            {/* Instant Free Quote Widget */}
            <div
              className="project-sidebar-card"
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: '#ffffff',
                border: '1px solid #334155',
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: '850', color: '#ea580c', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                WANT THIS EXACT FINISH?
              </span>
              <h3 style={{ color: '#ffffff', fontSize: '1.2rem', margin: '0 0 8px' }}>
                Get an Instant Quote for Your Floor
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '0 0 18px', lineHeight: '1.5' }}>
                Use our automated flooring calculator to get a custom price estimate for your space in under 60 seconds.
              </p>

              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setQuoteForm({
                    ...quoteForm,
                    serviceType: project.category || project.finish || quoteForm.serviceType,
                  });
                  navigate(`/get-a-quote?service=${encodeURIComponent(project.category || project.finish || '')}`);
                }}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  background: '#ea580c',
                  borderColor: '#ea580c',
                  marginBottom: '10px',
                }}
              >
                Request Fast Quote <ArrowRight size={16} />
              </button>

              <a
                href={`tel:${cleanPhone}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#ffffff',
                  fontSize: '0.86rem',
                  fontWeight: '750',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
              >
                <Phone size={15} color="#ea580c" /> Call {contactPhone}
              </a>

              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} color="#ea580c" /> Australian-made APC polymer systems
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} color="#ea580c" /> 10-Year commercial &amp; residential warranty
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} color="#ea580c" /> Free on-site measure &amp; coating advice
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ── 5. Bottom Full-Width Guarantee & Next Project Bar ── */}
        <section className="project-cta-banner">
          <div className="project-cta-content">
            <span style={{ fontSize: '0.74rem', fontWeight: '850', color: '#ea580c', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              FLOOR SHIELD AUSTRALIA
            </span>
            <h3>Ready to Upgrade Your Worn Concrete Slab?</h3>
            <p>
              Speak with certified coating technicians in Melbourne. We inspect your concrete, conduct moisture tests, and deliver a clean, lifetime durable floor with zero mess.
            </p>
          </div>
          <div className="project-cta-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setQuoteForm({
                  ...quoteForm,
                  serviceType: project.category || project.finish || quoteForm.serviceType,
                });
                navigate(`/get-a-quote?service=${encodeURIComponent(project.category || project.finish || '')}`);
              }}
              style={{ background: '#ea580c', borderColor: '#ea580c' }}
            >
              Request Free Measure &amp; Quote <ArrowRight size={17} />
            </button>
            <a
              href={`tel:${cleanPhone}`}
              className="btn-secondary"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              <Phone size={16} /> {contactPhone}
            </a>
          </div>
        </section>

        {/* ── 6. Next & Previous Case Study Browser ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginTop: '32px' }}>
          <Link className="btn-secondary" to="/projects">
            <ArrowLeft size={16} /> Back to all projects
          </Link>
          <Link
            className="btn-primary"
            to={getProjectPath(projects[(projects.indexOf(project) + 1) % projects.length] || projects[0])}
          >
            Next case study <ArrowRight size={17} />
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightboxImg(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15,23,42,0.95)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveLightboxImg(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: 0,
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={activeLightboxImg}
              alt="High resolution project view"
              style={{ maxWidth: '92vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '12px' }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
