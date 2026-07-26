const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const upload = require('../middlewares/multer');

const remediesController = require('../controllers/remediesController');

// Create a Vastu report (requires image upload under the field name 'blueprint')
router.post('/', upload.single('blueprint'), reportController.createReport);

// Generate Gemini AI Vastu Remedies Report
router.post('/remedies', remediesController.generateGeminiRemedies);

// Get a single Vastu report by ID
router.get('/:id', reportController.getReportById);

// Get all Vastu reports (history)
router.get('/', reportController.getReports);

module.exports = router;
