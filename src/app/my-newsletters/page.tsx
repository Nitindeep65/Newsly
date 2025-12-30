"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Cpu,
  TrendingUp,
  Bitcoin,
  Rocket,
  Zap,
  Crown,
  Mail,
  Clock,
  Check,
  Lock,
  Sparkles,
  Loader2,
  FileText,
  Bell,
  Settings,
  ChevronRight,
  Star,
  Coffee,
  Sun,
  Moon,
  Gift,
  Trophy,
  Target,
  BarChart3,
  ArrowUpRight,
  Shield,
  Flame,
  Calendar,
  Eye,
  TrendingDown,
  Activity,
  Search,
  PieChart,
  Globe,
  DollarSign,
  Heart,
  Briefcase,
  Building,
  Wallet,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

type SubscriptionTier = "FREE" | "PRO" | "PREMIUM";

interface Interest {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  field: keyof SubscriberPreferences;
  minTier: SubscriptionTier;
  color: string;
  gradient: string;
  keywords: string[];
  category: "featured" | "finance" | "tech" | "lifestyle";
}

interface SubscriberPreferences {
  aiTools: boolean;
  stockMarket: boolean;
  crypto: boolean;
  startups: boolean;
  productivity: boolean;
  // Stock Market Related
  mutualFunds: boolean;
  ipoNews: boolean;
  forex: boolean;
  commodities: boolean;
  // Tech & Business
  fintech: boolean;
  ecommerce: boolean;
  cloudComputing: boolean;
  cybersecurity: boolean;
  // Lifestyle & Growth
  healthWellness: boolean;
  careerGrowth: boolean;
  personalFinance: boolean;
  worldNews: boolean;
}

interface Subscriber {
  id: string;
  email: string;
  subscriptionTier: SubscriptionTier;
  aiTools: boolean;
  stockMarket: boolean;
  crypto: boolean;
  startups: boolean;
  productivity: boolean;
  // Stock Market Related
  mutualFunds: boolean;
  ipoNews: boolean;
  forex: boolean;
  commodities: boolean;
  // Tech & Business
  fintech: boolean;
  ecommerce: boolean;
  cloudComputing: boolean;
  cybersecurity: boolean;
  // Lifestyle & Growth
  healthWellness: boolean;
  careerGrowth: boolean;
  personalFinance: boolean;
  worldNews: boolean;
}

const TIER_LEVEL: Record<SubscriptionTier, number> = {
  FREE: 0,
  PRO: 1,
  PREMIUM: 2,
};

const TIER_INFO: Record<SubscriptionTier, { 
  name: string; 
  price: string; 
  topics: number; 
  color: string;
  gradient: string;
  icon: React.ReactNode;
  perks: string[];
}> = {
  FREE: { 
    name: "Free", 
    price: "₹0/month", 
    topics: 3, 
    color: "bg-slate-500",
    gradient: "from-slate-400 to-slate-600",
    icon: <Coffee className="h-5 w-5" />,
    perks: ["3 topics", "Daily digest", "9 AM delivery"]
  },
  PRO: { 
    name: "Pro", 
    price: "₹3/month", 
    topics: 7, 
    color: "bg-amber-500",
    gradient: "from-amber-400 to-orange-500",
    icon: <Flame className="h-5 w-5" />,
    perks: ["7 topics", "Priority delivery", "No ads", "Deeper insights"]
  },
  PREMIUM: { 
    name: "Premium", 
    price: "₹10/month", 
    topics: 17, 
    color: "bg-violet-500",
    gradient: "from-violet-500 to-purple-600",
    icon: <Crown className="h-5 w-5" />,
    perks: ["All 17 topics", "Exclusive tips", "Early access", "Personal digest"]
  },
};

