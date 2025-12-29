import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mail, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering - don't prerender at build time
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Sample Newsletter | AI Tools Weekly",
  description: "See what you'll get in your inbox every week - curated AI tools for traders & developers",
};

export default async function SampleNewsletterPage() {
  // Get 5 featured tools for the sample
  let tools: any[] = [];
  try {
    tools = await db.tool.findMany({
      where: { featured: true },
      take: 5,
      orderBy: { views: 'desc' },
      select: {
        name: true,
        tagline: true,
        category: true,
        websiteUrl: true,
        priceInr: true,
        freeTier: true,
      }
    });
  } catch (error) {
    console.error("Failed to fetch tools:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">AI Tools Weekly</span>
          </Link>
          <Button asChild>
            <Link href="/#subscribe">Subscribe Free</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Newsletter Preview */}
        <div className="text-center mb-8">
          <Badge className="mb-4">Sample Newsletter</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            This is what you'll get every Monday
          </h1>
          <p className="text-muted-foreground text-lg">
            Curated AI tools, code snippets, and insights - delivered to your inbox
          </p>
        </div>

        {/* Email Preview */}
        <Card className="shadow-xl border-2">
          <CardHeader className="bg-muted/50 border-b">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Mail className="h-4 w-4" />
              <span>From: AI Tools Weekly &lt;newsletter@aitools.dev&gt;</span>
            </div>
            <CardTitle className="text-xl">
              🚀 5 AI Tools That Will 10x Your Productivity This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Intro */}
            <div className="prose prose-sm max-w-none">
              <p className="text-base leading-relaxed">
                Hey there! 👋
              </p>
              <p className="text-base leading-relaxed">
                This week I found some absolute gems that I couldn't wait to share. 
                Whether you're building trading bots or shipping features faster, 
                these tools will save you hours.
              </p>
              <p className="text-base leading-relaxed">
                Let's dive in! 🎯
              </p>
            </div>

            {/* Tools Section */}
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                🔧 This Week's Tools
              </h2>
              <div className="space-y-4">
                {tools.map((tool, index) => (
                  <div 
                    key={tool.name}
                    className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base">
                          {index + 1}. {tool.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {tool.tagline}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {tool.category.replace(/_/g, ' ')}
                          </Badge>
                          {tool.freeTier && (
                            <Badge className="bg-green-500/10 text-green-600 text-xs">
                              Free tier
                            </Badge>
                          )}
                          {tool.priceInr && (
                            <span className="text-xs text-muted-foreground">
                              ₹{tool.priceInr}/mo
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={tool.websiteUrl} target="_blank" rel="noopener">
                          Try it →
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Snippet Section */}
            <div>
              <h2 className="text-lg font-bold mb-4">💡 Code Snippet of the Week</h2>
              <div className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm font-mono">
{`// Quick way to use OpenAI in your trading bot
import OpenAI from 'openai';

const openai = new OpenAI();

async function analyzeTrend(data) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "user",
      content: \`Analyze this stock data: \${JSON.stringify(data)}\`
    }]
  });
  return response.choices[0].message.content;
}`}
                </pre>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 rounded-lg text-center">
              <p className="font-medium mb-2">
                That's all for this week! 🎉
              </p>
              <p className="text-sm text-muted-foreground">
                Reply to this email if you found something cool - I read every response.
              </p>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t text-center text-sm text-muted-foreground">
              <p>AI Tools Weekly • Curated for Indian traders & developers</p>
              <p className="mt-1">
                <a href="#" className="underline">Unsubscribe</a> • 
                <a href="#" className="underline ml-2">View in browser</a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Subscribe CTA */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Want this in your inbox every Monday?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>100% free</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Every Monday</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Unsubscribe anytime</span>
            </div>
          </div>
          <Button asChild size="lg" className="mt-6">
            <Link href="/#subscribe">
              Subscribe Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
