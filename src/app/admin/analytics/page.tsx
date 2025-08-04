import { Metadata } from 'next'
import AuthGuard from '@/components/AuthGuard'
import PerformanceDashboard from '@/components/PerformanceDashboard'
import { PWAStatus } from '@/components/PWAInstaller'

export const metadata: Metadata = {
  title: 'アナリティクス',
  description: 'サイトのパフォーマンス指標とアナリティクス情報',
  robots: 'noindex, nofollow',
}

export default function AnalyticsPage() {
  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">アナリティクス ダッシュボード</h1>
            <p className="mt-2 text-lg text-gray-600">サイトのパフォーマンス指標とユーザー行動を監視</p>
          </div>

          {/* パフォーマンス指標 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <PerformanceDashboard />
            
            <PWAStatus />
            
            {/* Google Analytics情報 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Google Analytics</h3>
              
              {process.env.NEXT_PUBLIC_GA_ID ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800">
                      ✓ Google Analytics が設定されています
                    </p>
                    <p className="text-sm text-green-600 mt-2">
                      ID: {process.env.NEXT_PUBLIC_GA_ID}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">収集データ</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• ページビュー数</li>
                      <li>• ユーザーセッション</li>
                      <li>• Web Vitals指標</li>
                      <li>• カスタムイベント</li>
                      <li>• エラー追跡</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-800">
                    ⚠ Google Analytics ID が設定されていません
                  </p>
                  <p className="text-sm text-yellow-600 mt-2">
                    環境変数 NEXT_PUBLIC_GA_ID を設定してください
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 追跡可能なイベント一覧 */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">追跡イベント一覧</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">予約関連</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 予約開始</li>
                  <li>• 予約完了</li>
                  <li>• 予約方法選択</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">ナビゲーション</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• ページ遷移</li>
                  <li>• メニュークリック</li>
                  <li>• 外部リンククリック</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">コンテンツ</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• スタイリスト詳細表示</li>
                  <li>• 画像閲覧</li>
                  <li>• メニュー表示</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">ソーシャル</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• SNSリンククリック</li>
                  <li>• Instagram表示</li>
                  <li>• Twitter表示</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">パフォーマンス</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Core Web Vitals</li>
                  <li>• ページ読み込み時間</li>
                  <li>• エラー発生</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">ユーザー行動</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• スクロール深度</li>
                  <li>• 滞在時間</li>
                  <li>• 離脱ページ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}