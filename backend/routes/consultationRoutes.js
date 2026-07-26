const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');

// POST /api/consultations - Submit new consultation call request
router.post('/', consultationController.createConsultation);

// GET /api/consultations - List all consultation requests
router.get('/', consultationController.getConsultations);

// PATCH /api/consultations/:id - Update status (Pending, Contacted, Completed)
router.patch('/:id', consultationController.updateConsultationStatus);

// DELETE /api/consultations/:id - Delete consultation request
router.delete('/:id', consultationController.deleteConsultation);

module.exports = router;
