'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'

export default function NewStylistPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    experience: '',
    rating: '',
    reviewCount: '',
    specialties: '',
    instagram: '',
    twitter: '',
    youtube: '',
    image: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    } else {
      router.push('/admin')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const stylistData = {
        name: formData.name,
        position: formData.position,
        bio: formData.bio,
        experience: parseInt(formData.experience),
        rating: parseFloat(formData.rating),
        reviewCount: parseInt(formData.reviewCount),
        specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s),
        social: {
          instagram: formData.instagram || undefined,
          twitter: formData.twitter || undefined,
          youtube: formData.youtube || undefined
        },
        image: formData.image || null
      }

      const response = await fetch('/api/stylists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stylistData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'スタイリストの追加に失敗しました')
      }

      alert('スタイリストが追加されました。')
      router.push('/admin/stylists')
    } catch (error) {
      console.error('Error adding stylist:', error)
      alert(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
            <Link href="/admin/stylists" className="text-ocean-blue-600 hover:text-ocean-blue-700 mr-4">
              ← スタイリスト一覧
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">新しいスタイリストを追加</h1>
              <p className="text-gray-600">スタイリスト情報を入力してください</p>
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
                  基本情報
                </h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      氏名 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                      placeholder="田中 太郎"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                      役職 *
                    </label>
                    <select
                      name="position"
                      id="position"
                      required
                      value={formData.position}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                    >
                      <option value="">選択してください</option>
                      <option value="チーフスタイリスト">チーフスタイリスト</option>
                      <option value="シニアスタイリスト">シニアスタイリスト</option>
                      <option value="スタイリスト">スタイリスト</option>
                      <option value="ジュニアスタイリスト">ジュニアスタイリスト</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                      経験年数 *
                    </label>
                    <input
                      type="number"
                      name="experience"
                      id="experience"
                      required
                      min="0"
                      max="50"
                      value={formData.experience}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                      placeholder="5"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                      評価 (1.0-5.0) *
                    </label>
                    <input
                      type="number"
                      name="rating"
                      id="rating"
                      required
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={formData.rating}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                      placeholder="4.5"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="reviewCount" className="block text-sm font-medium text-gray-700">
                      レビュー数 *
                    </label>
                    <input
                      type="number"
                      name="reviewCount"
                      id="reviewCount"
                      required
                      min="0"
                      value={formData.reviewCount}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                      placeholder="120"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    自己紹介 *
                  </label>
                  <textarea
                    name="bio"
                    id="bio"
                    required
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                    placeholder="お客様の魅力を最大限に引き出すスタイルを提案いたします..."
                  />
                </div>
                
                <div className="mt-6">
                  <label htmlFor="specialties" className="block text-sm font-medium text-gray-700">
                    専門分野 *
                  </label>
                  <input
                    type="text"
                    name="specialties"
                    id="specialties"
                    required
                    value={formData.specialties}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                    placeholder="カット, カラー, パーマ (カンマ区切りで入力)"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    専門分野をカンマ区切りで入力してください（例: カット, カラー, パーマ）
                  </p>
                </div>
              </div>
            </div>

            {/* 画像アップロード */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  プロフィール画像
                </h3>
                <ImageUpload
                  category="stylists"
                  onUploadComplete={(imageUrl) => setFormData(prev => ({ ...prev, image: imageUrl }))}
                  onUploadError={(error) => alert(error)}
                  currentImage={formData.image}
                />
              </div>
            </div>

            {/* SNS情報 */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  SNS情報（任意）
                </h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      id="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      id="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      name="youtube"
                      id="youtube"
                      value={formData.youtube}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                      placeholder="https://youtube.com/channel/..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/stylists"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue-500"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-ocean-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-ocean-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? '追加中...' : 'スタイリストを追加'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}