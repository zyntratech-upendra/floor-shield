const Brand = require('../models/Brand');

// GET /api/brands - Get all active client/partner brand logos
exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ active: true }).sort({ order: 1, createdAt: 1 });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/brands/all - Get all brands (including inactive, for admin)
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ order: 1, createdAt: 1 });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/brands - Add a new brand logo (Admin)
exports.addBrand = async (req, res) => {
  try {
    const { name, logoUrl, order, active } = req.body;
    if (!name || !logoUrl) {
      return res.status(400).json({ success: false, message: 'Brand name and logo URL are required.' });
    }

    const newBrand = await Brand.create({
      id: 'brand_' + Date.now(),
      name,
      logoUrl,
      order: order !== undefined ? Number(order) : 0,
      active: active !== undefined ? active : true
    });

    res.status(201).json({ success: true, brand: newBrand });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/brands/:id - Update brand logo (Admin)
exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const updated = await Brand.findOneAndUpdate(
      {
        $or: [
          { id },
          ...(isObjectId ? [{ _id: id }] : [])
        ]
      },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Brand not found' });
    res.json({ success: true, brand: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/brands/:id - Delete brand logo (Admin)
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const deleted = await Brand.findOneAndDelete({
      $or: [
        { id },
        ...(isObjectId ? [{ _id: id }] : [])
      ]
    });
    if (!deleted) return res.status(404).json({ error: 'Brand not found' });
    res.json({ success: true, message: 'Brand logo deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
