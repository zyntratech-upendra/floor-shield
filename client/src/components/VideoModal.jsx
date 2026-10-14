import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, X } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function VideoModal() {
  const { activeVideoModal, setActiveVideoModal } = useSite();

  return (
    <AnimatePresence>
      {activeVideoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setActiveVideoModal(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '20px',
              overflow: 'hidden',
              maxWidth: '850px',
              width: '100%',
              border: '2px solid #ea580c',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              backgroundColor: '#1e293b',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Video size={20} color="#ea580c" />
                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{activeVideoModal.title}</span>
              </div>
              <button 
                onClick={() => setActiveVideoModal(null)}
                style={{ background: 'none', color: '#cbd5e1', border: 'none', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ position: 'relative', width: '100%', backgroundColor: '#000000', maxHeight: '480px' }}>
              <video 
                src={activeVideoModal.videoUrl}
                controls
                autoPlay
                style={{ width: '100%', maxHeight: '480px', display: 'block' }}
              />
            </div>

            <div style={{ padding: '20px 24px', color: '#cbd5e1', backgroundColor: '#0f172a' }}>
              <span className="badge badge-orange" style={{ marginBottom: '8px', display: 'inline-block' }}>{activeVideoModal.tag}</span>
              <p style={{ fontSize: '0.95rem', margin: 0, color: '#94a3b8' }}>{activeVideoModal.desc}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
