'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import stylistsData from '@/data/stylists.json'
import { Stylist } from '@/types'

interface StyleItem {
  id: string
  src: string
  alt: string
  category: string
  tags: string[]
  stylistName: string
  height: number
}

export default function EditStylePage({ params }: { params: { id: string } }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
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
      fetchStyle()
    } else {
      router.push('/admin')
    }
  }, [router, params.id])

  const fetchStyle = async () => {
    try {
      const response = await fetch(`/api/styles/${params.id}`)
      if (response.ok) {
        const style: StyleItem = await response.json()
        setFormData({
          src: style.src,
          alt: style.alt,
          category: style.category,
          tags: style.tags.join(', '),
          stylistName: style.stylistName,
          height: style.height.toString()
        })
      } else {
        alert('スタイルが見つかりません')
        router.push('/admin/styles')
      }
    } catch (error) {
      console.error('Error fetching style:', error)
      alert('データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const updateData = {
        src: formData.src,
        alt: formData.alt,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        stylistName: formData.stylistName,
        height: parseInt(formData.height)
      }

      const response = await fetch(`/api/styles/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'スタイルの更新に失敗しました')
      }

      alert('スタイルが更新されました。')
      router.push('/admin/styles')
    } catch (error) {
      console.error('Error updating style:', error)
      alert(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  if (!isAuthenticated || loading) {
    return <div>Loading...</div>
  }

  const stylists = stylistsData as Stylist[]

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
              <h1 className="text-3xl font-bold text-gray-900">スタイルを編集</h1>
              <p className="text-gray-600">スタイル情報を更新してください</p>
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

            {/* 画像アップロード */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  スタイル画像 *
                </h3>
                <ImageUpload
                  category="styles"
                  onUploadComplete={(imageUrl) => setFormData(prev => ({ ...prev, src: imageUrl }))}
                  onUploadError={(error) => alert(error)}
                  currentImage={formData.src}
                />
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
                disabled={isSubmitting}
                className="bg-ocean-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-ocean-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? '更新中...' : 'スタイルを更新'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}