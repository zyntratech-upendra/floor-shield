import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { apcProductLines } from '../utils/siteData';
import { fadeInUp, staggerContainer } from '../utils/constants';

export default function ProductsPage() {
  const navigate = useNavigate();
  const { quoteForm, setQuoteForm } = useSite();

  return (
    <div className="container" style={{ paddingTop: '50px', paddingBottom: '90px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: '800px', marginBottom: '44px' }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span className="badge badge-orange">ALL PURPOSE COATINGS (APC) SPECIFICATION</span>
          <span className="badge badge-blue">AUSTRALIAN MADE CHEMISTRY</span>
        </div>
        <h1 style={{ fontSize: '2.6rem', marginBottom: '16px', color: '#0f172a' }}>
          Engineered Resins, Flake Systems &amp; Topcoats
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6 }}>
          Floor Shield installs genuine formulations from <strong style={{ color: '#0f172a' }}>All Purpose Coatings (APC)</strong>. From the iconic Ultra Flake® and stone-look Hyper Flake® to 100% solids EPO100T® industrial epoxy and rapid-curing Sparta-Guard® polyaspartic coatings.
        </p>
      </motion.div>

      <motion.div 
        className="grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {apcProductLines.map((prod) => (
          <motion.div 
            key={prod.id}
            variants={fadeInUp}
            className="card-clean"
            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ height: '220px', position: 'relative', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
              <img 
                src={prod.image} 
                alt={prod.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', top: '12px', left: '12px',
                backgroundColor: '#0f172a', color: '#ffffff',
                padding: '4px 10px', borderRadius: '6px',
                fontSize: '0.75rem', fontWeight: '800'
              }}>
                {prod.badge}
              </div>
              <div style={{
                position: 'absolute', bottom: '12px', right: '12px',
                backgroundColor: '#ea580c', color: '#ffffff',
                padding: '4px 10px', borderRadius: '6px',
                fontSize: '0.8rem', fontWeight: '800'
              }}>
                From {prod.startingPrice}
              </div>
            </div>

            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '8px', color: '#0f172a' }}>{prod.name}</h3>
                <div style={{ fontSize: '0.8rem', color: '#ea580c', fontWeight: '700', marginBottom: '12px' }}>
                  Base: {prod.resinBase}
                </div>
                <p style={{ fontSize: '0.9rem', marginBottom: '18px', color: '#475569' }}>{prod.description}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
                  {prod.specs.map((spec, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#334155' }}>
                      <CheckCircle2 size={15} color="#059669" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  setQuoteForm({ ...quoteForm, serviceType: prod.name });
                  navigate(`/get-a-quote?service=${encodeURIComponent(prod.name)}`);
                }}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
              >
                <span>Inquire About {prod.name}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
