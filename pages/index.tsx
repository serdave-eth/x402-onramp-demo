import { useState, useEffect } from 'react';
import Head from 'next/head';
import { WalletConnect } from '@/components/WalletConnect';
import { PremiumContentAccess } from '@/components/PremiumContentAccess';
import { OnrampIntegration } from '@/components/OnrampIntegration';
import { ClientOnly } from '@/components/ClientOnly';
import { useAccount } from 'wagmi';

export default function Home() {
  const [showOnramp, setShowOnramp] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState('0.001');
  const [justReturnedFromOnramp, setJustReturnedFromOnramp] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    // Check if user just returned from Onramp
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('onramp_success') === 'true') {
      setJustReturnedFromOnramp(true);
      setShowOnramp(false);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Show success message for a few seconds
      setTimeout(() => {
        setJustReturnedFromOnramp(false);
      }, 5000);
    }
  }, []);

  const handlePaymentRequired = (amount: string) => {
    setRequiredAmount(amount);
    setShowOnramp(true);
  };

  const handleCancelOnramp = () => {
    setShowOnramp(false);
  };

  return (
    <>
      <Head>
        <title>x402 + Onramp Demo</title>
        <meta name="description" content="Demo of x402 payments with Coinbase Onramp integration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              x402 + Onramp Demo
            </h1>
            <p className="text-gray-600">
              Seamless payments with automatic funding
            </p>
          </div>

          {/* Wallet Connection */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">1. Connect Your Wallet</h2>
            <ClientOnly fallback={<div className="text-gray-500">Loading wallet connection...</div>}>
              <WalletConnect />
            </ClientOnly>
          </div>

          {/* Success Message */}
          {justReturnedFromOnramp && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <h3 className="font-bold">🎉 Welcome Back!</h3>
              <p>Your USDC purchase was successful. You can now access premium content!</p>
            </div>
          )}

          {/* Main Content Area */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">2. Access Premium Content</h2>
            
            <ClientOnly fallback={<div className="text-center py-8 text-gray-500">Loading...</div>}>
              {!isConnected ? (
                <div className="text-center py-8 text-gray-500">
                  Please connect your wallet to continue
                </div>
              ) : showOnramp ? (
                <OnrampIntegration 
                  requiredAmount={requiredAmount}
                  onCancel={handleCancelOnramp}
                />
              ) : (
                <PremiumContentAccess onPaymentRequired={handlePaymentRequired} />
              )}
            </ClientOnly>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">How This Demo Works</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                <p>Click &quot;Access Premium Content&quot; to make a request to the x402-protected endpoint</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                <p>Server responds with HTTP 402 Payment Required ($0.001 USDC)</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                <p>If you don&apos;t have enough USDC, you&apos;re redirected to Coinbase Onramp</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
                <p>Purchase the exact amount needed with your debit card</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">5</span>
                <p>Return automatically and complete the x402 payment</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">✓</span>
                <p>Access granted! See &quot;Payment Complete&quot; message</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>Built with x402 protocol + Coinbase Onramp API</p>
          </div>
        </div>
      </main>
    </>
  );
}