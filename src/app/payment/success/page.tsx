'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('txn');
  const plan = searchParams.get('plan') || 'PRO';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Welcome to Newsly {plan}! Your subscription is now active.
        </p>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
          <p className="font-mono text-sm text-gray-700 dark:text-gray-300 break-all">
            {orderId || 'N/A'}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">Plan</p>
            <p className="font-semibold text-lg text-indigo-600 dark:text-indigo-400">{plan}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Link 
            href="/dashboard"
            className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all"
          >
            Go to Dashboard
          </Link>
          
          <Link 
            href="/"
            className="block w-full text-gray-600 dark:text-gray-300 py-2 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          You&apos;ll receive newsletters at your subscribed frequency.
          Check your inbox for a welcome email!
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
