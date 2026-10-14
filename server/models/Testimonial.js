const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: 'Melbourne, VIC'
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
  },
  date: {
    type: String,
    default: 'October 2026'
  },
  verified: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    enum: ['Google', 'Direct', 'ProductReview', 'Facebook'],
    default: 'Google'
  },
  service: {
    type: String,
    default: 'Commercial Epoxy'
  },
  comment: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
