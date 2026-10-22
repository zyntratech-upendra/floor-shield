const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String, required: true },
  location: { type: String },
  category: { type: String },
  finish: { type: String },
  squareMeters: { type: String },
  duration: { type: String },
  description: { type: String },
  imageBefore: { type: String },
  imageAfter: { type: String },
  beforeImages: [{ type: String }],
  afterImages: [{ type: String }],
  comparisonViews: [{
    title: { type: String },
    beforeImage: { type: String },
    afterImage: { type: String },
    beforeLabel: { type: String },
    afterLabel: { type: String }
  }],
  clientCompany: { type: String },
  testimonial: { type: String },
  clientName: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
