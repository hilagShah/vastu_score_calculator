import React, { useState } from 'react';
import axios from 'axios';
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { loadRazorpaySdk } from '../utils/loadRazorpaySdk';
import { getApiUrl } from '../utils/apiUrl';

/**
 * RazorpayCheckout Component
 *
 * Props:
 * - amount: Amount in INR (e.g. 499)
 * - currency: Currency code (default: 'INR')
 * - title: Merchant / Product Title
 * - description: Payment Description
 * - prefill: User contact prefill object { name, email, phone }
 * - onSuccess: Callback function invoked when payment signature is verified
 * - onFailure: Callback function invoked when payment fails or signature fails
 * - buttonText: Label text for the trigger button
 * - className: Optional custom CSS classes
 * - disabled: Boolean flag to disable the button
 */
export const RazorpayCheckout = ({
  amount = 499,
  currency = 'INR',
  title = 'Vastu Harmony Consultations',
  description = 'Vedic Architectural Remedies & PDF Report',
  prefill = {},
  onSuccess,
  onFailure,
  buttonText = 'Pay & Unlock Premium Report',
  className = '',
  disabled = false
}) => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  const handleCheckout = async () => {
    setLoading(true);
    setStatusMessage(null);

    try {
      // 1. Dynamically load the Razorpay SDK
      const sdkLoaded = await loadRazorpaySdk();
      if (!sdkLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const API_URL = getApiUrl();

      // 2. Request backend to create a Razorpay Order ID
      const orderResponse = await axios.post(`${API_URL}/api/payments/create-order`, {
        amount,
        currency,
        notes: {
          client_name: prefill.name || 'Valued Client',
          client_email: prefill.email || 'N/A'
        }
      });

      if (!orderResponse.data?.success || !orderResponse.data?.data) {
        throw new Error(orderResponse.data?.message || 'Failed to initialize payment order on server.');
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || key_id || 'rzp_test_TKSLjUpinPPwYg';

      // 3. Configure Razorpay Modal Options
      const options = {
        key: razorpayKey,
        amount: orderAmount,
        currency: orderCurrency,
        name: title,
        description: description,
        image: '/favicon.ico', // Optional logo URL
        order_id: order_id,
        prefill: {
          name: prefill.name || '',
          email: prefill.email || '',
          contact: prefill.phone || ''
        },
        theme: {
          color: '#4f46e5' // Indigo accent theme
        },
        // 4. Payment Success Callback & Signature Verification
        handler: async (response) => {
          try {
            console.log('💳 Razorpay Modal Response Received:', response);

            // Verify the payment signature on backend
            const verifyRes = await axios.post(`${API_URL}/api/payments/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data?.success) {
              setStatusMessage({
                type: 'success',
                text: `Payment Successful! Transaction ID: ${response.razorpay_payment_id}`
              });

              if (onSuccess) {
                onSuccess({
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                  verificationData: verifyRes.data
                });
              }
            } else {
              throw new Error(verifyRes.data?.message || 'Payment signature verification failed.');
            }
          } catch (verifyErr) {
            console.error('❌ Verification Error:', verifyErr);
            const errorMsg = verifyErr.response?.data?.message || verifyErr.message || 'Signature verification failed';
            setStatusMessage({
              type: 'error',
              text: `Payment Failed: ${errorMsg}`
            });
            if (onFailure) onFailure(verifyErr);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            console.log('Payment modal closed by user.');
          }
        }
      };

      // 5. Open Razorpay Checkout Modal
      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (response) => {
        console.error('❌ Razorpay Payment Failed Event:', response.error);
        setLoading(false);
        setStatusMessage({
          type: 'error',
          text: `Payment Failed: ${response.error.description || 'Transaction declined'}`
        });
        if (onFailure) onFailure(response.error);
      });

      rzp.open();

    } catch (err) {
      console.error('❌ Checkout Error:', err);
      setLoading(false);
      const errMsg = err.response?.data?.message || err.message || 'Payment initialization failed';
      setStatusMessage({
        type: 'error',
        text: `Error: ${errMsg}`
      });
      if (onFailure) onFailure(err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading || disabled}
        className={className || `w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-white transition-all shadow-lg bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Initializing Razorpay...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>{buttonText} (₹{amount})</span>
          </>
        )}
      </button>

      {/* Status Alert Toast */}
      {statusMessage && (
        <div
          className={`mt-3 w-full p-3 rounded-lg flex items-center gap-2 text-xs font-semibold animate-fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
};

export default RazorpayCheckout;
