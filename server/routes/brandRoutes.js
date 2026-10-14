const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { authenticateAdmin } = require('../middleware/auth');

// Public route for active brand logos
router.get('/', brandController.getBrands);

// Admin-protected routes
router.get('/all', authenticateAdmin, brandController.getAllBrands);
router.post('/', authenticateAdmin, brandController.addBrand);
router.put('/:id', authenticateAdmin, brandController.updateBrand);
router.delete('/:id', authenticateAdmin, brandController.deleteBrand);

module.exports = router;
