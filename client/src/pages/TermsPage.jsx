import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function TermsPage() {
  const { settings } = useSite();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-page" style={{ backgroundColor: '#ffffff', minHeight: '80vh', padding: '60px 0 80px' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa', color: '#ea580c', fontSize: '0.8rem', fontWeight: '800', marginBottom: '16px' }}>
            <FileText size={16} />
            <span>LEGAL &amp; SERVICE AGREEMENT</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px', letterSpacing: '-0.02em' }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ fontSize: '0.94rem', color: '#64748b', marginBottom: '32px' }}>
            Last updated: October 2026 · Floor Shield Pty Ltd (ABN: {settings.abn || '75 688 496 166'})
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', color: '#334155', lineHeight: 1.7, fontSize: '0.95rem' }}>
            
            <section style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                1. Quotations, Bookings &amp; $0 Deposit Policy
              </h2>
              <p>
                All quotations issued by Floor Shield Pty Ltd are based on visual inspection, project plans, or customer-provided dimensions. We offer a <strong>$0 upfront deposit policy</strong> on residential garage installations: payment is only due once mechanical surface preparation, basecoat resin, broadcast, and topcoats are installed and inspected by the client.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                2. Surface Preparation &amp; Existing Concrete Condition
              </h2>
              <p>
                Long-lasting resin adhesion requires clean, profiled concrete. Floor Shield prepares every concrete slab using industrial mechanical diamond grinding with dustless HEPA vacuum extraction (CSP-2 to CSP-3 profile). We never use acid etching.
              </p>
              <p style={{ marginTop: '10px' }}>
                Hairline cracks, spalls, and expansion joints are repaired using structural epoxy mortar prior to basecoat installation. Significant slab movement, foundation shifting, or rising hydrostatic moisture pressure beyond manufacturer tolerances are outside standard surface coating warranties.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                3. Installation Schedule &amp; Curing Times
              </h2>
              <p>
                Most standard double garages and commercial floors are completed in <strong>2 days</strong>. Light foot traffic is typically permissible within 24 hours of topcoat completion, and full vehicular parking / heavy machinery traffic is permitted after 48 to 72 hours, depending on ambient Victoria weather conditions and polyaspartic curing speeds.
              </p>
            </section>

            <section style={{ backgroundColor: '#fff7ed', padding: '24px', borderRadius: '14px', border: '1px solid #fed7aa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <ShieldCheck size={22} color="#ea580c" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  4. 10-Year Warranty Terms
                </h2>
              </div>
              <p style={{ color: '#475569' }}>
                Floor Shield warrants that coatings formulated with All Purpose Coatings (APC) resin systems will not blister, chip, peel from the concrete slab, or experience hot-tire lift for a period of up to <strong>10 years</strong> from installation, provided the floor has been maintained in accordance with standard care instructions.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                5. Australian Standards &amp; Slip Ratings
              </h2>
              <p>
                Commercial kitchen, ramp, and industrial installations comply with <strong>AS 4586 Slip Resistance Standards</strong> (ratings P1 through P5). Aluminum oxide or quartz anti-slip aggregates are embedded into topcoats as specified in your job scope.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                6. Contact for Service Queries
              </h2>
              <p>
                For questions regarding terms, contracts, or warranty validation, please contact our Melbourne office:
              </p>
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="#ea580c" />
                  <span>Melbourne VIC 3000, Australia</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} color="#ea580c" />
                  <span>{settings.phone || '0489 074 340'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} color="#ea580c" />
                  <span>{settings.email || 'Floorshieldptyltd@gmail.com'}</span>
                </div>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
