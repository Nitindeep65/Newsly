"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  ChevronLeft,
  Newspaper,
  Search,
  Mail,
  CreditCard,
  Settings,
  Target,
  Shield,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

const FAQ_CATEGORIES = [
  {
    title: "Getting Started",
    icon: <Newspaper className="h-5 w-5" />,
    color: "from-violet-500 to-purple-600",
    questions: [
      {
        q: "How do I subscribe to Newsly?",
        a: "Simply visit our homepage, enter your email address, select your preferred topics, and click Subscribe. You'll receive a confirmation email to verify your subscription."
      },
      {
        q: "What topics can I choose from?",
        a: "We offer 5 topics: AI Tools & News, Stock Market, Crypto & Web3, Startups & Funding, and Productivity Hacks. The number of topics you can select depends on your subscription tier."
      },
      {
        q: "When do newsletters get delivered?",
        a: "Newsletters are delivered daily at 9:00 AM IST (3:30 AM UTC). You'll receive a personalized digest based on your selected topics."
      },
    ]
  },
  {
    title: "Subscription & Billing",
    icon: <CreditCard className="h-5 w-5" />,
    color: "from-amber-500 to-orange-600",
    questions: [
      {
        q: "What are the subscription tiers?",
        a: "We offer three tiers: Free (₹0/month, 2 topics), Pro (₹3/month, 4 topics), and Premium (₹10/month, all 5 topics with exclusive content)."
      },
      {
        q: "How do I upgrade my subscription?",
        a: "Go to your dashboard, click on the 'Plan' tab, and select the tier you want to upgrade to. Payment is processed securely through PhonePe."
      },
      {
        q: "Can I cancel my subscription?",
        a: "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your billing period."
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept payments through PhonePe, which supports UPI, credit/debit cards, and net banking."
      },
    ]
  },
  {
    title: "Account Settings",
    icon: <Settings className="h-5 w-5" />,
    color: "from-emerald-500 to-teal-600",
    questions: [
      {
        q: "How do I change my email address?",
        a: "Your email is managed through your Clerk account. You can update it by going to Account Settings and following the email change process."
      },
      {
        q: "How do I update my topic preferences?",
        a: "Log in to your dashboard and go to the 'Topics' tab. You can enable or disable topics based on your subscription tier."
      },
      {
        q: "Can I pause my newsletter?",
        a: "While we don't have a pause feature, you can adjust your topic preferences or unsubscribe temporarily and resubscribe later."
      },
    ]
  },
  {
    title: "Topics & Content",
    icon: <Target className="h-5 w-5" />,
    color: "from-sky-500 to-blue-600",
    questions: [
      {
        q: "How is the newsletter content generated?",
        a: "Our AI uses Google's Gemini to analyze the latest news and create personalized summaries based on your selected topics and interests."
      },
      {
        q: "Why am I not seeing certain topics?",
        a: "Some topics are exclusive to higher subscription tiers. Upgrade your plan to access Crypto & Web3 (Pro), Startups (Pro), or Productivity Hacks (Premium)."
      },
      {
        q: "Can I suggest new topics?",
        a: "We're always looking to expand! Contact us with your suggestions and we'll consider adding new topics in future updates."
      },
    ]
  },
  {
    title: "Privacy & Security",
    icon: <Shield className="h-5 w-5" />,
    color: "from-rose-500 to-pink-600",
    questions: [
      {
        q: "How is my data protected?",
        a: "We use industry-standard encryption for all data transmission and storage. Your payment information is processed securely through PhonePe and never stored on our servers."
      },
      {
        q: "Do you share my email with third parties?",
        a: "No, we never sell or share your email address with third parties for marketing purposes. See our Privacy Policy for full details."
      },
      {
        q: "How do I delete my account?",
        a: "Go to Account Settings and scroll to the Danger Zone section. Click 'Delete Account' to permanently remove your account and all associated data."
      },
    ]
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = FAQ_CATEGORIES.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-stone-900 dark:text-white">Help Center</h1>
              <p className="text-muted-foreground">Find answers to common questions</p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg dark:bg-zinc-900/50">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {(searchQuery ? filteredCategories : FAQ_CATEGORIES).map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card className="border-0 shadow-lg dark:bg-zinc-900/50 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} text-white`}>
                      {category.icon}
                    </div>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, qIndex) => (
                      <AccordionItem key={qIndex} value={`item-${qIndex}`}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="border-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardContent className="p-6 md:p-8 relative">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 bg-white/20 rounded-2xl">
                  <MessageCircle className="h-10 w-10" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">Still need help?</h3>
                  <p className="text-white/80">
                    Can&apos;t find what you&apos;re looking for? Our support team is here to help.
                  </p>
                </div>
                <Button className="bg-white text-violet-700 hover:bg-white/90 shadow-lg">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">
              <Newspaper className="h-4 w-4 mr-2" />
              Back to Newsly
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
