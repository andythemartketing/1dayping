import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '1dayping - Email Course Platform',
  description: 'Daily email courses with seamless subscription management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
