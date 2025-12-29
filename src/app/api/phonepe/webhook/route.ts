import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyChecksum } from "@/lib/phonepe";
import { SubscriptionTier } from "@prisma/client";

// Server-to-server webhook from PhonePe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get headers for verification
    const xVerify = request.headers.get('X-VERIFY');
    
    if (!xVerify) {
      console.error("Missing X-VERIFY header");
      return NextResponse.json({ success: false, error: 'Missing verification header' }, { status: 400 });
    }

    // Verify the checksum
    const isValid = verifyChecksum(body.response, xVerify);
    
    if (!isValid) {
      console.error("Invalid checksum from PhonePe webhook");
      return NextResponse.json({ success: false, error: 'Invalid checksum' }, { status: 400 });
    }

    // Decode the response
    const decodedResponse = JSON.parse(Buffer.from(body.response, 'base64').toString('utf-8'));
    console.log("PhonePe webhook payload:", decodedResponse);

    const { code, data } = decodedResponse;
    const merchantTransactionId = data?.merchantTransactionId;

    if (!merchantTransactionId) {
      return NextResponse.json({ success: false, error: 'Missing transaction ID' }, { status: 400 });
    }

    // Find the payment log
    const paymentLog = await db.emailLog.findFirst({
      where: {
        subject: { contains: merchantTransactionId },
        emailType: 'payment',
      },
      include: { subscriber: true }
    });

    if (!paymentLog) {
      console.error(`Payment log not found for transaction: ${merchantTransactionId}`);
      return NextResponse.json({ success: false, error: 'Transaction not found' }, { status: 404 });
    }

    // Parse stored plan info
    const paymentInfo = JSON.parse(paymentLog.errorMessage || '{}');

    if (code === 'PAYMENT_SUCCESS') {
      const plan = paymentInfo.plan?.toUpperCase() || 'FREE';
      
      // Determine tier based on plan
      let tier: SubscriptionTier = SubscriptionTier.FREE;
      if (plan === 'PREMIUM') tier = SubscriptionTier.PREMIUM;
      else if (plan === 'PRO') tier = SubscriptionTier.PRO;

      // Update subscriber tier
      await db.subscriber.update({
        where: { id: paymentLog.subscriberId },
        data: { 
          tier: tier,
          topicAiTools: true,
          topicStockMarket: true,
          topicCrypto: tier === SubscriptionTier.PRO || tier === SubscriptionTier.PREMIUM,
          topicStartups: tier === SubscriptionTier.PREMIUM,
          topicProductivity: tier === SubscriptionTier.PREMIUM,
        }
      });

      // Update payment log
      await db.emailLog.update({
        where: { id: paymentLog.id },
        data: { 
          status: 'DELIVERED',
          errorMessage: JSON.stringify({
            ...paymentInfo,
            paymentStatus: 'SUCCESS',
            webhookReceived: true,
            phonepeCode: code,
          }),
        }
      });

      console.log(`Payment successful for subscriber: ${paymentLog.subscriber?.email}`);
    } else if (code === 'PAYMENT_ERROR' || code === 'PAYMENT_DECLINED') {
      // Payment failed
      await db.emailLog.update({
        where: { id: paymentLog.id },
        data: { 
          status: 'FAILED',
          errorMessage: JSON.stringify({
            ...paymentInfo,
            paymentStatus: 'FAILED',
            webhookReceived: true,
            phonepeCode: code,
          }),
        }
      });

      console.log(`Payment failed for subscriber: ${paymentLog.subscriber?.email}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PhonePe webhook error:", error);
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 500 });
  }
}
