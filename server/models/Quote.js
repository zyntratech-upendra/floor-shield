const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  suburb: { type: String, default: 'Melbourne Metro' },
  serviceType: { type: String, default: 'APC Ultra Flake® System' },
  areaApproxSqm: { type: Number, default: 40 },
  conditionNotes: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Quoted', 'Booked', 'Completed', 'Cancelled'],
    default: 'New' 
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Quote', QuoteSchema);
