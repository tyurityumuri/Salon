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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto mb-4"></div>
            <p className="text-primary-600 font-light tracking-wide">LOADING...</p>
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
      <div className="section-padding bg-secondary-50">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary-600 mb-4">STYLE SHOWCASE</p>
            <h1 className="heading-primary mb-8">
              STYLE GALLERY
            </h1>
            <div className="divider mb-8"></div>
            <p className="text-body max-w-3xl mx-auto">
              当サロンの実績とスタイリストの技術をご覧ください。<br className="hidden md:block" />
              お気に入りのスタイルが見つかったら、担当スタイリストを指名してご予約いただけます。
            </p>
          </div>

          {/* Filters */}
          <div className="mb-12">
            <div className="bg-white border border-primary-100 p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="SEARCH STYLES..."
                    className="w-full pl-12 pr-4 py-3 border border-primary-200 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 font-light tracking-wide text-sm uppercase"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 text-xs font-medium tracking-wide uppercase transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-primary-900 text-white'
                          : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200'
                      }`}
                    >
                      {category === 'all' ? 'ALL STYLES' : category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-xs text-primary-500 tracking-wide uppercase">
                {filteredStyles.length} STYLES FOUND
                {selectedCategory !== 'all' && ` IN ${selectedCategory}`}
                {searchTerm && ` FOR "${searchTerm}"`}
              </div>
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
            <div className="text-center py-20 bg-white border border-primary-100">
              <svg className="w-16 h-16 text-primary-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.044-5.709-2.573M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <h3 className="font-heading text-lg font-medium text-primary-900 mb-3 tracking-wide">NO STYLES FOUND</h3>
              <p className="text-primary-600 mb-6">検索条件を変更してお試しください</p>
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchTerm('')
                }}
                className="btn-secondary"
              >
                RESET FILTERS
              </button>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-white border border-primary-100 p-10 text-center mt-12">
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary-600 mb-4">READY TO TRANSFORM?</p>
            <h2 className="font-heading text-2xl font-medium text-primary-900 mb-6 tracking-wide">
              お気に入りのスタイルは見つかりましたか？
            </h2>
            <div className="w-16 h-px bg-accent-600 mx-auto mb-6"></div>
            <p className="text-body mb-8 max-w-2xl mx-auto">
              スタイリストを指名してご予約いただけます。<br className="hidden md:block" />
              ご相談やカウンセリングも承っております。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="tel:03-1234-5678"
                className="btn-primary min-w-[200px]"
              >
                CALL FOR BOOKING
              </a>
              <a
                href="/stylists"
                className="btn-secondary min-w-[200px]"
              >
                VIEW STYLISTS
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}