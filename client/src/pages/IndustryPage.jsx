import { motion } from 'framer-motion';
import { ArrowRight, Factory, ShieldCheck } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { navIndustries } from '../utils/siteData';

const industryImages = [
  '/images/commercial-kitchen-quartz.jpg',
  '/images/industrial-epoxy-warehouse.jpg',
  '/images/concrete-diamond-grinding.jpg',
];

export default function IndustryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { settings } = useSite();
  const selectedCategory = searchParams.get('category');

  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="container landing-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="landing-hero-copy"
          >
            <span className="badge badge-orange">FLOORING FOR YOUR INDUSTRY</span>
            <h1>Purpose-built floors for demanding workplaces.</h1>
            <p>
              From food-safe kitchens to busy warehouses, Floor Shield specifies
              hard-wearing resin systems around the work your floor needs to do.
            </p>
            <button className="btn-primary" onClick={() => navigate('/calculator')}>
              Discuss your project <ArrowRight size={17} />
            </button>
          </motion.div>
          <div className="landing-hero-photo">
            <img src="/images/industrial-epoxy-warehouse.jpg" alt="Finished industrial resin floor in a warehouse" />
            <div className="landing-photo-caption">
              <ShieldCheck size={19} />
              <span>Specified for real-world traffic and cleaning requirements</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="container">
          <div className="landing-section-heading">
            <span className="landing-eyebrow">APPLICATIONS</span>
            <h2>Solutions for the way you work</h2>
            <p>Choose an industry to explore common flooring needs and suitable systems.</p>
          </div>

          <div className="industry-card-grid">
            {navIndustries.map((industry, index) => {
              const Icon = industry.icon || Factory;
              const isSelected = selectedCategory === industry.category;
              return (
                <motion.article
                  key={industry.category}
                  className={`industry-card${isSelected ? ' is-selected' : ''}`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                >
                  <div className="industry-card-image">
                    <img src={industryImages[index]} alt={`${industry.category} flooring application`} loading="lazy" />
                    <span className="industry-card-icon"><Icon size={19} /></span>
                  </div>
                  <div className="industry-card-body">
                    <h3>{industry.category}</h3>
                    <ul>
                      {industry.items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <button
                      className="industry-card-link"
                      onClick={() => navigate('/services')}
                    >
                      Explore flooring systems <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div className="container landing-cta-inner">
          <div>
            <span className="landing-eyebrow">LET'S PLAN YOUR FLOOR</span>
            <h2>Talk through your site, traffic and turnaround needs.</h2>
            <p>Serving commercial and industrial sites across Victoria.</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/calculator')}>
            Request a project estimate <ArrowRight size={17} />
          </button>
        </div>
      </section>
      <span className="visually-hidden">{settings.siteName}</span>
    </div>
  );
}
