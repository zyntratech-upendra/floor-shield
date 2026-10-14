const Quote = require('../models/Quote');

// GET /api/quotes - Fetch all quotes (sorted by newest)
exports.getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/quotes - Submit new quote inquiry
exports.createQuote = async (req, res) => {
  try {
    const { name, email, phone, suburb, serviceType, areaApproxSqm, conditionNotes } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Please provide name, email, and phone number.' });
    }

    const quote = await Quote.create({
      id: 'quote_' + Date.now(),
      name,
      email,
      phone,
      suburb: suburb || 'Melbourne Metro',
      serviceType: serviceType || 'APC Ultra Flake® System',
      areaApproxSqm: Number(areaApproxSqm) || 40,
      conditionNotes: conditionNotes || '',
      status: 'New'
    });

    res.status(201).json({
      success: true,
      message: 'Quote inquiry received! Our senior flooring estimator will call you within 2 hours.',
      quoteId: quote._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/quotes/:id/status - Update lead status
exports.updateQuoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const quote = await Quote.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { status },
      { new: true }
    );
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json({ success: true, quote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
