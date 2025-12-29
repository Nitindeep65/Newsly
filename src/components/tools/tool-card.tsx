"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, IndianRupee, DollarSign, Sparkles } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";

interface Tool {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description?: string;
  logoUrl?: string | null;
  websiteUrl: string;
  category: string;
  pricing: string;
  priceInr?: number | null;
  freeTier: boolean;
  featured: boolean;
  verified: boolean;
}

interface ToolCardProps {
  tool: Tool;
  showFullDescription?: boolean;
}

const categoryLabels: Record<string, string> = {
  CODE_GENERATION: "Code",
  IMAGE_VIDEO: "Media",
  WRITING: "Writing",
  DATA_ANALYSIS: "Data",
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
  ONE_TIME: "One-time",
};

export function ToolCard({ tool, showFullDescription = false }: ToolCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          {tool.logoUrl && (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border">
              <SmartImage
                src={tool.logoUrl}
                alt={`${tool.name} logo`}
                fill
                className="object-contain p-1"
              />
            </div>
          )}
          <div className="flex gap-1 flex-wrap">
            {tool.featured && (
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Featured
              </Badge>
            )}
            {tool.verified && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                ✓ Verified
              </Badge>
            )}
          </div>
        </div>

        <CardTitle className="text-lg group-hover:text-primary transition-colors">
          <Link href={`/tools/${tool.slug}`} className="hover:underline">
            {tool.name}
          </Link>
        </CardTitle>
        
        <CardDescription className="line-clamp-2">
          {tool.tagline}
        </CardDescription>

        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline">
            {categoryLabels[tool.category] || tool.category}
          </Badge>
          <Badge variant={tool.freeTier ? "default" : "secondary"}>
            {pricingLabels[tool.pricing] || tool.pricing}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between">
        {showFullDescription && tool.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {tool.description}
          </p>
        )}

        <div className="space-y-3">
          {tool.priceInr && (
            <div className="flex items-center gap-2 text-sm">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">₹{tool.priceInr}/month</span>
              {tool.freeTier && (
                <span className="text-xs text-muted-foreground">(Free tier available)</span>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button asChild className="flex-1" size="sm">
              <Link href={`/tools/${tool.slug}`}>
                View Details
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a 
                href={tool.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
