import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// GET all newsletters
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newsletters = await db.newsletter.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        subject: true,
        status: true,
        sentAt: true,
        openRate: true,
        clickRate: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ newsletters });
  } catch (error) {
    console.error("Failed to fetch newsletters:", error);
    return NextResponse.json(
      { error: "Failed to fetch newsletters" },
      { status: 500 }
    );
  }
}

// POST - Create new newsletter (draft)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, subject, intro, toolIds, customContent, status = 'DRAFT' } = body;

    // Get selected tools
    let toolsHtml = '';
    if (toolIds && toolIds.length > 0) {
      const tools = await db.tool.findMany({
        where: { id: { in: toolIds } },
        select: { name: true, tagline: true, websiteUrl: true, category: true }
      });

      toolsHtml = tools.map(tool => `
        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e5e5; border-radius: 8px;">
          <h3 style="margin: 0 0 8px 0; color: #1a1a1a;">${tool.name}</h3>
          <p style="margin: 0 0 8px 0; color: #666;">${tool.tagline}</p>
          <a href="${tool.websiteUrl}" style="color: #0066cc;">Check it out →</a>
        </div>
      `).join('');
    }

    // Build HTML content
    const contentHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        ${intro ? `<p style="font-size: 16px; line-height: 1.6; color: #333;">${intro}</p>` : ''}
        
        ${toolsHtml ? `
          <h2 style="margin-top: 30px; color: #1a1a1a;">🔧 This Week's Tools</h2>
          ${toolsHtml}
        ` : ''}
        
        ${customContent ? `
          <div style="margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
            <pre style="white-space: pre-wrap; font-family: monospace; font-size: 14px;">${customContent}</pre>
          </div>
        ` : ''}
      </div>
    `;

    const newsletter = await db.newsletter.create({
      data: {
        subject: subject || title,
        contentHtml,
        status,
      }
    });

    return NextResponse.json(newsletter);
  } catch (error) {
    console.error("Failed to create newsletter:", error);
    return NextResponse.json(
      { error: "Failed to create newsletter" },
      { status: 500 }
    );
  }
}
