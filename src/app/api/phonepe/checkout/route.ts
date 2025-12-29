import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { 
  initiatePayment, 
  generateTransactionId, 
  PLAN_PRICES, 
  PLAN_NAMES 
} from "@/lib/phonepe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, plan = 'basic', phone } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Get plan details
    const planKey = plan.toUpperCase() as keyof typeof PLAN_PRICES;
    const amount = PLAN_PRICES[planKey] || PLAN_PRICES.BASIC;
    const planName = PLAN_NAMES[planKey] || PLAN_NAMES.BASIC;

    // Find or create subscriber
    let subscriber = await db.subscriber.findUnique({
      where: { email }
    });

    if (!subscriber) {
      subscriber = await db.subscriber.create({
        data: { email, tier: 'FREE' }
      });
    }

    // Generate unique transaction ID
    const transactionId = generateTransactionId();

    // Store transaction in database for tracking
    // We'll use EmailLog temporarily to track payments
    // In production, you'd have a separate Payments table

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Initiate PhonePe payment
    const paymentResponse = await initiatePayment({
      merchantTransactionId: transactionId,
      amount: amount,
      merchantUserId: subscriber.id,
      redirectUrl: `${appUrl}/api/phonepe/callback`,
      callbackUrl: `${appUrl}/api/phonepe/webhook`,
      mobileNumber: phone,
    });

    if (paymentResponse.success && paymentResponse.data?.instrumentResponse?.redirectInfo?.url) {
      // Store transaction details for later verification
      await db.emailLog.create({
        data: {
          subscriberId: subscriber.id,
          status: 'SENT', // Use SENT as pending indicator
          emailType: 'payment',
          subject: `Payment: ${planName} - ${transactionId}`,
          errorMessage: JSON.stringify({ plan, amount, transactionId, status: 'pending' }),
        }
      });

      return NextResponse.json({ 
        success: true,
        redirectUrl: paymentResponse.data.instrumentResponse.redirectInfo.url,
        transactionId,
      });
    } else {
      console.error("PhonePe payment initiation failed:", paymentResponse);
      return NextResponse.json(
        { error: paymentResponse.message || "Failed to initiate payment" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("PhonePe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 }
    );
  }
}
