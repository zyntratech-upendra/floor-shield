const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { authenticateAdmin } = require('../middleware/auth');

router.get('/', authenticateAdmin, quoteController.getQuotes);
router.post('/', quoteController.createQuote);
router.patch('/:id/status', authenticateAdmin, quoteController.updateQuoteStatus);

module.exports = router;
