import type { NextConfig } from 'next'
import path from 'path'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    qualities: [75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  async headers() {
    return [
      {
        // Vercel does not automatically set long-lived cache on /public/fonts/.
        // Font filenames are not content-hashed, so no immutable directive —
        // the browser will revalidate after 1 year if the URL ever changes.
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
    ]
  },
}

export default withBundleAnalyzer(nextConfig)
