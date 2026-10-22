import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { fadeInUp, staggerContainer } from '../utils/constants';
import { getProjectFallbackImage, getProjectPath } from '../utils/projectRoutes';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, quoteForm, setQuoteForm } = useSite();

  return (
    <div className="container" style={{ paddingTop: '50px', paddingBottom: '90px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: '750px', marginBottom: '44px' }}
      >
        <span className="badge badge-blue">VICTORIAN INDUSTRIAL &amp; RESIDENTIAL PROVEN RESULTS</span>
        <h1 style={{ fontSize: '2.6rem', marginTop: '10px', marginBottom: '14px', color: '#0f172a' }}>
          Completed Transformations
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#475569' }}>
          Explore commercial factories, food production facilities, and residential garages across Victoria completed with All Purpose Coatings systems.
        </p>
      </motion.div>

      <div className="grid-cols-2">
        {projects.map((proj) => (
          <div 
            key={proj.id || proj._id}
            className="card-clean"
            style={{ overflow: 'hidden' }}
          >
            <div style={{ position: 'relative', height: '280px', backgroundColor: '#e2e8f0' }}>
              <img 
                src={proj.imageAfter || getProjectFallbackImage(proj)}
                alt={proj.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = getProjectFallbackImage(proj);
                }}
              />
              <div style={{
                position: 'absolute', top: '16px', left: '16px',
                backgroundColor: '#0f172a', color: '#ffffff',
                padding: '4px 12px', borderRadius: '6px',
                fontSize: '0.8rem', fontWeight: '800'
              }}>
                {proj.category}
              </div>
              <div style={{
                position: 'absolute', bottom: '16px', left: '16px',
                backgroundColor: '#ffffff', color: '#0f172a',
                padding: '6px 12px', borderRadius: '6px',
                fontSize: '0.8rem', fontWeight: '700',
                display: 'flex', alignItems: 'center', gap: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <MapPin size={14} color="#ea580c" />
                <span>{proj.location}</span>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '8px', color: '#0f172a' }}>{proj.title}</h3>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#64748b', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span><strong>Finish:</strong> {proj.finish}</span>
                <span><strong>Size:</strong> {proj.squareMeters}</span>
                <span><strong>Duration:</strong> {proj.duration}</span>
              </div>

              {proj.testimonial && (
                <div style={{
                  backgroundColor: '#f8fafc', borderLeft: '4px solid #ea580c',
                  padding: '12px 16px', borderRadius: '0 8px 8px 0', marginBottom: '16px'
                }}>
                  <p style={{ fontSize: '0.9rem', color: '#334155', fontStyle: 'italic', margin: 0 }}>
                    "{proj.testimonial}"
                  </p>
                  <div style={{ fontSize: '0.8rem', color: '#ea580c', fontWeight: '800', marginTop: '6px' }}>
                    — {proj.clientName}
                  </div>
                </div>
              )}
              {(proj.clientName || proj.clientCompany) && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  marginBottom: '14px', color: '#64748b', fontSize: '0.82rem'
                }}>
                  <strong style={{ color: '#334155' }}>{proj.clientCompany || proj.clientName}</strong>
                  {proj.clientCompany && proj.clientName && <span>· {proj.clientName}</span>}
                </div>
              )}

              <button
                onClick={() => navigate(getProjectPath(proj))}
                className="btn-primary"
                style={{ width: '100%', fontSize: '0.92rem', justifyContent: 'center', marginBottom: '10px' }}
              >
                <span>View project details</span>
                <ArrowRight size={16} />
              </button>
              <button 
                onClick={() => {
                  setQuoteForm({ ...quoteForm, serviceType: proj.category });
                  navigate(`/get-a-quote?service=${encodeURIComponent(proj.category || '')}`);
                }}
                className="btn-secondary"
                style={{ width: '100%', fontSize: '0.85rem', justifyContent: 'center' }}
              >
                <span>Get a Quote for Similar Floor</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
