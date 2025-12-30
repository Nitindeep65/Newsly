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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Mail, 
  Users, 
  IndianRupee, 
  Send, 
  Sparkles, 
  TrendingUp, 
  Crown, 
  Flame,
  Calendar,
  ArrowUpRight,
  BarChart3,
  Activity,
  Zap,
  Target,
  Clock,
  FileText,
  ChevronRight,
  Eye,
  UserPlus,
  DollarSign
} from "lucide-react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";

interface DashboardStats {
  subscribers: number;
  proSubscribers: number;
  premiumSubscribers: number;
  freeSubscribers: number;
  newslettersSent: number;
  revenue: number;
}

interface Newsletter {
  id: string;
  subject: string;
  status: string;
  sentAt: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    subscribers: 0,
    proSubscribers: 0,
    premiumSubscribers: 0,
    freeSubscribers: 0,
    newslettersSent: 0,
    revenue: 0,
  });
  const [recentNewsletters, setRecentNewsletters] = useState<Newsletter[]>([]);
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
      const freeCount = subsData.freeCount || 0;
      
      // Revenue: Pro = ₹3, Premium = ₹10
      const revenue = (proCount * 3) + (premiumCount * 10);
      
      setStats({
        subscribers: subsData.total || 0,
        proSubscribers: proCount,
        premiumSubscribers: premiumCount,
        freeSubscribers: freeCount,
        newslettersSent: newsData.newsletters?.filter((n: Newsletter) => n.status === 'SENT').length || 0,
        revenue,
      });

      setRecentNewsletters(newsData.newsletters?.slice(0, 5) || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Subscribers",
      value: stats.subscribers,
      description: "Active newsletter subscribers",
      icon: <Users className="h-5 w-5" />,
      color: "violet",
      gradient: "from-violet-500 to-purple-600",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Paid Subscribers",
      value: stats.proSubscribers + stats.premiumSubscribers,
      description: `${stats.proSubscribers} Pro + ${stats.premiumSubscribers} Premium`,
      icon: <Crown className="h-5 w-5" />,
      color: "amber",
      gradient: "from-amber-500 to-orange-600",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Newsletters Sent",
      value: stats.newslettersSent,
      description: "AI-generated newsletters",
      icon: <Mail className="h-5 w-5" />,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-600",
      trend: "+5",
      trendUp: true,
    },
    {
      title: "Monthly Revenue",
      value: `₹${stats.revenue.toLocaleString()}`,
      description: "From paid subscriptions",
      icon: <IndianRupee className="h-5 w-5" />,
      color: "sky",
      gradient: "from-sky-500 to-blue-600",
      trend: "+15%",
      trendUp: true,
    },
  ];

  const quickActions = [
    {
      title: "Create Newsletter",
      description: "Generate AI-powered newsletter",
      icon: <Send className="h-6 w-6" />,
      href: "/admin-panel/newsletters/new",
      gradient: "from-violet-500 to-purple-600",
      primary: true,
    },
    {
      title: "View Subscribers",
      description: "Manage your audience",
      icon: <Users className="h-6 w-6" />,
      href: "/admin-panel/subscribers",
      gradient: "from-emerald-500 to-teal-600",
      primary: false,
    },
    {
      title: "Newsletter History",
      description: "View sent newsletters",
      icon: <FileText className="h-6 w-6" />,
      href: "/admin-panel/newsletters",
      gradient: "from-amber-500 to-orange-600",
      primary: false,
    },
  ];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Draft';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
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

          <div className="mt-6 space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl bg-gray-100 p-6 md:p-8 text-black shadow-lg dark:bg-zinc-900/50"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-6 w-6" />
                  <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">Admin Panel</Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
                <p className="text-white/80 max-w-lg">
                  Your newsletter platform is performing great. You have {stats.subscribers} active subscribers
                  and generated ₹{stats.revenue} in revenue this month.
                </p>
                <div className="flex flex-wrap gap-4 mt-6">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild className="bg-white text-violet-700 hover:bg-white/90 shadow-lg">
                      <Link href="/admin-panel/newsletters/new">
                        <Zap className="h-4 w-4 mr-2" />
                        Send Newsletter
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      <Link href="/admin-panel/subscribers">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {statsCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Card className="relative overflow-hidden border-0 shadow-lg dark:bg-zinc-900/50">
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} text-white`}>
                        {stat.icon}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">
                          {loading ? '...' : typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                        </span>
                        <Badge variant="secondary" className={`text-xs ${stat.trendUp ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20' : 'text-rose-600 bg-rose-100'}`}>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {stat.trend}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-1"
              >
                <Card className="border-0 shadow-lg dark:bg-zinc-900/50 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-amber-500" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>Common tasks at your fingertips</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={action.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ x: 4 }}
                      >
                        <Link href={action.href}>
                          <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                            action.primary 
                              ? `bg-gradient-to-r ${action.gradient} text-white shadow-lg` 
                              : 'bg-stone-50 dark:bg-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-700'
                          }`}>
                            <div className={`p-2 rounded-lg ${action.primary ? 'bg-white/20' : `bg-gradient-to-br ${action.gradient} text-white`}`}>
                              {action.icon}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{action.title}</p>
                              <p className={`text-xs ${action.primary ? 'text-white/80' : 'text-muted-foreground'}`}>
                                {action.description}
                              </p>
                            </div>
                            <ChevronRight className={`h-5 w-5 ${action.primary ? 'text-white/60' : 'text-muted-foreground'}`} />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Subscriber Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-1"
              >
                <Card className="border-0 shadow-lg dark:bg-zinc-900/50 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-violet-500" />
                      Subscriber Breakdown
                    </CardTitle>
                    <CardDescription>Audience by subscription tier</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Free */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-slate-400" />
                          <span className="text-sm font-medium">Free</span>
                        </div>
                        <span className="text-sm font-bold">{loading ? '...' : stats.freeSubscribers}</span>
                      </div>
                      <div className="h-2 bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: stats.subscribers ? `${(stats.freeSubscribers / stats.subscribers) * 100}%` : '0%' }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                          className="h-full bg-slate-400 rounded-full"
                        />
                      </div>
                    </div>
                    {/* Pro */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-500" />
                          <span className="text-sm font-medium">Pro</span>
                          <Badge variant="secondary" className="text-xs">₹3/mo</Badge>
                        </div>
                        <span className="text-sm font-bold">{loading ? '...' : stats.proSubscribers}</span>
                      </div>
                      <div className="h-2 bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: stats.subscribers ? `${(stats.proSubscribers / stats.subscribers) * 100}%` : '0%' }}
                          transition={{ delay: 0.7, duration: 0.5 }}
                          className="h-full bg-amber-500 rounded-full"
                        />
                      </div>
                    </div>
                    {/* Premium */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-violet-500" />
                          <span className="text-sm font-medium">Premium</span>
                          <Badge variant="secondary" className="text-xs">₹10/mo</Badge>
                        </div>
                        <span className="text-sm font-bold">{loading ? '...' : stats.premiumSubscribers}</span>
                      </div>
                      <div className="h-2 bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: stats.subscribers ? `${(stats.premiumSubscribers / stats.subscribers) * 100}%` : '0%' }}
                          transition={{ delay: 0.8, duration: 0.5 }}
                          className="h-full bg-violet-500 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Est. Monthly Revenue</span>
                        <span className="text-lg font-bold text-emerald-600">₹{stats.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="lg:col-span-1"
              >
                <Card className="border-0 shadow-lg dark:bg-zinc-900/50 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-emerald-500" />
                      Recent Newsletters
                    </CardTitle>
                    <CardDescription>Your latest campaigns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentNewsletters.length === 0 ? (
                      <div className="text-center py-8">
                        <Mail className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">No newsletters sent yet</p>
                        <Button asChild size="sm" className="mt-4">
                          <Link href="/admin-panel/newsletters/new">
                            Create First Newsletter
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentNewsletters.map((newsletter, i) => (
                          <motion.div
                            key={newsletter.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 dark:bg-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-700 transition-colors"
                          >
                            <div className={`p-2 rounded-lg ${
                              newsletter.status === 'SENT' 
                                ? 'bg-emerald-100 dark:bg-emerald-500/20' 
                                : 'bg-amber-100 dark:bg-amber-500/20'
                            }`}>
                              {newsletter.status === 'SENT' ? (
                                <Send className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{newsletter.subject || 'Untitled'}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(newsletter.sentAt || newsletter.createdAt)}
                              </p>
                            </div>
                            <Badge variant={newsletter.status === 'SENT' ? 'default' : 'secondary'} className="text-xs">
                              {newsletter.status}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Performance Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="border-0 shadow-lg dark:bg-zinc-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-sky-500" />
                        Platform Overview
                      </CardTitle>
                      <CardDescription>Key metrics and insights</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/admin-panel/analytics">
                        View Details
                        <ArrowUpRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm text-muted-foreground">New This Week</span>
                      </div>
                      <p className="text-2xl font-bold">+{Math.floor(stats.subscribers * 0.15)}</p>
                      <p className="text-xs text-emerald-600">↑ 15% from last week</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-violet-500" />
                        <span className="text-sm text-muted-foreground">Avg Open Rate</span>
                      </div>
                      <p className="text-2xl font-bold">68%</p>
                      <p className="text-xs text-emerald-600">↑ 5% from average</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-amber-500" />
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {stats.subscribers ? Math.round(((stats.proSubscribers + stats.premiumSubscribers) / stats.subscribers) * 100) : 0}%
                      </p>
                      <p className="text-xs text-muted-foreground">Free to Paid</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-sky-500" />
                        <span className="text-sm text-muted-foreground">Next Auto Send</span>
                      </div>
                      <p className="text-2xl font-bold">9:00 AM</p>
                      <p className="text-xs text-muted-foreground">Tomorrow (IST)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </ContentLayout>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
