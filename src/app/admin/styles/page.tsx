'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import stylesData from '@/data/styles.json'

interface StyleItem {
  id: string
  src: string
  alt: string
  category: string
  tags: string[]
  stylistName: string
  height: number
}

export default function AdminStylesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [styles, setStyles] = useState<StyleItem[]>(stylesData as StyleItem[])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    } else {
      router.push('/admin')
    }
  }, [router])

  const categories = ['all', ...Array.from(new Set(styles.map(item => item.category)))]

  const filteredStyles = styles.filter(style => {
    const matchesCategory = selectedCategory === 'all' || style.category === selectedCategory
    const matchesSearch = style.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         style.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         style.stylistName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleDelete = (id: string) => {
    if (confirm('このスタイルを削除しますか？')) {
      const updatedStyles = styles.filter(style => style.id !== id)
      setStyles(updatedStyles)
      
      alert('スタイルが削除されました。\n※実際の実装では自動でJSONファイルが更新されます。')
    }
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
                <h1 className="text-3xl font-bold text-gray-900">スタイルギャラリー管理</h1>
                <p className="text-gray-600">{styles.length}件のスタイルが登録されています</p>
              </div>
            </div>
            <Link
              href="/admin/styles/new"
              className="bg-ocean-blue-600 text-white px-4 py-2 rounded-md hover:bg-ocean-blue-700 transition-colors"
            >
              新しいスタイルを追加
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Filters */}
          <div className="mb-6 space-y-4">
            {/* Search */}
            <div className="relative max-w-md">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="スタイルやタグで検索..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedCategory === category
                      ? 'bg-ocean-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category === 'all' ? 'すべて' : category}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {filteredStyles.length}件のスタイルが見つかりました
              {selectedCategory !== 'all' && ` (${selectedCategory})`}
              {searchTerm && ` - 検索: "${searchTerm}"`}
            </div>
          </div>

          {/* Styles Grid */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {filteredStyles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredStyles.map((style) => (
                    <div key={style.id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-ocean-blue-300 transition-colors">
                      <div className="aspect-square bg-gray-200 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            {style.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            高さ: {style.height}px
                          </span>
                        </div>
                        
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                          {style.alt}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-3">
                          スタイリスト: {style.stylistName}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {style.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-ocean-blue-100 text-ocean-blue-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {style.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{style.tags.length - 3}
                            </span>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-500 mb-3 break-all">
                          {style.src}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/styles/${style.id}/edit`}
                            className="flex-1 text-center bg-ocean-blue-600 text-white py-2 px-3 rounded-md text-sm hover:bg-ocean-blue-700 transition-colors"
                          >
                            編集
                          </Link>
                          <button
                            onClick={() => handleDelete(style.id)}
                            className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md text-sm hover:bg-red-700 transition-colors"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">スタイルが見つかりませんでした</h3>
                  <p className="text-gray-600 mb-4">検索条件を変更してお試しください</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all')
                      setSearchTerm('')
                    }}
                    className="bg-ocean-blue-600 text-white px-4 py-2 rounded-md hover:bg-ocean-blue-700 transition-colors"
                  >
                    フィルターをリセット
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}