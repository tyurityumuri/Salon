import type { Metadata } from 'next'
import './globals.css'
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/700.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/600.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Analytics from '@/components/Analytics'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import PWAInstaller from '@/components/PWAInstaller'

export const metadata: Metadata = {
  title: {
    template: '%s | 長瀬サロン',
    default: '長瀬サロン | プロフェッショナルヘアサロン - 東京・大手町'
  },
  description: '東京・大手町にある人気ヘアサロン「長瀬サロン」。経験豊富な5名のスタイリストが最新のトレンドスタイルをご提案。カット、カラー、パーマなど豊富なメニューをご用意。完全予約制でお一人お一人に寄り添ったサービスを提供いたします。',
  keywords: [
    'ヘアサロン', '美容室', 'カット', 'カラー', 'パーマ', 'トリートメント',
    '東京', '大手町', '千代田区', '長瀬サロン', 'メンズカット', 'スタイリスト',
    '予約', 'ホットペッパービューティー', 'ヘアケア', 'スタイル'
  ],
  authors: [{ name: '長瀬サロン' }],
  creator: '長瀬サロン',
  publisher: '長瀬サロン',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nagase-salon.vercel.app'),
  openGraph: {
    title: '長瀬サロン | プロフェッショナルヘアサロン - 東京・大手町',
    description: '東京・大手町にある人気ヘアサロン「長瀬サロン」。経験豊富な5名のスタイリストが最新のトレンドスタイルをご提案。カット、カラー、パーマなど豊富なメニューをご用意。',
    type: 'website',
    locale: 'ja_JP',
    url: '/',
    siteName: '長瀬サロン',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '長瀬サロン - プロフェッショナルヘアサロン',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '長瀬サロン | プロフェッショナルヘアサロン',
    description: '東京・大手町にある人気ヘアサロン。経験豊富なスタイリストが最新のトレンドスタイルをご提案。',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  category: 'business',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="--background: 255 255 255; --foreground: 0 0 0;">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="長瀬サロン" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <AuthProvider>
          <ServiceWorkerRegistration />
          <Analytics />
          {children}
          <PWAInstaller />
        </AuthProvider>
      </body>
    </html>
  )
}