"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, Zap, TrendingUp, Users, CheckCircle2, ArrowRight, IndianRupee, Gift, Calendar, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToolCard } from '@/components/tools/tool-card';
import { useToast } from '@/hooks/use-toast';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [featuredTools, setFeaturedTools] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fetch featured tools
    fetchFeaturedTools();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchFeaturedTools = async () => {
    try {
      const response = await fetch('/api/tools?featured=true&limit=10');
      const data = await response.json();
      setFeaturedTools(data.tools || []);
    } catch (error) {
      console.error('Failed to fetch tools:', error);
    }
  };

  const handleSubscribe = async (e: React.FormEvent, plan: string = 'basic') => {
    e.preventDefault();
    setLoading(true);

    try {
      // Redirect to PhonePe checkout
      const response = await fetch('/api/phonepe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          plan,
        }),
      });

      const data = await response.json();

      if (response.ok && data.redirectUrl) {
        // Redirect to PhonePe payment page
        window.location.href = data.redirectUrl;
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to start checkout. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    } catch (error) {
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
              <span className="text-xl font-bold">AI Tools Weekly</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/tools" className="text-sm hover:text-primary transition-colors">
                Tools
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
            <span className="text-primary font-medium">Free Newsletter • 3,000+ Subscribers</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Weekly AI Tools for<br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Indian Traders & Developers
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Discover 10+ handpicked AI tools every week. With Indian pricing (₹), 
            honest reviews, and exclusive deals.
          </p>

          {/* Email Capture Form */}
          <div id="subscribe" className="max-w-2xl mx-auto mb-8">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
              <p className="text-lg font-semibold text-center">
                📬 Subscribe to the newsletter for just <span className="text-primary">₹1/month</span>
              </p>
            </div>
            <form onSubmit={(e) => handleSubscribe(e, 'basic')} className="flex flex-col sm:flex-row gap-3">
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
                {loading ? 'Processing...' : 'Subscribe - ₹1/month'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="text-sm text-muted-foreground mt-3">
              ✓ Cancel anytime • Secure payment via PhonePe • 10K+ readers trust us
            </p>
            <Link 
              href="/sample-newsletter" 
              className="inline-block mt-4 text-sm text-primary hover:underline"
            >
              👀 See what our newsletter looks like →
            </Link>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-semibold">50+ AI Tools</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
              <Calendar className="w-6 h-6 text-primary" />
              <span className="font-semibold">Weekly Digest</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
              <Banknote className="w-6 h-6 text-primary" />
              <span className="font-semibold">Indian Pricing</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
              <Gift className="w-6 h-6 text-primary" />
              <span className="font-semibold">Affiliate Deals</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Top 10 AI Tools This Week</h2>
            <p className="text-lg text-muted-foreground">
              Handpicked tools from our directory — with Indian pricing (₹)
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {featuredTools.map((tool: any) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/tools">
              <Button size="lg" variant="outline">
                Browse All Tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What You Get Every Week</h2>
            <p className="text-lg text-muted-foreground">Everything you need to stay ahead with AI</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border rounded-lg bg-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">50+ AI Tools</h3>
              <p className="text-muted-foreground">
                Curated tools with detailed reviews, real use cases, and honest opinions
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Weekly Digest</h3>
              <p className="text-muted-foreground">
                Every Monday, get the best AI tools delivered straight to your inbox
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Banknote className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Indian Pricing</h3>
              <p className="text-muted-foreground">
                All prices in ₹ — no surprises, no currency conversion headaches
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Affiliate Deals</h3>
              <p className="text-muted-foreground">
                Exclusive discounts and early access to premium tools before anyone else
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Placeholder */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Readers Say</h2>
            <p className="text-lg text-muted-foreground">Join 3,000+ traders & developers who love our newsletter</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map((star) => (
                  <span key={star} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "Finally, AI tools with Indian pricing! No more converting USD to INR. Saved me hours of research."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-semibold text-primary">R</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Rahul S.</p>
                  <p className="text-xs text-muted-foreground">Trader, Mumbai</p>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map((star) => (
                  <span key={star} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "The weekly digest is my go-to for staying updated on AI. Honest reviews and no fluff."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-semibold text-primary">P</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Priya M.</p>
                  <p className="text-xs text-muted-foreground">Developer, Bangalore</p>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map((star) => (
                  <span key={star} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "Pro subscription is worth every rupee. The templates alone have 10x'd my productivity."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-semibold text-primary">A</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Amit K.</p>
                  <p className="text-xs text-muted-foreground">Founder, Delhi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground">Choose the plan that works for you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="p-6 border rounded-xl bg-card">
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <div className="text-4xl font-bold mb-6 flex items-center gap-1">
                <IndianRupee className="w-6 h-6" />
                1<span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span><strong>2 newsletters/day</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>AI Tools + Stock Market</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Basic tool summaries</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Tool directory access</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" size="lg" asChild>
                <a href="#subscribe">Subscribe - ₹1/month</a>
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="p-6 border-2 border-primary rounded-xl bg-card relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6 flex items-center gap-1">
                <IndianRupee className="w-6 h-6" />
                3<span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span><strong>3 newsletters/day</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>AI Tools + Stock Market + Crypto</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Deep-dive tool reviews</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Exclusive templates & prompts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Discord community access</span>
                </li>
              </ul>
              <Button className="w-full" size="lg" asChild>
                <Link href="/sign-up?plan=pro">Get Pro - ₹3/month</Link>
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="p-6 border rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                ✨ Best Value
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="text-4xl font-bold mb-6 flex items-center gap-1">
                <IndianRupee className="w-6 h-6" />
                10<span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span><strong>All Pro features</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span><strong>Personalized newsletters</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>5 topics: AI, Stocks, Crypto, Startups, Productivity</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>1-on-1 tool recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600" size="lg" asChild>
                <Link href="/sign-up?plan=premium">Go Premium - ₹10/month</Link>
              </Button>
            </div>
          </div>

          {/* Note about pricing */}
          <p className="text-center mt-8 text-muted-foreground">
            All plans include cancel anytime. Secure payment via PhonePe.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Join 3,000+ Traders & Developers
          </h2>
          <p className="text-xl text-muted-foreground mb-4">
            Get the best AI tools delivered to your inbox.
          </p>
          <p className="text-2xl font-bold text-primary mb-8">
            Just ₹1/month to get started!
          </p>
          
          <form onSubmit={(e) => handleSubscribe(e, 'basic')} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-14 text-lg flex-1"
            />
            <Button 
              type="submit" 
              size="lg" 
              disabled={loading}
              className="h-14 px-12"
            >
              {loading ? 'Processing...' : 'Subscribe - ₹1/month'}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold">AI Tools Weekly</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Curated AI tools for Indian traders and developers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/tools" className="hover:text-foreground">Tools Directory</Link></li>
                <li><Link href="/#pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="/admin-panel" className="hover:text-foreground">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 AI Tools Weekly. Made with ❤️ for Indian traders & developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
