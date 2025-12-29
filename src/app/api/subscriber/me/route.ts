import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET subscriber data by email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const subscriber = await db.subscriber.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        topicAiTools: true,
        topicStockMarket: true,
        topicCrypto: true,
        topicStartups: true,
        topicProductivity: true,
        personalizedDigest: true,
        dailyDigest: true,
        marketingEmails: true,
        subscribedAt: true,
      }
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subscriber);
  } catch (error) {
    console.error("Get subscriber error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriber" },
      { status: 500 }
    );
  }
}
