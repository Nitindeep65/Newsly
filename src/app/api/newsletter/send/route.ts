import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import NewsletterEmail from "@/emails/newsletter";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, subject, intro, toolIds, customContent, cta, subscriberIds, targetTopics } = body;

    // Build subscriber query based on targeting
    interface SubscriberData {
      id: string;
      email: string;
      name: string | null;
      tier: string;
      topicAiTools: boolean;
      topicStockMarket: boolean;
      topicCrypto: boolean;
      topicStartups: boolean;
      topicProductivity: boolean;
    }

    let subscribers: SubscriberData[] = [];

    // If specific subscriber IDs are provided, use those
    if (subscriberIds && subscriberIds.length > 0) {
      subscribers = await db.subscriber.findMany({
        where: { id: { in: subscriberIds } },
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
        }
      });
    } else {
      // Get all subscribers
      subscribers = await db.subscriber.findMany({
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
        }
      });
    }

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: "No subscribers to send to" },
        { status: 400 }
      );
    }

    // Get selected tools for content sections
    let toolSections: Array<{ title: string; content: string; link?: string }> = [];
    if (toolIds && toolIds.length > 0) {
      try {
        const tools = await db.tool.findMany({
          where: { id: { in: toolIds } },
          select: { name: true, tagline: true, websiteUrl: true, category: true, priceInr: true, freeTier: true }
        });

        toolSections = tools.map(tool => ({
          title: `🔧 ${tool.name}`,
          content: `${tool.tagline}${tool.freeTier ? ' • Free tier available' : ''}${tool.priceInr ? ` • From ₹${tool.priceInr}/mo` : ''}`,
          link: tool.websiteUrl || undefined,
        }));
      } catch {
        // Tools table might not exist, skip
        console.log('Tools not available, skipping');
      }
    }

    // Add custom content as a section if provided
    if (customContent) {
      toolSections.push({
        title: "💡 Today's Tip",
        content: customContent,
      });
    }

    // If no sections, add intro as a section
    if (toolSections.length === 0 && intro) {
      toolSections.push({
        title: "📰 Today's Highlights",
        content: intro,
      });
    }

    // Ensure we have at least one section
    if (toolSections.length === 0) {
      toolSections.push({
        title: "📰 Your Daily Digest",
        content: "Check out the latest news and updates curated just for you!",
      });
    }

    // Create newsletter record
    const newsletter = await db.newsletter.create({
      data: {
        subject: subject || title,
        contentHtml: `Targeted: ${subscriberIds ? 'Yes' : 'No'} | Topics: ${targetTopics?.join(', ') || 'All'}`,
        status: 'SENT',
        sentAt: new Date(),
      }
    });

    // Send to all targeted subscribers
    let sentCount = 0;
    let failedCount = 0;

    for (const subscriber of subscribers) {
      try {
        // Get subscriber's selected topics for personalization
        const subscriberTopics: string[] = [];
        if (subscriber.topicAiTools) subscriberTopics.push('AI_TOOLS');
        if (subscriber.topicStockMarket) subscriberTopics.push('STOCK_MARKET');
        if (subscriber.topicCrypto) subscriberTopics.push('CRYPTO');
        if (subscriber.topicStartups) subscriberTopics.push('STARTUPS');
        if (subscriber.topicProductivity) subscriberTopics.push('PRODUCTIVITY');

        // Render the professional email template
        const emailHtml = await render(NewsletterEmail({
          subscriberName: subscriber.name || 'there',
          email: subscriber.email,
          subject: subject || title,
          headline: title || 'Your Daily News Digest',
          intro: intro || `Here's your personalized news digest for today.`,
          sections: toolSections,
          tier: (subscriber.tier as 'FREE' | 'PRO' | 'PREMIUM') || 'FREE',
          topics: targetTopics || subscriberTopics,
        }));

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Newsly <newsletter@resend.dev>',
          to: subscriber.email,
          subject: subject || title,
          html: emailHtml,
        });

        // Log email
        await db.emailLog.create({
          data: {
            subscriberId: subscriber.id,
            newsletterId: newsletter.id,
            emailType: 'newsletter',
            subject: subject || title,
            status: 'SENT',
            sentAt: new Date(),
          }
        });

        sentCount++;
      } catch (error) {
        console.error(`Failed to send to ${subscriber.email}:`, error);
        
        await db.emailLog.create({
          data: {
            subscriberId: subscriber.id,
            newsletterId: newsletter.id,
            emailType: 'newsletter',
            subject: subject || title,
            status: 'FAILED',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          }
        });

        failedCount++;
      }
    }

    // Update newsletter with final stats
    await db.newsletter.update({
      where: { id: newsletter.id },
      data: {
        contentHtml: `Sent to ${sentCount} subscribers${targetTopics ? ` (filtered by: ${targetTopics.join(', ')})` : ' (all subscribers)'}`,
      }
    });

    return NextResponse.json({
      success: true,
      newsletterId: newsletter.id,
      sentCount,
      failedCount,
      targeted: !!subscriberIds || !!targetTopics,
      message: `Newsletter sent to ${sentCount} subscribers${failedCount > 0 ? `, ${failedCount} failed` : ''}`
    });
  } catch (error) {
    console.error("Failed to send newsletter:", error);
    return NextResponse.json(
      { error: "Failed to send newsletter" },
      { status: 500 }
    );
  }
}
