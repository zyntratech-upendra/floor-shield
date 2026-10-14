import fs from 'fs';

const content = fs.readFileSync('./src/App.jsx', 'utf8');
const lines = content.split('\n');

// HomePage is from line 1597 to line 3182
let homeBody = lines.slice(1597, 3182).join('\n');
homeBody = homeBody
  .replace(/setActiveTab\('calculator'\)/g, "navigate('/calculator')")
  .replace(/setActiveTab\('services'\)/g, "navigate('/services')")
  .replace(/setActiveTab\('projects'\)/g, "navigate('/projects')")
  .replace(/setActiveTab\('products'\)/g, "navigate('/products')");

const homeFile = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Play, Pause, Volume2, VolumeX, ShieldCheck, CheckCircle2, 
  ArrowRight, Star, Award, Layers3, Check, HelpCircle, 
  ChevronDown, Phone, Mail, MapPin, Sparkles, Building2, Eye, Wrench
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { 
  featuredVideos, apcSwatches, engineeringProcess, faqs, typewriterPhrases, brandLogos 
} from '../utils/siteData';
import { fadeInUp, staggerContainer } from '../utils/constants';

export default function HomePage() {
  const navigate = useNavigate();
  const { 
    settings, services, projects, reviews, brands, 
    quoteForm, setQuoteForm, setActiveVideoModal 
  } = useSite();

  // Carousel & UI states local to Home
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [heroVideoMuted, setHeroVideoMuted] = useState(true);
  const [beforeAfterPos, setBeforeAfterPos] = useState(50);
  const [activeSwatchId, setActiveSwatchId] = useState('silver-ash');
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);

  // Typewriter state
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Carousel auto-slide loops
  useEffect(() => {
    if (projects.length === 0) return;
    const interval = setInterval(() => {
      setActiveProjectIndex((prev) => (prev + 1) % projects.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [projects.length]);

  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 7500);
    return () => clearInterval(interval);
  }, [reviews.length]);

  // Typewriter effect loop
  useEffect(() => {
    const currentPhrase = typewriterPhrases[typewriterIndex];
    let timer;

    if (!isDeleting) {
      if (displayedText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
        }, 70);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 2400);
      }
    } else {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length - 1));
        }, 35);
      } else {
        setIsDeleting(false);
        setTypewriterIndex((prev) => (prev + 1) % typewriterPhrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, typewriterIndex]);

  const currentProject = projects[activeProjectIndex] || projects[0];

  return (
${homeBody}
  );
}
`;

fs.writeFileSync('./src/pages/HomePage.jsx', homeFile, 'utf8');
console.log('HomePage.jsx created successfully, bytes:', homeFile.length);
