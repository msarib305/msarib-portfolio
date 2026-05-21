import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { SkipToContent } from '@/components/SkipToContent'
import { Nav }           from '@/components/Nav'
import { Footer }        from '@/components/Footer'

const jetbrainsMono = JetBrains_Mono({
  subsets:  ['latin'],
  display:  'swap',
  variable: '--font-jetbrains-mono',
  preload:  false,
  weight:   ['400', '500', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://msarib.dev'),

  title: {
    default:  'Sarib · Lead UE5 Developer',
    template: '%s · Sarib',
  },

  description: 'Lead Unreal Engine 5 developer with seven years in engine and ten shipped titles. C++, GAS, multiplayer replication, mobile, VR.',

  openGraph: {
    type:        'website',
    siteName:    'msarib.dev',
    locale:      'en_US',
    url:         'https://msarib.dev',
    title:       'Sarib · Lead UE5 Developer',
    description: 'Lead Unreal Engine 5 developer with seven years in engine and ten shipped titles. C++, GAS, multiplayer replication, mobile, VR.',
    images: [
      {
        url:    '/og?title=Lead+UE5+Developer&eyebrow=msarib.dev',
        width:  1200,
        height: 630,
        alt:    'Sarib · Lead Unreal Engine 5 Developer',
      },
    ],
  },

  icons: {
    icon: [
      { url: '/icons/favicon.ico' },
      { url: '/icons/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icons/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icons/icon-192.png',      type: 'image/png', sizes: '192x192' },
      { url: '/icons/icon-512.png',      type: 'image/png', sizes: '512x512' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },

  manifest: '/site.webmanifest',

  verification: {
    google: process.env.NEXT_GOOGLE_SITE_VERIFICATION || undefined,
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-image-preview': 'large',
      'max-snippet':       -1,
      'max-video-preview': -1,
    },
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#101014',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable} style={{ colorScheme: 'dark' }}>
      <head>
        {/* Opt out of Dark Reader: the site is already dark-mode native.
            Letting DR re-style it produces inverted colours that break the
            blob blends and mix-blend-mode: screen layers. */}
        <meta name="darkreader-lock" />
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Preload the two above-the-fold font files. Without these the
            text uses the metric-matched fallback for ~300ms longer on
            slow networks, which measurably hurts FCP and CLS. React 19
            may render a benign duplicate `<link>` in DevTools (a known
            React resource-hint hoisting quirk); browsers dedupe by URL. */}
        <link
          rel="preload"
          href="/fonts/PPRightGrotesk-WideBlack.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/PPRightGroteskText-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning>
        <SkipToContent />
        <Nav />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
