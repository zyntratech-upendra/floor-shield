import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export default function FloatingQuoteButton() {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="floating-quote-bubble"
      aria-label="Get an instant free quote"
      title="Get an instant free quote"
      onClick={() => {
        navigate('/get-a-quote');
        const elem = document.getElementById('estimator-section');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageSquare size={18} />
      <span>Instant Free Quote</span>
    </motion.div>
  );
}
