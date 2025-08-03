'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState([
    { title: 'スタイリスト', count: 0, href: '/admin/stylists', icon: '👥' },
    { title: 'メニュー', count: 0, href: '/admin/menu', icon: '📋' },
    { title: 'ニュース', count: 0, href: '/admin/news', icon: '📰' },
    { title: 'スタイル', count: 0, href: '/admin/styles', icon: '✂️' },
  ])
  const [newsCount, setNewsCount] = useState(0)
  const [stylesCount, setStylesCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    } else {
      router.push('/admin')
    }
  }, [router])

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [stylistsRes, menuRes, newsRes, stylesRes] = await Promise.all([
          fetch('/api/stylists'),
          fetch('/api/menu'),
          fetch('/api/news'),
          fetch('/api/styles')
        ])

        const [stylists, menu, news, styles] = await Promise.all([
          stylistsRes.ok ? stylistsRes.json() : [],
          menuRes.ok ? menuRes.json() : [],
          newsRes.ok ? newsRes.json() : [],
          stylesRes.ok ? stylesRes.json() : []
        ])

        setStats([
          { title: 'スタイリスト', count: stylists.length, href: '/admin/stylists', icon: '👥' },
          { title: 'メニュー', count: menu.length, href: '/admin/menu', icon: '📋' },
          { title: 'ニュース', count: news.length, href: '/admin/news', icon: '📰' },
          { title: 'スタイル', count: styles.length, href: '/admin/styles', icon: '✂️' },
        ])
        setNewsCount(news.length)
        setStylesCount(styles.length)
      } catch (error) {
        console.error('Error fetching counts:', error)
      }
    }

    if (isAuthenticated) {
      fetchCounts()
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    router.push('/admin')
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">長瀬サロン管理画面</h1>
              <p className="text-gray-600">コンテンツ管理システム</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                target="_blank"
                className="text-ocean-blue-600 hover:text-ocean-blue-700 font-medium"
              >
                サイトを表示
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Overview Stats */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Link key={stat.title} href={stat.href}>
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">{stat.icon}</span>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {stat.title}
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {stat.count}件
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                クイックアクション
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/admin/stylists/new">
                  <div className="border border-gray-300 rounded-lg p-4 hover:border-ocean-blue-500 hover:bg-ocean-blue-50 transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">👤</span>
                      <div>
                        <h4 className="font-medium text-gray-900">新しいスタイリスト</h4>
                        <p className="text-sm text-gray-600">スタイリストを追加</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/admin/menu/new">
                  <div className="border border-gray-300 rounded-lg p-4 hover:border-ocean-blue-500 hover:bg-ocean-blue-50 transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">📋</span>
                      <div>
                        <h4 className="font-medium text-gray-900">新しいメニュー</h4>
                        <p className="text-sm text-gray-600">メニューを追加</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/admin/news/new">
                  <div className="border border-gray-300 rounded-lg p-4 hover:border-ocean-blue-500 hover:bg-ocean-blue-50 transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">📰</span>
                      <div>
                        <h4 className="font-medium text-gray-900">新しいニュース</h4>
                        <p className="text-sm text-gray-600">お知らせを追加</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/admin/styles/new">
                  <div className="border border-gray-300 rounded-lg p-4 hover:border-ocean-blue-500 hover:bg-ocean-blue-50 transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">✂️</span>
                      <div>
                        <h4 className="font-medium text-gray-900">新しいスタイル</h4>
                        <p className="text-sm text-gray-600">スタイルを追加</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/admin/salon">
                  <div className="border border-gray-300 rounded-lg p-4 hover:border-ocean-blue-500 hover:bg-ocean-blue-50 transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">🏪</span>
                      <div>
                        <h4 className="font-medium text-gray-900">サロン情報</h4>
                        <p className="text-sm text-gray-600">基本情報を編集</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/admin/settings" className="block">
                  <div className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">⚙️</span>
                      <div>
                        <h4 className="font-medium text-gray-900">サロン設定</h4>
                        <p className="text-sm text-gray-600">ヒーロー画像や基本情報を管理</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                最近の更新
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  管理システムが正常に動作中
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  {newsCount}件のニュースが公開中
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  {stylesCount}件のスタイルが登録済み
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}