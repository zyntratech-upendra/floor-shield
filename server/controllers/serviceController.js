const Service = require('../models/Service');

// Helper to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-');
};

// GET /api/services - List all services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ popular: -1, createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/services/:slug - Get single service by slug or id
exports.getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const isObjectId = slug.match(/^[0-9a-fA-F]{24}$/);
    const service = await Service.findOne({
      $or: [
        { slug },
        { id: slug },
        ...(isObjectId ? [{ _id: slug }] : [])
      ]
    });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/services - Create new service (Admin)
exports.addService = async (req, res) => {
  try {
    const slug = req.body.slug || generateSlug(req.body.title);
    const serviceData = {
      id: 'srv_' + Date.now(),
      ...req.body,
      slug
    };

    const newService = await Service.create(serviceData);
    res.status(201).json({ success: true, service: newService });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/services/:id - Update existing service (Admin)
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    
    if (req.body.title && !req.body.slug) {
      req.body.slug = generateSlug(req.body.title);
    }

    const updated = await Service.findOneAndUpdate(
      { $or: [{ id }, ...(isObjectId ? [{ _id: id }] : [])] },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ success: true, service: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/services/:id - Remove service (Admin)
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    await Service.findOneAndDelete({
      $or: [{ id }, ...(isObjectId ? [{ _id: id }] : [])]
    });
    res.json({ success: true, message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
