/**
 * Utility function to dynamically load the Razorpay Checkout SDK script
 * into the document head if it hasn't already been loaded.
 * Returns a Promise that resolves to true when loaded, or false if it fails.
 */
export const loadRazorpaySdk = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK from https://checkout.razorpay.com/v1/checkout.js');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};
