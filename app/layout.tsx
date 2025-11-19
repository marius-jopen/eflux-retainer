import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Retainer Calculator',
  description: 'Calculate retainer costs and profits',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

