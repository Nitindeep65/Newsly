"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Newspaper, Zap, Target, TrendingUp, BookmarkPlus, Globe2, Clock, CheckCircle2 } from 'lucide-react';

export default function AINewsLandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-light hidden sm:inline">NewsAI</span>
            </div>
            <div className="flex items-center space-x-4 md:space-x-8">
              <a href="#features" className="hidden md:inline text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#how" className="hidden md:inline text-gray-400 hover:text-white transition-colors">How it Works</a>
              <a href="#pricing" className="hidden md:inline text-gray-400 hover:text-white transition-colors">Pricing</a>
              <Link href="/sign-in" className="text-xs sm:text-sm md:text-base text-gray-400 hover:text-white transition-colors inline-block">Sign In</Link>
              <Link href="/sign-up" className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 bg-white text-black rounded text-xs sm:text-sm md:text-base hover:bg-gray-200 transition-colors inline-flex items-center justify-center">
                  Get Started
                </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto text-center space-y-6 sm:space-y-10">
          <div className="inline-flex items-center space-x-2 border border-emerald-500/30 bg-emerald-500/10 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-emerald-400">Live News • AI-Powered</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-tight sm:leading-none px-4">
            News That Matters,
            <br />
            <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Summarized Instantly</span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Skip the noise. Get AI-curated news summaries from 10,000+ sources delivered in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-center sm:gap-4 justify-center pt-4 sm:pt-6 px-4">
            <Link href="/sign-in" className="group inline-flex sm:items-center items-center px-8 sm:px-10 py-3 sm:py-4 bg-white text-black rounded hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base font-medium">
              Start Reading Free
              <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
            </Link>
            <button className="px-8 sm:px-10 py-3 sm:py-4 border border-white/30 hover:bg-white/10 transition-all duration-300 rounded text-sm sm:text-base">
              See How It Works
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-8 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>50K+ active readers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Updated every minute</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light mb-3 sm:mb-4">Powerful Features</h2>
            <p className="text-lg sm:text-xl text-gray-400">Everything you need to stay informed</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Instant Summaries',
                desc: 'AI reads full articles and extracts key points in under a second',
                color: 'text-yellow-500'
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Personalized Topics',
                desc: 'Follow the topics and sources that matter most to you',
                color: 'text-blue-500'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Trending Stories',
                desc: 'Discover what the world is reading right now',
                color: 'text-emerald-500'
              },
              {
                icon: <BookmarkPlus className="w-8 h-8" />,
                title: 'Save & Collections',
                desc: 'Organize important stories into personal reading lists',
                color: 'text-purple-500'
              },
              {
                icon: <Globe2 className="w-8 h-8" />,
                title: 'Global Coverage',
                desc: 'News from every continent, translated to your language',
                color: 'text-cyan-500'
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Time-Saving',
                desc: 'Read 10 articles in the time it takes to read one',
                color: 'text-orange-500'
              }
            ].map((feature, index) => (
              <div key={index} className="group p-6 sm:p-8 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className={`${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-light mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 border-t border-white/10 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-light mb-12 sm:mb-20 text-center">Three Steps to Stay Informed</h2>

          <div className="space-y-12 sm:space-y-16">
            {[
              {
                step: '01',
                title: 'Select Your Interests',
                desc: 'Choose from 50+ categories: Technology, Business, Politics, Sports, Science, Entertainment, and more.',
                items: ['Technology', 'Business', 'Politics', 'Sports', 'Health', 'Science', 'Entertainment', 'World News']
              },
              {
                step: '02',
                title: 'AI Curates & Summarizes',
                desc: 'Our AI scans thousands of articles every minute, identifies key information, and generates clear summaries.',
                items: ['Real-time monitoring', 'Fact extraction', 'Bias detection', 'Smart summarization']
              },
              {
                step: '03',
                title: 'Read & Stay Updated',
                desc: 'Access your personalized feed anytime. Read summaries in seconds, or dive into full articles when you want more.',
                items: ['Mobile & desktop apps', 'Offline reading', 'Share stories', 'Daily newsletters']
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col lg:flex-row items-start gap-6 sm:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/20 flex items-center justify-center text-2xl sm:text-3xl font-light">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1 space-y-3 sm:space-y-4">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light">{item.title}</h3>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed">{item.desc}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.items.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs sm:text-sm text-gray-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-16 text-center">
            {[
              { number: '10K+', label: 'News Sources', sublabel: 'Worldwide' },
              { number: '1M+', label: 'Summaries', sublabel: 'Generated Daily' },
              { number: '50K+', label: 'Active Users', sublabel: 'Reading Now' },
              { number: '0.8s', label: 'Average Time', sublabel: 'Per Summary' }
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-light">{stat.number}</div>
                <div className="text-sm sm:text-base text-gray-300">{stat.label}</div>
                <div className="text-xs text-gray-600">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light mb-3 sm:mb-4">Simple Pricing</h2>
            <p className="text-lg sm:text-xl text-gray-400">Start free, upgrade when you&apos;re ready</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                features: ['50 summaries per day', '10 saved articles', 'Basic categories', 'Mobile app access', 'Web access']
              },
              {
                name: 'Pro',
                price: '$9',
                features: ['Unlimited summaries', 'Unlimited saves', 'All 50+ categories', 'Custom sources', 'No ads', 'Priority processing', 'Daily newsletter'],
                popular: true
              },
              {
                name: 'Team',
                price: '$29',
                features: ['Everything in Pro', '10 team members', 'Shared collections', 'Admin dashboard', 'Team analytics', 'Priority support', 'API access']
              }
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative p-6 sm:p-8 lg:p-10 rounded-lg transition-all duration-300 ${
                  plan.popular
                    ? 'bg-white text-black scale-100 md:scale-105 shadow-2xl'
                    : 'border border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs px-3 sm:px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-light mb-2">{plan.name}</h3>
                    <div className="flex items-baseline">
                      <span className="text-4xl sm:text-5xl font-light">{plan.price}</span>
                      <span className={`ml-2 text-sm sm:text-base ${plan.popular ? 'text-gray-600' : 'text-gray-500'}`}>/month</span>
                    </div>
                  </div>
                  <ul className="space-y-2 sm:space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-emerald-600' : 'text-emerald-500'}`} />
                        <span className={`text-sm sm:text-base ${plan.popular ? 'text-gray-700' : 'text-gray-400'}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-2.5 sm:py-3 rounded transition-all duration-300 text-sm sm:text-base font-medium ${
                      plan.popular
                        ? 'bg-black text-white hover:bg-gray-900'
                        : 'border border-white hover:bg-white hover:text-black'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 border-t border-white/10 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight px-4">
            Ready to Save Time?
          </h2>
          <p className="text-base sm:text-xl text-gray-400 px-4">
            Join 50,000+ readers who stay informed without the overwhelm
          </p>
          <button className="group px-8 sm:px-12 py-3 sm:py-5 bg-white text-black text-base sm:text-lg font-medium hover:bg-gray-100 transition-colors rounded">
            Start Free Trial
            <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
          </button>
          <p className="text-xs sm:text-sm text-gray-600">14-day free trial • No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-light">NewsAI</span>
              </div>
              <p className="text-sm text-gray-500">Stay informed with AI-powered news summaries.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'API', 'Mobile App', 'Chrome Extension'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press Kit', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Guidelines'] }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm text-gray-600 gap-4">
            <p>© 2025 NewsAI. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}