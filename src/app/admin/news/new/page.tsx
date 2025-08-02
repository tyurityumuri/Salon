'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewNewsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    date: new Date().toISOString().split('T')[0], // 今日の日付をデフォルト
    image: ''
  })

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    } else {
      router.push('/admin')
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newId = Date.now().toString()
    
    const newNews = {
      id: newId,
      title: formData.title,
      content: formData.content,
      category: formData.category,
      date: formData.date,
      image: formData.image || undefined
    }

    console.log('新しいニュース:', newNews)
    alert('ニュースが追加されました。\n※実際の実装では自動でJSONファイルが更新されます。')
    router.push('/admin/news')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/admin/news" className="text-ocean-blue-600 hover:text-ocean-blue-700 mr-4">
              ← ニュース一覧
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">新しいニュースを追加</h1>
              <p className="text-gray-600">ニュース情報を入力してください</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  ニュース情報
                </h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      タイトル *
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                      placeholder="春の新メニューキャンペーン開始"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      カテゴリ *
                    </label>
                    <select
                      name="category"
                      id="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                    >
                      <option value="">選択してください</option>
                      <option value="campaign">キャンペーン</option>
                      <option value="event">イベント</option>
                      <option value="notice">お知らせ</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      公開日 *
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      内容 *
                    </label>
                    <textarea
                      name="content"
                      id="content"
                      required
                      rows={8}
                      value={formData.content}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                      placeholder="この度、長瀬サロンでは春の新メニューキャンペーンを開始いたします。期間限定で特別価格にてご提供いたします..."
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                      画像URL（任意）
                    </label>
                    <input
                      type="url"
                      name="image"
                      id="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex">
                        <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium">S3画像管理について</p>
                          <p className="mt-1">
                            将来的にはS3から画像を管理できるようになります。
                            現在は外部の画像URLを使用してください。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* プレビュー */}
            {(formData.title || formData.content) && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    プレビュー
                  </h3>
                  
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center mb-3">
                      {formData.category && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full mr-3 ${
                          formData.category === 'campaign' ? 'bg-orange-100 text-orange-700' :
                          formData.category === 'event' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {formData.category === 'campaign' ? 'キャンペーン' :
                           formData.category === 'event' ? 'イベント' : 'お知らせ'}
                        </span>
                      )}
                      {formData.date && (
                        <span className="text-sm text-gray-500">
                          {new Date(formData.date).toLocaleDateString('ja-JP')}
                        </span>
                      )}
                    </div>
                    
                    {formData.title && (
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {formData.title}
                      </h4>
                    )}
                    
                    {formData.content && (
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                        {formData.content}
                      </p>
                    )}
                    
                    {formData.image && (
                      <div className="mt-3 text-xs text-gray-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        画像: {formData.image}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 送信ボタン */}
            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/news"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue-500"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                className="bg-ocean-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-ocean-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue-500"
              >
                ニュースを追加
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}