const INTERESTS: Interest[] = [
  // Featured - Free tier
  {
    id: "ai-tools",
    name: "AI Tools & News",
    description: "Latest AI tools, updates, and breakthroughs",
    icon: <Cpu className="h-5 w-5" />,
    field: "aiTools",
    minTier: "FREE",
    color: "violet",
    gradient: "from-violet-500 to-purple-600",
    keywords: ["ai", "artificial intelligence", "machine learning", "gpt", "tools"],
    category: "featured",
  },
  {
    id: "stock-market",
    name: "Stock Market",
    description: "Market trends, analysis, and investment insights",
    icon: <TrendingUp className="h-5 w-5" />,
    field: "stockMarket",
    minTier: "FREE",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-600",
    keywords: ["stocks", "nse", "bse", "sensex", "nifty", "trading"],
    category: "featured",
  },
  {
    id: "crypto",
    name: "Crypto & Web3",
    description: "Cryptocurrency news and blockchain updates",
    icon: <Bitcoin className="h-5 w-5" />,
    field: "crypto",
    minTier: "FREE",
    color: "amber",
    gradient: "from-amber-500 to-orange-600",
    keywords: ["crypto", "bitcoin", "ethereum", "defi", "web3", "blockchain"],
    category: "featured",
  },
  
  // Stock Market Related - Pro tier
  {
    id: "mutual-funds",
    name: "Mutual Funds & ETFs",
    description: "Fund performance, SIP strategies, and NAV updates",
    icon: <PieChart className="h-5 w-5" />,
    field: "mutualFunds",
    minTier: "PRO",
    color: "blue",
    gradient: "from-blue-500 to-indigo-600",
    keywords: ["mutual funds", "sip", "etf", "nav", "portfolio", "amc"],
    category: "finance",
  },
  {
    id: "ipo-news",
    name: "IPO & New Listings",
    description: "Upcoming IPOs, GMP, and listing day updates",
    icon: <Flame className="h-5 w-5" />,
    field: "ipoNews",
    minTier: "PRO",
    color: "red",
    gradient: "from-red-500 to-rose-600",
    keywords: ["ipo", "listing", "allotment", "grey market", "public issue"],
    category: "finance",
  },
  {
    id: "forex",
    name: "Forex & Currency",
    description: "Currency market trends and exchange rates",
    icon: <Globe className="h-5 w-5" />,
    field: "forex",
    minTier: "PRO",
    color: "teal",
    gradient: "from-teal-500 to-cyan-600",
    keywords: ["forex", "currency", "dollar", "rupee", "exchange rate", "usd"],
    category: "finance",
  },
  {
    id: "commodities",
    name: "Commodities",
    description: "Gold, silver, crude oil, and metals market",
    icon: <Star className="h-5 w-5" />,
    field: "commodities",
    minTier: "PRO",
    color: "yellow",
    gradient: "from-yellow-500 to-amber-600",
    keywords: ["gold", "silver", "crude", "oil", "commodities", "mcx"],
    category: "finance",
  },
  
  // Tech & Business - Pro tier
  {
    id: "startups",
    name: "Startups & Funding",
    description: "Startup news, funding rounds, and founder stories",
    icon: <Rocket className="h-5 w-5" />,
    field: "startups",
    minTier: "PRO",
    color: "sky",
    gradient: "from-sky-500 to-blue-600",
    keywords: ["startups", "funding", "venture", "entrepreneur", "vc", "seed"],
    category: "tech",
  },
  {
    id: "fintech",
    name: "Fintech",
    description: "Digital payments, neobanks, and financial tech",
    icon: <DollarSign className="h-5 w-5" />,
    field: "fintech",
    minTier: "PRO",
    color: "green",
    gradient: "from-green-500 to-emerald-600",
    keywords: ["fintech", "payments", "upi", "neobank", "lending", "digital banking"],
    category: "tech",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Online retail, D2C brands, and marketplace news",
    icon: <Building className="h-5 w-5" />,
    field: "ecommerce",
    minTier: "PRO",
    color: "orange",
    gradient: "from-orange-500 to-red-600",
    keywords: ["ecommerce", "amazon", "flipkart", "retail", "d2c", "online shopping"],
    category: "tech",
  },
  
  // Premium tier topics
  {
    id: "cloud-computing",
    name: "Cloud & SaaS",
    description: "Cloud infrastructure, DevOps, and enterprise tech",
    icon: <Zap className="h-5 w-5" />,
    field: "cloudComputing",
    minTier: "PREMIUM",
    color: "indigo",
    gradient: "from-indigo-500 to-purple-600",
    keywords: ["cloud", "aws", "azure", "saas", "devops", "infrastructure"],
    category: "tech",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Security threats, privacy updates, and data protection",
    icon: <Shield className="h-5 w-5" />,
    field: "cybersecurity",
    minTier: "PREMIUM",
    color: "slate",
    gradient: "from-slate-500 to-gray-700",
    keywords: ["cybersecurity", "hacking", "privacy", "security", "data breach"],
    category: "tech",
  },
  {
    id: "health-wellness",
    name: "Health & Wellness",
    description: "Health tips, fitness trends, and wellness insights",
    icon: <Heart className="h-5 w-5" />,
    field: "healthWellness",
    minTier: "PREMIUM",
    color: "pink",
    gradient: "from-pink-500 to-rose-600",
    keywords: ["health", "wellness", "fitness", "nutrition", "mental health"],
    category: "lifestyle",
  },
  {
    id: "career-growth",
    name: "Career & Jobs",
    description: "Job market trends, hiring news, and career tips",
    icon: <Briefcase className="h-5 w-5" />,
    field: "careerGrowth",
    minTier: "PREMIUM",
    color: "purple",
    gradient: "from-purple-500 to-violet-600",
    keywords: ["career", "jobs", "hiring", "layoffs", "salary", "remote work"],
    category: "lifestyle",
  },
  {
    id: "personal-finance",
    name: "Personal Finance",
    description: "Budgeting, tax tips, and money management",
    icon: <Wallet className="h-5 w-5" />,
    field: "personalFinance",
    minTier: "PREMIUM",
    color: "lime",
    gradient: "from-lime-500 to-green-600",
    keywords: ["personal finance", "savings", "tax", "budget", "insurance"],
    category: "lifestyle",
  },
  {
    id: "productivity",
    name: "Productivity Hacks",
    description: "Tips, tools, and strategies to boost productivity",
    icon: <Zap className="h-5 w-5" />,
    field: "productivity",
    minTier: "PREMIUM",
    color: "rose",
    gradient: "from-rose-500 to-pink-600",
    keywords: ["productivity", "efficiency", "workflow", "automation", "habits"],
    category: "lifestyle",
  },
  {
    id: "world-news",
    name: "World News",
    description: "Global events, geopolitics, and international affairs",
    icon: <Globe className="h-5 w-5" />,
    field: "worldNews",
    minTier: "PREMIUM",
    color: "cyan",
    gradient: "from-cyan-500 to-blue-600",
    keywords: ["world news", "global", "international", "politics", "geopolitics"],
    category: "lifestyle",
  },
];

