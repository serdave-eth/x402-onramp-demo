import { useState } from 'react';
import { useAccount } from 'wagmi';

interface OnrampIntegrationProps {
  requiredAmount: string;
  onCancel: () => void;
}

export function OnrampIntegration({ requiredAmount, onCancel }: OnrampIntegrationProps) {
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();

  const handleOnrampRedirect = async () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);

    try {
      // Generate session token for Onramp
      const sessionResponse = await fetch('/api/session-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create session token');
      }

      const { token } = await sessionResponse.json();

      // Calculate total amount needed (payment + small buffer for gas)
      const paymentAmount = parseFloat(requiredAmount);
      const gasBuffer = 0.01; // Small buffer for transaction fees
      const totalAmount = paymentAmount + gasBuffer;

      // Construct Onramp URL with parameters
      const currentUrl = window.location.origin;
      const returnUrl = `${currentUrl}?onramp_success=true`;
      
      const onrampParams = new URLSearchParams({
        sessionToken: token,
        defaultAsset: 'USDC',
        defaultNetwork: 'base', // Use base mainnet for real payments
        presetFiatAmount: totalAmount.toFixed(2),
        fiatCurrency: 'USD',
        redirectUrl: returnUrl,
      });

      // For demo purposes, we'll create a demo Onramp URL that simulates the flow
      // In production with real CDP API keys, this would redirect to the actual Coinbase Onramp
      const demoOnrampUrl = `https://demo-onramp-simulator.com?amount=${totalAmount.toFixed(2)}&asset=USDC&return=${encodeURIComponent(returnUrl)}`;
      const realOnrampUrl = `https://pay.coinbase.com/buy/select-asset?${onrampParams.toString()}`;

      console.log('Redirecting to Onramp:', realOnrampUrl);
      
      // Show enhanced confirmation with demo explanation
      const confirmRedirect = confirm(
        `DEMO MODE: Session Token Demo Limitation\n\n` +
        `This demo uses a mock session token which Coinbase's API doesn't recognize.\n\n` +
        `In production with real CDP API keys, you would be redirected to:\n` +
        `${realOnrampUrl}\n\n` +
        `For this demo, would you like to:\n` +
        `1. Click OK to see the redirect attempt (will show Coinbase error)\n` +
        `2. Click Cancel to simulate successful return from Onramp`
      );
      
      if (confirmRedirect) {
        // Show the real URL attempt (will fail due to invalid session token)
        window.location.href = realOnrampUrl;
      } else {
        // Simulate successful Onramp completion
        alert('Demo: Simulating successful USDC purchase from Onramp!\n\nIn a real implementation, you would have purchased USDC and returned here.');
        
        // Simulate return from successful Onramp
        setTimeout(() => {
          window.location.href = returnUrl;
        }, 1000);
      }

    } catch (error) {
      console.error('Error creating Onramp URL:', error);
      alert('Failed to create Onramp URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = parseFloat(requiredAmount) + 0.01; // Add gas buffer

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h2 className="text-xl font-bold text-yellow-800 mb-4">💰 Fund Your Wallet</h2>
      
      <div className="mb-4">
        <p className="text-yellow-700 mb-2">
          You need <strong>${requiredAmount} USDC</strong> to access this content.
        </p>
        <p className="text-sm text-yellow-600 mb-4">
          We&apos;ll help you purchase <strong>${totalAmount.toFixed(2)} USDC</strong> (includes small buffer for gas fees) using Coinbase Onramp.
        </p>
      </div>

      <div className="bg-white rounded p-4 mb-4 border">
        <h3 className="font-semibold mb-2">What happens next:</h3>
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>You&apos;ll be redirected to Coinbase Onramp</li>
          <li>Purchase USDC with your debit card or bank account</li>
          <li>Return here automatically after purchase</li>
          <li>Access your premium content</li>
        </ol>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={handleOnrampRedirect}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Creating Purchase Link...' : `Purchase $${totalAmount.toFixed(2)} USDC`}
        </button>
        
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400"
        >
          Cancel
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Powered by Coinbase Onramp • Secure and instant funding
      </p>
    </div>
  );
}