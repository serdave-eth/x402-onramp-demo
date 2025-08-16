#!/bin/bash

echo "🚀 Starting x402 + Onramp Demo"
echo "==============================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Environment file not found!"
    echo "Please copy .env.example to .env.local and configure your settings:"
    echo "  cp .env.example .env.local"
    echo ""
    echo "Required environment variables:"
    echo "  - CDP_PROJECT_ID"
    echo "  - CDP_API_KEY_ID" 
    echo "  - CDP_API_KEY_SECRET"
    echo "  - WALLET_ADDRESS"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🌐 Starting development server..."
echo "Open http://localhost:3000 in your browser"
echo ""
echo "How to test:"
echo "1. Connect your wallet (MetaMask)"
echo "2. Click 'Access Premium Content'"
echo "3. Follow the Onramp flow if you need USDC"
echo "4. Complete payment and see 'Payment Complete'"
echo ""

npm run dev