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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Users, IndianRupee, Send, Sparkles } from "lucide-react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    subscribers: 0,
    proSubscribers: 0,
    premiumSubscribers: 0,
    newslettersSent: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [subsRes, newsRes] = await Promise.all([
        fetch('/api/subscribers'),
        fetch('/api/newsletter')
      ]);
      
      const subsData = await subsRes.json();
      const newsData = await newsRes.json();
      
      const proCount = subsData.proCount || 0;
      const premiumCount = subsData.premiumCount || 0;
      
      // Revenue: Pro = ₹3, Premium = ₹10
      const revenue = (proCount * 3) + (premiumCount * 10);
      
      setStats({
        subscribers: subsData.total || 0,
        proSubscribers: proCount,
        premiumSubscribers: premiumCount,
        newslettersSent: newsData.newsletters?.filter((n: { status: string }) => n.status === 'SENT').length || 0,
        revenue,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SignedIn>
        <ContentLayout title="Dashboard">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin-panel">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.subscribers}</div>
                <p className="text-xs text-muted-foreground">
                  Active newsletter subscribers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid Subscribers</CardTitle>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.proSubscribers + stats.premiumSubscribers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.proSubscribers} Pro + {stats.premiumSubscribers} Premium
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Newsletters Sent</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.newslettersSent}</div>
                <p className="text-xs text-muted-foreground">
                  AI-generated newsletters
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{loading ? '...' : stats.revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  From paid subscriptions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-xl font-bold tracking-tight mb-4">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Button asChild size="lg" className="h-auto py-6">
                <Link href="/admin-panel/newsletters/new" className="flex flex-col items-center gap-2">
                  <Send className="h-6 w-6" />
                  <span>Create Newsletter</span>
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="h-auto py-6">
                <Link href="/admin-panel/subscribers" className="flex flex-col items-center gap-2">
                  <Users className="h-6 w-6" />
                  <span>View Subscribers</span>
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="h-auto py-6">
                <Link href="/admin-panel/newsletters" className="flex flex-col items-center gap-2">
                  <Mail className="h-6 w-6" />
                  <span>All Newsletters</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Auto Newsletter Info */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>🤖 Automated Newsletters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">Daily at 9 AM IST</h4>
                    <p className="text-sm text-muted-foreground">
                      Gemini AI automatically generates personalized newsletters based on each subscriber&apos;s selected topics.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-white text-sm font-medium">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-medium">Topics: Stock Market, AI, Crypto, Startups, Productivity</h4>
                    <p className="text-sm text-muted-foreground">
                      Subscribers choose their topics in their dashboard. Newsletters are personalized based on selections.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium">
                    $
                  </div>
                  <div>
                    <h4 className="font-medium">Tier-based Content</h4>
                    <p className="text-sm text-muted-foreground">
                      FREE: 2 topics, PRO (₹3): 4 topics, PREMIUM (₹10): 5 topics with personalized digest.
                    </p>
                  </div>
                </div>
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
