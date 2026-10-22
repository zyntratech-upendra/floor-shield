const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Floor Shield Australia' },
  phone: { type: String, default: '0489 074 340' },
  tollFree: { type: String, default: '1800 231 907' },
  email: { type: String, default: 'floorshieldptyltd@gmail.com' },
  address: { type: String, default: 'Melbourne VIC 3000' },
  abn: { type: String, default: '75 688 496 166' },
  heroTitle: { type: String },
  heroSubtitle: { type: String },
  heroSlides: [{
    kicker: { type: String },
    title: { type: String },
    description: { type: String },
    image: { type: String },
    alt: { type: String },
    badge: { type: String },
    badgeText: { type: String },
    benefits: [{ type: String }]
  }],
  experienceYears: { type: Number, default: 15 },
  projectsCompleted: { type: Number, default: 2450 },
  warrantyYears: { type: Number, default: 10 },
  satisfactionRate: { type: Number, default: 99.8 }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
