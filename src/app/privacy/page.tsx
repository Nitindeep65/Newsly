"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ChevronLeft, Newspaper } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-stone-900 dark:text-white">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: December 30, 2025</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg dark:bg-zinc-900/50">
            <CardContent className="p-6 md:p-8 prose dark:prose-invert max-w-none">
              <h2>1. Introduction</h2>
              <p>
                At Newsly, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our newsletter service.
              </p>

              <h2>2. Information We Collect</h2>
              <h3>Personal Information</h3>
              <p>We may collect the following personal information:</p>
              <ul>
                <li><strong>Email Address:</strong> Required for newsletter delivery and account creation</li>
                <li><strong>Name:</strong> Optional, used for personalization</li>
                <li><strong>Payment Information:</strong> Processed securely through PhonePe for paid subscriptions</li>
                <li><strong>Topic Preferences:</strong> Your selected interests for newsletter personalization</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <p>We may automatically collect:</p>
              <ul>
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Usage patterns and preferences</li>
                <li>Email open and click rates</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Deliver personalized newsletters based on your preferences</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send important service updates and notifications</li>
                <li>Improve our AI-powered content generation</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Prevent fraud and ensure platform security</li>
              </ul>

              <h2>4. Information Sharing</h2>
              <p>We do not sell your personal information. We may share data with:</p>
              <ul>
                <li><strong>Service Providers:</strong> Third-party services that help us operate (email delivery, payment processing)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with any merger or acquisition</li>
              </ul>

              <h2>5. Third-Party Services</h2>
              <p>We use the following third-party services:</p>
              <ul>
                <li><strong>Clerk:</strong> Authentication and user management</li>
                <li><strong>PhonePe:</strong> Payment processing</li>
                <li><strong>Resend:</strong> Email delivery</li>
                <li><strong>Google Gemini:</strong> AI content generation</li>
                <li><strong>Vercel:</strong> Hosting and analytics</li>
              </ul>

              <h2>6. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your information, including:
              </p>
              <ul>
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure database storage with access controls</li>
                <li>Regular security audits and updates</li>
                <li>Employee training on data protection</li>
              </ul>

              <h2>7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Unsubscribe:</strong> Opt out of newsletters at any time</li>
                <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
              </ul>

              <h2>8. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to enhance your experience, 
                remember your preferences, and analyze site traffic. You can manage 
                cookie preferences through your browser settings.
              </p>

              <h2>9. Children&apos;s Privacy</h2>
              <p>
                Newsly is not intended for children under 13 years of age. We do not 
                knowingly collect personal information from children.
              </p>

              <h2>10. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other 
                than your country of residence. We ensure appropriate safeguards are in 
                place for such transfers.
              </p>

              <h2>11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you 
                of any material changes by email or through the Service.
              </p>

              <h2>12. Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy or our data 
                practices, please contact us:
              </p>
              <p>
                Email: privacy@newsly.com<br />
                Website: https://newsly-beryl.vercel.app
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
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
