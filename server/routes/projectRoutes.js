const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateAdmin } = require('../middleware/auth');

router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', authenticateAdmin, projectController.addProject);
router.put('/:id', authenticateAdmin, projectController.updateProject);
router.delete('/:id', authenticateAdmin, projectController.deleteProject);

module.exports = router;
