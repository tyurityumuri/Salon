'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AuthGuard from '@/components/AuthGuard'
import { useAuthContext } from '@/contexts/AuthContext'

export default function AdminDashboard() {
  const { user, logout } = useAuthContext()
  const [stats, setStats] = useState([
    { title: 'スタイリスト', count: 0, href: '/admin/stylists', icon: '👥' },
    { title: 'メニュー', count: 0, href: '/admin/menu', icon: '📋' },
    { title: 'ニュース', count: 0, href: '/admin/news', icon: '📰' },
    { title: 'スタイル', count: 0, href: '/admin/styles', icon: '✂️' },
  ])

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
      } catch (error) {
        console.error('Failed to fetch counts:', error)
      }
    }

    fetchCounts()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-primary-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-heading font-light tracking-wide text-primary-900">
                  NAGASE SALON
                </h1>
                <p className="text-primary-600 font-light">管理システム</p>
              </div>
              <div className="flex items-center space-x-6">
                {user && (
                  <div className="text-right">
                    <p className="text-sm text-primary-600">ログイン中</p>
                    <p className="font-medium text-primary-900">{user.email}</p>
                  </div>
                )}
                <Link 
                  href="/"
                  target="_blank"
                  className="text-accent-600 hover:text-accent-700 font-medium tracking-wide transition-colors duration-300"
                >
                  サイトを表示
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-primary-900 text-white px-6 py-2 font-medium tracking-wide uppercase text-sm hover:bg-primary-800 transition-colors duration-300"
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
          {/* Overview Stats */}
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {stats.map((stat) => (
                <Link key={stat.title} href={stat.href}>
                  <div className="bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group border border-primary-100">
                    <div className="p-8">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{stat.icon}</span>
                        </div>
                        <div className="ml-6 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-primary-500 uppercase tracking-wide">
                              {stat.title}
                            </dt>
                            <dd className="text-2xl font-light text-primary-900 mt-1">
                              {stat.count}<span className="text-base text-primary-500 ml-1">件</span>
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
            <div className="bg-white shadow-sm border border-primary-100">
              <div className="px-8 py-8">
                <h3 className="text-xl font-heading font-medium text-primary-900 mb-8 tracking-wide">
                  クイックアクション
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Link href="/admin/stylists/new">
                    <div className="border border-primary-200 p-6 hover:border-accent-500 hover:bg-accent-50 transition-all duration-300 cursor-pointer group">
                      <div className="flex items-center">
                        <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">👤</span>
                        <div>
                          <h4 className="font-medium text-primary-900 tracking-wide">新しいスタイリスト</h4>
                          <p className="text-sm text-primary-600 mt-1">スタイリストを追加</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/admin/menu/new">
                    <div className="border border-primary-200 p-6 hover:border-accent-500 hover:bg-accent-50 transition-all duration-300 cursor-pointer group">
                      <div className="flex items-center">
                        <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">📋</span>
                        <div>
                          <h4 className="font-medium text-primary-900 tracking-wide">新しいメニュー</h4>
                          <p className="text-sm text-primary-600 mt-1">メニューを追加</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/admin/news/new">
                    <div className="border border-primary-200 p-6 hover:border-accent-500 hover:bg-accent-50 transition-all duration-300 cursor-pointer group">
                      <div className="flex items-center">
                        <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">📰</span>
                        <div>
                          <h4 className="font-medium text-primary-900 tracking-wide">新しいニュース</h4>
                          <p className="text-sm text-primary-600 mt-1">ニュースを追加</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/admin/styles/new">
                    <div className="border border-primary-200 p-6 hover:border-accent-500 hover:bg-accent-50 transition-all duration-300 cursor-pointer group">
                      <div className="flex items-center">
                        <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">✂️</span>
                        <div>
                          <h4 className="font-medium text-primary-900 tracking-wide">新しいスタイル</h4>
                          <p className="text-sm text-primary-600 mt-1">スタイルを追加</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/admin/salon">
                    <div className="border border-primary-200 p-6 hover:border-accent-500 hover:bg-accent-50 transition-all duration-300 cursor-pointer group">
                      <div className="flex items-center">
                        <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">🏪</span>
                        <div>
                          <h4 className="font-medium text-primary-900 tracking-wide">サロン情報</h4>
                          <p className="text-sm text-primary-600 mt-1">基本情報を編集</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/admin/settings">
                    <div className="border border-primary-200 p-6 hover:border-accent-500 hover:bg-accent-50 transition-all duration-300 cursor-pointer group">
                      <div className="flex items-center">
                        <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">⚙️</span>
                        <div>
                          <h4 className="font-medium text-primary-900 tracking-wide">設定</h4>
                          <p className="text-sm text-primary-600 mt-1">システム設定</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}