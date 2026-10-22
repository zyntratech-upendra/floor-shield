import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Camera,
  Clock3,
  Edit3,
  Eye,
  Layers,
  MapPin,
  MoveDown,
  MoveUp,
  Plus,
  Search,
  SlidersHorizontal,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { API_BASE } from '../adminConstants';
import { Field } from '../AdminShared';
import { getProjectFallbackImage, getProjectPath } from '../../utils/projectRoutes';

const emptyProject = {
  title: '',
  location: '',
  category: '',
  finish: '',
  squareMeters: '',
  duration: '',
  description: '',
  imageBefore: '',
  imageAfter: '',
  beforeImages: [],
  afterImages: [],
  comparisonViews: [],
  clientName: '',
  clientCompany: '',
  testimonial: '',
};

const metricStyle = {
  padding: '17px 20px',
  borderRadius: '14px',
  border: '1px solid #e8edf3',
  background: '#fff',
  boxShadow: '0 3px 12px rgba(15, 23, 42, 0.035)',
};

export default function ProjectsPage({ projects, onAdd, onUpdate, onDelete }) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
  const [formError, setFormError] = useState('');

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...projects]
      .filter((project) => !query || [
        project.title,
        project.location,
        project.category,
        project.finish,
        project.clientName,
        project.clientCompany,
      ].some((value) => value?.toLowerCase().includes(query)))
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
  }, [projects, search]);

  const reviewedCount = projects.filter((project) => project.testimonial?.trim()).length;
  const categoriesCount = new Set(projects.map((project) => project.category).filter(Boolean)).size;

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyProject,
      comparisonViews: [
        {
          title: 'Main Floor Bay',
          beforeImage: '',
          afterImage: '',
          beforeLabel: 'BEFORE: Porous & Stained Slab',
          afterLabel: 'AFTER: APC Ultra Flake® + Sparta-Guard®',
        },
      ],
    });
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (project) => {
    setEditingId(project._id || project.id);
    const beforeList = Array.isArray(project.beforeImages) && project.beforeImages.length > 0
      ? project.beforeImages
      : (project.imageBefore ? [project.imageBefore] : []);
    const afterList = Array.isArray(project.afterImages) && project.afterImages.length > 0
      ? project.afterImages
      : (project.imageAfter ? [project.imageAfter] : []);

    let views = Array.isArray(project.comparisonViews) && project.comparisonViews.length > 0
      ? project.comparisonViews.map((v) => ({ ...v }))
      : [];

    if (views.length === 0 && (project.imageBefore || project.imageAfter || beforeList[0] || afterList[0])) {
      views = [
        {
          title: 'Main Floor Bay',
          beforeImage: project.imageBefore || beforeList[0] || '',
          afterImage: project.imageAfter || afterList[0] || '',
          beforeLabel: 'BEFORE: Porous & Stained Slab',
          afterLabel: 'AFTER: APC Ultra Flake® + Sparta-Guard®',
        },
      ];
    }

    setForm({
      ...emptyProject,
      ...project,
      beforeImages: beforeList,
      afterImages: afterList,
      comparisonViews: views,
    });
    setFormError('');
    setShowForm(true);
  };

  /* ── Cloudinary Upload Helper (Single File) ── */
  const uploadSingleImageToCloudinary = async (file) => {
    if (!file) return null;
    const payload = new FormData();
    payload.append('image', file);
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('fs_admin_token')}` },
      body: payload,
    });
    const result = await response.json();
    if (response.ok && result.success && result.url) {
      return result.url;
    }
    throw new Error(result.message || 'Image upload failed. Check connection.');
  };

  /* ── Cloudinary Upload for Comparison View (Before or After) ── */
  const handleViewImageUpload = async (viewIndex, side, file) => {
    if (!file) return;
    const uploadKey = `view-${viewIndex}-${side}`;
    setUploading(uploadKey);
    setFormError('');
    try {
      const url = await uploadSingleImageToCloudinary(file);
      if (url) {
        setForm((prev) => {
          const views = [...(prev.comparisonViews || [])];
          if (views[viewIndex]) {
            views[viewIndex] = {
              ...views[viewIndex],
              [side === 'before' ? 'beforeImage' : 'afterImage']: url,
            };
          }
          return { ...prev, comparisonViews: views };
        });
      }
    } catch (err) {
      setFormError(`Upload failed: ${err.message}`);
    } finally {
      setUploading('');
    }
  };

  /* ── Add New Comparison View ── */
  const addComparisonView = () => {
    setForm((prev) => {
      const existing = prev.comparisonViews || [];
      const nextNum = existing.length + 1;
      return {
        ...prev,
        comparisonViews: [
          ...existing,
          {
            title: `View ${nextNum}: Angle & Detail`,
            beforeImage: '',
            afterImage: '',
            beforeLabel: 'BEFORE: Unprepared Concrete',
            afterLabel: 'AFTER: Premium Polymer Finish',
          },
        ],
      };
    });
  };

  /* ── Update Specific View Field ── */
  const updateComparisonView = (index, field, value) => {
    setForm((prev) => {
      const views = [...(prev.comparisonViews || [])];
      if (views[index]) {
        views[index] = { ...views[index], [field]: value };
      }
      return { ...prev, comparisonViews: views };
    });
  };

  /* ── Remove Comparison View ── */
  const removeComparisonView = (index) => {
    setForm((prev) => ({
      ...prev,
      comparisonViews: (prev.comparisonViews || []).filter((_, i) => i !== index),
    }));
  };

  /* ── Move Comparison View ── */
  const moveComparisonView = (index, direction) => {
    setForm((prev) => {
      const views = [...(prev.comparisonViews || [])];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= views.length) return prev;
      const temp = views[index];
      views[index] = views[targetIndex];
      views[targetIndex] = temp;
      return { ...prev, comparisonViews: views };
    });
  };

  /* ── Multiple Images Upload for Gallery ── */
  const uploadMultipleImages = async (groupField, files) => {
    if (!files || files.length === 0) return;
    setUploading(groupField);
    setFormError('');
    try {
      const uploadedUrls = [];
      for (const file of Array.from(files)) {
        const url = await uploadSingleImageToCloudinary(file);
        if (url) uploadedUrls.push(url);
      }
      if (uploadedUrls.length > 0) {
        setForm((prev) => {
          const currentList = Array.isArray(prev[groupField]) ? prev[groupField] : [];
          const updatedList = [...currentList, ...uploadedUrls];
          const legacySingleKey = groupField === 'beforeImages' ? 'imageBefore' : 'imageAfter';
          return {
            ...prev,
            [groupField]: updatedList,
            [legacySingleKey]: prev[legacySingleKey] || updatedList[0] || '',
          };
        });
      }
    } catch (error) {
      setFormError(error.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading('');
    }
  };

  const removeImageFromGroup = (groupField, indexToRemove) => {
    setForm((prev) => {
      const currentList = Array.isArray(prev[groupField]) ? prev[groupField] : [];
      const updatedList = currentList.filter((_, idx) => idx !== indexToRemove);
      const legacySingleKey = groupField === 'beforeImages' ? 'imageBefore' : 'imageAfter';
      return {
        ...prev,
        [groupField]: updatedList,
        [legacySingleKey]: updatedList[0] || '',
      };
    });
  };

  const submitProject = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setFormError('Add a project title before saving.');
      return;
    }
    setSaving(true);
    setFormError('');

    try {
      // Sync primary images and gallery arrays
      const views = form.comparisonViews || [];
      const primaryBefore = views[0]?.beforeImage || form.imageBefore || form.beforeImages?.[0] || '';
      const primaryAfter = views[0]?.afterImage || form.imageAfter || form.afterImages?.[0] || '';

      // Collect all view images into arrays for backwards compatibility
      const allBefore = [...(form.beforeImages || [])];
      const allAfter = [...(form.afterImages || [])];
      views.forEach((v) => {
        if (v.beforeImage && !allBefore.includes(v.beforeImage)) allBefore.push(v.beforeImage);
        if (v.afterImage && !allAfter.includes(v.afterImage)) allAfter.push(v.afterImage);
      });

      const payload = {
        ...form,
        imageBefore: primaryBefore,
        imageAfter: primaryAfter,
        beforeImages: allBefore,
        afterImages: allAfter,
        comparisonViews: views,
      };

      const saved = editingId
        ? await onUpdate(editingId, payload)
        : await onAdd(payload);

      if (saved) setShowForm(false);
      else setFormError('The project could not be saved. Check connection and try again.');
    } catch (err) {
      setFormError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const removeProject = async (project) => {
    const confirmed = window.confirm(`Delete "${project.title}" from the project portfolio?`);
    if (confirmed) await onDelete(project._id || project.id);
  };

  return (
    <div className="project-admin-page">
      <div className="project-admin-heading">
        <div>
          <span className="project-admin-kicker">PORTFOLIO CONTENT</span>
          <h2>Project management</h2>
          <p>Add completed work, keep project details current, and publish the customer story alongside each result.</p>
        </div>
        <motion.button
          type="button"
          className="project-admin-primary-button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
        >
          <Plus size={17} /> Add project
        </motion.button>
      </div>

      <div className="project-admin-metrics">
        <div style={metricStyle}>
          <span>Portfolio projects</span>
          <strong>{projects.length}</strong>
          <small>Saved in the project database</small>
        </div>
        <div style={metricStyle}>
          <span>With client reviews</span>
          <strong>{reviewedCount}</strong>
          <small>Customer stories shown on project pages</small>
        </div>
        <div style={metricStyle}>
          <span>Flooring systems</span>
          <strong>{categoriesCount}</strong>
          <small>Distinct project categories</small>
        </div>
      </div>

      <div className="project-admin-toolbar">
        <div className="project-admin-search">
          <Search size={17} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects, locations or clients"
            aria-label="Search projects"
          />
          {search && (
            <button type="button" aria-label="Clear search" onClick={() => setSearch('')}>
              <X size={15} />
            </button>
          )}
        </div>
        <span>{visibleProjects.length} {visibleProjects.length === 1 ? 'project' : 'projects'}</span>
      </div>

      {visibleProjects.length ? (
        <div className="project-admin-grid">
          {visibleProjects.map((project, index) => (
            <motion.article
              key={project._id || project.id || project.title}
              className="project-admin-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.035, 0.2) }}
            >
              <div className="project-admin-card-image">
                <img
                  src={project.imageAfter || getProjectFallbackImage(project)}
                  alt={`${project.title} completed floor`}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = getProjectFallbackImage(project);
                  }}
                />
                <span className="project-admin-live-label"><i /> On website</span>
                {project.category && <span className="project-admin-category">{project.category}</span>}
              </div>
              <div className="project-admin-card-body">
                <div className="project-admin-card-location"><MapPin size={14} /> {project.location || 'Location not set'}</div>
                <h3>{project.title}</h3>
                <div className="project-admin-card-facts">
                  {project.squareMeters && <span>{project.squareMeters}</span>}
                  {project.duration && <span><Clock3 size={13} /> {project.duration}</span>}
                  {project.comparisonViews?.length > 0 && (
                    <span style={{ color: '#ea580c', fontWeight: '700' }}>
                      <SlidersHorizontal size={12} style={{ display: 'inline', marginRight: '3px' }} />
                      {project.comparisonViews.length} Slider {project.comparisonViews.length === 1 ? 'View' : 'Views'}
                    </span>
                  )}
                </div>
                <div className="project-admin-client">
                  <span className="project-admin-avatar">{(project.clientName || 'C').trim().charAt(0).toUpperCase()}</span>
                  <span>
                    <strong>{project.clientName || 'Client not added'}</strong>
                    <small>{project.clientCompany || 'Client / organization'}</small>
                  </span>
                </div>
                {project.testimonial ? (
                  <div className="project-admin-review">
                    <Star size={14} fill="currentColor" />
                    <p>“{project.testimonial}”</p>
                  </div>
                ) : (
                  <div className="project-admin-review is-empty">No client review added yet.</div>
                )}
                <div className="project-admin-card-actions">
                  <Link to={getProjectPath(project)} target="_blank" rel="noreferrer" className="project-admin-view-link">
                    View details <ArrowUpRight size={15} />
                  </Link>
                  <button type="button" aria-label={`Edit ${project.title}`} onClick={() => openEdit(project)}>
                    <Edit3 size={15} /> Edit
                  </button>
                  <button type="button" className="is-danger" aria-label={`Delete ${project.title}`} onClick={() => removeProject(project)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="project-admin-empty">
          <span><Camera size={25} /></span>
          <h3>{search ? 'No matching projects' : 'Your project portfolio starts here'}</h3>
          <p>{search ? 'Try a different project title, location or client.' : 'Add a completed project and its client review to publish a case study on the website.'}</p>
          {!search && <button type="button" className="project-admin-primary-button" onClick={openCreate}><Plus size={16} /> Add first project</button>}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            className="project-admin-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false); }}
          >
            <motion.section
              className="project-admin-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-form-title"
              initial={{ opacity: 0, y: 18, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.99 }}
              style={{ maxWidth: '880px', width: '95vw', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
            >
              <header className="project-admin-modal-header">
                <div>
                  <span className="project-admin-kicker">{editingId ? 'EDIT CASE STUDY' : 'NEW CASE STUDY'}</span>
                  <h2 id="project-form-title">{editingId ? 'Update project' : 'Add a project'}</h2>
                  <p>Upload multi-view Before &amp; After combinations with manual sliders for customer visual proof.</p>
                </div>
                <button type="button" className="project-admin-close" aria-label="Close project editor" onClick={() => setShowForm(false)}>
                  <X size={19} />
                </button>
              </header>

              <form onSubmit={submitProject} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                <div className="project-admin-form-content" style={{ overflowY: 'auto', padding: '24px' }}>
                  {/* Section 01: Project overview */}
                  <section className="project-admin-form-section">
                    <div className="project-admin-section-title">
                      <span>01</span>
                      <div>
                        <h3>Project overview</h3>
                        <p>Core details shown on portfolio and case study pages.</p>
                      </div>
                    </div>
                    <div className="project-admin-form-grid">
                      <div className="project-admin-span-two">
                        <Field
                          label="Project title *"
                          value={form.title}
                          onChange={(event) => updateField('title', event.target.value)}
                          placeholder="e.g. Luxury 4-Car Garage — APC Ultra Flake® (Onyx Series)"
                        />
                      </div>
                      <Field label="Location" value={form.location} onChange={(event) => updateField('location', event.target.value)} placeholder="Brighton, Victoria" />
                      <Field label="Flooring system / category" value={form.category} onChange={(event) => updateField('category', event.target.value)} placeholder="APC Ultra Flake® System" />
                      <Field label="Finish" value={form.finish} onChange={(event) => updateField('finish', event.target.value)} placeholder="Full Broadcast Flake + Sparta-Guard® Topcoat" />
                      <div className="project-admin-form-grid project-admin-nested-grid">
                        <Field label="Floor area" value={form.squareMeters} onChange={(event) => updateField('squareMeters', event.target.value)} placeholder="85 sqm" />
                        <Field label="Installation time" value={form.duration} onChange={(event) => updateField('duration', event.target.value)} placeholder="1 Day Fast Return" />
                      </div>
                      <div className="project-admin-span-two">
                        <Field
                          label="Project story / scope"
                          value={form.description || ''}
                          onChange={(event) => updateField('description', event.target.value)}
                          placeholder="Explain the substrate condition, mechanical diamond grinding, crack treatment, basecoat, flake broadcast, and Sparta-Guard® polyaspartic topcoat."
                          multiline
                          rows={4}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Section 02: Multi-View Before & After Comparison Combinations */}
                  <section className="project-admin-form-section">
                    <div className="project-admin-section-title">
                      <span>02</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ margin: 0 }}>Interactive Before &amp; After Combinations</h3>
                          <span style={{ fontSize: '0.72rem', background: '#ffedd5', color: '#c2410c', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>
                            SLIDER VIEWS
                          </span>
                        </div>
                        <p>Upload Before and After photos for multiple views/angles. Customers can manually drag the slider to compare each angle.</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {form.comparisonViews?.map((view, vIdx) => (
                        <div
                          key={vIdx}
                          style={{
                            background: '#ffffff',
                            border: '1.5px solid #e2e8f0',
                            borderRadius: '14px',
                            padding: '16px',
                            boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                              <span style={{ width: '26px', height: '26px', background: '#0f172a', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800' }}>
                                {vIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={view.title}
                                onChange={(e) => updateComparisonView(vIdx, 'title', e.target.value)}
                                placeholder="View name (e.g. Main Floor Bay, Workshop Angle, Texture Detail)"
                                style={{
                                  fontWeight: '700',
                                  fontSize: '0.95rem',
                                  border: '1px solid transparent',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  background: '#f8fafc',
                                  width: '75%',
                                }}
                              />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <button
                                type="button"
                                onClick={() => moveComparisonView(vIdx, -1)}
                                disabled={vIdx === 0}
                                style={{ background: '#f1f5f9', border: 0, padding: '5px', borderRadius: '6px', cursor: vIdx === 0 ? 'not-allowed' : 'pointer', opacity: vIdx === 0 ? 0.4 : 1 }}
                                title="Move up"
                              >
                                <MoveUp size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveComparisonView(vIdx, 1)}
                                disabled={vIdx === (form.comparisonViews?.length || 0) - 1}
                                style={{ background: '#f1f5f9', border: 0, padding: '5px', borderRadius: '6px', cursor: vIdx === (form.comparisonViews?.length || 0) - 1 ? 'not-allowed' : 'pointer', opacity: vIdx === (form.comparisonViews?.length || 0) - 1 ? 0.4 : 1 }}
                                title="Move down"
                              >
                                <MoveDown size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeComparisonView(vIdx)}
                                style={{ background: '#fee2e2', color: '#ef4444', border: 0, padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', fontWeight: '700' }}
                                title="Delete this comparison view"
                              >
                                <Trash2 size={13} /> Remove
                              </button>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                            {/* BEFORE PHOTO */}
                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                  BEFORE PHOTO
                                </span>
                                <label
                                  htmlFor={`upload-view-${vIdx}-before`}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: '#ea580c',
                                    background: '#fff',
                                    border: '1px solid #fed7aa',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <Upload size={12} />
                                  {uploading === `view-${vIdx}-before` ? 'Uploading…' : 'Upload to Cloudinary'}
                                </label>
                                <input
                                  id={`upload-view-${vIdx}-before`}
                                  type="file"
                                  accept="image/*"
                                  hidden
                                  disabled={!!uploading}
                                  onChange={(e) => handleViewImageUpload(vIdx, 'before', e.target.files?.[0])}
                                />
                              </div>

                              <input
                                type="text"
                                value={view.beforeImage || ''}
                                onChange={(e) => updateComparisonView(vIdx, 'beforeImage', e.target.value)}
                                placeholder="Paste Before Image URL or upload"
                                style={{ width: '100%', fontSize: '0.8rem', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '8px' }}
                              />

                              <input
                                type="text"
                                value={view.beforeLabel || ''}
                                onChange={(e) => updateComparisonView(vIdx, 'beforeLabel', e.target.value)}
                                placeholder="Badge label: e.g. BEFORE: Porous & Stained Slab"
                                style={{ width: '100%', fontSize: '0.76rem', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', color: '#64748b', marginBottom: '8px' }}
                              />

                              <div style={{ height: '140px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1' }}>
                                {view.beforeImage ? (
                                  <img src={view.beforeImage} alt={`Before ${vIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                ) : (
                                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>No before photo uploaded</span>
                                )}
                              </div>
                            </div>

                            {/* AFTER PHOTO */}
                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                  AFTER PHOTO (COMPLETED)
                                </span>
                                <label
                                  htmlFor={`upload-view-${vIdx}-after`}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: '#047857',
                                    background: '#fff',
                                    border: '1px solid #a7f3d0',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <Upload size={12} />
                                  {uploading === `view-${vIdx}-after` ? 'Uploading…' : 'Upload to Cloudinary'}
                                </label>
                                <input
                                  id={`upload-view-${vIdx}-after`}
                                  type="file"
                                  accept="image/*"
                                  hidden
                                  disabled={!!uploading}
                                  onChange={(e) => handleViewImageUpload(vIdx, 'after', e.target.files?.[0])}
                                />
                              </div>

                              <input
                                type="text"
                                value={view.afterImage || ''}
                                onChange={(e) => updateComparisonView(vIdx, 'afterImage', e.target.value)}
                                placeholder="Paste After Image URL or upload"
                                style={{ width: '100%', fontSize: '0.8rem', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '8px' }}
                              />

                              <input
                                type="text"
                                value={view.afterLabel || ''}
                                onChange={(e) => updateComparisonView(vIdx, 'afterLabel', e.target.value)}
                                placeholder="Badge label: e.g. AFTER: APC Ultra Flake® + Sparta-Guard®"
                                style={{ width: '100%', fontSize: '0.76rem', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', color: '#047857', marginBottom: '8px' }}
                              />

                              <div style={{ height: '140px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1' }}>
                                {view.afterImage ? (
                                  <img src={view.afterImage} alt={`After ${vIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                ) : (
                                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>No completed photo uploaded</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addComparisonView}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '12px',
                          background: '#fff',
                          border: '2px dashed #ea580c',
                          borderRadius: '10px',
                          color: '#ea580c',
                          fontWeight: '700',
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={16} /> + Add Another Comparison View (Before &amp; After Pair)
                      </button>
                    </div>

                    {/* Additional Gallery Photos */}
                    <div style={{ marginTop: '24px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                        Additional Gallery Photos (Direct Cloudinary Upload)
                      </strong>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 14px' }}>
                        Upload any additional high-resolution photos that will appear in the project gallery.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                        {/* More Before Photos */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}>
                              Extra Before Photos ({form.beforeImages?.length || 0})
                            </span>
                            <label htmlFor="extra-before-upload" style={{ cursor: 'pointer', fontSize: '0.75rem', color: '#ea580c', fontWeight: '700' }}>
                              <Upload size={12} style={{ display: 'inline', marginRight: '3px' }} />
                              {uploading === 'beforeImages' ? 'Uploading…' : '+ Add Photos'}
                            </label>
                            <input
                              id="extra-before-upload"
                              type="file"
                              accept="image/*"
                              multiple
                              hidden
                              disabled={!!uploading}
                              onChange={(e) => uploadMultipleImages('beforeImages', e.target.files)}
                            />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '8px' }}>
                            {form.beforeImages?.map((url, idx) => (
                              <div key={idx} style={{ position: 'relative', height: '65px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                <img src={url} alt={`Before ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button
                                  type="button"
                                  onClick={() => removeImageFromGroup('beforeImages', idx)}
                                  style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239,68,68,0.9)', color: '#fff', border: 0, borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* More After Photos */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}>
                              Extra Completed Photos ({form.afterImages?.length || 0})
                            </span>
                            <label htmlFor="extra-after-upload" style={{ cursor: 'pointer', fontSize: '0.75rem', color: '#047857', fontWeight: '700' }}>
                              <Upload size={12} style={{ display: 'inline', marginRight: '3px' }} />
                              {uploading === 'afterImages' ? 'Uploading…' : '+ Add Photos'}
                            </label>
                            <input
                              id="extra-after-upload"
                              type="file"
                              accept="image/*"
                              multiple
                              hidden
                              disabled={!!uploading}
                              onChange={(e) => uploadMultipleImages('afterImages', e.target.files)}
                            />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '8px' }}>
                            {form.afterImages?.map((url, idx) => (
                              <div key={idx} style={{ position: 'relative', height: '65px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                <img src={url} alt={`After ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button
                                  type="button"
                                  onClick={() => removeImageFromGroup('afterImages', idx)}
                                  style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239,68,68,0.9)', color: '#fff', border: 0, borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section 03: Client & review */}
                  <section className="project-admin-form-section">
                    <div className="project-admin-section-title">
                      <span>03</span>
                      <div>
                        <h3>Client &amp; review</h3>
                        <p>Add attribution and the customer review connected to this work.</p>
                      </div>
                    </div>
                    <div className="project-admin-form-grid">
                      <Field label="Client name" value={form.clientName || ''} onChange={(event) => updateField('clientName', event.target.value)} placeholder="Customer name (e.g. Julian Thorne)" />
                      <Field label="Business / organization" value={form.clientCompany || ''} onChange={(event) => updateField('clientCompany', event.target.value)} placeholder="Company name (optional)" />
                      <div className="project-admin-span-two">
                        <Field
                          label="Client review"
                          value={form.testimonial || ''}
                          onChange={(event) => updateField('testimonial', event.target.value)}
                          placeholder="Turned an oily 30-year-old concrete slab into a supercar showroom. Dust-free and gorgeous."
                          multiline
                          rows={3}
                        />
                      </div>
                    </div>
                  </section>

                  {formError && (
                    <div className="project-admin-error" role="alert" style={{ marginTop: '12px' }}>
                      {formError}
                    </div>
                  )}
                </div>

                <footer className="project-admin-modal-footer">
                  <button type="button" className="project-admin-cancel-button" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="project-admin-primary-button" disabled={saving || !!uploading}>
                    {saving ? 'Saving project…' : editingId ? 'Save changes' : 'Save project'}
                  </button>
                </footer>
              </form>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
