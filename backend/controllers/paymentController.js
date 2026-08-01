const Razorpay = require('razorpay');
const crypto = require('crypto');

/**
 * Helper to get an initialized Razorpay instance using env keys.
 */
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret || key_id === 'your_razorpay_key_id') {
    throw new Error('Razorpay API keys (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET) are not properly configured in environment variables.');
  }

  return new Razorpay({
    key_id,
    key_secret
  });
};

/**
 * Controller to create a new Razorpay Order.
 * POST /api/payments/create-order
 */
exports.createOrder = async (req, res) => {
  try {
    const { amount = 499, currency = 'INR', receipt, notes = {} } = req.body;

    // Razorpay expects amount in smallest currency unit (e.g. Paise for INR, 1 INR = 100 Paise)
    // If amount is passed in Rupees (e.g. 499), convert to Paise (49900).
    // If amount is already in Paise (>1000 and integer), keep as is.
    const amountInPaise = Math.round(Number(amount) < 1000 ? Number(amount) * 100 : Number(amount));

    const razorpay = getRazorpayInstance();

    const options = {
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: receipt || `rcpt_vastu_${Date.now().toString().slice(-8)}`,
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
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID
      }
    });

  } catch (error) {
    console.error('❌ Create Razorpay Order Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create Razorpay order'
    });
  }
};

/**
 * Controller to verify Razorpay Payment Signature.
 * POST /api/payments/verify-payment
 *
 * SIGNATURE VERIFICATION EXPLANATION:
 * When a payment completes on the client modal, Razorpay passes back 3 values:
 * 1. razorpay_order_id
 * 2. razorpay_payment_id
 * 3. razorpay_signature
 *
 * To ensure the payment response has NOT been tampered with or forged:
 * Step A: Combine `razorpay_order_id` and `razorpay_payment_id` separated by a pipe '|'.
 * Step B: Calculate an HMAC SHA256 signature of this combined string using your secret `RAZORPAY_KEY_SECRET`.
 * Step C: Compare your calculated signature with `razorpay_signature` received from Razorpay.
 * If signatures match, the payment is authentic and verified!
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
        message: 'RAZORPAY_KEY_SECRET is not configured on the server.'
      });
    }

    // Step A: Construct the raw payload string
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Step B: Generate HMAC-SHA256 signature using secret key
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    // Step C: Secure constant-time comparison to prevent timing attacks
    const isAuthentic = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf-8'),
      Buffer.from(razorpay_signature, 'utf-8')
    );

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
        message: 'Payment verification failed: Invalid HMAC signature'
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
