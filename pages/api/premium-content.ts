import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Premium content API called:', req.method);
  console.log('Headers:', req.headers);
  console.log('X-Payment header present:', !!req.headers['x-payment']);
  
  // This endpoint is protected by x402 middleware
  // If we reach here, payment has been verified
  
  res.status(200).json({
    message: "🎉 Payment Complete! You have successfully accessed premium content.",
    timestamp: new Date().toISOString(),
    paymentReceived: true
  });
}