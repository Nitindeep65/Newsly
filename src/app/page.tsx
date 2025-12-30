"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Sparkles, CheckCircle2, ArrowRight, Calendar, Mail, 
  TrendingUp, Newspaper, Clock, Target, ChevronRight,
  Zap, Shield, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
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
          toast({
            title: 'Welcome to Newsly! 🎉',
            description: 'Check your inbox for your first newsletter.',
          });
          setEmail('');
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to subscribe. Please try again.',
            variant: 'destructive',
          });
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
        toast({
          title: 'Error',
          description: data.error || 'Failed to start checkout.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const topics = [
    { icon: TrendingUp, name: "Stock Market", desc: "NSE, BSE, market analysis", color: "from-green-500 to-emerald-500" },
    { icon: Sparkles, name: "AI & Tech", desc: "Latest AI breakthroughs", color: "from-purple-500 to-violet-500" },
    { icon: BarChart3, name: "Crypto", desc: "BTC, ETH, DeFi trends", color: "from-orange-500 to-amber-500" },
    { icon: Zap, name: "Startups", desc: "Funding & launches", color: "from-blue-500 to-cyan-500" },
    { icon: Target, name: "Productivity", desc: "Tips & workflows", color: "from-pink-500 to-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-background/80 backdrop-blur-xl border-b shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">Newsly</span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="#topics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Topics</Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="hidden md:inline-flex">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="shadow-lg shadow-primary/25">
                  Get Started
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4">
        <motion.div 
          style={{ opacity, scale }}
          className="container mx-auto max-w-6xl"
        >
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2 inline-block"></span>
                AI-Powered • Delivered Daily at 9 AM IST
              </Badge>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              Your Personalized
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                AI News Digest
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Get AI-curated news on topics you care about — Stock Market, Crypto, 
              Startups & more. Personalized. Automated. Delivered to your inbox.
            </motion.p>

            {/* Email Form */}
            <motion.div variants={fadeInUp} className="max-w-md mx-auto mb-8">
              <form onSubmit={(e) => handleSubscribe(e, 'FREE')} className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 pl-5 pr-36 text-base rounded-full border-2 focus:border-primary shadow-lg shadow-black/5"
                />
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="absolute right-1.5 top-1.5 h-11 px-6 rounded-full shadow-lg shadow-primary/25"
                >
                  {loading ? 'Joining...' : 'Subscribe Free'}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                ✓ Free forever &nbsp;•&nbsp; ✓ No spam &nbsp;•&nbsp; ✓ Unsubscribe anytime
              </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-8 text-sm"
            >
              {[
                { icon: Target, label: "Personalized" },
                { icon: Clock, label: "Daily 9 AM" },
                { icon: Sparkles, label: "AI Generated" },
                { icon: Shield, label: "5 Topics" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-muted-foreground">
                  <item.icon className="w-4 h-4 text-primary" />
                  <span>{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Floating Cards Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 left-10 hidden lg:block"
          >
            <Card className="w-48 shadow-xl bg-card/80 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-medium">Market Update</span>
                </div>
                <p className="text-xs text-muted-foreground">Nifty hits all-time high...</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-60 right-10 hidden lg:block"
          >
            <Card className="w-48 shadow-xl bg-card/80 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-medium">AI News</span>
                </div>
                <p className="text-xs text-muted-foreground">OpenAI launches GPT-5...</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple. Personalized. Automated.</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to get your personalized news digest
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: "01", 
                title: "Subscribe", 
                desc: "Enter your email and choose topics that interest you",
                icon: Mail
              },
              { 
                step: "02", 
                title: "AI Curates", 
                desc: "Gemini AI gathers and summarizes the latest news for you",
                icon: Sparkles
              },
              { 
                step: "03", 
                title: "Get Newsletter", 
                desc: "Receive your personalized digest at 9 AM IST daily",
                icon: Newspaper
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                  <CardContent className="p-8">
                    <div className="absolute top-4 right-4 text-6xl font-bold text-muted/20 group-hover:text-primary/20 transition-colors">
                      {item.step}
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section id="topics" className="py-20 md:py-32 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Topics</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Choose What Matters to You</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Select your interests and get curated news delivered daily
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {topics.map((topic, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="cursor-pointer"
              >
                <Card className="h-full overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <topic.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold mb-1">{topic.name}</h3>
                    <p className="text-xs text-muted-foreground">{topic.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Start Free, Upgrade Anytime</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Simple pricing that grows with your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Free</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">₹0</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {["2 topics", "Daily newsletter", "9 AM delivery", "Basic insights"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full relative border-2 border-primary shadow-xl shadow-primary/10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="shadow-lg">Most Popular</Badge>
                </div>
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Pro</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">₹3</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {["4 topics", "Detailed insights", "Priority delivery", "Ad-free experience"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full shadow-lg shadow-primary/25" asChild>
                    <Link href="/sign-up">
                      Upgrade to Pro
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Premium</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">₹10</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {["All 5 topics", "Personalized digest", "Exclusive content", "Early access"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/sign-up">Go Premium</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <div className="absolute inset-0 bg-grid-white/10" />
              <CardContent className="relative p-12 md:p-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Stay Informed?
                </h2>
                <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
                  Join thousands of readers who start their day with Newsly. 
                  Your personalized news digest awaits.
                </p>
                <form onSubmit={(e) => handleSubscribe(e, 'FREE')} className="max-w-md mx-auto flex gap-3" id="subscribe">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  <Button 
                    type="submit"
                    variant="secondary"
                    size="lg"
                    disabled={loading}
                    className="h-12 px-8 shadow-xl"
                  >
                    {loading ? 'Joining...' : 'Subscribe'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Newsly</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              AI-powered personalized newsletters. Delivered daily at 9 AM IST.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/sign-in" className="text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
              <Link href="/sign-up" className="text-muted-foreground hover:text-foreground transition-colors">Sign Up</Link>
              <Link href="/my-newsletters" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Newsly. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
