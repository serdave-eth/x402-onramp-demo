import { paymentMiddleware } from 'x402-next';
import { facilitator } from "@coinbase/x402";

// Use Coinbase's mainnet facilitator for real payments
const facilitatorConfig = facilitator;

console.log('x402 middleware loaded with Coinbase mainnet facilitator');

export const middleware = paymentMiddleware(
  process.env.WALLET_ADDRESS! as `0x${string}`, // Your receiving wallet address
  {
    '/api/premium-content': {
      price: '$0.001', // Very small amount for testing
      network: "base", // MAINNET - real payments!
      config: {
        description: 'Access to premium content - x402 + Onramp demo',
        outputSchema: {
          type: "object",
          properties: {
            message: { type: "string" },
            timestamp: { type: "string" }
          }
        }
      }
    },
  },
  facilitatorConfig
);

export const config = {
  matcher: [
    '/api/premium-content/:path*',
  ]
};