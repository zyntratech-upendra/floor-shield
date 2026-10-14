const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Floor Shield Australia' },
  phone: { type: String, default: '1800 231 907' },
  email: { type: String, default: 'info@floorshield.au' },
  address: { type: String, default: 'Unit 1/76 Rushdale St, Knoxfield VIC 3180' },
  abn: { type: String, default: '84 629 184 921' },
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
