# x402 + Coinbase Onramp Demo

This is a Next.js demonstration of integrating x402 payments with Coinbase Onramp for seamless fiat-to-crypto-to-payment flows.

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
4. **Base Sepolia ETH** - For gas fees (get from [faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet))

### Installation

1. **Clone and install dependencies:**
   ```bash
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
   NETWORK=base-sepolia
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
2. **Add Base Sepolia Network:**
   - Network Name: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - Chain ID: 84532
   - Currency: ETH
3. **Get Test ETH:** [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

## How to Test

### Demo Flow

1. **Connect Wallet:** Use MetaMask or WalletConnect
2. **Click "Access Premium Content"** - Triggers x402 payment request
3. **Payment Required:** Server responds with 402 status
4. **Onramp Redirect:** Automatically detects insufficient USDC
5. **Purchase Flow:** Redirected to Coinbase Onramp (simulated in demo)
6. **Return & Pay:** Complete x402 payment with newly purchased USDC
7. **Success:** See "Payment Complete" message

### ⚠️ Real Payments Enabled

This demo is configured for **mainnet with real payments**:

- **x402 Middleware:** Uses Coinbase's mainnet facilitator
- **Network:** Base mainnet with real USDC
- **Payment Amount:** $0.001 USDC (very small for testing)
- **Onramp Integration:** Real Coinbase Onramp for purchasing USDC

### Setting Up Real Onramp (Production)

To use real Coinbase Onramp instead of the demo simulation:

1. **Get Real CDP API Keys:**
   - Visit [cdp.coinbase.com](https://cdp.coinbase.com)
   - Create a project and generate **Secret API Keys**
   - Apply for [Onramp access](https://support.cdp.coinbase.com/onramp-onboarding)

2. **Update Session Token API:**
   - Replace the mock JWT generation in `/pages/api/session-token.ts`
   - Implement proper ES256 signing with your CDP private key
   - Make real API calls to `https://api.developer.coinbase.com/onramp/v1/token`

3. **Environment Variables:**
   ```env
   CDP_PROJECT_ID=your-real-project-id
   CDP_API_KEY_ID=your-real-api-key-id
   CDP_API_KEY_SECRET=your-real-api-key-secret
   ```

With real API keys, users will be able to complete actual USDC purchases through Coinbase Onramp.

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
      network: "base-sepolia"
    }
  },
  { url: "https://x402.org/facilitator" }
);
```

### Onramp Integration

```typescript
// Detect insufficient funds and redirect
if (response.status === 402) {
  const paymentInfo = await response.json();
  onPaymentRequired(paymentInfo.amount);
}

// Generate Onramp URL
const onrampUrl = `https://pay.coinbase.com/buy/select-asset?${params}`;
```

## Production Deployment

### Environment Configuration

For production use:

1. **Switch to Mainnet:**
   ```env
   NETWORK=base
   ```

2. **Use CDP Facilitator:**
   ```typescript
   import { facilitator } from "@coinbase/x402";
   // Replace middleware facilitator config
   ```

3. **Real Session Tokens:**
   - Implement proper JWT signing with CDP private key
   - Call actual CDP Session Token API
   - Handle real Onramp redirects

### Security Considerations

- ✅ **Private keys** stored securely (CDP manages this)
- ✅ **Session tokens** expire after 5 minutes
- ✅ **Payment verification** through x402 facilitator
- ✅ **Environment variables** for sensitive data

## Troubleshooting

### Common Issues

**"Payment required" but have USDC:**
- Check you're on the correct network (Base Sepolia)
- Ensure sufficient balance for payment + gas

**Onramp redirect not working:**
- Verify CDP credentials in `.env.local`
- Check session token generation logs

**Wallet connection issues:**
- Try refreshing the page
- Check MetaMask is unlocked and on Base Sepolia

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