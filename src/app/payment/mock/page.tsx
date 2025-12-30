'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2, CreditCard } from 'lucide-react';

function MockPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<'success' | 'failed' | null>(null);

  const email = searchParams.get('email') || 'user@example.com';
  const plan = searchParams.get('plan') || 'PRO';
  const amount = plan === 'PRO' ? '₹3.00' : '₹10.00';
  const orderId = searchParams.get('orderId') || 'ORD_' + Date.now();

  const handlePayment = async (success: boolean) => {
    setProcessing(true);
    
    try {
      // Call API to update subscriber tier
      const response = await fetch('/api/payment/mock-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, success, email, plan }),
      });

      const data = await response.json();
      
      // Simulate payment processing delay
      setTimeout(() => {
        setProcessing(false);
        setResult(success ? 'success' : 'failed');
        
        // Redirect after showing result
        setTimeout(() => {
          if (success) {
            router.push(`/payment/success?orderId=${orderId}&plan=${plan}`);
          } else {
            router.push(`/payment/failed?orderId=${orderId}`);
          }
        }, 2000);
      }, 1500);
    } catch (error) {
      console.error('Payment error:', error);
      setProcessing(false);
      setResult('failed');
      
      setTimeout(() => {
        router.push(`/payment/failed?orderId=${orderId}`);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Mock Payment Gateway</CardTitle>
          <CardDescription>Test payment flow without real transactions</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
              <span className="font-mono font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Email:</span>
              <span className="font-medium">{email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Plan:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{plan}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <span className="font-medium">Amount:</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">{amount}</span>
            </div>
          </div>

          {/* Processing State */}
          {processing && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Processing payment...</p>
            </div>
          )}

          {/* Result State */}
          {result === 'success' && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <p className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">Payment Successful!</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Redirecting...</p>
            </div>
          )}

          {result === 'failed' && (
            <div className="text-center py-8">
              <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
              <p className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Payment Failed!</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Redirecting...</p>
            </div>
          )}

          {/* Action Buttons */}
          {!processing && !result && (
            <div className="space-y-3">
              <Button 
                onClick={() => handlePayment(true)} 
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Simulate Success
              </Button>
              
              <Button 
                onClick={() => handlePayment(false)} 
                variant="destructive"
                className="w-full"
                size="lg"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Simulate Failure
              </Button>

              <Button 
                onClick={() => router.push('/')} 
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Info Banner */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
              🧪 <strong>Development Mode:</strong> This is a mock payment page. No real charges will be made.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MockPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    }>
      <MockPaymentContent />
    </Suspense>
  );
}
