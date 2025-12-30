"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, ArrowRight, Calendar, Mail, TrendingUp, Newspaper, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = async (e: React.FormEvent, plan: string = 'FREE') => {
    e.preventDefault();
    setLoading(true);

    try {
      // For FREE plan, just subscribe directly
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

      // For paid plans, redirect to checkout
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
          description: data.error || 'Failed to start checkout. Please try again.',
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/95 backdrop-blur-lg border-b' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Newsly</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="#pricing" className="text-sm hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="/sign-in" className="text-sm hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 text-sm mb-8">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-primary font-medium">AI-Powered Newsletter • Delivered Daily at 9 AM</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Your Personalized<br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI News Digest
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Get AI-curated news on topics you care about — Stock Market, Crypto, 
            Startups, Productivity & more. Delivered to your inbox every morning.
          </p>

          {/* Email Capture Form */}
          <div id="subscribe" className="max-w-2xl mx-auto mb-8">
            <form onSubmit={(e) => handleSubscribe(e, 'FREE')} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-lg flex-1"
              />
              <Button 
                type="submit" 
                size="lg" 
                disabled={loading}
                className="h-12 px-8"
              >
                {loading ? 'Subscribing...' : 'Subscribe Free'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="text-sm text-muted-foreground mt-3">
              ✓ Free forever • ✓ No spam • ✓ Unsubscribe anytime
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
              <Target className="w-6 h-6 text-primary" />
              <span className="font-semibold">Personalized</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
              <Clock className="w-6 h-6 text-primary" />
              <span className="font-semibold">Daily 9 AM</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-semibold">AI Generated</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
              <Newspaper className="w-6 h-6 text-primary" />
              <span className="font-semibold">5 Topics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Topics</h2>
            <p className="text-lg text-muted-foreground">Get news on what matters to you</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: TrendingUp, name: "Stock Market", desc: "NSE, BSE, market trends" },
              { icon: Sparkles, name: "AI & Tech", desc: "Latest AI news & tools" },
              { icon: Mail, name: "Crypto", desc: "BTC, ETH, DeFi updates" },
              { icon: Calendar, name: "Startups", desc: "Funding, launches, trends" },
              { icon: Target, name: "Productivity", desc: "Tips, hacks, workflows" },
            ].map((topic, i) => (
              <div key={i} className="p-6 border rounded-lg bg-card text-center hover:border-primary transition-colors">
                <topic.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-1">{topic.name}</h3>
                <p className="text-sm text-muted-foreground">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Simple. Personalized. Automated.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Subscribe</h3>
              <p className="text-muted-foreground">Enter your email and choose your topics of interest</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Curates</h3>
              <p className="text-muted-foreground">Gemini AI gathers and summarizes the latest news</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Get Newsletter</h3>
              <p className="text-muted-foreground">Receive your personalized digest at 9 AM IST daily</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-lg text-muted-foreground">Start free, upgrade when you need more</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="p-6 border rounded-lg bg-card">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-3xl font-bold mb-4">₹0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>2 topics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Daily newsletter</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>9 AM delivery</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" onClick={() => document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth' })}>
                Get Started
              </Button>
            </div>

            {/* Pro */}
            <div className="p-6 border-2 border-primary rounded-lg bg-card relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-4">₹3<span className="text-lg font-normal text-muted-foreground">/month</span></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>4 topics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Detailed insights</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Priority delivery</span>
                </li>
              </ul>
              <Link href={`/api/phonepe/checkout?plan=PRO&email=`}>
                <Button className="w-full">Upgrade to Pro</Button>
              </Link>
            </div>

            {/* Premium */}
            <div className="p-6 border rounded-lg bg-card">
              <h3 className="text-xl font-bold mb-2">Premium</h3>
              <div className="text-3xl font-bold mb-4">₹10<span className="text-lg font-normal text-muted-foreground">/month</span></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>All 5 topics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Personalized digest</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Exclusive content</span>
                </li>
              </ul>
              <Link href={`/api/phonepe/checkout?plan=PREMIUM&email=`}>
                <Button variant="outline" className="w-full">Go Premium</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Newsly</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered personalized newsletters. Delivered daily.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/sign-in" className="hover:text-primary">Sign In</Link>
              <Link href="/sign-up" className="hover:text-primary">Sign Up</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
