import { NextApiRequest, NextApiResponse } from 'next';
import { generateJwt } from '@coinbase/cdp-sdk/auth';

// Use the official CDP SDK to generate proper JWT tokens
async function createSessionToken(address: string) {
  try {
    console.log('Creating session token for address:', address);
    
    // Create session token data
    const sessionTokenData = {
      addresses: [
        {
          address: address,
          blockchains: ["base", "ethereum"]
        }
      ],
      assets: ["USDC", "ETH"]
    };

    console.log('Session token request data:', JSON.stringify(sessionTokenData, null, 2));
    
    // Generate JWT using the official CDP SDK
    const jwt = await generateJwt({
      apiKeyId: process.env.CDP_API_KEY_ID!,
      apiKeySecret: process.env.CDP_API_KEY_SECRET!,
      requestMethod: 'POST',
      requestHost: 'api.developer.coinbase.com',
      requestPath: '/onramp/v1/token',
      expiresIn: 120 // 2 minutes
    });
    
    console.log('Generated JWT using CDP SDK');
    
    // Make the API call to CDP
    const response = await fetch('https://api.developer.coinbase.com/onramp/v1/token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionTokenData),
    });

    console.log('CDP API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('CDP API error response:', errorText);
      throw new Error(`CDP API error: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log('CDP API success response:', result);
    
    return result;
    
  } catch (error) {
    console.error('Error in createSessionToken:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Session token API called:', req.method, req.body);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.body;
  console.log('Received address:', address);

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  try {
    // Use the new function that handles CDP authentication properly
    const result = await createSessionToken(address);
    console.log('Successfully created session token');
    
    res.status(200).json(result);
    
  } catch (error) {
    console.error('Error creating session token:', error);
    res.status(500).json({ 
      error: 'Failed to create session token',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}