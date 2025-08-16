# x402 + Coinbase Onramp Demo

Next.js demo integrating x402 payments with Coinbase Onramp for seamless fiat-to-crypto-to-payment flows.

## What This Demo Shows

This project demonstrates a revolutionary payment flow:

1. **User visits x402-gated content** - Premium content protected by micropayments
2. **Server responds with 402 Payment Required** - Requests $0.001 USDC payment
3. **Automatic Onramp integration** - If user lacks funds, redirect to Coinbase Onramp
4. **Just-in-time funding** - Purchase exact amount needed with debit card
5. **Seamless return** - Complete x402 payment and access content

## Features

- ✅ **x402 protocol integration** with Next.js middleware
- ✅ **Wallet connection** with wagmi/viem
- ✅ **Automatic Onramp detection** for insufficient funds
- ✅ **Session token generation** for secure Onramp authentication
- ✅ **Return flow handling** after successful purchase
- ✅ **Responsive UI** with Tailwind CSS

## Getting Started

### Prerequisites

1. **Node.js 18+** and npm
2. **CDP Account** - Sign up at [cdp.coinbase.com](https://cdp.coinbase.com)
3. **Wallet** - MetaMask or other Web3 wallet
4. **Base mainnet ETH** - For gas fees

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/serdave-eth/x402-onramp-demo.git
   cd x402-onramp-demo
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your values:
   ```env
   CDP_PROJECT_ID=your-project-id
   CDP_API_KEY_ID=your-api-key-id  
   CDP_API_KEY_SECRET=your-api-key-secret
   WALLET_ADDRESS=0xYourWalletAddress
   NETWORK=base
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** (or the port shown in terminal)

### Configuration

#### CDP Setup

1. **Create CDP Account:** [cdp.coinbase.com](https://cdp.coinbase.com)
2. **Get Project ID:** Copy from your CDP dashboard
3. **Create API Keys:** Generate Secret API Key for server-side operations
4. **Apply for Onramp:** [Request access](https://support.cdp.coinbase.com/onramp-onboarding)

#### Wallet Setup

1. **Install MetaMask:** [metamask.io](https://metamask.io)
2. **Add Base Mainnet Network:**
   - Network Name: Base
   - RPC URL: https://mainnet.base.org
   - Chain ID: 8453
   - Currency: ETH
   - Block Explorer: https://basescan.org
3. **Get ETH on Base:** Transfer from other networks or buy directly

## How to Test

### Demo Flow

1. **Connect Wallet:** Use MetaMask or WalletConnect on Base mainnet
2. **Click "Access Premium Content"** - Triggers x402 payment request
3. **Payment Required:** Server responds with 402 status
4. **Onramp Redirect:** Automatically detects insufficient USDC
5. **Purchase Flow:** Redirected to Coinbase Onramp for real USDC purchase
6. **Return & Pay:** Complete x402 payment with newly purchased USDC
7. **Success:** See "Payment Complete" message

### ⚠️ Real Payments Enabled

This demo is configured for **mainnet with real payments**:

- **x402 Middleware:** Uses Coinbase's mainnet facilitator
- **Network:** Base mainnet with real USDC
- **Payment Amount:** $0.001 USDC (very small for testing)
- **Onramp Integration:** Real Coinbase Onramp for purchasing USDC

## Project Structure

```
x402-onramp-demo/
├── components/
│   ├── WalletConnect.tsx      # Wallet connection UI
│   ├── PremiumContentAccess.tsx # x402 payment interface
│   └── OnrampIntegration.tsx   # Onramp flow component
├── pages/
│   ├── api/
│   │   ├── premium-content.ts  # x402-protected endpoint
│   │   └── session-token.ts    # Onramp session token generation
│   ├── _app.tsx               # App configuration with wagmi
│   └── index.tsx              # Main demo page
├── middleware.ts              # x402 payment middleware
└── styles/globals.css         # Tailwind styles
```

## Key Integration Points

### x402 Middleware

```typescript
// middleware.ts
export const middleware = paymentMiddleware(
  process.env.WALLET_ADDRESS!,
  {
    '/api/premium-content': {
      price: '$0.001',
      network: "base"
    }
  },
  facilitator
);
```

### Onramp Integration

```typescript
// Generate real session tokens using CDP SDK
const jwt = await generateJwt({
  apiKeyId: process.env.CDP_API_KEY_ID!,
  apiKeySecret: process.env.CDP_API_KEY_SECRET!,
  requestMethod: 'POST',
  requestHost: 'api.developer.coinbase.com',
  requestPath: '/onramp/v1/token'
});
```

## Troubleshooting

### Common Issues

**Chain ID mismatch:**
- Ensure your wallet is connected to Base mainnet (chain ID 8453)
- Switch networks in MetaMask if needed

**"Invalid session token" errors:**
- Verify CDP credentials in `.env.local`
- Ensure you have Onramp access approved by Coinbase

**Payment failures:**
- Check sufficient ETH for gas fees on Base
- Verify wallet has signing permissions

### Support

- **x402 Discord:** [discord.gg/cdp](https://discord.gg/cdp) #x402 channel
- **CDP Documentation:** [docs.cdp.coinbase.com](https://docs.cdp.coinbase.com)
- **GitHub Issues:** File issues in this repository

## What's Next?

This demo showcases the foundation for:

- **AI Agent Commerce** - Agents that auto-fund themselves
- **Micropayment APIs** - Per-request pricing without subscriptions  
- **Frictionless Web3** - Zero-barrier entry to crypto payments
- **Just-in-Time Liquidity** - Purchase only what you need, when you need it

## License

MIT License - feel free to use this as a starting point for your own projects!
