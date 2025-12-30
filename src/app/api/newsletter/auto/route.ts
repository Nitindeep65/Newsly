import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resend } from "@/lib/resend";
import { generateNewsletter, NewsletterTopic } from "@/lib/ai-newsletter";

// This endpoint is called by a cron job (Vercel Cron or external service)
// Schedule: 3 times a day - 8 AM, 2 PM, 6 PM IST

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret (for security)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const topic = (body.topic as NewsletterTopic) || getTopicByTime();
    
    console.log(`🤖 Generating AI newsletter for topic: ${topic}`);

    // Generate newsletters for each tier
    const results = {
      free: { generated: false, sent: 0, failed: 0 },
      pro: { generated: false, sent: 0, failed: 0 },
      premium: { generated: false, sent: 0, failed: 0 },
    };

    // FREE tier newsletter
    const freeNewsletter = await generateAndSend(topic, "FREE");
    results.free = freeNewsletter;

    // PRO tier newsletter (more content)
    const proNewsletter = await generateAndSend(topic, "PRO");
    results.pro = proNewsletter;

    // PREMIUM tier newsletter (personalized)
    const premiumNewsletter = await generateAndSend(topic, "PREMIUM");
    results.premium = premiumNewsletter;

    return NextResponse.json({
      success: true,
      topic,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Auto newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to generate/send newsletters" },
      { status: 500 }
    );
  }
}

async function generateAndSend(
  topic: NewsletterTopic,
  tier: "FREE" | "PRO" | "PREMIUM"
) {
  try {
    // Generate newsletter content using AI
    const content = await generateNewsletter(topic, tier);

    // Save newsletter to database
    const newsletter = await db.newsletter.create({
      data: {
        subject: content.subject,
        previewText: content.previewText,
        contentHtml: content.contentHtml,
        contentJson: JSON.stringify(content.contentJson),
        topic: topic,
        targetTier: tier,
        aiGenerated: true,
        status: "SENDING",
      },
    });

    // Get subscribers for this tier
    const subscribers = await getSubscribersForTier(tier, topic);
    
    let sentCount = 0;
    let failedCount = 0;

    // Send emails in batches
    const batchSize = 50;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (subscriber) => {
        try {
          await resend.emails.send({
            from: "Newsly <newsletter@newsly.in>",
            to: subscriber.email,
            subject: content.subject,
            html: content.contentHtml,
          });

          // Log successful send
          await db.emailLog.create({
            data: {
              subscriberId: subscriber.id,
              newsletterId: newsletter.id,
              emailType: "newsletter",
              status: "SENT",
              subject: content.subject,
            },
          });

          sentCount++;
        } catch (error) {
          console.error(`Failed to send to ${subscriber.email}:`, error);
          
          await db.emailLog.create({
            data: {
              subscriberId: subscriber.id,
              newsletterId: newsletter.id,
              emailType: "newsletter",
              status: "FAILED",
              subject: content.subject,
              errorMessage: String(error),
            },
          });

          failedCount++;
        }
      });

      await Promise.all(emailPromises);
    }

    // Update newsletter stats
    await db.newsletter.update({
      where: { id: newsletter.id },
      data: {
        status: "SENT",
        sentAt: new Date(),
        recipientCount: sentCount + failedCount,
      },
    });

    // Update lastEmailSent for all sent subscribers
    await db.subscriber.updateMany({
      where: {
        id: { in: subscribers.map(s => s.id) },
      },
      data: {
        lastEmailSent: new Date(),
      },
    });

    return { generated: true, sent: sentCount, failed: failedCount };
  } catch (error) {
    console.error(`Failed to generate/send ${tier} newsletter:`, error);
    return { generated: false, sent: 0, failed: 0, error: String(error) };
  }
}

async function getSubscribersForTier(
  tier: "FREE" | "PRO" | "PREMIUM",
  topic: NewsletterTopic
) {
  // Build topic filter based on subscriber preferences
  const topicFilter: Record<string, boolean> = {};
  
  switch (topic) {
    case "AI_TOOLS":
      topicFilter.topicAiTools = true;
      break;
    case "STOCK_MARKET":
      topicFilter.topicStockMarket = true;
      break;
    case "CRYPTO":
      topicFilter.topicCrypto = true;
      break;
    case "STARTUPS":
      topicFilter.topicStartups = true;
      break;
    case "PRODUCTIVITY":
      topicFilter.topicProductivity = true;
      break;
  }

  // Get subscribers based on tier
  // FREE: all subscribers get free content
  // PRO: only PRO and PREMIUM subscribers
  // PREMIUM: only PREMIUM subscribers
  
  const tierFilter = 
    tier === "FREE" 
      ? { tier: { in: ["FREE", "PRO", "PREMIUM"] as any } }
      : tier === "PRO"
      ? { tier: { in: ["PRO", "PREMIUM"] as any } }
      : { tier: "PREMIUM" as any };

  const subscribers = await db.subscriber.findMany({
    where: {
      unsubscribed: false,
      dailyDigest: true,
      ...tierFilter,
      ...topicFilter,
    },
    select: {
      id: true,
      email: true,
      name: true,
      tier: true,
    },
  });

  return subscribers;
}

function getTopicByTime(): NewsletterTopic {
  const hour = new Date().getHours();
  
  // Morning (6 AM - 12 PM) - AI Tools
  if (hour >= 6 && hour < 12) {
    return "AI_TOOLS";
  }
  // Afternoon (12 PM - 5 PM) - Stock Market
  else if (hour >= 12 && hour < 17) {
    return "STOCK_MARKET";
  }
  // Evening (5 PM - 10 PM) - Crypto
  else {
    return "CRYPTO";
  }
}

// GET endpoint to check status
export async function GET() {
  const recentNewsletters = await db.newsletter.findMany({
    where: { aiGenerated: true },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      subject: true,
      topic: true,
      targetTier: true,
      status: true,
      recipientCount: true,
      sentAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    message: "Auto newsletter endpoint",
    schedule: "3x daily: 8 AM (AI Tools), 2 PM (Stock Market), 6 PM (Crypto)",
    recentNewsletters,
  });
}
