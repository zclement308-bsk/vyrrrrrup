import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Archivo, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo' })
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-mono' })

const title = 'VYR UP — Sais si ta vidéo va percer'
const description = 'Connecte ton TikTok et découvre ce qui fait vraiment décoller tes vidéos, avec un plan d’action personnalisé.'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vyrup.vercel.app'),
  title,
  description,
  openGraph: { title, description, type: 'website', locale: 'fr_FR' },
  twitter: { card: 'summary_large_image', title, description },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#11110f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`bg-background ${archivo.variable} ${plexMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
