import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICE_IDS } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, plan = 'basic', successUrl, cancelUrl } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Determine which price ID to use based on plan
    let priceId: string;
    let tierName: string;
    
    switch (plan) {
      case 'premium':
        priceId = PRICE_IDS.PREMIUM_MONTHLY;
        tierName = 'PREMIUM';
        break;
      case 'pro':
        priceId = PRICE_IDS.PRO_MONTHLY;
        tierName = 'PRO';
        break;
      case 'basic':
      default:
        priceId = PRICE_IDS.BASIC_MONTHLY;
        tierName = 'FREE'; // Basic subscribers are stored as FREE tier
        break;
    }

    if (!priceId) {
      return NextResponse.json(
        { error: `Stripe not configured. Please set the price ID for ${plan} plan` },
        { status: 500 }
      );
    }

    // Find or create subscriber
    let subscriber = await db.subscriber.findUnique({
      where: { email }
    });

    if (!subscriber) {
      subscriber = await db.subscriber.create({
        data: { email, tier: 'FREE' }
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pro/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?canceled=true`,
      metadata: {
        subscriberId: subscriber.id,
        plan: tierName,
      },
    });

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id 
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
