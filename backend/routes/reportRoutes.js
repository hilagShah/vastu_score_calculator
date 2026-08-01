const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

const remediesController = require('../controllers/remediesController');

// Create a Vastu report
router.post('/', reportController.createReport);

// Generate Gemini AI Vastu Remedies Report
router.post('/remedies', remediesController.generateGeminiRemedies);

// Get a single Vastu report by ID
router.get('/:id', reportController.getReportById);

// Get all Vastu reports (history)
router.get('/', reportController.getReports);

module.exports = router;

