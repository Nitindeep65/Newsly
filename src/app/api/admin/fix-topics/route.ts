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

// GET - Check current topic status (no auth required for debugging)
export async function GET() {
  try {
    // Get all subscribers with their topic values
    const subscribers = await db.subscriber.findMany({
      select: {
        id: true,
        email: true,
        topicAiTools: true,
        topicStockMarket: true,
        topicCrypto: true,
        topicStartups: true,
        topicProductivity: true,
        topicMutualFunds: true,
        topicIpoNews: true,
      },
    });

    // Count topic distribution
    const topicCounts = {
      total: subscribers.length,
      aiTools: subscribers.filter(s => s.topicAiTools === true).length,
      stockMarket: subscribers.filter(s => s.topicStockMarket === true).length,
      crypto: subscribers.filter(s => s.topicCrypto === true).length,
      startups: subscribers.filter(s => s.topicStartups === true).length,
      productivity: subscribers.filter(s => s.topicProductivity === true).length,
      mutualFunds: subscribers.filter(s => s.topicMutualFunds === true).length,
      ipoNews: subscribers.filter(s => s.topicIpoNews === true).length,
    };

    // Check for any true values at all
    const anyTrueValues = subscribers.some(s => 
      s.topicAiTools || s.topicStockMarket || s.topicCrypto || 
      s.topicStartups || s.topicProductivity
    );

    return NextResponse.json({
      topicCounts,
      anyTrueValues,
      sampleSubscribers: subscribers.slice(0, 5).map(s => ({
        email: s.email.substring(0, 5) + '***',
        topicAiTools: s.topicAiTools,
        topicStockMarket: s.topicStockMarket,
        topicCrypto: s.topicCrypto,
      })),
    });
  } catch (error) {
    console.error("Failed to check topics:", error);
    return NextResponse.json(
      { error: "Failed to check topics", details: String(error) },
      { status: 500 }
    );
  }
}
