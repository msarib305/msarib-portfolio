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
  title:       'Sarib',
  description: 'Lead Unreal Engine 5 developer. msarib.dev',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <head>
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
