import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SmartImage } from "@/components/ui/smart-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ExternalLink, 
  IndianRupee, 
  CheckCircle2, 
  Sparkles,
  TrendingUp,
  Code,
  Zap
} from "lucide-react";
import Link from "next/link";

// Force dynamic rendering to avoid prerendering database calls
export const dynamic = 'force-dynamic';

const categoryLabels: Record<string, string> = {
  CODE_GENERATION: "Code Generation",
  IMAGE_VIDEO: "Image & Video",
  WRITING: "Writing",
  DATA_ANALYSIS: "Data Analysis",
  PRODUCTIVITY: "Productivity",
  AUTOMATION: "Automation",
  DESIGN: "Design",
  RESEARCH: "Research",
  TRADING: "Trading",
  OTHER: "Other",
};

const pricingLabels: Record<string, string> = {
  FREE: "Free",
  FREEMIUM: "Freemium",
  PAID: "Paid",
  SUBSCRIPTION: "Subscription",
  ONE_TIME: "One-time Purchase",
};

// Return empty array during build - pages will be generated on demand
export async function generateStaticParams() {
  try {
    const tools = await db.tool.findMany({
      where: { published: true },
      select: { slug: true },
    });

    return tools.map((tool) => ({
      slug: tool.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const tool = await db.tool.findUnique({
      where: { slug: params.slug },
    });

    if (!tool) {
      return {
        title: "Tool Not Found",
      };
    }

    return {
      title: `${tool.name} - ${tool.tagline}`,
      description: tool.description,
    };
  } catch {
    return {
      title: "AI Tool | Newsly",
      description: "Discover AI tools",
    };
  }
}

export default async function ToolDetailPage({ params }: { params: { slug: string } }) {
  const tool = await db.tool.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!tool) {
    notFound();
  }

  // Increment view count
  await db.tool.update({
    where: { id: tool.id },
    data: { views: { increment: 1 } },
  });

  // Get related tools (same category, exclude current)
  const relatedTools = await db.tool.findMany({
    where: {
      category: tool.category,
      published: true,
      id: { not: tool.id },
    },
    take: 3,
    orderBy: { views: "desc" },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <Link 
              href="/tools" 
              className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
            >
              ← Back to Tools
            </Link>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              {tool.logoUrl && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2">
                  <SmartImage
                    src={tool.logoUrl}
                    alt={`${tool.name} logo`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              )}

              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {tool.featured && (
                    <Badge className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                  {tool.verified && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      ✓ Verified
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    {categoryLabels[tool.category]}
                  </Badge>
                </div>

                <h1 className="text-4xl font-bold mb-3">{tool.name}</h1>
                <p className="text-xl text-muted-foreground mb-4">{tool.tagline}</p>

                <div className="flex flex-wrap gap-3">
                  <Button size="lg" asChild>
                    <a 
                      href={tool.affiliateLink || tool.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Visit Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  {tool.affiliateLink && (
                    <span className="text-xs text-muted-foreground self-center">
                      (Affiliate link - supports us at no extra cost)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold mb-4">About {tool.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
            </section>

            {/* Features */}
            {tool.features.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Zap className="h-6 w-6" />
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tool.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Use Cases */}
            {tool.useCases.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Use Cases
                </h2>
                <div className="space-y-3">
                  {tool.useCases.map((useCase, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-2">
                          <Code className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <p>{useCase}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Plan Type</div>
                  <Badge variant="secondary" className="text-base">
                    {pricingLabels[tool.pricing]}
                  </Badge>
                </div>

                {tool.priceInr && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Starting Price</div>
                    <div className="flex items-center gap-1 text-2xl font-bold">
                      <IndianRupee className="h-6 w-6" />
                      {tool.priceInr}
                      <span className="text-base font-normal text-muted-foreground">/month</span>
                    </div>
                  </div>
                )}

                {tool.freeTier && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">Free Tier Available</span>
                    </div>
                  </div>
                )}

                <Button className="w-full" size="lg" asChild>
                  <a 
                    href={tool.affiliateLink || tool.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Get Started
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Tags */}
            {tool.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-semibold">{tool.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Clicks</span>
                  <span className="font-semibold">{tool.clicks}</span>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter CTA */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>📬 Weekly AI Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Get 10+ tools like this delivered to your inbox every week
                </p>
                <Button className="w-full" asChild>
                  <a href="/#subscribe">Subscribe Free</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <section className="mt-12 max-w-6xl">
            <h2 className="text-2xl font-bold mb-6">Similar Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTools.map((relatedTool) => (
                <Link key={relatedTool.id} href={`/tools/${relatedTool.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader>
                      {relatedTool.logoUrl && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden mb-2 border">
                          <SmartImage
                            src={relatedTool.logoUrl}
                            alt={relatedTool.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      )}
                      <CardTitle className="text-lg">{relatedTool.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedTool.tagline}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
