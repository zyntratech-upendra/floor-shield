const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticateAdmin } = require('../middleware/auth');

router.get('/', serviceController.getServices);
router.get('/:slug', serviceController.getServiceBySlug);
router.post('/', authenticateAdmin, serviceController.addService);
router.put('/:id', authenticateAdmin, serviceController.updateService);
router.delete('/:id', authenticateAdmin, serviceController.deleteService);

module.exports = router;
