import crypto from 'crypto';
import { randomUUID } from 'crypto';

// PhonePe Business Configuration  
const PHONEPE_CONFIG = {
  merchantId: process.env.PHONEPE_MERCHANT_ID || '',
  saltKey: process.env.PHONEPE_SALT_KEY || '',
  saltIndex: process.env.PHONEPE_SALT_INDEX || '1',
  // Use sandbox for testing, production for live
  baseUrl: process.env.PHONEPE_ENV === 'production' 
    ? 'https://api.phonepe.com/apis/hermes'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox',
};

// Plan pricing in paise (1 rupee = 100 paise)
export const PLAN_PRICES = {
  BASIC: 100,     // ₹1 = 100 paise
  PRO: 300,       // ₹3 = 300 paise
  PREMIUM: 1000,  // ₹10 = 1000 paise
};

export const PLAN_NAMES = {
  BASIC: 'Basic Newsletter',
  PRO: 'Pro Newsletter',
  PREMIUM: 'Premium Newsletter',
};

export interface PaymentRequest {
  merchantOrderId: string;
  amount: number; // in paise
  redirectUrl: string;
}

export function generateChecksum(payload: string): string {
  const { saltKey, saltIndex } = PHONEPE_CONFIG;
  const dataToHash = payload + '/pg/v1/pay' + saltKey;
  const sha256Hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  return sha256Hash + '###' + saltIndex;
}

export function verifyChecksum(payload: string, receivedChecksum: string): boolean {
  const { saltKey, saltIndex } = PHONEPE_CONFIG;
  const dataToHash = payload + saltKey;
  const sha256Hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  const expectedChecksum = sha256Hash + '###' + saltIndex;
  return expectedChecksum === receivedChecksum;
}

export async function initiatePayment(request: PaymentRequest) {
  const { merchantId, baseUrl } = PHONEPE_CONFIG;

  const payload = {
    merchantId,
    merchantTransactionId: request.merchantOrderId,
    merchantUserId: 'USER_' + Date.now(),
    amount: request.amount,
    redirectUrl: request.redirectUrl,
    redirectMode: 'POST',
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const checksum = generateChecksum(payloadBase64);

  try {
    const response = await fetch(`${baseUrl}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      body: JSON.stringify({
        request: payloadBase64,
      }),
    });

    const data = await response.json();
    
    return {
      success: data.success,
      redirectUrl: data.data?.instrumentResponse?.redirectInfo?.url,
      message: data.message,
      data: data,
    };
  } catch (error) {
    console.error('PhonePe payment error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Payment initiation failed',
      redirectUrl: undefined,
      data: null,
    };
  }
}

export async function checkPaymentStatus(merchantOrderId: string) {
  const { merchantId, baseUrl, saltKey, saltIndex } = PHONEPE_CONFIG;

  const endpoint = `/pg/v1/status/${merchantId}/${merchantOrderId}`;
  const dataToHash = endpoint + saltKey;
  const sha256Hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  const checksum = sha256Hash + '###' + saltIndex;

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': merchantId,
      },
    });

    const data = await response.json();
    
    return {
      success: data.success && data.code === 'PAYMENT_SUCCESS',
      state: data.code,
      data: data,
    };
  } catch (error) {
    console.error('PhonePe status check error:', error);
    return {
      success: false,
      state: 'FAILED',
      message: error instanceof Error ? error.message : 'Status check failed',
      data: null,
    };
  }
}

export function generateTransactionId(): string {
  return randomUUID();
}
