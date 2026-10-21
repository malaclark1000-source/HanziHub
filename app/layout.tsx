import './globals.css'
import { ApplicationStoreProvider } from '@/providers/application-store-provider'
import ClientLayout from './ClientLayout'
import { Metadata } from 'next'
import { Inter, Noto_Sans_SC } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

// Chinese glyphs. Google serves this in small unicode-range slices, so only
// the characters a page actually uses get downloaded.
const notoSansSC = Noto_Sans_SC({ weight: ['400', '500', '700'], preload: false, variable: '--font-noto-sc' })

const description = 'Free Anki and Pleco flashcard decks, tutorials and study tools for DLI Mandarin students.'

export const metadata: Metadata = {
  title: {
    default: 'Hanzi Hub',
    template: '%s · Hanzi Hub',
  },
  description,
  openGraph: {
    siteName: 'Hanzi Hub',
    title: 'Hanzi Hub',
    description,
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {


  return (
    <html lang="en" className={`${inter.variable} ${notoSansSC.variable}`}>
      <body className="antialiased bg-slate-50 dark:bg-slate-950 min-h-screen">
        <ApplicationStoreProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ApplicationStoreProvider>
      </body>
    </html>
  )
}
