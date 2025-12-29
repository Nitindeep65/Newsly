"use client";

import React, { useState, useEffect } from "react";
import { ToolCard } from "@/components/tools/tool-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter } from "lucide-react";

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

const categories = [
  { value: "all", label: "All Tools" },
  { value: "CODE_GENERATION", label: "Code Generation" },
  { value: "IMAGE_VIDEO", label: "Image & Video" },
  { value: "WRITING", label: "Writing" },
  { value: "DATA_ANALYSIS", label: "Data Analysis" },
  { value: "PRODUCTIVITY", label: "Productivity" },
  { value: "AUTOMATION", label: "Automation" },
  { value: "DESIGN", label: "Design" },
  { value: "RESEARCH", label: "Research" },
  { value: "TRADING", label: "Trading" },
];

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFeatured, setShowFeatured] = useState(false);

  useEffect(() => {
    fetchTools();
  }, [selectedCategory, showFeatured]);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (showFeatured) params.append("featured", "true");
      params.append("limit", "50");

      const response = await fetch(`/api/tools?${params.toString()}`);
      const data = await response.json();
      setTools(data.tools || []);
    } catch (error) {
      console.error("Failed to fetch tools:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTools = tools.filter((tool) =>
    searchQuery
      ? tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI Tools Directory
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Discover 50+ AI tools curated for Indian traders and developers. 
              All prices in ₹INR with honest reviews.
            </p>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search tools by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </h3>
              
              <div className="space-y-2">
                <Button
                  variant={showFeatured ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setShowFeatured(!showFeatured)}
                >
                  ⭐ Featured Only
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">💌 Get Weekly Updates</h3>
              <p className="text-sm text-muted-foreground mb-3">
                New tools delivered to your inbox every week
              </p>
              <Button className="w-full" asChild>
                <a href="/#subscribe">Subscribe Free</a>
              </Button>
            </div>
          </aside>

          {/* Tools Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  {loading ? (
                    "Loading tools..."
                  ) : (
                    <>
                      Showing {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""}
                      {selectedCategory !== "all" && (
                        <Badge variant="secondary" className="ml-2">
                          {categories.find((c) => c.value === selectedCategory)?.label}
                        </Badge>
                      )}
                    </>
                  )}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="h-80">
                    <CardHeader>
                      <Skeleton className="h-12 w-12 rounded-lg mb-2" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredTools.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No tools found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} showFullDescription />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}</div>;
}

function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-4 pt-0">{children}</div>;
}
