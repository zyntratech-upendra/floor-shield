import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Building2,
  Camera,
  Clock3,
  Edit3,
  MapPin,
  Plus,
  Search,
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
    setForm(emptyProject);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (project) => {
    setEditingId(project._id || project.id);
    setForm({ ...emptyProject, ...project });
    setFormError('');
    setShowForm(true);
  };

  const uploadImage = async (field, file) => {
    if (!file) return;
    setUploading(field);
    setFormError('');
    try {
      const payload = new FormData();
      payload.append('image', file);
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('fs_admin_token')}` },
        body: payload,
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.url) {
        throw new Error(result.message || 'Image upload failed.');
      }
      updateField(field, result.url);
    } catch (error) {
      setFormError(error.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading('');
    }
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
      const saved = editingId
        ? await onUpdate(editingId, form)
        : await onAdd(form);
      if (saved) setShowForm(false);
      else setFormError('The project could not be saved. Check the connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const removeProject = async (project) => {
    const confirmed = window.confirm(`Delete "${project.title}" from the project portfolio?`);
    if (confirmed) await onDelete(project._id || project.id);
  };

  const renderImageInput = (field, label) => (
    <div className="project-admin-image-field" key={field}>
      <div className="project-admin-field-heading">
        <label htmlFor={`${field}-url`}>{label}</label>
        <label className="project-admin-upload-button" htmlFor={`${field}-upload`}>
          <Upload size={14} />
          {uploading === field ? 'Uploading…' : 'Upload'}
        </label>
        <input
          id={`${field}-upload`}
          type="file"
          accept="image/*"
          hidden
          disabled={!!uploading}
          onChange={(event) => uploadImage(field, event.target.files?.[0])}
        />
      </div>
      <Field
        value={form[field]}
        onChange={(event) => updateField(field, event.target.value)}
        placeholder="Paste an image URL or upload an image"
      />
      {form[field] && (
        <img
          className="project-admin-image-preview"
          src={form[field]}
          alt={`${label} preview`}
          onError={(event) => { event.currentTarget.hidden = true; }}
        />
      )}
    </div>
  );

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
            >
              <header className="project-admin-modal-header">
                <div>
                  <span className="project-admin-kicker">{editingId ? 'EDIT CASE STUDY' : 'NEW CASE STUDY'}</span>
                  <h2 id="project-form-title">{editingId ? 'Update project' : 'Add a project'}</h2>
                  <p>Project details, visual proof, and the client story all in one place.</p>
                </div>
                <button type="button" className="project-admin-close" aria-label="Close project editor" onClick={() => setShowForm(false)}><X size={19} /></button>
              </header>
              <form onSubmit={submitProject}>
                <div className="project-admin-form-content">
                  <section className="project-admin-form-section">
                    <div className="project-admin-section-title"><span>01</span><div><h3>Project overview</h3><p>Core details shown on portfolio and case study pages.</p></div></div>
                    <div className="project-admin-form-grid">
                      <div className="project-admin-span-two"><Field label="Project title *" value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="e.g. Commercial showroom — metallic epoxy" /></div>
                      <Field label="Location" value={form.location} onChange={(event) => updateField('location', event.target.value)} placeholder="Suburb, State" />
                      <Field label="Flooring system / category" value={form.category} onChange={(event) => updateField('category', event.target.value)} placeholder="e.g. APC Ultra Flake®" />
                      <Field label="Finish" value={form.finish} onChange={(event) => updateField('finish', event.target.value)} placeholder="Describe the installed finish" />
                      <div className="project-admin-form-grid project-admin-nested-grid">
                        <Field label="Floor area" value={form.squareMeters} onChange={(event) => updateField('squareMeters', event.target.value)} placeholder="160 sqm" />
                        <Field label="Installation time" value={form.duration} onChange={(event) => updateField('duration', event.target.value)} placeholder="2 days" />
                      </div>
                      <div className="project-admin-span-two"><Field label="Project story / scope" value={form.description || ''} onChange={(event) => updateField('description', event.target.value)} placeholder="Explain the space, preparation, coating system, and result." multiline rows={4} /></div>
                    </div>
                  </section>

                  <section className="project-admin-form-section">
                    <div className="project-admin-section-title"><span>02</span><div><h3>Project imagery</h3><p>Upload before and completed images, or use hosted image URLs.</p></div></div>
                    <div className="project-admin-form-grid">
                      {renderImageInput('imageBefore', 'Before image')}
                      {renderImageInput('imageAfter', 'Completed image')}
                    </div>
                  </section>

                  <section className="project-admin-form-section">
                    <div className="project-admin-section-title"><span>03</span><div><h3>Client &amp; review</h3><p>Add attribution and the customer review connected to this work.</p></div></div>
                    <div className="project-admin-form-grid">
                      <Field label="Client name" value={form.clientName || ''} onChange={(event) => updateField('clientName', event.target.value)} placeholder="Customer or reviewer name" />
                      <Field label="Business / organization" value={form.clientCompany || ''} onChange={(event) => updateField('clientCompany', event.target.value)} placeholder="Company name (optional)" />
                      <div className="project-admin-span-two"><Field label="Client review" value={form.testimonial || ''} onChange={(event) => updateField('testimonial', event.target.value)} placeholder="Add the client's review for this project" multiline rows={4} /></div>
                    </div>
                  </section>
                  {formError && <div className="project-admin-error" role="alert">{formError}</div>}
                </div>
                <footer className="project-admin-modal-footer">
                  <button type="button" className="project-admin-cancel-button" onClick={() => setShowForm(false)}>Cancel</button>
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
