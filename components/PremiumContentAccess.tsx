import { useState, useCallback } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { wrapFetchWithPayment } from 'x402-fetch';

interface PremiumContentAccessProps {
  onPaymentRequired: (amount: string) => void;
}

export function PremiumContentAccess({ onPaymentRequired }: PremiumContentAccessProps) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attemptedPayment, setAttemptedPayment] = useState(false);
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const accessPremiumContent = useCallback(async () => {
    if (!isConnected || !walletClient) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);
    setContent(null);
    setAttemptedPayment(true); // Track that we attempted a payment

    try {
      console.log('Starting x402 payment attempt...');
      console.log('Wallet client:', walletClient);
      
      // Create x402-enabled fetch function
      const fetchWithPayment = wrapFetchWithPayment(fetch, walletClient);
      
      const response = await fetchWithPayment('/api/premium-content', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('x402 response status:', response.status);
      console.log('x402 response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const result = await response.json();
        setContent(result.message);
      } else if (response.status === 402) {
        // This means x402 payment was attempted but failed (likely insufficient funds)
        const paymentInfo = await response.json().catch(() => ({}));
        console.log('Payment failed:', paymentInfo);
        
        // Trigger Onramp flow for insufficient funds
        onPaymentRequired('0.001');
        return;
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to access content`);
      }
    } catch (err: any) {
      console.error('Access error:', err);
      const errorMessage = err?.message || err?.toString() || 'Unknown error';
      
      // Check if this is a payment-related error that should trigger onramp
      const isPaymentError = (
        errorMessage.toLowerCase().includes('insufficient') ||
        errorMessage.toLowerCase().includes('balance') ||
        errorMessage.toLowerCase().includes('usdc') ||
        errorMessage.toLowerCase().includes('payment') ||
        errorMessage.toLowerCase().includes('failed to access content') ||
        err?.code === 'INSUFFICIENT_FUNDS' ||
        err?.status === 500 // Often insufficient funds results in 500 error
      );
      
      console.log('Checking if should trigger onramp:');
      console.log('- isPaymentError:', isPaymentError);
      console.log('- attemptedPayment:', attemptedPayment);
      console.log('- error message:', errorMessage);
      
      if (isPaymentError || attemptedPayment) {
        console.log('✅ Payment error detected or payment was attempted, triggering onramp!');
        onPaymentRequired('0.001');
        return;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isConnected, walletClient, onPaymentRequired]);

  if (content) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <h2 className="text-xl font-bold mb-2">✅ Access Granted!</h2>
        <p className="text-lg">{content}</p>
        <button
          onClick={() => setContent(null)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
        <h2 className="text-xl font-bold mb-2">🔒 Premium Content</h2>
        <p className="mb-4">
          This content is protected by x402 payments. You&apos;ll need to pay $0.001 USDC to access it.
        </p>
        <p className="text-sm mb-4">
          Don&apos;t have USDC? No problem! We&apos;ll automatically redirect you to Coinbase Onramp to purchase the exact amount needed.
        </p>
      </div>

      <button
        onClick={accessPremiumContent}
        disabled={loading || !isConnected || !walletClient}
        className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Checking Access...' : 
         !walletClient ? 'Waiting for wallet...' :
         'Access Premium Content ($0.001)'}
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="mb-2">{error}</p>
          <button
            onClick={() => onPaymentRequired('0.001')}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Get USDC via Onramp
          </button>
        </div>
      )}

      {!isConnected && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Please connect your wallet to access premium content.
        </div>
      )}

      {isConnected && !walletClient && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Waiting for wallet client to initialize...
        </div>
      )}
    </div>
  );
}