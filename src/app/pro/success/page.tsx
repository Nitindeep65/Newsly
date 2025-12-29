import { stripe } from "@/lib/stripe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Welcome to Pro! | AI Tools Weekly",
  description: "Your Pro subscription is now active",
};

async function getSessionDetails(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch {
    return null;
  }
}

export default async function ProSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const session = params.session_id ? await getSessionDetails(params.session_id) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Welcome to Pro! 🎉</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Your subscription is now active. You now have access to all Pro features!
          </p>

          <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              Your Pro Benefits
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ 50+ AI tools every week (vs 10 for free)</li>
              <li>✓ Exclusive templates & playbooks</li>
              <li>✓ Early access to new tools</li>
              <li>✓ Pro-only Discord community</li>
              <li>✓ Priority support</li>
            </ul>
          </div>

          {session?.customer_email && (
            <p className="text-sm text-muted-foreground">
              Confirmation sent to <strong>{session.customer_email}</strong>
            </p>
          )}

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/tools">Browse Pro Tools</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
