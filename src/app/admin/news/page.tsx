'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import newsData from '@/data/news.json'

interface NewsItem {
  id: string
  title: string
  content: string
  category: 'campaign' | 'event' | 'notice'
  date: string
  image?: string
}

export default function AdminNewsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [news, setNews] = useState<NewsItem[]>(newsData as NewsItem[])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    } else {
      router.push('/admin')
    }
  }, [router])

  const categories = [
    { value: 'all', label: 'すべて' },
    { value: 'campaign', label: 'キャンペーン' },
    { value: 'event', label: 'イベント' },
    { value: 'notice', label: 'お知らせ' }
  ]

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory)

  const handleDelete = (id: string) => {
    if (confirm('このニュースを削除しますか？')) {
      const updatedNews = news.filter(item => item.id !== id)
      setNews(updatedNews)
      
      alert('ニュースが削除されました。\n※実際の実装では自動でJSONファイルが更新されます。')
    }
  }

  const getCategoryLabel = (category: string) => {
    const categoryMap = {
      campaign: 'キャンペーン',
      event: 'イベント',
      notice: 'お知らせ'
    }
    return categoryMap[category as keyof typeof categoryMap] || category
  }

  const getCategoryColor = (category: string) => {
    const colorMap = {
      campaign: 'bg-orange-100 text-orange-700',
      event: 'bg-purple-100 text-purple-700',
      notice: 'bg-blue-100 text-blue-700'
    }
    return colorMap[category as keyof typeof colorMap] || 'bg-gray-100 text-gray-700'
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
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="text-ocean-blue-600 hover:text-ocean-blue-700 mr-4">
                ← ダッシュボード
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">ニュース管理</h1>
                <p className="text-gray-600">{news.length}件のニュースが登録されています</p>
              </div>
            </div>
            <Link
              href="/admin/news/new"
              className="bg-ocean-blue-600 text-white px-4 py-2 rounded-md hover:bg-ocean-blue-700 transition-colors"
            >
              新しいニュースを追加
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-ocean-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                {filteredNews.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-ocean-blue-300 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
                            {getCategoryLabel(item.category)}
                          </span>
                          <span className="text-sm text-gray-500 ml-3">
                            {new Date(item.date).toLocaleDateString('ja-JP')}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">
                          {item.content}
                        </p>
                        
                        {item.image && (
                          <div className="text-xs text-gray-500 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            画像あり
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex items-center space-x-2">
                        <Link
                          href={`/admin/news/${item.id}/edit`}
                          className="text-ocean-blue-600 hover:text-ocean-blue-900 text-sm font-medium"
                        >
                          編集
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredNews.length === 0 && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <p className="text-gray-500">該当するニュースがありません</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}