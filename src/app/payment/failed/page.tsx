'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw } from 'lucide-react';
import { Suspense } from 'react';

function FailedContent() {
  const searchParams = useSearchParams();
  const txn = searchParams.get('txn');
  const error = searchParams.get('error');

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'PAYMENT_DECLINED':
        return 'Your payment was declined. Please try again with a different payment method.';
      case 'PAYMENT_ERROR':
        return 'There was an error processing your payment. Please try again.';
      case 'missing_transaction':
        return 'Transaction information is missing. Please start the payment process again.';
      case 'processing_error':
        return 'There was an error processing your payment callback. Please contact support.';
      default:
        return 'Your payment could not be completed. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Failed
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {getErrorMessage(error)}
        </p>

        {(txn || error) && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6 text-left">
            {txn && (
              <div className="mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Transaction ID</p>
                <p className="font-mono text-sm text-gray-700 dark:text-gray-300 break-all">
                  {txn}
                </p>
              </div>
            )}
            {error && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Error Code</p>
                <p className="font-mono text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Link 
            href="/#pricing"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Link>
          
          <Link 
            href="/"
            className="block w-full text-gray-600 dark:text-gray-300 py-2 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Need help? Contact us at{' '}
          <a href="mailto:support@aitoolsweekly.com" className="text-purple-600 hover:underline">
            support@aitoolsweekly.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    }>
      <FailedContent />
    </Suspense>
  );
}
