/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CDP_PROJECT_ID: process.env.CDP_PROJECT_ID,
    CDP_API_KEY_ID: process.env.CDP_API_KEY_ID,
    CDP_API_KEY_SECRET: process.env.CDP_API_KEY_SECRET,
    WALLET_ADDRESS: process.env.WALLET_ADDRESS,
  },
}

module.exports = nextConfig