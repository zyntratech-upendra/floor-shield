import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Building2, MapPin, Star, UserRound } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { getProjectFallbackImage, getProjectPath, getProjectRouteKey, getProjectSlug } from '../utils/projectRoutes';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, loadingData, quoteForm, setQuoteForm } = useSite();
  const project = projects.find((item) => (
    getProjectRouteKey(item) === projectId || getProjectSlug(item) === projectId
  ));

  if (!project && loadingData) {
    return (
      <div className="container project-detail-state" role="status">
        Loading project…
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container project-detail-state">
        <h1>Project not found</h1>
        <p>This project may have been removed or the link may be incorrect.</p>
        <Link className="btn-primary" to="/projects"><ArrowLeft size={17} /> View all projects</Link>
      </div>
    );
  }

  return (
    <main className="project-detail-page">
      <div className="container project-detail-container">
        <Link className="project-detail-back" to="/projects">
          <ArrowLeft size={17} /> All projects
        </Link>
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="project-detail-card"
        >
          <div className="project-detail-image">
            <img
              src={project.imageAfter || getProjectFallbackImage(project)}
              alt={`${project.title} completed flooring`}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = getProjectFallbackImage(project);
              }}
            />
            {project.category && <span className="project-detail-category">{project.category}</span>}
          </div>
          <div className="project-detail-content">
            <span className="landing-eyebrow">PROJECT CASE STUDY</span>
            <h1>{project.title}</h1>
            {project.location && (
              <div className="project-detail-location"><MapPin size={17} /> {project.location}</div>
            )}
            <div className="project-detail-facts">
              {project.finish && <div><span>Flooring system</span><strong>{project.finish}</strong></div>}
              {project.squareMeters && <div><span>Floor area</span><strong>{project.squareMeters}</strong></div>}
              {project.duration && <div><span>Installation time</span><strong>{project.duration}</strong></div>}
            </div>
            {project.description && <p className="project-detail-description">{project.description}</p>}
            {(project.clientName || project.clientCompany) && (
              <section className="project-detail-client" aria-label="Project client">
                <span className="project-detail-client-icon"><Building2 size={19} /></span>
                <div>
                  <span className="project-detail-client-label">PROJECT CLIENT</span>
                  {project.clientCompany && <strong>{project.clientCompany}</strong>}
                  {project.clientName && (
                    <span className="project-detail-client-name"><UserRound size={14} /> {project.clientName}</span>
                  )}
                </div>
              </section>
            )}
            {project.testimonial && (
              <blockquote className="project-detail-testimonial">
                <span className="project-detail-review-label"><Star size={14} fill="currentColor" /> CLIENT REVIEW</span>
                <p>“{project.testimonial}”</p>
                {project.clientName && <cite>— {project.clientName}</cite>}
              </blockquote>
            )}
            <div className="project-detail-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  setQuoteForm({ ...quoteForm, serviceType: project.category || project.finish || quoteForm.serviceType });
                  navigate('/calculator');
                }}
              >
                Request a similar floor <ArrowRight size={17} />
              </button>
              <Link className="btn-secondary" to={getProjectPath(projects[(projects.indexOf(project) + 1) % projects.length])}>
                Next project <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </motion.article>
      </div>
    </main>
  );
}
