import { Metadata } from 'next'
import Link from 'next/link'
import Layout from '@/components/Layout'

export const metadata: Metadata = {
  title: 'ページが見つかりません | 長瀬サロン',
  description: 'お探しのページは見つかりませんでした。長瀬サロンのトップページまたはメニューから目的のページをお探しください。',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            {/* 404 エラーアイコン */}
            <div className="mx-auto h-32 w-32 text-ocean-blue-300 mb-8">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.09M6.343 6.343A8 8 0 1017.657 17.657 8 8 0 106.343 6.343z" />
              </svg>
            </div>
            
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ページが見つかりません
            </h2>
            <p className="text-gray-600 mb-8">
              お探しのページは削除されたか、URLが変更された可能性があります。
              <br />
              お手数ですが、以下のリンクから目的のページをお探しください。
            </p>
          </div>

          {/* ナビゲーションリンク */}
          <div className="space-y-4">
            <Link
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ocean-blue-600 hover:bg-ocean-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue-500 transition-colors"
            >
              トップページに戻る
            </Link>
            
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/stylists"
                className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue-500 transition-colors"
              >
                スタイリスト
              </Link>
              <Link
                href="/styles"
                className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue-500 transition-colors"
              >
                スタイル
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/menu"
                className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue-500 transition-colors"
              >
                メニュー
              </Link>
              <Link
                href="https://beauty.hotpepper.jp/" target="_blank" rel="noopener noreferrer"
                className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue-500 transition-colors"
              >
                予約
              </Link>
            </div>
          </div>

          {/* お問い合わせ */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-4">
              ご不明な点がございましたら、お気軽にお問い合わせください。
            </p>
            <div className="space-y-2">
              <a
                href="tel:03-1234-5678"
                className="inline-flex items-center text-ocean-blue-600 hover:text-ocean-blue-700 text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                03-1234-5678
              </a>
              <br />
              <a
                href="mailto:info@nagase-salon.com"
                className="inline-flex items-center text-ocean-blue-600 hover:text-ocean-blue-700 text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@nagase-salon.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}