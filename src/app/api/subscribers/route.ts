import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// GET all subscribers (admin only)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeTopics = searchParams.get('includeTopics') === 'true';

    const subscribers = await db.subscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        verified: true,
        subscribedAt: true,
        ...(includeTopics && {
          topicAiTools: true,
          topicStockMarket: true,
          topicCrypto: true,
          topicStartups: true,
          topicProductivity: true,
        }),
      }
    });

    return NextResponse.json({ 
      subscribers,
      total: subscribers.length,
      proCount: subscribers.filter(s => s.tier === 'PRO').length,
    });
  } catch (error) {
    console.error("Failed to fetch subscribers:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}
