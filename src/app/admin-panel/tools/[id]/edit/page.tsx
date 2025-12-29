"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { value: "CODE_GENERATION", label: "Code Generation" },
  { value: "IMAGE_VIDEO", label: "Image & Video" },
  { value: "WRITING", label: "Writing" },
  { value: "DATA_ANALYSIS", label: "Data Analysis" },
  { value: "PRODUCTIVITY", label: "Productivity" },
  { value: "AUTOMATION", label: "Automation" },
  { value: "DESIGN", label: "Design" },
  { value: "RESEARCH", label: "Research" },
  { value: "TRADING", label: "Trading" },
  { value: "OTHER", label: "Other" },
];

const PRICING_TYPES = [
  { value: "FREE", label: "Free" },
  { value: "FREEMIUM", label: "Freemium" },
  { value: "PAID", label: "Paid" },
  { value: "SUBSCRIPTION", label: "Subscription" },
  { value: "ONE_TIME", label: "One-time Purchase" },
];

export default function EditToolPage() {
  const router = useRouter();
  const params = useParams();
  const toolId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    logoUrl: "",
    websiteUrl: "",
    affiliateLink: "",
    category: "OTHER",
    pricing: "FREEMIUM",
    priceInr: "",
    freeTier: true,
    features: "",
    useCases: "",
    tags: "",
    featured: false,
    verified: false,
  });

  useEffect(() => {
    fetchTool();
  }, [toolId]);

  const fetchTool = async () => {
    try {
      const res = await fetch(`/api/tools/${toolId}`);
      if (!res.ok) throw new Error("Tool not found");
      
      const tool = await res.json();
      setFormData({
        name: tool.name || "",
        tagline: tool.tagline || "",
        description: tool.description || "",
        logoUrl: tool.logoUrl || "",
        websiteUrl: tool.websiteUrl || "",
        affiliateLink: tool.affiliateLink || "",
        category: tool.category || "OTHER",
        pricing: tool.pricing || "FREEMIUM",
        priceInr: tool.priceInr?.toString() || "",
        freeTier: tool.freeTier ?? true,
        features: (tool.features || []).join("\n"),
        useCases: (tool.useCases || []).join("\n"),
        tags: (tool.tags || []).join(", "),
        featured: tool.featured ?? false,
        verified: tool.verified ?? false,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...formData,
        features: formData.features.split("\n").filter(f => f.trim()),
        useCases: formData.useCases.split("\n").filter(u => u.trim()),
        tags: formData.tags.split(",").map(t => t.trim()).filter(t => t),
        priceInr: formData.priceInr ? parseFloat(formData.priceInr) : null,
      };

      const res = await fetch(`/api/tools/${toolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update tool');
      }

      router.push('/admin-panel/tools');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SignedIn>
        <ContentLayout title="Edit Tool">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </ContentLayout>
      </SignedIn>
    );
  }

  return (
    <>
      <SignedIn>
        <ContentLayout title="Edit Tool">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin-panel">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin-panel/tools">Tools</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-6">
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/admin-panel/tools">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
              </Link>
            </Button>

            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Edit Tool: {formData.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Tool Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="e.g., ChatGPT"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tagline">Tagline *</Label>
                      <Input
                        id="tagline"
                        value={formData.tagline}
                        onChange={(e) => handleChange("tagline", e.target.value)}
                        placeholder="Short description"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Full Description</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Detailed description of the tool..."
                      className="w-full min-h-[100px] px-3 py-2 border rounded-md bg-background resize-y"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="logoUrl">Logo URL</Label>
                      <Input
                        id="logoUrl"
                        value={formData.logoUrl}
                        onChange={(e) => handleChange("logoUrl", e.target.value)}
                        placeholder="https://..."
                        type="url"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl">Website URL *</Label>
                      <Input
                        id="websiteUrl"
                        value={formData.websiteUrl}
                        onChange={(e) => handleChange("websiteUrl", e.target.value)}
                        placeholder="https://..."
                        type="url"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="affiliateLink">Affiliate Link (optional)</Label>
                    <Input
                      id="affiliateLink"
                      value={formData.affiliateLink}
                      onChange={(e) => handleChange("affiliateLink", e.target.value)}
                      placeholder="Your affiliate URL"
                      type="url"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleChange("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pricing">Pricing Type *</Label>
                      <Select
                        value={formData.pricing}
                        onValueChange={(value) => handleChange("pricing", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRICING_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priceInr">Price (₹/month)</Label>
                      <Input
                        id="priceInr"
                        value={formData.priceInr}
                        onChange={(e) => handleChange("priceInr", e.target.value)}
                        placeholder="e.g., 249"
                        type="number"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="features">Key Features (one per line)</Label>
                    <textarea
                      id="features"
                      value={formData.features}
                      onChange={(e) => handleChange("features", e.target.value)}
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      className="w-full min-h-[80px] px-3 py-2 border rounded-md bg-background resize-y"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="useCases">Use Cases (one per line)</Label>
                    <textarea
                      id="useCases"
                      value={formData.useCases}
                      onChange={(e) => handleChange("useCases", e.target.value)}
                      placeholder="Use case 1&#10;Use case 2"
                      className="w-full min-h-[80px] px-3 py-2 border rounded-md bg-background resize-y"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleChange("tags", e.target.value)}
                      placeholder="ai, chatbot, productivity"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.freeTier}
                        onChange={(e) => handleChange("freeTier", e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-sm">Has Free Tier</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => handleChange("featured", e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-sm">Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.verified}
                        onChange={(e) => handleChange("verified", e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-sm">Verified</span>
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/admin-panel/tools">Cancel</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </ContentLayout>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
