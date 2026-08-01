const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route to create a new Razorpay order
router.post('/create-order', paymentController.createOrder);

// Route to verify Razorpay payment signature
router.post('/verify-payment', paymentController.verifyPayment);

module.exports = router;
