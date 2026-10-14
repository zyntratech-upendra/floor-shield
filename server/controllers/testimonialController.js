const Testimonial = require('../models/Testimonial');

// GET /api/testimonials (or /api/reviews) - List all testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const list = await Testimonial.find().sort({ featured: -1, createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/testimonials/:id - Get single testimonial
exports.getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const item = await Testimonial.findOne({
      $or: [
        { id },
        ...(isObjectId ? [{ _id: id }] : [])
      ]
    });
    if (!item) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/testimonials - Create new testimonial (Admin)
exports.addTestimonial = async (req, res) => {
  try {
    const itemData = {
      id: 'tst_' + Date.now(),
      ...req.body
    };
    const created = await Testimonial.create(itemData);
    res.status(201).json({ success: true, testimonial: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/testimonials/:id - Update testimonial (Admin)
exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const updated = await Testimonial.findOneAndUpdate(
      {
        $or: [
          { id },
          ...(isObjectId ? [{ _id: id }] : [])
        ]
      },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Testimonial not found' });
    res.json({ success: true, testimonial: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/testimonials/:id - Delete testimonial (Admin)
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const deleted = await Testimonial.findOneAndDelete({
      $or: [
        { id },
        ...(isObjectId ? [{ _id: id }] : [])
      ]
    });
    if (!deleted) return res.status(404).json({ error: 'Testimonial not found' });
    res.json({ success: true, message: 'Testimonial removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
