import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Mail, Phone, MapPin } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function PrivacyPage() {
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
            <Lock size={16} />
            <span>PRIVACY &amp; DATA PROTECTION</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px', letterSpacing: '-0.02em' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '0.94rem', color: '#64748b', marginBottom: '32px' }}>
            Last updated: October 2026 · Floor Shield Pty Ltd (ABN: {settings.abn || '75 688 496 166'})
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', color: '#334155', lineHeight: 1.7, fontSize: '0.95rem' }}>
            
            <section style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                1. Overview &amp; Australian Privacy Principles
              </h2>
              <p>
                Floor Shield Pty Ltd is dedicated to protecting your privacy in accordance with the <em>Privacy Act 1988 (Cth)</em> and the Australian Privacy Principles (APPs). This policy details how we collect, handle, and protect personal information provided when you interact with floorshield.au, request a quote, or schedule an on-site inspection.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                2. Information We Collect
              </h2>
              <p>
                When inquiring about residential epoxy flake, commercial resin, or diamond grinding, we may collect:
              </p>
              <ul style={{ paddingLeft: '22px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Full name and business / entity name</li>
                <li>Contact phone number and email address</li>
                <li>Site address, suburb, or postcode for measure and quote scheduling</li>
                <li>Floor area dimensions, slab condition photos, and project notes</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                3. How We Use Your Information
              </h2>
              <p>
                We use collected information solely for genuine business purposes:
              </p>
              <ul style={{ paddingLeft: '22px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Preparing accurate project quotations and system specifications</li>
                <li>Coordinating on-site measures, slab inspections, and installation dates</li>
                <li>Issuing manufacturer warranties and project receipts</li>
                <li>Responding to inquiries or customer support requests</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                4. Data Protection &amp; Third Parties
              </h2>
              <p>
                We never sell, rent, or trade your personal data to third-party marketing companies. Personal data is securely stored and only accessible to authorized Floor Shield estimators and installation supervisors.
              </p>
            </section>

            <section style={{ backgroundColor: '#fff7ed', padding: '24px', borderRadius: '14px', border: '1px solid #fed7aa' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                5. Contact Our Privacy Officer
              </h2>
              <p style={{ color: '#475569' }}>
                If you have questions regarding our privacy practices or wish to update your details, please reach out to us directly:
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
