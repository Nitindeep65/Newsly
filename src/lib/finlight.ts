import { FinlightApi } from 'finlight-client';

const apiKey = process.env.FINLIGHT_API_KEY || process.env.NEXT_PUBLIC_FINLIGHT_API_KEY;

if (!apiKey) {
  console.warn('Finlight API key is not configured. Set FINLIGHT_API_KEY in .env.local to use Finlight client.');
}

export const finlight = new FinlightApi({ apiKey: apiKey || '' });
