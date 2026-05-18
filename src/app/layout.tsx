import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sarib',
  description: 'Lead Unreal Engine 5 developer. msarib.dev',
  other: {
    'color-scheme': 'dark',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
