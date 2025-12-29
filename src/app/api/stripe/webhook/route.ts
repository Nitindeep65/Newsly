import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriberId = session.metadata?.subscriberId;
        const plan = session.metadata?.plan || 'PRO';
        
        if (subscriberId) {
          // Determine the tier from metadata
          const tier = plan === 'PREMIUM' ? 'PREMIUM' : 'PRO';
          
          await db.subscriber.update({
            where: { id: subscriberId },
            data: { 
              tier: tier as any,
              stripeCustomerId: session.customer as string,
              // Enable all topics for Premium users
              ...(tier === 'PREMIUM' && {
                topicAiTools: true,
                topicStockMarket: true,
                topicCrypto: true,
                topicStartups: true,
                topicProductivity: true,
                personalizedDigest: true,
              }),
              // Enable crypto for Pro users
              ...(tier === 'PRO' && {
                topicCrypto: true,
              }),
            }
          });
          console.log(`✅ Upgraded subscriber ${subscriberId} to ${tier}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find subscriber by Stripe customer ID and downgrade
        const subscriber = await db.subscriber.findFirst({
          where: { stripeCustomerId: customerId }
        });

        if (subscriber) {
          await db.subscriber.update({
            where: { id: subscriber.id },
            data: { tier: 'FREE' }
          });
          console.log(`⬇️ Downgraded subscriber ${subscriber.id} to FREE`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`❌ Payment failed for customer ${invoice.customer}`);
        // Optionally send email notification
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
