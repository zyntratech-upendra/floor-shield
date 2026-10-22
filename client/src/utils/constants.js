export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Format numbers nicely with commas
export const fmt = (n) => n?.toLocaleString?.() ?? n;

// Motion animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};
