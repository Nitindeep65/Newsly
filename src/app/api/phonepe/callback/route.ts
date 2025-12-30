import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkPaymentStatus } from "@/lib/phonepe";
import { SubscriptionTier } from "@prisma/client";

// This handles the redirect after payment
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const transactionId = formData.get('transactionId') as string;

    if (!transactionId) {
      return NextResponse.redirect(new URL('/payment/failed?error=missing_transaction', request.url));
    }

    // Check payment status with PhonePe SDK
    const statusResponse = await checkPaymentStatus(transactionId);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (statusResponse.success && statusResponse.state === 'COMPLETED') {
      // Payment successful - find the transaction and upgrade user
      const paymentLog = await db.emailLog.findFirst({
        where: {
          subject: { contains: transactionId },
          emailType: 'payment',
        },
        include: { subscriber: true }
      });

      if (paymentLog) {
        // Parse stored plan info
        const paymentInfo = JSON.parse(paymentLog.errorMessage || '{}');
        const plan = paymentInfo.plan?.toUpperCase() || 'FREE';
        
        // Determine tier based on plan
        let tier: SubscriptionTier = SubscriptionTier.FREE;
        if (plan === 'PREMIUM') tier = SubscriptionTier.PREMIUM;
        else if (plan === 'PRO') tier = SubscriptionTier.PRO;
        // BASIC stays as FREE tier but is a paid subscriber

        // Update subscriber tier
        await db.subscriber.update({
          where: { id: paymentLog.subscriberId },
          data: { 
            tier: tier,
            // Enable topics based on tier
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
            status: 'DELIVERED', // Using DELIVERED to indicate successful payment
            errorMessage: JSON.stringify({
              ...paymentInfo,
              paymentStatus: 'SUCCESS',
              phonepeResponse: statusResponse,
            }),
          }
        });
      }

      return NextResponse.redirect(new URL(`/payment/success?txn=${transactionId}`, appUrl));
    } else {
      // Payment failed
      return NextResponse.redirect(new URL(`/payment/failed?txn=${transactionId}&error=${statusResponse.state}`, appUrl));
    }
  } catch (error) {
    console.error("PhonePe callback error:", error);
    return NextResponse.redirect(new URL('/payment/failed?error=processing_error', request.url));
  }
}
