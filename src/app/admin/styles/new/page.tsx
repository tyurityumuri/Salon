'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Stylist } from '@/types'

export default function NewStylePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stylists, setStylists] = useState<Stylist[]>([])
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    src: '',
    alt: '',
    category: '',
    tags: '',
    stylistName: '',
    height: '400'
  })

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchStylists()
    } else {
      router.push('/admin')
    }
  }, [router])

  const fetchStylists = async () => {
    try {
      const response = await fetch('/api/stylists')
      if (response.ok) {
        const data = await response.json()
        setStylists(data)
      } else {
        console.error('Failed to fetch stylists')
      }
    } catch (error) {
      console.error('Error fetching stylists:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newId = Date.now().toString()
    
    const newStyle = {
      id: newId,
      src: formData.src,
      alt: formData.alt,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      stylistName: formData.stylistName,
      height: parseInt(formData.height)
    }

    console.log('新しいスタイル:', newStyle)
    alert('スタイルが追加されました。\n※実際の実装では自動でJSONファイルが更新されます。')
    router.push('/admin/styles')
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
            <Link href="/admin/styles" className="text-ocean-blue-600 hover:text-ocean-blue-700 mr-4">
              ← スタイル一覧
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">新しいスタイルを追加</h1>
              <p className="text-gray-600">スタイル情報を入力してください</p>
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
                  スタイル情報
                </h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="src" className="block text-sm font-medium text-gray-700">
                      画像URL *
                    </label>
                    <input
                      type="url"
                      name="src"
                      id="src"
                      required
                      value={formData.src}
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
                            将来的にはS3から画像をアップロード・管理できるようになります。
                            現在は外部の画像URLを使用してください。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="alt" className="block text-sm font-medium text-gray-700">
                      スタイル名・説明 *
                    </label>
                    <input
                      type="text"
                      name="alt"
                      id="alt"
                      required
                      value={formData.alt}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                      placeholder="ナチュラルマッシュボブ"
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
                      <option value="ショート">ショート</option>
                      <option value="ボブ">ボブ</option>
                      <option value="ミディアム">ミディアム</option>
                      <option value="ロング">ロング</option>
                      <option value="メンズ">メンズ</option>
                      <option value="カラー">カラー</option>
                      <option value="パーマ">パーマ</option>
                      <option value="その他">その他</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="stylistName" className="block text-sm font-medium text-gray-700">
                      担当スタイリスト *
                    </label>
                    <select
                      name="stylistName"
                      id="stylistName"
                      required
                      value={formData.stylistName}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                    >
                      <option value="">選択してください</option>
                      {stylists.map((stylist) => (
                        <option key={stylist.id} value={stylist.name}>
                          {stylist.name} ({stylist.position})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                      画像の高さ（px）*
                    </label>
                    <input
                      type="number"
                      name="height"
                      id="height"
                      required
                      min="200"
                      max="800"
                      value={formData.height}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                      placeholder="400"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Masonry レイアウト用の高さです（200-800px推奨）
                    </p>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                      タグ *
                    </label>
                    <input
                      type="text"
                      name="tags"
                      id="tags"
                      required
                      value={formData.tags}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                      placeholder="ナチュラル, 小顔, カジュアル (カンマ区切りで入力)"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      タグをカンマ区切りで入力してください（例: ナチュラル, 小顔, カジュアル）
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* プレビュー */}
            {(formData.alt || formData.category) && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    プレビュー
                  </h3>
                  
                  <div className="max-w-sm mx-auto border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className="bg-gray-200 flex items-center justify-center"
                      style={{ height: `${Math.min(parseInt(formData.height) || 400, 300)}px` }}
                    >
                      {formData.src ? (
                        <div className="text-center">
                          <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs text-gray-500 break-all px-2">{formData.src}</p>
                        </div>
                      ) : (
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        {formData.category && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            {formData.category}
                          </span>
                        )}
                      </div>
                      
                      {formData.alt && (
                        <h4 className="font-medium text-gray-900 mb-2">
                          {formData.alt}
                        </h4>
                      )}
                      
                      {formData.stylistName && (
                        <p className="text-sm text-gray-600 mb-2">
                          スタイリスト: {formData.stylistName}
                        </p>
                      )}
                      
                      {formData.tags && (
                        <div className="flex flex-wrap gap-1">
                          {formData.tags.split(',').map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-ocean-blue-100 text-ocean-blue-700 text-xs rounded-full"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 送信ボタン */}
            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/styles"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue-500"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                className="bg-ocean-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-ocean-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue-500"
              >
                スタイルを追加
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}