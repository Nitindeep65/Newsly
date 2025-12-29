import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, subject, intro, toolIds, customContent, cta } = body;

    // Get all subscribers
    const subscribers = await db.subscriber.findMany({
      where: { verified: true },
      select: { id: true, email: true, name: true }
    });

    if (subscribers.length === 0) {
      // Also try unverified subscribers for MVP
      const allSubscribers = await db.subscriber.findMany({
        select: { id: true, email: true, name: true }
      });
      
      if (allSubscribers.length === 0) {
        return NextResponse.json(
          { error: "No subscribers to send to" },
          { status: 400 }
        );
      }
      
      subscribers.push(...allSubscribers);
    }

    // Get selected tools
    let toolsHtml = '';
    if (toolIds && toolIds.length > 0) {
      const tools = await db.tool.findMany({
        where: { id: { in: toolIds } },
        select: { name: true, tagline: true, websiteUrl: true, category: true, priceInr: true, freeTier: true }
      });

      toolsHtml = tools.map(tool => `
        <div style="margin-bottom: 24px; padding: 20px; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px;">
          <h3 style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 18px;">${tool.name}</h3>
          <p style="margin: 0 0 12px 0; color: #666; font-size: 14px;">${tool.tagline}</p>
          <div style="margin-bottom: 12px;">
            <span style="display: inline-block; padding: 4px 8px; background: #f0f0f0; border-radius: 4px; font-size: 12px; color: #555;">
              ${tool.category.replace(/_/g, ' ')}
            </span>
            ${tool.freeTier ? '<span style="display: inline-block; margin-left: 8px; padding: 4px 8px; background: #dcfce7; border-radius: 4px; font-size: 12px; color: #166534;">Free tier</span>' : ''}
            ${tool.priceInr ? `<span style="display: inline-block; margin-left: 8px; padding: 4px 8px; background: #fef3c7; border-radius: 4px; font-size: 12px; color: #92400e;">₹${tool.priceInr}/mo</span>` : ''}
          </div>
          <a href="${tool.websiteUrl}" style="display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 6px; font-size: 14px;">
            Try ${tool.name} →
          </a>
        </div>
      `).join('');
    }

    // Build email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="margin: 0; font-size: 28px; color: #1a1a1a;">✨ ${title}</h1>
          </div>
          
          <!-- Intro -->
          ${intro ? `
            <div style="background: #fff; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333;">${intro}</p>
            </div>
          ` : ''}
          
          <!-- Tools -->
          ${toolsHtml ? `
            <h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a1a1a;">🔧 This Week's AI Tools</h2>
            ${toolsHtml}
          ` : ''}
          
          <!-- Custom Content -->
          ${customContent ? `
            <div style="margin-top: 32px; padding: 24px; background: #1a1a1a; border-radius: 12px;">
              <h3 style="margin: 0 0 16px 0; color: #fff;">💡 Code Snippet / Tip</h3>
              <pre style="margin: 0; white-space: pre-wrap; font-family: 'Monaco', 'Menlo', monospace; font-size: 13px; color: #a0a0a0; overflow-x: auto;">${customContent}</pre>
            </div>
          ` : ''}
          
          <!-- CTA -->
          ${cta ? `
            <div style="text-align: center; margin-top: 40px; padding: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px;">
              <p style="margin: 0 0 16px 0; color: #fff; font-size: 16px;">${cta}</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'}/tools" style="display: inline-block; padding: 14px 28px; background: #fff; color: #764ba2; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Browse All Tools →
              </a>
            </div>
          ` : ''}
          
          <!-- Footer -->
          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e5e5; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              AI Tools Weekly • Curated tools for Indian traders & developers
            </p>
            <p style="margin: 12px 0 0 0; font-size: 12px; color: #999;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'}/unsubscribe" style="color: #999;">Unsubscribe</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create newsletter record
    const newsletter = await db.newsletter.create({
      data: {
        subject: subject || title,
        contentHtml: emailHtml,
        status: 'SENT',
        sentAt: new Date(),
      }
    });

    // Send to all subscribers
    let sentCount = 0;
    let failedCount = 0;

    for (const subscriber of subscribers) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'AI Tools Weekly <newsletter@resend.dev>',
          to: subscriber.email,
          subject: subject || title,
          html: emailHtml.replace('{{name}}', subscriber.name || 'there'),
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

    return NextResponse.json({
      success: true,
      newsletterId: newsletter.id,
      sentCount,
      failedCount,
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
