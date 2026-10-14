import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { API_BASE } from '../adminConstants';
import { Field } from '../AdminShared';

const fallbackSlide = {
  image: '/images/epoxy-flake-garage.jpg',
  alt: 'Epoxy flooring project',
};

export default function HeroCarouselPage({ settings, onChange, onSave }) {
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const token = localStorage.getItem('fs_admin_token');
  const slides = Array.isArray(settings.heroSlides) && settings.heroSlides.length > 0
    ? settings.heroSlides
    : [
        { image: '/images/epoxy-flake-garage.jpg', alt: 'Decorative flake epoxy garage floor' },
        { image: '/images/industrial-epoxy-warehouse.jpg', alt: 'Industrial epoxy warehouse floor' },
        { image: '/images/concrete-diamond-grinding.jpg', alt: 'Concrete diamond grinding preparation' },
      ];

  const saveSlidesToDatabase = async (nextSlides) => {
    const payload = { ...settings, heroSlides: nextSlides };
    onChange(payload);
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.message || 'Failed to save hero carousel');
  };

  const commitSlides = (nextSlides) => onChange({ ...settings, heroSlides: nextSlides });

  const updateSlide = (index, key, value) => {
    const nextSlides = [...slides];
    nextSlides[index] = { ...nextSlides[index], [key]: value };
    commitSlides(nextSlides);
  };

  const addSlide = () => commitSlides([...slides, fallbackSlide]);

  const removeSlide = (index) => {
    if (slides.length <= 1) return;
    commitSlides(slides.filter((_, i) => i !== index));
  };

  const uploadImage = async (index, file) => {
    if (!file) return;
    setUploadingIndex(index);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const result = await res.json();
      if (result.success && result.url) {
        const nextSlides = [...slides];
        nextSlides[index] = { ...nextSlides[index], image: result.url };
        await saveSlidesToDatabase(nextSlides);
      } else {
        alert(result.message || 'Hero image upload failed');
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploadingIndex(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px',
        padding: '20px 24px', boxShadow: '0 1px 3px rgba(15,23,42,0.04)'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem', fontWeight: 900 }}>Hero Carousel</h2>
          <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Upload the background images used by the homepage hero. The headline and buttons stay consistent.
          </p>
        </div>
        <button type="button" onClick={addSlide} style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
          borderRadius: '10px', border: '1px solid #fed7aa', backgroundColor: '#fff7ed',
          color: '#ea580c', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap'
        }}>
          <Plus size={16} /> Add Image
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        {slides.map((slide, index) => (
          <div key={index} style={{
            backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px',
            overflow: 'hidden', boxShadow: '0 8px 24px rgba(15,23,42,0.05)'
          }}>
            <div style={{ position: 'relative', aspectRatio: '16 / 10', backgroundColor: '#e2e8f0' }}>
              {slide.image ? (
                <img src={slide.image} alt={slide.alt || 'Hero slide'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: '#94a3b8' }}>
                  <ImageIcon size={34} />
                </div>
              )}
              <span style={{
                position: 'absolute', top: '12px', left: '12px', padding: '5px 10px',
                borderRadius: '999px', backgroundColor: 'rgba(15,23,42,0.78)', color: '#fff',
                fontSize: '0.72rem', fontWeight: 800
              }}>
                Slide {index + 1}
              </span>
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Field label="Image URL" value={slide.image || ''} onChange={e => updateSlide(index, 'image', e.target.value)} placeholder="Upload or paste hero image URL" />
              <Field label="Alt Text" value={slide.alt || ''} onChange={e => updateSlide(index, 'alt', e.target.value)} placeholder="Describe this background image" />
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '10px 13px', borderRadius: '10px', border: 'none',
                  background: uploadingIndex === index ? '#94a3b8' : 'linear-gradient(135deg, #ea580c, #c2410c)',
                  color: '#fff', fontSize: '0.82rem', fontWeight: 800,
                  cursor: uploadingIndex === index ? 'not-allowed' : 'pointer'
                }}>
                  {uploadingIndex === index ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                  {uploadingIndex === index ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" disabled={uploadingIndex === index} onChange={e => uploadImage(index, e.target.files?.[0])} style={{ display: 'none' }} />
                </label>
                <button type="button" onClick={() => removeSlide(index)} disabled={slides.length <= 1} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 13px',
                  borderRadius: '10px', border: '1px solid #fecaca',
                  backgroundColor: slides.length <= 1 ? '#f8fafc' : '#fef2f2',
                  color: slides.length <= 1 ? '#94a3b8' : '#dc2626',
                  fontSize: '0.82rem', fontWeight: 800,
                  cursor: slides.length <= 1 ? 'not-allowed' : 'pointer'
                }}>
                  <Trash2 size={15} /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={onSave} style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px', alignSelf: 'flex-start',
        padding: '13px 28px', background: 'linear-gradient(135deg, #0f172a, #2563eb)',
        border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.95rem',
        fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
        boxShadow: '0 12px 24px rgba(37,99,235,0.22)'
      }}>
        <Save size={18} /> Save Hero Carousel
      </motion.button>
    </div>
  );
}
