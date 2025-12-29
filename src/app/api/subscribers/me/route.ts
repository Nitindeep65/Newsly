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
    if (typeof body.aiTools === "boolean") updateData.topicAiTools = body.aiTools;
    if (typeof body.stockMarket === "boolean") updateData.topicStockMarket = body.stockMarket;
    if (typeof body.crypto === "boolean") updateData.topicCrypto = body.crypto;
    if (typeof body.startups === "boolean") updateData.topicStartups = body.startups;
    if (typeof body.productivity === "boolean") updateData.topicProductivity = body.productivity;

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
