import type { Metadata } from 'next'
import './globals.css'
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/700.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/600.css'

export const metadata: Metadata = {
  title: '長瀬サロン | プロフェッショナルヘアサロン',
  description: '東京の人気ヘアサロン「長瀬サロン」。経験豊富なスタイリストが最新のトレンドスタイルをご提案します。',
  keywords: ['ヘアサロン', '美容室', 'カット', 'カラー', 'パーマ', '東京', '長瀬サロン'],
  openGraph: {
    title: '長瀬サロン | プロフェッショナルヘアサロン',
    description: '東京の人気ヘアサロン「長瀬サロン」。経験豊富なスタイリストが最新のトレンドスタイルをご提案します。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: '長瀬サロン | プロフェッショナルヘアサロン',
    description: '東京の人気ヘアサロン「長瀬サロン」。経験豊富なスタイリストが最新のトレンドスタイルをご提案します。',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="--background: 255 255 255; --foreground: 0 0 0;">
      <body>{children}</body>
    </html>
  )
}