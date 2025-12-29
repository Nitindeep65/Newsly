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
import { Mail, Wrench, Users, IndianRupee, Plus, Send } from "lucide-react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalTools: 0,
    subscribers: 0,
    proSubscribers: 0,
    newslettersSent: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [toolsRes, subsRes, newsRes] = await Promise.all([
        fetch('/api/tools?limit=1'),
        fetch('/api/subscribers'),
        fetch('/api/newsletter')
      ]);
      
      const toolsData = await toolsRes.json();
      const subsData = await subsRes.json();
      const newsData = await newsRes.json();
      
      const proCount = subsData.proCount || 0;
      
      setStats({
        totalTools: toolsData.total || 0,
        subscribers: subsData.total || 0,
        proSubscribers: proCount,
        newslettersSent: newsData.newsletters?.filter((n: any) => n.status === 'SENT').length || 0,
        revenue: proCount * 249, // ₹249/month per pro subscriber
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

          {/* Stats Cards - What matters: Subscribers, Newsletters, Revenue */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.subscribers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.proSubscribers} pro members
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
                  Total sent
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{loading ? '...' : stats.revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  /month from pro tier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tools</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.totalTools}</div>
                <p className="text-xs text-muted-foreground">
                  In directory
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions - What you do: Create Newsletter, View Subscribers, Add Tool */}
          <div className="mt-8">
            <h2 className="text-xl font-bold tracking-tight mb-4">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                <Link href="/admin-panel/tools/new" className="flex flex-col items-center gap-2">
                  <Plus className="h-6 w-6" />
                  <span>Add Tool</span>
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="h-auto py-6">
                <Link href="/admin-panel/tools" className="flex flex-col items-center gap-2">
                  <Wrench className="h-6 w-6" />
                  <span>Manage Tools</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Getting Started Guide */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>🚀 Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">1</div>
                  <div>
                    <h4 className="font-medium">Add AI tools to your directory</h4>
                    <p className="text-sm text-muted-foreground">You have {stats.totalTools} tools. Aim for 20+ before launch.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">2</div>
                  <div>
                    <h4 className="font-medium">Get subscribers</h4>
                    <p className="text-sm text-muted-foreground">Share your landing page. You have {stats.subscribers} subscribers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">3</div>
                  <div>
                    <h4 className="font-medium">Send weekly newsletter</h4>
                    <p className="text-sm text-muted-foreground">Pick 5 tools, write your thoughts, hit send every Monday.</p>
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