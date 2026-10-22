import { motion } from 'framer-motion';
import { Save, Phone, BarChart3, Zap } from 'lucide-react';
import { Field } from '../AdminShared';

export default function SettingsPage({ settings, onChange, onSave }) {
  const upd = (k, v) => onChange({ ...settings, [k]: v });
  const sections = [
    {
      title: 'Contact Information',
      icon: Phone,
      fields: [
        { label: 'Site Name', key: 'siteName', placeholder: 'Floor Shield Australia' },
        { label: 'Phone Number', key: 'phone', placeholder: '0489 074 340' },
        { label: 'Email Address', key: 'email', placeholder: 'info@floorshield.au' },
        { label: 'Office Address', key: 'address', placeholder: 'Unit 1/76 Rushdale St...' },
        { label: 'ABN', key: 'abn', placeholder: '84 629 184 921' },
      ],
    },
    {
      title: 'Business Stats',
      icon: BarChart3,
      fields: [
        { label: 'Years Experience', key: 'experienceYears', placeholder: '15' },
        { label: 'Projects Completed', key: 'projectsCompleted', placeholder: '2450' },
        { label: 'Warranty Years', key: 'warrantyYears', placeholder: '10' },
        { label: 'Satisfaction Rate (%)', key: 'satisfactionRate', placeholder: '99.8' },
      ],
    },
    {
      title: 'Hero Content',
      icon: Zap,
      fields: [
        { label: 'Hero Title', key: 'heroTitle', placeholder: 'Premium epoxy floors installed fast, built to last.', multiline: true, rows: 2 },
        { label: 'Hero Subtitle', key: 'heroSubtitle', placeholder: 'Australian-made coating systems...', multiline: true, rows: 3 },
      ],
    },
  ];

  return (
    <div style={{ maxWidth: '760px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {sections.map(section => {
        const Icon = section.icon;
        return (
          <div key={section.title} style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(15,23,42,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#fafafa' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={17} color="#ea580c" />
              </div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>{section.title}</h3>
            </div>
            <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {section.fields.map(f => (
                <Field key={f.key} label={f.label} value={settings[f.key] || ''} onChange={e => upd(f.key, e.target.value)} placeholder={f.placeholder} multiline={f.multiline} rows={f.rows} />
              ))}
            </div>
          </div>
        );
      })}

      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={onSave} style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '13px 28px', alignSelf: 'flex-start',
        background: 'linear-gradient(135deg, #ea580c, #c2410c)',
        border: 'none', borderRadius: '12px',
        color: '#fff', fontSize: '0.95rem', fontWeight: '700',
        cursor: 'pointer', fontFamily: 'inherit',
        boxShadow: '0 4px 16px rgba(234,88,12,0.3)',
      }}>
        <Save size={18} /> Save All Settings
      </motion.button>
    </div>
  );
}
