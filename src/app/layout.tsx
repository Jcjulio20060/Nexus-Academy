import type { Metadata } from 'next'
import { Instrument_Sans, Fraunces, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const instrumentSans = Instrument_Sans({ subsets: ['latin'], variable: '--font-sans' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', weight: ['300', '400', '500', '600'] })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Coffee & Code',
  description: 'Portal da turma de Ciência da Computação',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/icons/icon-192x192.png',
    },
  },
}

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${instrumentSans.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`}
        </Script>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
