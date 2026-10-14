import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Phone } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function ServicesPage() {
  const navigate = useNavigate();
  const { services, settings, quoteForm, setQuoteForm } = useSite();

  return (
    <div className="container" style={{ paddingTop: '50px', paddingBottom: '90px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: '750px', marginBottom: '44px' }}
      >
        <span className="badge badge-orange">ENGINEERED APPLICATION SYSTEMS</span>
        <h1 style={{ fontSize: '2.6rem', marginTop: '10px', marginBottom: '14px', color: '#0f172a' }}>
          All Purpose Coatings Turnkey Flooring Systems
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#475569' }}>
          Every system installed by Floor Shield utilizes authentic All Purpose Coatings primers, resins, and Sparta-Guard® polyaspartic coats tested to Australian Standards AS 4586.
        </p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
        {services.map((srv) => (
          <div 
            key={srv.id || srv._id}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)'
            }}
          >
            <div style={{ height: '100%', minHeight: '300px', backgroundColor: '#e2e8f0', position: 'relative' }}>
              <img 
                src={srv.image} 
                alt={srv.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', bottom: '20px', left: '20px',
                backgroundColor: '#ffffff', border: '1px solid #cbd5e1',
                color: '#ea580c', fontWeight: '800',
                padding: '8px 16px', borderRadius: '8px',
                fontSize: '0.9rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}>
                Starting from {srv.priceStarting}
              </div>
            </div>

            <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span className="badge badge-blue">{srv.category}</span>
                  {srv.popular && <span className="badge badge-orange">APC CERTIFIED</span>}
                </div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '12px', color: '#0f172a' }}>{srv.title}</h2>
                <p style={{ fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.6, color: '#475569' }}>
                  {srv.fullDesc || srv.shortDesc}
                </p>

                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#ea580c', letterSpacing: '0.05em', marginBottom: '10px', fontWeight: '800' }}>
                    Engineering Specifications:
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {srv.features?.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
                        <CheckCircle2 size={16} color="#059669" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => {
                    setQuoteForm({ ...quoteForm, serviceType: srv.title });
                    navigate('/calculator');
                  }}
                  className="btn-primary"
                >
                  <span>Calculate Cost For This System</span>
                  <ArrowRight size={16} />
                </button>
                <a 
                  href={`tel:${settings.phone?.replace(/\s+/g, '')}`}
                  className="btn-secondary"
                >
                  <Phone size={16} />
                  <span>Speak to a Flooring Tech</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
