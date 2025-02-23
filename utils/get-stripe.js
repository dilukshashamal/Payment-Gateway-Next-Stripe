//utils/get-stripe.js
import { loadStripe } from '@stripe/stripe-js';

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
    if (!publishableKey || typeof publishableKey !== 'string') {
      throw new Error(
        "Missing or invalid NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable."
      );
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export default getStripe;
