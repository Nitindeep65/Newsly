import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";

// GET current user's subscriber data
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const email = user.primaryEmailAddress.emailAddress;

    const subscriber = await db.subscriber.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        verified: true,
        topicAiTools: true,
        topicStockMarket: true,
        topicCrypto: true,
        topicStartups: true,
        topicProductivity: true,
        // New topic fields
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
        subscribedAt: true,
      },
    });

    if (!subscriber) {
      return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }

    // Map to frontend-friendly format
    return NextResponse.json({
      id: subscriber.id,
      email: subscriber.email,
      name: subscriber.name,
      subscriptionTier: subscriber.tier,
      verified: subscriber.verified,
      aiTools: subscriber.topicAiTools,
      stockMarket: subscriber.topicStockMarket,
      crypto: subscriber.topicCrypto,
      startups: subscriber.topicStartups,
      productivity: subscriber.topicProductivity,
      // New topic fields
      mutualFunds: subscriber.topicMutualFunds,
      ipoNews: subscriber.topicIpoNews,
      forex: subscriber.topicForex,
      commodities: subscriber.topicCommodities,
      fintech: subscriber.topicFintech,
      ecommerce: subscriber.topicEcommerce,
      cloudComputing: subscriber.topicCloudComputing,
      cybersecurity: subscriber.topicCybersecurity,
      healthWellness: subscriber.topicHealthWellness,
      careerGrowth: subscriber.topicCareerGrowth,
      personalFinance: subscriber.topicPersonalFinance,
      worldNews: subscriber.topicWorldNews,
      subscribedAt: subscriber.subscribedAt,
    });
  } catch (error) {
    console.error("Failed to fetch subscriber:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriber" },
      { status: 500 }
    );
  }
}

// PATCH - Update current user's preferences
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const email = user.primaryEmailAddress.emailAddress;
    const body = await request.json();

    // Map frontend fields to database fields
    const updateData: Record<string, boolean> = {};
    
    // Original topics
    if (typeof body.aiTools === "boolean") updateData.topicAiTools = body.aiTools;
    if (typeof body.stockMarket === "boolean") updateData.topicStockMarket = body.stockMarket;
    if (typeof body.crypto === "boolean") updateData.topicCrypto = body.crypto;
    if (typeof body.startups === "boolean") updateData.topicStartups = body.startups;
    if (typeof body.productivity === "boolean") updateData.topicProductivity = body.productivity;
    
    // New Stock Market Related topics
    if (typeof body.mutualFunds === "boolean") updateData.topicMutualFunds = body.mutualFunds;
    if (typeof body.ipoNews === "boolean") updateData.topicIpoNews = body.ipoNews;
    if (typeof body.forex === "boolean") updateData.topicForex = body.forex;
    if (typeof body.commodities === "boolean") updateData.topicCommodities = body.commodities;
    
    // Tech & Business topics
    if (typeof body.fintech === "boolean") updateData.topicFintech = body.fintech;
    if (typeof body.ecommerce === "boolean") updateData.topicEcommerce = body.ecommerce;
    if (typeof body.cloudComputing === "boolean") updateData.topicCloudComputing = body.cloudComputing;
    if (typeof body.cybersecurity === "boolean") updateData.topicCybersecurity = body.cybersecurity;
    
    // Lifestyle & Growth topics
    if (typeof body.healthWellness === "boolean") updateData.topicHealthWellness = body.healthWellness;
    if (typeof body.careerGrowth === "boolean") updateData.topicCareerGrowth = body.careerGrowth;
    if (typeof body.personalFinance === "boolean") updateData.topicPersonalFinance = body.personalFinance;
    if (typeof body.worldNews === "boolean") updateData.topicWorldNews = body.worldNews;

    const subscriber = await db.subscriber.update({
      where: { email },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        verified: true,
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
        subscribedAt: true,
      },
    });

    // Map to frontend-friendly format
    return NextResponse.json({
      id: subscriber.id,
      email: subscriber.email,
      name: subscriber.name,
      subscriptionTier: subscriber.tier,
      verified: subscriber.verified,
      aiTools: subscriber.topicAiTools,
      stockMarket: subscriber.topicStockMarket,
      crypto: subscriber.topicCrypto,
      startups: subscriber.topicStartups,
      productivity: subscriber.topicProductivity,
      mutualFunds: subscriber.topicMutualFunds,
      ipoNews: subscriber.topicIpoNews,
      forex: subscriber.topicForex,
      commodities: subscriber.topicCommodities,
      fintech: subscriber.topicFintech,
      ecommerce: subscriber.topicEcommerce,
      cloudComputing: subscriber.topicCloudComputing,
      cybersecurity: subscriber.topicCybersecurity,
      healthWellness: subscriber.topicHealthWellness,
      careerGrowth: subscriber.topicCareerGrowth,
      personalFinance: subscriber.topicPersonalFinance,
      worldNews: subscriber.topicWorldNews,
      subscribedAt: subscriber.subscribedAt,
    });
  } catch (error) {
    console.error("Failed to update subscriber:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
