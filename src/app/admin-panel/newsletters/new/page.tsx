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
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Send, Eye } from "lucide-react";
import Link from "next/link";

interface Tool {
  id: string;
  name: string;
  tagline: string;
  category: string;
}

export default function CreateNewsletterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tools, setTools] = useState<Tool[]>([]);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    intro: "",
    selectedTools: [] as string[],
    customContent: "",
    cta: "Check out all our tools at https://yoursite.com/tools",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [toolsRes, subsRes] = await Promise.all([
        fetch('/api/tools?limit=50'),
        fetch('/api/subscribers')
      ]);
      
      const toolsData = await toolsRes.json();
      const subsData = await subsRes.json();
      
      setTools(toolsData.tools || []);
      setSubscriberCount(subsData.total || 0);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTool = (toolId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTools: prev.selectedTools.includes(toolId)
        ? prev.selectedTools.filter(id => id !== toolId)
        : [...prev.selectedTools, toolId]
    }));
  };

  const handleSend = async () => {
    if (!formData.title || !formData.subject) {
      setError("Title and subject are required");
      return;
    }

    if (subscriberCount === 0) {
      setError("No subscribers to send to. Get some subscribers first!");
      return;
    }

    setSending(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          subject: formData.subject,
          intro: formData.intro,
          toolIds: formData.selectedTools,
          customContent: formData.customContent,
          cta: formData.cta,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send newsletter');
      }

      setSuccess(`Newsletter sent to ${data.sentCount} subscribers!`);
      
      // Redirect after success
      setTimeout(() => {
        router.push('/admin-panel/newsletters');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSending(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          subject: formData.subject,
          intro: formData.intro,
          toolIds: formData.selectedTools,
          customContent: formData.customContent,
          status: 'DRAFT',
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save draft');
      }

      setSuccess("Draft saved!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SignedIn>
        <ContentLayout title="Create Newsletter">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin-panel">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin-panel/newsletters">Newsletters</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-6">
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/admin-panel/newsletters">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Newsletters
              </Link>
            </Button>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>New Newsletter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {error && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm">
                        {success}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="title">Newsletter Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="e.g., AI Tools Weekly #1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Email Subject Line *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        placeholder="e.g., 🚀 5 AI Tools That Will 10x Your Productivity"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="intro">Introduction</Label>
                      <textarea
                        id="intro"
                        value={formData.intro}
                        onChange={(e) => handleChange("intro", e.target.value)}
                        placeholder="Hey! This week I found some amazing tools..."
                        className="w-full min-h-[100px] px-3 py-2 border rounded-md bg-background resize-y"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Select Tools to Feature ({formData.selectedTools.length} selected)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-lg">
                        {tools.map((tool) => (
                          <label
                            key={tool.id}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                              formData.selectedTools.includes(tool.id)
                                ? 'bg-primary/10 border-primary'
                                : 'hover:bg-muted'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedTools.includes(tool.id)}
                              onChange={() => toggleTool(tool.id)}
                              className="h-4 w-4"
                            />
                            <span className="text-sm truncate">{tool.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customContent">Additional Content (optional)</Label>
                      <textarea
                        id="customContent"
                        value={formData.customContent}
                        onChange={(e) => handleChange("customContent", e.target.value)}
                        placeholder="Code snippets, tips, your thoughts..."
                        className="w-full min-h-[150px] px-3 py-2 border rounded-md bg-background resize-y font-mono text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cta">Call to Action</Label>
                      <Input
                        id="cta"
                        value={formData.cta}
                        onChange={(e) => handleChange("cta", e.target.value)}
                        placeholder="Check out all tools at..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Send Newsletter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-4">
                      <div className="text-3xl font-bold">{subscriberCount}</div>
                      <div className="text-sm text-muted-foreground">subscribers will receive this</div>
                    </div>

                    <Button 
                      onClick={handleSend} 
                      disabled={sending || subscriberCount === 0}
                      className="w-full"
                      size="lg"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Now
                        </>
                      )}
                    </Button>

                    <Button 
                      variant="outline" 
                      onClick={handleSaveDraft}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? "Saving..." : "Save as Draft"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• Use emojis in subject lines 🚀</p>
                    <p>• Feature 3-5 tools per newsletter</p>
                    <p>• Add personal commentary</p>
                    <p>• Include code snippets when relevant</p>
                    <p>• Send on Monday mornings for best opens</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </ContentLayout>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
