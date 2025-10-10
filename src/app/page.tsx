import { ModeToggle } from '@/components/togglemode';
import { UserButton } from "@clerk/nextjs";
import Link from 'next/link';


export default function AINewsLandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 border-b  border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-light tracking-wide">Newsly</span>
            </div>
            <div className="hidden md:flex items-center space-x-10 text-sm">
              <Link href="#features" className="hover:text-gray-400 transition-colors">Features</Link>
              <Link href="#how" className="hover:text-gray-400 transition-colors">How it Works</Link>
              <Link href="#pricing" className="hover:text-gray-400 transition-colors">Pricing</Link>
              <Link href={'/sign-in'} className="hover:text-gray-400 transition-colors">Sign In</Link>
             <Link href={'/sign-up'}  className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition-colors font-medium">
                Get Started
             </Link>
             <UserButton afterSignOutUrl="/" />
             <ModeToggle/>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-26">
        <div className="max-w-6xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center space-x-2 border border-white/20 rounded-full px-4 py-2 text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-gray-400">AI-Powered News Summarization</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-light tracking-tight leading-none">
            Stay Informed
            <br />
            <span className="border-b-2 border-white inline-block pb-2">In Seconds</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Get AI-generated summaries of the latest news from trusted sources. Save time, stay updated.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button className="group relative px-10 py-4 bg-white text-black overflow-hidden rounded">
              <span className="relative z-10">Try for Free</span>
            </button>
            <button className="px-10 py-4 border border-white hover:bg-white hover:text-black transition-all duration-300 rounded">
              Watch Demo
            </button>
          </div>

          {/* Demo Preview */}
          <div className="pt-16">
            <div className="border border-white/10 rounded-lg p-8 bg-white/5 backdrop-blur-sm max-w-4xl mx-auto">
              <div className="space-y-6 text-left">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Technology</span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-500">2 min read</span>
                    </div>
                    <h3 className="text-xl font-light">Latest AI Breakthrough in Machine Learning</h3>
                  </div>
                  <div className="ml-4 w-20 h-20 bg-white/10 rounded flex-shrink-0"></div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  ✨ AI Summary: Researchers have developed a new neural network architecture that significantly improves processing speed while reducing computational costs by 40%...
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-gray-600">Generated in 0.8s</span>
                  <button className="text-xs border border-white/20 px-4 py-1 rounded hover:border-white/40 transition-colors">
                    Read Full Article →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light mb-4">Why NewsAI</h2>
            <p className="text-xl text-gray-400">Smart features for modern readers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: '🤖',
                title: 'AI-Powered Summaries',
                desc: 'Advanced AI analyzes articles and generates concise, accurate summaries in seconds'
              },
              {
                icon: '⚡',
                title: 'Real-Time Updates',
                desc: 'Stay current with continuously updated news from thousands of trusted sources'
              },
              {
                icon: '🎯',
                title: 'Personalized Feed',
                desc: 'Customize your news experience based on topics and sources you care about'
              },
              {
                icon: '📊',
                title: 'Multi-Source',
                desc: 'Aggregate news from various publishers to get complete coverage of any story'
              },
              {
                icon: '💾',
                title: 'Save & Organize',
                desc: 'Bookmark summaries and create collections for easy access later'
              },
              {
                icon: '🌐',
                title: 'Multi-Language',
                desc: 'Read news in your preferred language with automatic translation support'
              }
            ].map((feature, index) => (
              <div key={index} className="space-y-4">
                <div className="text-5xl">{feature.icon}</div>
                <h3 className="text-2xl font-light">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-32 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-light mb-20 text-center">How It Works</h2>

          <div className="space-y-24">
            {[
              {
                step: '01',
                title: 'Choose Your Topics',
                desc: 'Select from categories like Technology, Business, Sports, Health, and more. Customize your news feed to match your interests.',
                position: 'left'
              },
              {
                step: '02',
                title: 'AI Analyzes Articles',
                desc: 'Our advanced AI scans thousands of articles from trusted sources, extracting key information and main points.',
                position: 'right'
              },
              {
                step: '03',
                title: 'Read Smart Summaries',
                desc: 'Get concise, accurate summaries that capture the essence of each story in seconds. Dive deeper when you want more.',
                position: 'left'
              }
            ].map((item, index) => (
              <div key={index} className={`flex flex-col ${item.position === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
                <div className="flex-1 space-y-4">
                  <span className="text-sm text-gray-600">Step {item.step}</span>
                  <h3 className="text-4xl font-light">{item.title}</h3>
                  <p className="text-xl text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
                <div className="flex-1">
                  <div className="aspect-video bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                    <span className="text-gray-700">Visual Placeholder</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-32 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 text-center">
            {[
              { number: '10K+', label: 'News Sources' },
              { number: '1M+', label: 'Summaries Generated' },
              { number: '50K+', label: 'Active Users' },
              { number: '0.8s', label: 'Avg Summary Time' }
            ].map((stat, index) => (
              <div key={index} className="space-y-3">
                <div className="text-6xl font-light">{stat.number}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-400">Choose the plan that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                features: ['50 summaries/day', 'Basic categories', 'Save up to 10 articles', 'Mobile app access']
              },
              {
                name: 'Pro',
                price: '$9',
                features: ['Unlimited summaries', 'All categories', 'Unlimited saves', 'Priority AI processing', 'Custom sources', 'No ads'],
                popular: true
              },
              {
                name: 'Team',
                price: '$29',
                features: ['Everything in Pro', 'Up to 10 team members', 'Shared collections', 'Admin dashboard', 'Priority support']
              }
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative p-10 rounded-lg ${
                  plan.popular
                    ? 'bg-white text-black'
                    : 'border border-white/10 bg-white/5'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-4 py-1 rounded-full border border-white/20">
                    Most Popular
                  </div>
                )}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-light mb-2">{plan.name}</h3>
                    <div className="flex items-baseline">
                      <span className="text-5xl font-light">{plan.price}</span>
                      <span className={`ml-2 ${plan.popular ? 'text-gray-600' : 'text-gray-500'}`}>/month</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <span className={plan.popular ? 'text-black' : 'text-white'}>✓</span>
                        <span className={plan.popular ? 'text-gray-700' : 'text-gray-400'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-3 rounded transition-all duration-300 ${
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

      {/* CTA */}
      <section className="py-32 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl md:text-7xl font-light leading-tight">
            Start Reading Smarter Today
          </h2>
          <p className="text-xl text-gray-400">
            Join thousands of readers who save time with AI-powered news summaries
          </p>
          <button className="px-12 py-5 bg-white text-black text-lg hover:bg-gray-200 transition-colors rounded">
            Try Free for 14 Days
          </button>
          <p className="text-sm text-gray-600">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-lg">N</span>
                </div>
                <span className="text-xl font-light">NewsAI</span>
              </div>
              <p className="text-sm text-gray-500">AI-powered news summaries for the modern reader.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'API', 'Mobile App'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-medium mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© 2025 NewsAI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
              <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
