const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { authenticateAdmin } = require('../middleware/auth');

// Public route to fetch testimonials/reviews
router.get('/', testimonialController.getTestimonials);
router.get('/:id', testimonialController.getTestimonialById);

// Admin-protected routes
router.post('/', authenticateAdmin, testimonialController.addTestimonial);
router.put('/:id', authenticateAdmin, testimonialController.updateTestimonial);
router.delete('/:id', authenticateAdmin, testimonialController.deleteTestimonial);

module.exports = router;
