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

    // Build select object
    const selectFields: Record<string, boolean> = {
      id: true,
      email: true,
      name: true,
      tier: true,
      verified: true,
      subscribedAt: true,
    };

    // Add topic fields if requested
    if (includeTopics) {
      selectFields.topicAiTools = true;
      selectFields.topicStockMarket = true;
      selectFields.topicCrypto = true;
      selectFields.topicStartups = true;
      selectFields.topicProductivity = true;
      selectFields.topicMutualFunds = true;
      selectFields.topicIpoNews = true;
      selectFields.topicForex = true;
      selectFields.topicCommodities = true;
      selectFields.topicFintech = true;
      selectFields.topicEcommerce = true;
      selectFields.topicCloudComputing = true;
      selectFields.topicCybersecurity = true;
      selectFields.topicHealthWellness = true;
      selectFields.topicCareerGrowth = true;
      selectFields.topicPersonalFinance = true;
      selectFields.topicWorldNews = true;
    }

    const subscribers = await db.subscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
      select: selectFields,
    });

    // Count by tier
    const proCount = subscribers.filter(s => s.tier === 'PRO').length;
    const premiumCount = subscribers.filter(s => s.tier === 'PREMIUM').length;
    const freeCount = subscribers.filter(s => s.tier === 'FREE').length;

    return NextResponse.json({ 
      subscribers,
      total: subscribers.length,
      proCount,
      premiumCount,
      freeCount,
    });
  } catch (error) {
    console.error("Failed to fetch subscribers:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

// DELETE subscriber (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const subscriberId = searchParams.get('id');

    if (!subscriberId) {
      return NextResponse.json(
        { error: "Subscriber ID is required" },
        { status: 400 }
      );
    }

    await db.subscriber.delete({
      where: { id: subscriberId }
    });

    return NextResponse.json({ 
      success: true,
      message: "Subscriber deleted successfully" 
    });
  } catch (error) {
    console.error("Failed to delete subscriber:", error);
    return NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}
