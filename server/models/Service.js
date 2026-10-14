const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  brand: { type: String, default: 'Floor Shield Australia' },
  category: { type: String, default: 'Commercial & Industrial' },
  shortDesc: { type: String },
  fullDesc: { type: String },
  priceStarting: { type: String, default: 'Contact for Quote' },
  image: { type: String },
  gallery: [{ type: String }],
  features: [{ type: String }],
  applications: [{ type: String }],
  processSteps: [{
    stepNumber: Number,
    title: String,
    description: String
  }],
  benefits: [{
    title: String,
    description: String
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  metaTitle: { type: String },
  metaDescription: { type: String },
  popular: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
