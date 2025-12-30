import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// POST - Fix subscribers with null/false topic values
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update all subscribers to have default topics enabled
    const result = await db.subscriber.updateMany({
      data: {
        topicAiTools: true,
        topicStockMarket: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Updated ${result.count} subscribers with default topics`,
      updatedCount: result.count,
    });
  } catch (error) {
    console.error("Failed to fix topics:", error);
    return NextResponse.json(
      { error: "Failed to fix topics" },
      { status: 500 }
    );
  }
}

// GET - Check current topic status
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all subscribers with their topic values
    const subscribers = await db.subscriber.findMany({
      select: {
        id: true,
        email: true,
        topicAiTools: true,
        topicStockMarket: true,
        topicCrypto: true,
        topicStartups: true,
      },
    });

    // Count topic distribution
    const aiCount = subscribers.filter(s => s.topicAiTools === true).length;
    const stockCount = subscribers.filter(s => s.topicStockMarket === true).length;
    const cryptoCount = subscribers.filter(s => s.topicCrypto === true).length;
    const startupsCount = subscribers.filter(s => s.topicStartups === true).length;

    return NextResponse.json({
      total: subscribers.length,
      topicCounts: {
        aiTools: aiCount,
        stockMarket: stockCount,
        crypto: cryptoCount,
        startups: startupsCount,
      },
      sample: subscribers.slice(0, 3),
    });
  } catch (error) {
    console.error("Failed to check topics:", error);
    return NextResponse.json(
      { error: "Failed to check topics" },
      { status: 500 }
    );
  }
}
