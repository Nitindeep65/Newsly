import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resend } from "@/lib/resend";
import { generateNewsletter, NewsletterTopic } from "@/lib/ai-newsletter";

// This endpoint is called by Vercel Cron at 9 AM IST (3:30 AM UTC) daily
// It generates personalized newsletters based on each subscriber's selected topics

type SubscriberWithTopics = {
  id: string;
  email: string;
  name: string | null;
  tier: "FREE" | "PRO" | "PREMIUM";
  topicAiTools: boolean;
  topicStockMarket: boolean;
  topicCrypto: boolean;
  topicStartups: boolean;
  topicProductivity: boolean;
};

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret (for security)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`🤖 Starting personalized newsletter generation at ${new Date().toISOString()}`);

    // Get all active subscribers with their topic preferences
    const subscribers = await db.subscriber.findMany({
      where: {
        unsubscribed: false,
        dailyDigest: true,
      },
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
      },
    }) as SubscriberWithTopics[];

    console.log(`📧 Found ${subscribers.length} active subscribers`);

    // Group subscribers by their topic combinations
    const topicGroups = groupSubscribersByTopics(subscribers);
    
    const results = {
      totalSubscribers: subscribers.length,
      newslettersGenerated: 0,
      emailsSent: 0,
      emailsFailed: 0,
      topicBreakdown: {} as Record<string, number>,
    };

    // Generate and send newsletters for each topic group
    for (const [topicsKey, groupSubscribers] of Object.entries(topicGroups)) {
      const topics = topicsKey.split(',').filter(Boolean) as NewsletterTopic[];
      
      if (topics.length === 0) {
        console.log(`⏭️ Skipping ${groupSubscribers.length} subscribers with no topics selected`);
        continue;
      }

      console.log(`📝 Generating newsletter for topics: ${topics.join(', ')} (${groupSubscribers.length} subscribers)`);
      
      try {
        // Generate combined newsletter for these topics
        const content = await generateCombinedNewsletter(topics, groupSubscribers[0].tier);
        results.newslettersGenerated++;

        // Save newsletter to database
        const newsletter = await db.newsletter.create({
          data: {
            subject: content.subject,
            previewText: content.previewText,
            contentHtml: content.contentHtml,
            contentJson: JSON.stringify(content.contentJson),
            topic: topics[0], // Primary topic
            targetTier: groupSubscribers[0].tier,
            aiGenerated: true,
            status: "SENDING",
          },
        });

        // Send to all subscribers in this group
        const sendResults = await sendToSubscribers(groupSubscribers, content, newsletter.id);
        results.emailsSent += sendResults.sent;
        results.emailsFailed += sendResults.failed;

        // Track topic counts
        for (const topic of topics) {
          results.topicBreakdown[topic] = (results.topicBreakdown[topic] || 0) + groupSubscribers.length;
        }

        // Update newsletter status
        await db.newsletter.update({
          where: { id: newsletter.id },
          data: {
            status: "SENT",
            sentAt: new Date(),
            recipientCount: sendResults.sent + sendResults.failed,
          },
        });
      } catch (error) {
        console.error(`Failed to process topic group ${topicsKey}:`, error);
      }
    }

    console.log(`✅ Newsletter generation complete:`, results);

    return NextResponse.json({
      success: true,
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

// Group subscribers by their selected topics for efficient batch processing
function groupSubscribersByTopics(subscribers: SubscriberWithTopics[]): Record<string, SubscriberWithTopics[]> {
  const groups: Record<string, SubscriberWithTopics[]> = {};

  for (const subscriber of subscribers) {
    const topics: NewsletterTopic[] = [];
    
    if (subscriber.topicAiTools) topics.push("AI_TOOLS");
    if (subscriber.topicStockMarket) topics.push("STOCK_MARKET");
    if (subscriber.topicCrypto) topics.push("CRYPTO");
    if (subscriber.topicStartups) topics.push("STARTUPS");
    if (subscriber.topicProductivity) topics.push("PRODUCTIVITY");

    // Create a key from sorted topics
    const key = topics.sort().join(',');
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(subscriber);
  }

  return groups;
}

// Generate a combined newsletter covering multiple topics
async function generateCombinedNewsletter(
  topics: NewsletterTopic[],
  tier: "FREE" | "PRO" | "PREMIUM"
) {
  // If single topic, use the standard generator
  if (topics.length === 1) {
    return generateNewsletter(topics[0], tier);
  }

  // For multiple topics, generate each and combine
  const topicContents = await Promise.all(
    topics.slice(0, 3).map(topic => generateNewsletter(topic, tier))
  );

  // Combine into one newsletter
  const combinedSections = topicContents.flatMap((content, index) => {
    const topicName = topics[index].replace('_', ' ');
    return [
      {
        title: `📌 ${topicName}`,
        content: content.contentJson.intro,
      },
      ...content.contentJson.sections.slice(0, 2),
    ];
  });

  const topicNames = topics.map(t => t.replace('_', ' ')).join(' + ');
  
  return {
    subject: `Your Daily Digest: ${topicNames} | ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
    previewText: `Today's updates on ${topicNames.toLowerCase()}`,
    contentHtml: generateHtmlEmail({
      headline: `Your Personalized News Digest`,
      intro: `Good morning! Here's your curated update on ${topicNames.toLowerCase()}.`,
      sections: combinedSections,
      cta: "Explore more on Newsly",
    }),
    contentJson: {
      headline: `Your Personalized News Digest`,
      intro: `Good morning! Here's your curated update on ${topicNames.toLowerCase()}.`,
      sections: combinedSections,
      cta: "Explore more on Newsly",
    },
  };
}

function generateHtmlEmail(content: {
  headline: string;
  intro: string;
  sections: Array<{ title: string; content: string; link?: string }>;
  cta: string;
}): string {
  const sectionsHtml = content.sections
    .map(section => `
      <div style="margin-bottom: 24px;">
        <h2 style="color: #1a1a1a; font-size: 18px; margin-bottom: 8px;">${section.title}</h2>
        <p style="color: #4a4a4a; line-height: 1.6;">${section.content}</p>
        ${section.link ? `<a href="${section.link}" style="color: #0066cc;">Read more →</a>` : ''}
      </div>
    `)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background-color: white; border-radius: 8px; padding: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #000; font-size: 24px; margin: 0;">Newsly</h1>
          <p style="color: #666; font-size: 12px;">Your AI-Curated Newsletter</p>
        </div>
        
        <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">${content.headline}</h1>
        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">${content.intro}</p>
        
        ${sectionsHtml}
        
        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee;">
          <a href="https://newsly-beryl.vercel.app/my-newsletters" style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">${content.cta}</a>
        </div>
        
        <div style="text-align: center; margin-top: 32px; color: #999; font-size: 12px;">
          <p>You're receiving this because you subscribed to Newsly.</p>
          <p><a href="https://newsly-beryl.vercel.app/my-newsletters" style="color: #666;">Manage preferences</a> | <a href="https://newsly-beryl.vercel.app/api/unsubscribe" style="color: #666;">Unsubscribe</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function sendToSubscribers(
  subscribers: SubscriberWithTopics[],
  content: { subject: string; contentHtml: string },
  newsletterId: string
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

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

        await db.emailLog.create({
          data: {
            subscriberId: subscriber.id,
            newsletterId,
            emailType: "newsletter",
            status: "SENT",
            subject: content.subject,
          },
        });

        // Update last email sent
        await db.subscriber.update({
          where: { id: subscriber.id },
          data: { lastEmailSent: new Date() },
        });

        sent++;
      } catch (error) {
        console.error(`Failed to send to ${subscriber.email}:`, error);

        await db.emailLog.create({
          data: {
            subscriberId: subscriber.id,
            newsletterId,
            emailType: "newsletter",
            status: "FAILED",
            subject: content.subject,
            errorMessage: String(error),
          },
        });

        failed++;
      }
    });

    await Promise.all(emailPromises);
  }

  return { sent, failed };
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

  const subscriberStats = await db.subscriber.groupBy({
    by: ['tier'],
    where: { unsubscribed: false, dailyDigest: true },
    _count: true,
  });

  return NextResponse.json({
    message: "Personalized Newsletter System",
    schedule: "Daily at 9:00 AM IST",
    features: [
      "AI-generated content using Google Gemini",
      "Personalized based on user-selected topics",
      "Topics: AI Tools, Stock Market, Crypto, Startups, Productivity",
      "Tier-based content depth (FREE, PRO, PREMIUM)",
    ],
    subscriberStats,
    recentNewsletters,
  });
}
