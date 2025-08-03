import { Metadata } from 'next'
import HomeClient from '@/components/HomeClient'
import { generateSEO, generateBusinessStructuredData, SALON_BUSINESS_DATA } from '@/utils/seo'
import { StructuredData } from '@/components/StructuredData'

export const metadata: Metadata = generateSEO({
  title: '長瀬サロン | プロフェッショナルヘアサロン - 東京・大手町',
  description: '東京・大手町にある人気ヘアサロン「長瀬サロン」。経験豊富な5名のスタイリストが最新のトレンドスタイルをご提案。カット、カラー、パーマなど豊富なメニューをご用意。完全予約制でお一人お一人に寄り添ったサービスを提供いたします。',
  keywords: [
    'ヘアサロン', '美容室', 'カット', 'カラー', 'パーマ', 'トリートメント',
    '東京', '大手町', '千代田区', 'メンズカット', 'スタイリスト',
    '予約', 'ホットペッパービューティー', 'ヘアケア', 'スタイル'
  ],
  path: '/',
  type: 'website',
})

export default function Home() {
  const businessData = generateBusinessStructuredData(SALON_BUSINESS_DATA)

  return (
    <>
      <StructuredData data={businessData} />
      <HomeClient />
    </>
  )
}