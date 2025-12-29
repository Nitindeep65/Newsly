import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PUT update subscriber preferences
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      topicAiTools, 
      topicStockMarket, 
      topicCrypto, 
      topicStartups, 
      topicProductivity,
      dailyDigest,
      marketingEmails 
    } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find subscriber
    const subscriber = await db.subscriber.findUnique({
      where: { email }
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    // Build update data based on tier
    const updateData: any = {};
    
    // Free topics (available to Pro and Premium)
    if (subscriber.tier === 'PRO' || subscriber.tier === 'PREMIUM') {
      if (topicAiTools !== undefined) updateData.topicAiTools = topicAiTools;
      if (topicStockMarket !== undefined) updateData.topicStockMarket = topicStockMarket;
      if (topicCrypto !== undefined) updateData.topicCrypto = topicCrypto;
    }

    // Premium-only topics
    if (subscriber.tier === 'PREMIUM') {
      if (topicStartups !== undefined) updateData.topicStartups = topicStartups;
      if (topicProductivity !== undefined) updateData.topicProductivity = topicProductivity;
    }

    // General preferences (available to all)
    if (dailyDigest !== undefined) updateData.dailyDigest = dailyDigest;
    if (marketingEmails !== undefined) updateData.marketingEmails = marketingEmails;

    // Update subscriber
    const updated = await db.subscriber.update({
      where: { email },
      data: updateData,
      select: {
        id: true,
        email: true,
        tier: true,
        topicAiTools: true,
        topicStockMarket: true,
        topicCrypto: true,
        topicStartups: true,
        topicProductivity: true,
        dailyDigest: true,
        marketingEmails: true,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Preferences updated",
      subscriber: updated 
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