export default function MyNewslettersPage() {
  const { user, isLoaded } = useUser();
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showConfetti, setShowConfetti] = useState(false);
  const [topicSearch, setTopicSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "featured" | "finance" | "tech" | "lifestyle">("all");

  useEffect(() => {
    if (isLoaded && user) {
      fetchSubscriber();
    }
  }, [isLoaded, user]);

  const fetchSubscriber = async () => {
    try {
      const response = await fetch("/api/subscribers/me");
      if (response.ok) {
        const data = await response.json();
        setSubscriber(data);
      }
    } catch (error) {
      console.error("Failed to fetch subscriber:", error);
    } finally {
      setLoading(false);
    }
  };

  const isInterestAvailable = (interest: Interest): boolean => {
    if (!subscriber) return false;
    return TIER_LEVEL[subscriber.subscriptionTier] >= TIER_LEVEL[interest.minTier];
  };

  const toggleInterest = async (interest: Interest) => {
    if (!subscriber || saving) return;

    if (!isInterestAvailable(interest)) {
      window.location.href = `/api/phonepe/checkout?email=${subscriber.email}&plan=${interest.minTier}`;
      return;
    }

    setSaving(true);
    try {
      const currentValue = subscriber[interest.field];
      const response = await fetch("/api/subscribers/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [interest.field]: !currentValue }),
      });

      if (response.ok) {
        const updated = await response.json();
        setSubscriber(updated);
        if (!currentValue) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2000);
        }
      }
    } catch (error) {
      console.error("Failed to update preference:", error);
    } finally {
      setSaving(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", icon: <Sun className="h-7 w-7 text-amber-500" /> };
    if (hour < 17) return { text: "Good afternoon", icon: <Sun className="h-7 w-7 text-orange-500" /> };
    return { text: "Good evening", icon: <Moon className="h-7 w-7 text-indigo-500" /> };
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-stone-50 to-stone-100 dark:from-zinc-950 dark:to-zinc-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-12 w-12 text-amber-500" />
        </motion.div>
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  if (!subscriber) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4 bg-gradient-to-br from-stone-50 to-stone-100 dark:from-zinc-950 dark:to-zinc-900">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="p-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20"
        >
          <Mail className="h-16 w-16 text-amber-600 dark:text-amber-400" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-2">No Subscription Found</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Subscribe to get personalized newsletters delivered to your inbox every morning.
          </p>
          <Button 
            size="lg" 
            className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            onClick={() => (window.location.href = "/")}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Subscribe Now
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentTier = subscriber.subscriptionTier;
  const tierInfo = TIER_INFO[currentTier];
  const activeTopics = INTERESTS.filter((i) => subscriber[i.field] && isInterestAvailable(i)).length;
  const topicProgress = (activeTopics / tierInfo.topics) * 100;
  const greeting = getGreeting();

  // Stats data
  const statsData = [
    { label: "Newsletters Received", value: "12", change: "+3 this week", icon: <Mail className="h-5 w-5" />, color: "violet", trend: "up" },
    { label: "Topics Active", value: activeTopics.toString(), change: `of ${tierInfo.topics} available`, icon: <Target className="h-5 w-5" />, color: "emerald", trend: "neutral" },
    { label: "Reading Streak", value: "5", change: "days in a row", icon: <Flame className="h-5 w-5" />, color: "orange", trend: "up" },
    { label: "Next Delivery", value: "9 AM", change: "Tomorrow", icon: <Clock className="h-5 w-5" />, color: "sky", trend: "neutral" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-200/30 dark:bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-violet-200/30 dark:bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-emerald-200/30 dark:bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 0, x: 0, opacity: 1 }}
                animate={{
                  y: [0, -200, 400],
                  x: [0, (Math.random() - 0.5) * 400],
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 2, ease: "easeOut" }}
                className={`absolute w-3 h-3 rounded-full ${
                  ['bg-amber-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500', 'bg-sky-500'][i % 5]
                }`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="p-3 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20"
              >
                {greeting.icon}
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">
                  {greeting.text}, {user?.firstName || 'there'}!
                </h1>
                <p className="text-muted-foreground">
                  Here&apos;s your newsletter dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm" className="rounded-full gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Settings className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="border-0 shadow-lg shadow-stone-200/50 dark:shadow-none dark:bg-zinc-900/50 overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-500/20`}>
                      <div className={`text-${stat.color}-600 dark:text-${stat.color}-400`}>
                        {stat.icon}
                      </div>
                    </div>
                    {stat.trend === "up" && (
                      <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-1 rounded-full">
                        <TrendingUp className="h-3 w-3" />
                        <span>Up</span>
                      </div>
                    )}
                  </div>
                  <p className="text-3xl font-bold text-stone-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  <p className="text-xs text-stone-500 dark:text-zinc-500 mt-0.5">{stat.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="inline-flex p-1 bg-stone-100 dark:bg-zinc-900 rounded-full">
            <TabsTrigger value="overview" className="rounded-full px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="topics" className="rounded-full px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm">
              <Target className="h-4 w-4 mr-2" />
              Topics
            </TabsTrigger>
            <TabsTrigger value="plan" className="rounded-full px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm">
              <Crown className="h-4 w-4 mr-2" />
              Plan
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Plan Overview Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${tierInfo.gradient} text-white`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <CardContent className="relative p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <motion.div 
                              whileHover={{ rotate: 15 }}
                              className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm"
                            >
                              {tierInfo.icon}
                            </motion.div>
                            <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">
                              {tierInfo.name} Plan
                            </Badge>
                          </div>
                          <h3 className="text-3xl font-bold mb-1">{tierInfo.price}</h3>
                          <p className="text-white/80">{tierInfo.topics} topics available</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white/60 mb-1">Topics Used</p>
                          <p className="text-5xl font-bold">{activeTopics}<span className="text-2xl text-white/60">/{tierInfo.topics}</span></p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/80">Topic Usage</span>
                          <span className="font-medium">{Math.round(topicProgress)}%</span>
                        </div>
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${topicProgress}%` }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="h-full bg-white rounded-full"
                          />
                        </div>
                      </div>
                      {currentTier !== "PREMIUM" && (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            className="mt-6 bg-white text-stone-900 hover:bg-white/90 rounded-full shadow-lg"
                            onClick={() => (window.location.href = `/api/phonepe/checkout?email=${subscriber.email}&plan=PREMIUM`)}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Upgrade to Premium
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Active Topics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="border-0 shadow-lg shadow-stone-200/50 dark:shadow-none dark:bg-zinc-900/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-amber-500" />
                            Your Active Topics
                          </CardTitle>
                          <CardDescription>
                            These topics are included in your daily newsletter
                          </CardDescription>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setActiveTab("topics")}>
                            Manage
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </motion.div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {activeTopics === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-12"
                        >
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-20 h-20 bg-stone-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4"
                          >
                            <FileText className="h-10 w-10 text-stone-400" />
                          </motion.div>
                          <p className="font-semibold text-stone-900 dark:text-white text-lg">No topics selected yet</p>
                          <p className="text-sm text-muted-foreground mt-1 mb-6">
                            Choose topics to personalize your newsletter
                          </p>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white" onClick={() => setActiveTab("topics")}>
                              <Target className="h-4 w-4 mr-2" />
                              Select Topics
                            </Button>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {INTERESTS.filter((i) => subscriber[i.field] && isInterestAvailable(i)).map(
                            (interest, index) => (
                              <motion.div
                                key={interest.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ scale: 1.02, x: 4 }}
                                className="p-4 rounded-xl bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700/50"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${interest.gradient} text-white shadow-lg`}>
                                    {interest.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-stone-900 dark:text-white truncate">
                                      {interest.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {interest.description}
                                    </p>
                                  </div>
                                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                  </div>
                                </div>
                              </motion.div>
                            )
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="border-0 shadow-lg shadow-stone-200/50 dark:shadow-none dark:bg-zinc-900/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-violet-500" />
                        Recent Newsletters
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { title: "AI Tools Weekly Digest", date: "Today, 9:00 AM", read: true },
                          { title: "Stock Market Morning Brief", date: "Yesterday, 9:00 AM", read: true },
                          { title: "Weekend Tech Roundup", date: "Dec 28, 9:00 AM", read: false },
                        ].map((newsletter, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                            whileHover={{ x: 4 }}
                            className="flex items-center gap-4 p-4 rounded-xl bg-stone-50 dark:bg-zinc-800/50 cursor-pointer hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <div className={`p-2 rounded-lg ${newsletter.read ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-amber-100 dark:bg-amber-500/20'}`}>
                              {newsletter.read ? (
                                <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-stone-900 dark:text-white">{newsletter.title}</p>
                              <p className="text-xs text-muted-foreground">{newsletter.date}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Next Delivery */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="border-0 shadow-lg shadow-stone-200/50 dark:shadow-none dark:bg-zinc-900/50 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-500" />
                    <CardContent className="p-6">
                      <div className="text-center">
                        <motion.div 
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 mb-4"
                        >
                          <Sun className="h-10 w-10 text-amber-500" />
                        </motion.div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Next Newsletter</h3>
                        <p className="text-4xl font-bold text-stone-900 dark:text-white">9:00 AM</p>
                        <p className="text-sm text-muted-foreground mt-1">Tomorrow morning</p>
                        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
                          <div className="flex items-center justify-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                            <Sparkles className="h-4 w-4" />
                            <span>{activeTopics} topic{activeTopics !== 1 ? 's' : ''} personalized for you</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Account Details */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="border-0 shadow-lg shadow-stone-200/50 dark:shadow-none dark:bg-zinc-900/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Shield className="h-4 w-4 text-emerald-500" />
                        Account Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-zinc-800 rounded-xl">
                        <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm truncate flex-1">{subscriber.email}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-stone-50 dark:bg-zinc-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Crown className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Plan</span>
                        </div>
                        <Badge className={`bg-gradient-to-r ${tierInfo.gradient} text-white border-0`}>
                          {currentTier}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-stone-50 dark:bg-zinc-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Member since</span>
                        </div>
                        <span className="text-sm font-medium">Dec 2025</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Referral Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <CardContent className="p-5 relative">
                      <Gift className="h-8 w-8 mb-3" />
                      <h3 className="font-bold text-lg mb-1">Invite Friends</h3>
                      <p className="text-sm text-white/80 mb-4">
                        Share Newsly and earn free premium months!
                      </p>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="sm" className="bg-white text-violet-600 hover:bg-white/90 rounded-full">
                          Share Now
                          <ArrowUpRight className="h-4 w-4 ml-1" />
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          {/* TOPICS TAB */}
          <TabsContent value="topics" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg shadow-stone-200/50 dark:shadow-none dark:bg-zinc-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-amber-500" />
                    Choose Your Topics
                  </CardTitle>
                  <CardDescription>
                    Select up to {tierInfo.topics} topics for your personalized newsletter
                  </CardDescription>
                  <div className="pt-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Using {activeTopics} of {tierInfo.topics} topics</span>
                      <span className="font-medium">{Math.round(topicProgress)}%</span>
                    </div>
                    <div className="h-2 bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${topicProgress}%` }}
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      />
                    </div>
                  </div>
                  
                  {/* Search and Filters */}
                  <div className="pt-4 space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search topics... (e.g., stocks, AI, crypto)"
                        value={topicSearch}
                        onChange={(e) => setTopicSearch(e.target.value)}
                        className="pl-10 rounded-full border-stone-200 dark:border-zinc-700"
                      />
                      {topicSearch && (
                        <button
                          onClick={() => setTopicSearch("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: "all", label: "All Topics", count: INTERESTS.length },
                        { key: "featured", label: "Featured", count: INTERESTS.filter(i => i.category === "featured").length },
                        { key: "finance", label: "Finance", count: INTERESTS.filter(i => i.category === "finance").length },
                        { key: "tech", label: "Tech & Business", count: INTERESTS.filter(i => i.category === "tech").length },
                        { key: "lifestyle", label: "Lifestyle", count: INTERESTS.filter(i => i.category === "lifestyle").length },
                      ].map((cat) => (
                        <Button
                          key={cat.key}
                          variant={selectedCategory === cat.key ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(cat.key as typeof selectedCategory)}
                          className="rounded-full text-xs"
                        >
                          {cat.label}
                          <Badge variant="secondary" className="ml-1.5 text-xs px-1.5">
                            {cat.count}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {INTERESTS
                      .filter(interest => {
                        // Filter by search
                        if (topicSearch.trim()) {
                          const search = topicSearch.toLowerCase();
                          const matchesSearch = 
                            interest.name.toLowerCase().includes(search) ||
                            interest.description.toLowerCase().includes(search) ||
                            interest.keywords.some(kw => kw.includes(search));
                          if (!matchesSearch) return false;
                        }
                        // Filter by category
                        if (selectedCategory !== "all" && interest.category !== selectedCategory) {
                          return false;
                        }
                        return true;
                      })
                      .map((interest, index) => {
                      const isAvailable = isInterestAvailable(interest);
                      const isSelected = subscriber[interest.field];

                      return (
                        <motion.div
                          key={interest.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: isAvailable ? 1.02 : 1 }}
                          whileTap={{ scale: isAvailable ? 0.98 : 1 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all overflow-hidden h-full ${
                              !isAvailable
                                ? "opacity-60 border-dashed"
                                : isSelected
                                ? "border-2 border-emerald-500 shadow-lg shadow-emerald-500/20"
                                : "hover:border-stone-300 dark:hover:border-zinc-600 hover:shadow-md"
                            }`}
                            onClick={() => toggleInterest(interest)}
                          >
                            {isSelected && isAvailable && (
                              <div className={`h-1 bg-gradient-to-r ${interest.gradient}`} />
                            )}
                            <CardContent className="p-5">
                              <div className="flex flex-col gap-3">
                                <div className="flex items-start justify-between">
                                  <motion.div
                                    animate={{ 
                                      scale: isSelected && isAvailable ? [1, 1.1, 1] : 1,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className={`p-3 rounded-xl ${
                                      isSelected && isAvailable
                                        ? `bg-gradient-to-br ${interest.gradient} text-white shadow-lg`
                                        : "bg-stone-100 dark:bg-zinc-800"
                                    }`}
                                  >
                                    {interest.icon}
                                  </motion.div>
                                  {!isAvailable ? (
                                    <Badge variant="secondary" className="text-xs">
                                      <Lock className="h-3 w-3 mr-1" />
                                      {interest.minTier}
                                    </Badge>
                                  ) : (
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                      isSelected 
                                        ? 'bg-emerald-500 border-emerald-500' 
                                        : 'border-stone-300 dark:border-zinc-600'
                                    }`}>
                                      {isSelected && <Check className="h-4 w-4 text-white" />}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-stone-900 dark:text-white">
                                      {interest.name}
                                    </h3>
                                    <Badge variant="outline" className="text-[10px] capitalize">
                                      {interest.category}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {interest.description}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {/* No results */}
                  {INTERESTS.filter(interest => {
                    if (topicSearch.trim()) {
                      const search = topicSearch.toLowerCase();
                      const matchesSearch = 
                        interest.name.toLowerCase().includes(search) ||
                        interest.description.toLowerCase().includes(search) ||
                        interest.keywords.some(kw => kw.includes(search));
                      if (!matchesSearch) return false;
                    }
                    if (selectedCategory !== "all" && interest.category !== selectedCategory) {
                      return false;
                    }
                    return true;
                  }).length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium">No topics found</p>
                      <p className="text-sm">Try a different search term or category</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setTopicSearch(""); setSelectedCategory("all"); }}
                        className="mt-4 rounded-full"
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* PLAN TAB */}
          <TabsContent value="plan" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-6 md:grid-cols-3"
            >
              {(["FREE", "PRO", "PREMIUM"] as SubscriptionTier[]).map((tier, index) => {
                const info = TIER_INFO[tier];
                const isCurrent = currentTier === tier;
                
                return (
                  <motion.div
                    key={tier}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    <Card className={`relative overflow-hidden h-full ${
                      isCurrent 
                        ? 'border-2 border-amber-500 shadow-xl shadow-amber-500/20' 
                        : 'hover:shadow-xl'
                    }`}>
                      {isCurrent && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-amber-500 text-white border-0">
                            <Star className="h-3 w-3 mr-1" />
                            Current
                          </Badge>
                        </div>
                      )}
                      {tier === "PRO" && !isCurrent && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                            <Flame className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-6 pt-8">
                        <motion.div 
                          whileHover={{ rotate: 10 }}
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-white mb-4 shadow-lg`}
                        >
                          {info.icon}
                        </motion.div>
                        <h3 className="text-xl font-bold text-stone-900 dark:text-white">{info.name}</h3>
                        <p className="text-3xl font-bold mt-2 mb-4 text-stone-900 dark:text-white">
                          {info.price.split('/')[0]}
                          <span className="text-base font-normal text-muted-foreground">/month</span>
                        </p>
                        <ul className="space-y-3 mb-6">
                          {info.perks.map((perk, i) => (
                            <motion.li 
                              key={i} 
                              className="flex items-center gap-2 text-sm"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + i * 0.1 }}
                            >
                              <Check className={`h-4 w-4 shrink-0 ${tier === 'PREMIUM' ? 'text-violet-500' : tier === 'PRO' ? 'text-amber-500' : 'text-slate-500'}`} />
                              <span className="text-stone-600 dark:text-zinc-400">{perk}</span>
                            </motion.li>
                          ))}
                        </ul>
                        {isCurrent ? (
                          <Button disabled className="w-full rounded-full" variant="outline">
                            Current Plan
                          </Button>
                        ) : TIER_LEVEL[tier] > TIER_LEVEL[currentTier] ? (
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button 
                              className={`w-full rounded-full bg-gradient-to-r ${info.gradient} hover:opacity-90 text-white shadow-lg`}
                              onClick={() => (window.location.href = `/api/phonepe/checkout?email=${subscriber.email}&plan=${tier}`)}
                            >
                              Upgrade Now
                              <ArrowUpRight className="h-4 w-4 ml-1" />
                            </Button>
                          </motion.div>
                        ) : (
                          <Button disabled className="w-full rounded-full" variant="outline">
                            Downgrade
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Why Upgrade */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 bg-gradient-to-br from-stone-100 to-stone-50 dark:from-zinc-900 dark:to-zinc-950">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <motion.div 
                      whileHover={{ rotate: 15 }}
                      className="p-3 bg-amber-100 dark:bg-amber-500/20 rounded-xl"
                    >
                      <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-stone-900 dark:text-white text-lg mb-2">
                        Why upgrade?
                      </h3>
                      <p className="text-muted-foreground">
                        Get access to more topics, deeper insights, and exclusive content. 
                        Pro and Premium members receive priority delivery and ad-free newsletters 
                        with early access to new features. Plus, support independent journalism!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
