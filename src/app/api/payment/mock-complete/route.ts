import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, success, email, plan } = body;

    if (!orderId || !email || !plan) {
      return NextResponse.json(
        { error: 'Order ID, email, and plan are required' },
        { status: 400 }
      );
    }

    if (success) {
      // Update subscriber tier
      const subscriber = await db.subscriber.update({
        where: { email },
        data: { tier: plan },
      });

      return NextResponse.json({
        success: true,
        message: 'Payment completed successfully',
        tier: subscriber.tier,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Payment failed',
      });
    }
  } catch (error) {
    console.error('Mock payment completion error:', error);
    return NextResponse.json(
      { error: 'Failed to process mock payment' },
      { status: 500 }
    );
  }
}
