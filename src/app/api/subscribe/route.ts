import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  source: z.string().optional().default('landing_page'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = subscribeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, name, source } = validation.data;

    // Check if already subscribed
    const existing = await db.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.unsubscribed) {
        // Resubscribe
        await db.subscriber.update({
          where: { email },
          data: {
            unsubscribed: false,
            unsubscribedAt: null,
            subscribedAt: new Date(),
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Welcome back! You have been resubscribed.',
        });
      }

      return NextResponse.json({
        success: true,
        message: 'You are already subscribed!',
      });
    }

    // Create new subscriber
    const subscriber = await db.subscriber.create({
      data: {
        email,
        name: name || null,
        source,
        verified: false,
        tier: 'FREE',
      },
    });

    // Log the subscription
    await db.emailLog.create({
      data: {
        subscriberId: subscriber.id,
        emailType: 'welcome',
        subject: 'Welcome to AI Tools Weekly! 🚀',
        status: 'SENT',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your email to get started.',
      subscriber: {
        email: subscriber.email,
        name: subscriber.name,
      },
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to check subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const subscriber = await db.subscriber.findUnique({
      where: { email },
      select: {
        email: true,
        name: true,
        verified: true,
        unsubscribed: true,
        tier: true,
        subscribedAt: true,
      },
    });

    if (!subscriber) {
      return NextResponse.json(
        { subscribed: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      subscribed: !subscriber.unsubscribed,
      subscriber,
    });
  } catch (error) {
    console.error('Check subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}
