"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ChevronLeft, Newspaper } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-stone-900 dark:text-white">Terms of Service</h1>
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
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Newsly (&quot;the Service&quot;), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our service.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                Newsly is an AI-powered personalized newsletter platform that delivers curated news content 
                based on your selected topics and subscription tier. Our service includes:
              </p>
              <ul>
                <li>Daily AI-generated newsletters</li>
                <li>Topic-based personalization</li>
                <li>Multiple subscription tiers (Free, Pro, Premium)</li>
                <li>Email delivery to your inbox</li>
              </ul>

              <h2>3. User Accounts</h2>
              <p>
                To access certain features of the Service, you must create an account. You agree to:
              </p>
              <ul>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>

              <h2>4. Subscription and Payment</h2>
              <p>
                Newsly offers various subscription tiers with different pricing and features:
              </p>
              <ul>
                <li><strong>Free:</strong> ₹0/month - 2 topics</li>
                <li><strong>Pro:</strong> ₹3/month - 4 topics</li>
                <li><strong>Premium:</strong> ₹10/month - 5 topics with exclusive content</li>
              </ul>
              <p>
                Payments are processed securely through our payment partners. Subscriptions 
                automatically renew unless cancelled before the renewal date.
              </p>

              <h2>5. Content and Intellectual Property</h2>
              <p>
                All content provided through Newsly, including AI-generated newsletters, is protected 
                by intellectual property laws. You may not:
              </p>
              <ul>
                <li>Reproduce or distribute our content without permission</li>
                <li>Use the content for commercial purposes without authorization</li>
                <li>Remove any copyright or proprietary notices</li>
              </ul>

              <h2>6. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Service for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Share your account credentials with others</li>
              </ul>

              <h2>7. Termination</h2>
              <p>
                We may terminate or suspend your account at any time for violations of these terms. 
                You may cancel your subscription at any time through your account settings.
              </p>

              <h2>8. Limitation of Liability</h2>
              <p>
                Newsly is provided &quot;as is&quot; without warranties of any kind. We are not liable for 
                any indirect, incidental, or consequential damages arising from your use of the Service.
              </p>

              <h2>9. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the Service 
                after changes constitutes acceptance of the new terms.
              </p>

              <h2>10. Contact Us</h2>
              <p>
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <p>
                Email: support@newsly.com<br />
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
