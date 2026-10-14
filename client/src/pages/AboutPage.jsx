import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Award, BadgeCheck, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { navAboutItems } from '../utils/siteData';

const aboutIcons = [Award, BadgeCheck, ShieldCheck];
const aboutIds = ['about-floor-shield', 'certified-applicator', 'warranty'];

export default function AboutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSite();

  useEffect(() => {
    const sectionId = decodeURIComponent(location.hash.slice(1));
    if (!sectionId) return undefined;
    const frame = requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.hash]);

  return (
    <div className="landing-page">
      <section className="landing-hero about-hero">
        <div className="container landing-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="landing-hero-copy"
          >
            <span className="badge badge-orange">ABOUT FLOOR SHIELD AUSTRALIA</span>
            <h1>Built on preparation. Backed by proven coating systems.</h1>
            <p>
              We install high-performance resin flooring for Australian homes,
              businesses and industrial facilities, with careful surface preparation
              and support from specification through installation.
            </p>
            <button className="btn-primary" onClick={() => navigate('/projects')}>
              View completed projects <ArrowRight size={17} />
            </button>
          </motion.div>
          <div className="landing-hero-photo">
            <img src="/images/concrete-diamond-grinding.jpg" alt="Concrete floor being mechanically prepared before coating" />
            <div className="landing-photo-caption">
              <ShieldCheck size={19} />
              <span>Preparation is the foundation of a durable finish</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-stats">
        <div className="container about-stats-grid">
          <div><strong>{settings.experienceYears || 15}+</strong><span>years of experience</span></div>
          <div><strong>{Number(settings.projectsCompleted || 2450).toLocaleString()}+</strong><span>floors installed</span></div>
          <div><strong>{settings.warrantyYears || 10} years</strong><span>manufacturer warranty options</span></div>
        </div>
      </section>

      <section className="landing-section">
        <div className="container">
          <div className="landing-section-heading">
            <span className="landing-eyebrow">OUR COMMITMENT</span>
            <h2>Experience, certified products and clear standards</h2>
            <p>Learn what guides our work and how our systems are specified.</p>
          </div>
          <div className="about-card-grid">
            {navAboutItems.map((item, index) => {
              const Icon = aboutIcons[index];
              return (
                <motion.article
                  className="about-card"
                  id={aboutIds[index]}
                  key={item.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                >
                  <span className="about-card-icon"><Icon size={22} /></span>
                  <span className="landing-eyebrow">0{index + 1} / FLOOR SHIELD</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <button
                    className="industry-card-link"
                    onClick={() => navigate(index === 1 ? '/products' : '/services')}
                  >
                    {index === 1 ? 'Explore APC systems' : 'Explore our services'}
                    <ArrowRight size={15} />
                  </button>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div className="container landing-cta-inner">
          <div>
            <span className="landing-eyebrow">FLOOR SHIELD AUSTRALIA</span>
            <h2>Get advice for your next flooring project.</h2>
            <p>Call {settings.phone} or request a no-obligation estimate.</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/calculator')}>
            Request an estimate <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}
