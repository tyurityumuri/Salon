'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import MasonryGrid from '@/components/MasonryGrid'

interface StyleItem {
  id: string
  src: string
  alt: string
  category: string
  tags: string[]
  stylistName: string
  height: number
}



export default function StylesPage() {
  const [stylesData, setStylesData] = useState<StyleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await fetch('/api/styles')
        if (response.ok) {
          const data = await response.json()
          setStylesData(data)
        }
      } catch (error) {
        console.error('Error fetching styles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStyles()
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </Layout>
    )
  }

  const categories = ['all', ...Array.from(new Set(stylesData.map(item => item.category)))]

  const filteredStyles = stylesData.filter(style => {
    const matchesCategory = selectedCategory === 'all' || style.category === selectedCategory
    const matchesSearch = style.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         style.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         style.stylistName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              スタイルギャラリー
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              当サロンの実績とスタイリストの技術をご覧ください。
              お気に入りのスタイルが見つかったら、担当スタイリストを指名してご予約いただけます。
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
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

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedCategory === category
                        ? 'bg-ocean-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'すべて' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              {filteredStyles.length}件のスタイルが見つかりました
              {selectedCategory !== 'all' && ` (${selectedCategory})`}
              {searchTerm && ` - 検索: "${searchTerm}"`}
            </div>
          </div>

          {/* Masonry Grid */}
          {filteredStyles.length > 0 ? (
            <div className="mb-12">
              <MasonryGrid 
                items={filteredStyles.map(style => ({
                  ...style,
                  url: style.src,
                  stylistId: style.id,
                  width: 300,
                  description: style.alt
                }))} 
                columns={3}
              />
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.044-5.709-2.573M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">スタイルが見つかりませんでした</h3>
              <p className="text-gray-600 mb-4">検索条件を変更してお試しください</p>
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchTerm('')
                }}
                className="btn-secondary"
              >
                フィルターをリセット
              </button>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-ocean-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              お気に入りのスタイルは見つかりましたか？
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              スタイリストを指名してご予約いただけます。
              ご相談やカウンセリングも承っております。
            </p>
            <div className="space-x-4">
              <button className="btn-primary">
                電話で予約する
              </button>
              <button className="btn-secondary">
                スタイリスト一覧を見る
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}