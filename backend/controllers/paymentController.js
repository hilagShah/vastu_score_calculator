const Razorpay = require('razorpay');
const crypto = require('crypto');

/**
 * Helper to get an initialized Razorpay instance using env keys.
 */
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret || key_id === 'your_razorpay_key_id') {
    const err = new Error('Razorpay API keys (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET) are missing or default in environment variables.');
    err.statusCode = 401;
    throw err;
  }

  return new Razorpay({
    key_id,
    key_secret
  });
};

/**
 * Controller to create a new Razorpay Order.
 * Endpoints: POST /api/create-order or POST /api/payments/create-order
 * Minimum amount: 100 paise (₹1.00)
 */
exports.createOrder = async (req, res) => {
  try {
    const { amount = 499, currency = 'INR', receipt, notes = {} } = req.body;

    // Convert amount to paise if passed in Rupees (e.g. 499 -> 49900 Paise)
    const rawAmount = Number(amount);
    const amountInPaise = Math.round(rawAmount < 1000 ? rawAmount * 100 : rawAmount);

    // Validation: Minimum amount 100 paise (₹1.00)
    if (isNaN(amountInPaise) || amountInPaise < 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount: Minimum amount must be at least 100 paise (₹1.00)'
      });
    }

    const razorpay = getRazorpayInstance();

    const options = {
      amount: amountInPaise,
      currency: (currency || 'INR').toUpperCase(),
      receipt: receipt || `rcpt_${Date.now().toString().slice(-10)}`,
      notes: {
        service: 'Vastu Score Architectural Consultation Report',
        ...notes
      }
    };

    const order = await razorpay.orders.create(options);

    console.log(`✅ Razorpay Order Created: ${order.id} | Amount: ${order.amount} ${order.currency}`);

    return res.status(200).json({
      success: true,
      message: 'Razorpay order created successfully',
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID
      }
    });

  } catch (error) {
    console.error('❌ Create Razorpay Order Error:', error);

    const statusCode = error.statusCode || error.status || (error.message?.includes('auth') ? 401 : 500);

    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to create Razorpay order'
    });
  }
};

/**
 * Controller to verify Razorpay Payment Signature.
 * Endpoints: POST /api/verify-payment or POST /api/payments/verify-payment
 *
 * ALGORITHM: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Compare generated signature with razorpay_signature.
 */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required Razorpay payment verification parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.'
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret || secret === 'your_razorpay_key_secret') {
      return res.status(500).json({
        success: false,
        message: 'RAZORPAY_KEY_SECRET is missing or not configured on the server.'
      });
    }

    // Step 1: Construct the raw payload string: order_id + "|" + payment_id
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Step 2: Generate HMAC-SHA256 signature using KEY_SECRET
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    // Step 3: Secure constant-time comparison to prevent timing attacks
    let isAuthentic = false;
    try {
      isAuthentic = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf-8'),
        Buffer.from(razorpay_signature, 'utf-8')
      );
    } catch {
      isAuthentic = false;
    }

    if (isAuthentic) {
      console.log(`✅ Razorpay Payment Verified Successfully! OrderID: ${razorpay_order_id} | PaymentID: ${razorpay_payment_id}`);

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          verifiedAt: new Date()
        }
      });
    } else {
      console.warn(`⚠️ Invalid Payment Signature for OrderID: ${razorpay_order_id}`);
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Signature mismatch'
      });
    }

  } catch (error) {
    console.error('❌ Verify Razorpay Payment Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed due to server error'
    });
  }
};
