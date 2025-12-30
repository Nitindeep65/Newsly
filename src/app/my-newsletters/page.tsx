"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
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
  Calendar,
  FileText,
} from "lucide-react";

export const dynamic = "force-dynamic";

type SubscriptionTier = "FREE" | "PRO" | "PREMIUM";

interface Interest {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  field: keyof SubscriberPreferences;
  minTier: SubscriptionTier;
}

interface SubscriberPreferences {
  aiTools: boolean;
  stockMarket: boolean;
  crypto: boolean;
  startups: boolean;
  productivity: boolean;
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
}

const TIER_LEVEL: Record<SubscriptionTier, number> = {
  FREE: 0,
  PRO: 1,
  PREMIUM: 2,
};

const TIER_INFO: Record<SubscriptionTier, { name: string; price: string; topics: number; color: string }> = {
  FREE: { name: "Free", price: "₹0/month", topics: 2, color: "bg-gray-500" },
  PRO: { name: "Pro", price: "₹3/month", topics: 4, color: "bg-blue-500" },
  PREMIUM: { name: "Premium", price: "₹10/month", topics: 5, color: "bg-amber-500" },
};

const INTERESTS: Interest[] = [
  {
    id: "ai-tools",
    name: "AI Tools & News",
    description: "Latest AI tools, updates, and breakthroughs",
    icon: <Cpu className="h-5 w-5" />,
    field: "aiTools",
    minTier: "FREE",
  },
  {
    id: "stock-market",
    name: "Stock Market",
    description: "Market trends, analysis, and investment insights",
    icon: <TrendingUp className="h-5 w-5" />,
    field: "stockMarket",
    minTier: "FREE",
  },
  {
    id: "crypto",
    name: "Crypto & Web3",
    description: "Cryptocurrency news and blockchain updates",
    icon: <Bitcoin className="h-5 w-5" />,
    field: "crypto",
    minTier: "PRO",
  },
  {
    id: "startups",
    name: "Startups & Funding",
    description: "Startup news, funding rounds, and founder stories",
    icon: <Rocket className="h-5 w-5" />,
    field: "startups",
    minTier: "PRO",
  },
  {
    id: "productivity",
    name: "Productivity Hacks",
    description: "Tips, tools, and strategies to boost productivity",
    icon: <Zap className="h-5 w-5" />,
    field: "productivity",
    minTier: "PREMIUM",
  },
];

const DELIVERY_SCHEDULE = [
  { time: "8:00 AM IST", label: "Morning Digest" },
  { time: "2:00 PM IST", label: "Afternoon Update" },
  { time: "6:00 PM IST", label: "Evening Roundup" },
];

export default function MyNewslettersPage() {
  const { user, isLoaded } = useUser();
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      }
    } catch (error) {
      console.error("Failed to update preference:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!subscriber) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <Mail className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">No Subscription Found</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Subscribe to get personalized newsletters delivered to your inbox.
        </p>
        <Button onClick={() => (window.location.href = "/")}>Subscribe Now</Button>
      </div>
    );
  }

  const currentTier = subscriber.subscriptionTier;
  const tierInfo = TIER_INFO[currentTier];
  const activeTopics = INTERESTS.filter((i) => subscriber[i.field] && isInterestAvailable(i)).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Newsletters</h1>
          <p className="text-muted-foreground">
            Manage your subscription and preferences
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Topics</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeTopics}</div>
                  <p className="text-xs text-muted-foreground">
                    of {tierInfo.topics} available
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                  <Crown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tierInfo.name}</div>
                  <p className="text-xs text-muted-foreground">{tierInfo.price}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Newsletters</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3x</div>
                  <p className="text-xs text-muted-foreground">daily delivery</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Delivery</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8 AM</div>
                  <p className="text-xs text-muted-foreground">tomorrow morning</p>
                </CardContent>
              </Card>
            </div>

            {/* Current Plan Card */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${tierInfo.color}`}>
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Your Plan: {tierInfo.name}</CardTitle>
                      <CardDescription className="text-base">
                        {tierInfo.price} • {tierInfo.topics} topics available
                      </CardDescription>
                    </div>
                  </div>
                  {currentTier !== "PREMIUM" && (
                    <Button
                      onClick={() =>
                        (window.location.href = `/api/phonepe/checkout?email=${subscriber.email}&plan=PREMIUM`)
                      }
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Upgrade
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Active Topics */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Your Active Topics</CardTitle>
                  <CardDescription>
                    Topics included in your personalized newsletter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activeTopics === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p className="font-medium">No topics selected</p>
                      <p className="text-sm mt-1">Go to Preferences to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {INTERESTS.filter((i) => subscriber[i.field] && isInterestAvailable(i)).map(
                        (interest) => (
                          <div
                            key={interest.id}
                            className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border"
                          >
                            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                              {interest.icon}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{interest.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {interest.description}
                              </p>
                            </div>
                            <Check className="h-5 w-5 text-primary" />
                          </div>
                        )
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Delivery Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {DELIVERY_SCHEDULE.map((schedule, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{schedule.time}</p>
                          <p className="text-xs text-muted-foreground">{schedule.label}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Subscription Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium truncate ml-2">{subscriber.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Plan</span>
                      <Badge variant="secondary">{currentTier}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Topics</span>
                      <span className="font-medium">{activeTopics} active</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* PREFERENCES TAB */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Topics</CardTitle>
                <CardDescription>
                  Choose the topics you want to receive newsletters about
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {INTERESTS.map((interest) => {
                    const isAvailable = isInterestAvailable(interest);
                    const isSelected = subscriber[interest.field];

                    return (
                      <Card
                        key={interest.id}
                        className={`cursor-pointer transition-all ${
                          !isAvailable
                            ? "opacity-60 border-dashed"
                            : isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "hover:border-primary/50 hover:shadow-sm"
                        }`}
                        onClick={() => toggleInterest(interest)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2.5 rounded-lg shrink-0 ${
                                isSelected && isAvailable
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              {interest.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold truncate">{interest.name}</h3>
                                {!isAvailable && (
                                  <Badge variant="secondary" className="text-xs shrink-0">
                                    <Lock className="h-3 w-3 mr-1" />
                                    {interest.minTier}
                                  </Badge>
                                )}
                                {isAvailable && isSelected && (
                                  <Check className="h-4 w-4 text-primary shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {interest.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
