import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// GET all subscribers (admin only)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    console.log("Subscribers API - userId:", userId);
    
    if (!userId) {
      console.log("Subscribers API - Unauthorized, returning 401");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeTopics = searchParams.get('includeTopics') === 'true';
    console.log("Subscribers API - includeTopics:", includeTopics);

    // Always fetch with topics if requested, otherwise just base fields
    if (includeTopics) {
      const subscribers = await db.subscriber.findMany({
        orderBy: { subscribedAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          tier: true,
          verified: true,
          subscribedAt: true,
          topicAiTools: true,
          topicStockMarket: true,
          topicCrypto: true,
          topicStartups: true,
          topicProductivity: true,
          topicMutualFunds: true,
          topicIpoNews: true,
          topicForex: true,
          topicCommodities: true,
          topicFintech: true,
          topicEcommerce: true,
          topicCloudComputing: true,
          topicCybersecurity: true,
          topicHealthWellness: true,
          topicCareerGrowth: true,
          topicPersonalFinance: true,
          topicWorldNews: true,
        },
      });

      console.log("Subscribers API - Found", subscribers.length, "subscribers with topics");
      console.log("Subscribers API - First subscriber:", subscribers[0]);

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
    }

    // Without topics
    const subscribers = await db.subscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        verified: true,
        subscribedAt: true,
      },
    });

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
