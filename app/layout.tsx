import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'Tankwise — Calcula tu aventura',
  description: 'Calculadora de costes para viajes en moto',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}