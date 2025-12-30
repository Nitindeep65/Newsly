"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, CheckCircle2, ArrowRight, 
  TrendingUp, Clock, Target, ChevronRight,
  Zap, BarChart3, Star, Coffee, Flame, Search,
  PieChart, Globe, DollarSign, Shield, Heart,
  Briefcase, Building, Wallet, ChevronDown, LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Topic {
  icon: LucideIcon;
  name: string;
  desc: string;
  bg: string;
  text: string;
  border: string;
  keywords: string[];
  featured?: boolean;
}

const TOPICS: Topic[] = [
  // Featured Topics (shown first)
  { icon: TrendingUp, name: "Stocks", desc: "Market trends", bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-200", keywords: ["stocks", "market", "nse", "bse", "trading", "investment", "shares", "sensex", "nifty"], featured: true },
  { icon: Sparkles, name: "AI & Tech", desc: "New tools", bg: "bg-violet-500/10", text: "text-violet-600", border: "border-violet-200", keywords: ["ai", "tech", "technology", "tools", "software", "artificial intelligence", "machine learning"], featured: true },
  { icon: BarChart3, name: "Crypto", desc: "DeFi news", bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-200", keywords: ["crypto", "bitcoin", "ethereum", "defi", "web3", "blockchain", "nft"], featured: true },
  { icon: Zap, name: "Startups", desc: "Funding", bg: "bg-sky-500/10", text: "text-sky-600", border: "border-sky-200", keywords: ["startups", "funding", "venture", "entrepreneur", "business", "vc", "seed"], featured: true },
  
  // Stock Market Related
  { icon: PieChart, name: "Mutual Funds", desc: "Fund insights", bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-200", keywords: ["mutual funds", "sip", "etf", "investment", "portfolio", "amc", "nav"] },
  { icon: Flame, name: "IPO News", desc: "New listings", bg: "bg-red-500/10", text: "text-red-600", border: "border-red-200", keywords: ["ipo", "listing", "allotment", "grey market", "public issue", "ofs"] },
  { icon: Globe, name: "Forex", desc: "Currency markets", bg: "bg-teal-500/10", text: "text-teal-600", border: "border-teal-200", keywords: ["forex", "currency", "dollar", "rupee", "exchange rate", "usd", "inr"] },
  { icon: Star, name: "Commodities", desc: "Gold & Oil", bg: "bg-yellow-500/10", text: "text-yellow-600", border: "border-yellow-200", keywords: ["gold", "silver", "crude oil", "commodities", "mcx", "metals"] },
  
  // Tech & Business
  { icon: DollarSign, name: "Fintech", desc: "Digital finance", bg: "bg-green-500/10", text: "text-green-600", border: "border-green-200", keywords: ["fintech", "payments", "upi", "digital banking", "neobank", "lending"] },
  { icon: Building, name: "E-commerce", desc: "Online retail", bg: "bg-orange-500/10", text: "text-orange-600", border: "border-orange-200", keywords: ["ecommerce", "amazon", "flipkart", "retail", "d2c", "online shopping"] },
  { icon: Zap, name: "Cloud & SaaS", desc: "Tech infra", bg: "bg-indigo-500/10", text: "text-indigo-600", border: "border-indigo-200", keywords: ["cloud", "aws", "azure", "saas", "infrastructure", "devops"] },
  { icon: Shield, name: "Cybersecurity", desc: "Digital safety", bg: "bg-slate-500/10", text: "text-slate-600", border: "border-slate-200", keywords: ["cybersecurity", "hacking", "privacy", "security", "data breach", "infosec"] },
  
  // Lifestyle & Growth
  { icon: Heart, name: "Health", desc: "Wellness tips", bg: "bg-pink-500/10", text: "text-pink-600", border: "border-pink-200", keywords: ["health", "wellness", "fitness", "nutrition", "mental health", "lifestyle"] },
  { icon: Briefcase, name: "Career", desc: "Job trends", bg: "bg-purple-500/10", text: "text-purple-600", border: "border-purple-200", keywords: ["career", "jobs", "hiring", "layoffs", "salary", "remote work", "skills"] },
  { icon: Wallet, name: "Personal Finance", desc: "Money tips", bg: "bg-lime-500/10", text: "text-lime-600", border: "border-lime-200", keywords: ["personal finance", "savings", "tax", "budget", "insurance", "retirement"] },
  { icon: Target, name: "Productivity", desc: "Life hacks", bg: "bg-rose-500/10", text: "text-rose-600", border: "border-rose-200", keywords: ["productivity", "efficiency", "workflow", "automation", "habits", "time management"] },
  { icon: Globe, name: "World News", desc: "Global events", bg: "bg-cyan-500/10", text: "text-cyan-600", border: "border-cyan-200", keywords: ["world news", "global", "international", "politics", "economy", "geopolitics"] },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [topicSearch, setTopicSearch] = useState('');
  const [showAllTopics, setShowAllTopics] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = async (e: React.FormEvent, plan: string = 'FREE') => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      if (plan === 'FREE') {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, tier: 'FREE' }),
        });
        const data = await response.json();
        if (response.ok) {
          toast({ title: 'Welcome! 🎉', description: 'Check your inbox soon.' });
          setEmail('');
        } else {
          toast({ title: 'Error', description: data.error || 'Try again.', variant: 'destructive' });
        }
        setLoading(false);
        return;
      }
      const response = await fetch('/api/phonepe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan }),
      });
      const data = await response.json();
      if (response.ok && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast({ title: 'Error', description: data.error || 'Try again.', variant: 'destructive' });
        setLoading(false);
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
      setLoading(false);
    }
  };

  // Filter topics based on search
  const filteredTopics = useMemo(() => {
    // If searching, filter by search term
    if (topicSearch.trim()) {
      const search = topicSearch.toLowerCase();
      return TOPICS.filter(topic => 
        topic.name.toLowerCase().includes(search) ||
        topic.desc.toLowerCase().includes(search) ||
        topic.keywords.some(kw => kw.includes(search))
      );
    }
    
    // If not searching, show 4 featured topics or all if expanded
    if (!showAllTopics) {
      return TOPICS.filter(t => t.featured);
    }
    
    return TOPICS;
  }, [topicSearch, showAllTopics]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-zinc-950">
      {/* Warm accent shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/30 dark:bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-rose-200/40 dark:bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-sky-200/30 dark:bg-sky-500/10 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? 'bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-stone-200 dark:border-zinc-800' : ''
      }`}>
        <div className="max-w-5xl mx-auto px-5">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg">Newsly</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/sign-in" className="text-sm text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors hidden sm:block">
                Sign in
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="bg-stone-900 hover:bg-stone-800 dark:bg-white dark:text-black dark:hover:bg-stone-100 rounded-full px-4">
                  Get started <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-sm px-3 py-1.5 rounded-full mb-6">
              <Coffee className="w-3.5 h-3.5" />
              <span>Your morning news companion</span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 dark:text-white mb-5 leading-[1.1]"
          >
            News you actually
            <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              want to read
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-lg text-stone-600 dark:text-zinc-400 mb-8 max-w-xl mx-auto"
          >
            AI picks the best stories on stocks, crypto, startups & more. 
            Personalized to your interests. Lands in your inbox at 9 AM.
          </motion.p>

          {/* Email form */}
          <motion.form 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            onSubmit={(e) => handleSubscribe(e, 'FREE')}
            className="max-w-md mx-auto"
          >
            <div className="flex gap-2 p-1.5 bg-white dark:bg-zinc-900 rounded-full border border-stone-200 dark:border-zinc-800 shadow-lg shadow-stone-200/50 dark:shadow-black/20">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pl-4"
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-5 shadow-md"
              >
                {loading ? '...' : 'Subscribe'} 
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <p className="text-xs text-stone-500 dark:text-zinc-500 mt-3">
              Free forever • No spam • Unsubscribe anytime
            </p>
          </motion.form>

          {/* Trust signals */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mt-10 text-sm text-stone-500 dark:text-zinc-500"
          >
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-500" /> 9 AM daily</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-violet-500" /> AI-curated</span>
            <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-rose-500" /> Personalized</span>
          </motion.div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white mb-2">Pick your topics</h2>
            <p className="text-stone-600 dark:text-zinc-400">We&apos;ll curate stories just for you</p>
          </div>

          {/* Topic Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input
                type="text"
                placeholder="Search topics... (e.g., crypto, AI, stocks)"
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                className="pl-10 rounded-full border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              />
              {topicSearch && (
                <button 
                  onClick={() => setTopicSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredTopics.length > 0 ? filteredTopics.map((topic, i) => (
              <motion.div
                key={topic.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                className="cursor-pointer"
              >
                <Card className={`border-2 ${topic.border} dark:border-zinc-800 hover:shadow-md transition-all bg-white dark:bg-zinc-900`}>
                  <CardContent className="p-4 text-center">
                    <div className={`w-10 h-10 ${topic.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                      <topic.icon className={`w-5 h-5 ${topic.text}`} />
                    </div>
                    <p className="font-medium text-stone-900 dark:text-white text-sm">{topic.name}</p>
                    <p className="text-xs text-stone-500 dark:text-zinc-500">{topic.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-8 text-stone-500 dark:text-zinc-500">
                <p>No topics found for &quot;{topicSearch}&quot;</p>
                <button 
                  onClick={() => setTopicSearch('')}
                  className="mt-2 text-amber-500 hover:text-amber-600 text-sm font-medium"
                >
                  Show all topics
                </button>
              </div>
            )}
          </div>

          {/* Show more/less button */}
          {!topicSearch && (
            <motion.div 
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="outline"
                onClick={() => setShowAllTopics(!showAllTopics)}
                className="rounded-full px-6 border-stone-300 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800"
              >
                {showAllTopics ? (
                  <>Show less</>
                ) : (
                  <>
                    +{TOPICS.length - 4} more topics
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white mb-2">Simple pricing</h2>
            <p className="text-stone-600 dark:text-zinc-400">Start free, upgrade when you want more</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-stone-500 dark:text-zinc-500 mb-1">Free</p>
                    <p className="text-3xl font-bold text-stone-900 dark:text-white">₹0<span className="text-base font-normal text-stone-500">/mo</span></p>
                  </div>
                  <ul className="space-y-2.5 mb-6 text-sm">
                    {["3 topics", "Daily digest", "9 AM delivery"].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-stone-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full rounded-full" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    Get started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="h-full relative bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border-2 border-amber-300 dark:border-amber-500/50 shadow-lg">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
                  <Flame className="w-3 h-3" /> Popular
                </div>
                <CardContent className="p-6 pt-8">
                  <div className="mb-4">
                    <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">Pro</p>
                    <p className="text-3xl font-bold text-stone-900 dark:text-white">₹3<span className="text-base font-normal text-stone-500">/mo</span></p>
                  </div>
                  <ul className="space-y-2.5 mb-6 text-sm">
                    {["7 topics", "Deeper insights", "Priority send", "No ads"].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-stone-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full rounded-full bg-amber-500 hover:bg-amber-600 text-white" asChild>
                    <Link href="/sign-up">Upgrade <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="h-full bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-stone-500 dark:text-zinc-500 mb-1">Premium</p>
                    <p className="text-3xl font-bold text-stone-900 dark:text-white">₹10<span className="text-base font-normal text-stone-500">/mo</span></p>
                  </div>
                  <ul className="space-y-2.5 mb-6 text-sm">
                    {["All 17 topics", "Personal digest", "Exclusive tips", "Early access"].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-stone-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-violet-500" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full rounded-full" asChild>
                    <Link href="/sign-up">Go premium</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial / Social proof */}
      <section className="py-16 px-5 bg-stone-100 dark:bg-zinc-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[1,2,3,4,5].map((s) => <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
          </div>
          <blockquote className="text-lg sm:text-xl text-stone-700 dark:text-zinc-300 mb-4 italic">
            &quot;Finally, a newsletter that doesn&apos;t feel like homework. Quick, relevant, and actually useful.&quot;
          </blockquote>
          <p className="text-sm text-stone-500 dark:text-zinc-500">— Happy reader from India</p>
        </div>
      </section>
    </div>
  );
}
