import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export type NewsletterTopic = "AI_TOOLS" | "STOCK_MARKET" | "CRYPTO" | "STARTUPS" | "PRODUCTIVITY";

interface GeneratedNewsletter {
  subject: string;
  previewText: string;
  contentHtml: string;
  contentJson: {
    headline: string;
    intro: string;
    sections: Array<{
      title: string;
      content: string;
      link?: string;
    }>;
    cta: string;
  };
}

const TOPIC_PROMPTS: Record<NewsletterTopic, string> = {
  AI_TOOLS: `You are an AI tools newsletter curator for Indian developers and traders. 
Write about the latest AI tools, updates, and tips. Include:
- 3-5 new or trending AI tools with brief descriptions
- One "Tool of the Day" with deeper coverage
- A quick tip or prompt for using AI effectively
- Indian pricing where applicable (₹)`,
  
  STOCK_MARKET: `You are a stock market newsletter curator for Indian traders.
Write about the latest market trends and AI tools for trading. Include:
- Market overview and key movements (NSE/BSE focused)
- 2-3 AI tools useful for trading/analysis
- One trading tip or strategy
- Keep it educational, not financial advice`,
  
  CRYPTO: `You are a crypto newsletter curator for Indian investors.
Write about crypto trends and AI tools for crypto trading. Include:
- Market overview (BTC, ETH, major alts)
- 2-3 AI tools for crypto analysis/trading
- One DeFi or Web3 update
- Regulatory updates relevant to India`,
  
  STARTUPS: `You are a startup newsletter curator for Indian entrepreneurs.
Write about AI tools for startups and entrepreneurship. Include:
- 3-4 AI tools that help startups (marketing, ops, dev)
- One startup success story using AI
- Funding news or trends in India
- A productivity tip for founders`,
  
  PRODUCTIVITY: `You are a productivity newsletter curator.
Write about AI tools that boost productivity. Include:
- 3-4 AI productivity tools with use cases
- One workflow automation tip
- A "before vs after AI" comparison
- Time-saving hacks using AI`,
};

export async function generateNewsletter(
  topic: NewsletterTopic,
  tier: "FREE" | "PRO" | "PREMIUM" = "FREE"
): Promise<GeneratedNewsletter> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const tierContext = tier === "FREE" 
    ? "Keep it concise. This is for free subscribers."
    : tier === "PRO"
    ? "Include more detail and exclusive insights. This is for Pro subscribers."
    : "Make it highly personalized and comprehensive. This is for Premium subscribers.";

  const prompt = `${TOPIC_PROMPTS[topic]}

${tierContext}

Today's date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Generate a newsletter in the following JSON format:
{
  "subject": "Catchy email subject line (max 60 chars)",
  "previewText": "Email preview text (max 100 chars)",
  "headline": "Main headline for the newsletter",
  "intro": "2-3 sentence introduction",
  "sections": [
    {
      "title": "Section title",
      "content": "Section content with details, can include markdown",
      "link": "optional relevant URL"
    }
  ],
  "cta": "Call to action text"
}

Return ONLY valid JSON, no markdown code blocks.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response (remove markdown code blocks if present)
    const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    // Generate HTML from the structured content
    const contentHtml = generateHtmlFromContent(parsed, topic, tier);

    return {
      subject: parsed.subject,
      previewText: parsed.previewText,
      contentHtml,
      contentJson: {
        headline: parsed.headline,
        intro: parsed.intro,
        sections: parsed.sections,
        cta: parsed.cta,
      },
    };
  } catch (error) {
    console.error("Failed to generate newsletter:", error);
    throw new Error("Failed to generate newsletter content");
  }
}

function generateHtmlFromContent(
  content: any,
  topic: NewsletterTopic,
  tier: string
): string {
  const topicEmoji: Record<NewsletterTopic, string> = {
    AI_TOOLS: "🤖",
    STOCK_MARKET: "📈",
    CRYPTO: "₿",
    STARTUPS: "🚀",
    PRODUCTIVITY: "⚡",
  };

  const tierBadge = tier === "PREMIUM" 
    ? '<span style="background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; padding: 2px 8px; border-radius: 4px; font-size: 12px;">PREMIUM</span>'
    : tier === "PRO"
    ? '<span style="background: #4F46E5; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 12px;">PRO</span>'
    : '';

  const sectionsHtml = content.sections
    .map((section: any) => `
      <div style="margin-bottom: 24px; padding: 16px; background: #f9fafb; border-radius: 8px;">
        <h3 style="margin: 0 0 12px 0; color: #111827; font-size: 18px;">${section.title}</h3>
        <p style="margin: 0; color: #4b5563; line-height: 1.6;">${section.content}</p>
        ${section.link ? `<a href="${section.link}" style="color: #4F46E5; text-decoration: none; font-weight: 500;">Learn more →</a>` : ''}
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
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="font-size: 28px; margin: 0;">
      ${topicEmoji[topic]} AI Tools Weekly
    </h1>
    <p style="color: #6b7280; margin: 8px 0;">${new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
    ${tierBadge}
  </div>

  <!-- Headline -->
  <h2 style="font-size: 24px; color: #111827; margin-bottom: 16px;">
    ${content.headline}
  </h2>

  <!-- Intro -->
  <p style="font-size: 16px; color: #4b5563; margin-bottom: 32px;">
    ${content.intro}
  </p>

  <!-- Sections -->
  ${sectionsHtml}

  <!-- CTA -->
  <div style="text-align: center; margin: 40px 0;">
    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://aitoolsweekly.in'}" 
       style="display: inline-block; background: #4F46E5; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
      ${content.cta}
    </a>
  </div>

  <!-- Footer -->
  <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 40px; text-align: center; color: #9ca3af; font-size: 14px;">
    <p>Made with ❤️ for Indian traders & developers</p>
    <p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color: #9ca3af;">Unsubscribe</a> · 
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/preferences" style="color: #9ca3af;">Preferences</a>
    </p>
  </div>

</body>
</html>
  `;
}

// Generate newsletters for a specific time slot
export async function generateScheduledNewsletters() {
  const topics: NewsletterTopic[] = ["AI_TOOLS", "STOCK_MARKET", "CRYPTO"];
  const hour = new Date().getHours();
  
  // Morning (8 AM) - AI Tools
  // Afternoon (2 PM) - Stock Market
  // Evening (6 PM) - Crypto/Startups
  let topic: NewsletterTopic;
  if (hour < 12) {
    topic = "AI_TOOLS";
  } else if (hour < 17) {
    topic = "STOCK_MARKET";
  } else {
    topic = "CRYPTO";
  }

  const newsletters = [];
  
  // Generate for each tier
  for (const tier of ["FREE", "PRO", "PREMIUM"] as const) {
    const newsletter = await generateNewsletter(topic, tier);
    newsletters.push({ ...newsletter, tier, topic });
  }

  return newsletters;
}
