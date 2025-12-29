import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️ STRIPE_SECRET_KEY not set - Stripe payments will not work');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia' as any,
  typescript: true,
});

// Price IDs - create these in Stripe Dashboard
// Basic: ₹1/month, Pro: ₹3/month, Premium: ₹10/month
export const PRICE_IDS = {
  BASIC_MONTHLY: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID || '',
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || '',
  PREMIUM_MONTHLY: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || '',
};

export const PLAN_PRICES = {
  BASIC: 1,     // ₹1/month
  PRO: 3,       // ₹3/month
  PREMIUM: 10,  // ₹10/month
};
