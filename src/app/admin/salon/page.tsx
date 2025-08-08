'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUploadManager from '@/components/admin/ImageUploadManager'

interface SalonInfo {
  name: string
  address: string
  phone: string
  email: string
  businessHours: {
    [key: string]: { open: string; close: string }
  }
  closedDays: string[]
  googleMapsUrl: string
  accessInfo: string[]
  parkingInfo: string
  heroImages?: string[]
  heroImagesMobile?: string[]
  heroTitle?: string
  heroSubtitle?: string
}

export default function AdminSalonPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [salonInfo, setSalonInfo] = useState<SalonInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchSalonInfo()
    } else {
      router.push('/admin')
    }
  }, [router])

  const fetchSalonInfo = async () => {
    try {
      const response = await fetch('/api/salon')
      if (response.ok) {
        const data = await response.json()
        setSalonInfo(data)
      } else {
        console.error('Failed to fetch salon info')
      }
    } catch (error) {
      console.error('Error fetching salon info:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const response = await fetch('/api/salon', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(salonInfo)
      })

      if (!response.ok) {
        throw new Error('保存に失敗しました')
      }

      alert('サロン情報が更新されました。')
    } catch (error) {
      console.error('Error saving salon info:', error)
      alert('保存中にエラーが発生しました。')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSalonInfo(prev => prev ? ({
      ...prev,
      [name]: value
    }) : null)
  }

  const handleBusinessHourChange = (day: string, field: 'open' | 'close', value: string) => {
    setSalonInfo(prev => prev ? ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }) : null)
  }

  const handleAccessInfoChange = (index: number, value: string) => {
    if (!salonInfo) return
    const newAccessInfo = [...salonInfo.accessInfo]
    newAccessInfo[index] = value
    setSalonInfo(prev => prev ? ({
      ...prev,
      accessInfo: newAccessInfo
    }) : null)
  }

  const addAccessInfo = () => {
    setSalonInfo(prev => prev ? ({
      ...prev,
      accessInfo: [...prev.accessInfo, '']
    }) : null)
  }

  const removeAccessInfo = (index: number) => {
    if (!salonInfo) return
    const newAccessInfo = salonInfo.accessInfo.filter((_, i) => i !== index)
    setSalonInfo(prev => prev ? ({
      ...prev,
      accessInfo: newAccessInfo
    }) : null)
  }

  if (!isAuthenticated || loading || !salonInfo) {
    return <div>Loading...</div>
  }

  const days = ['月', '火', '水', '木', '金', '土', '日']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/admin/dashboard" className="text-ocean-blue-600 hover:text-ocean-blue-700 mr-4">
              ← ダッシュボード
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">サロン情報管理</h1>
              <p className="text-gray-600">基本情報や営業時間を編集できます</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報 */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  基本情報
                </h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      サロン名 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={salonInfo.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      住所 *
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      required
                      value={salonInfo.address}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      電話番号 *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      value={salonInfo.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      メールアドレス *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={salonInfo.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="googleMapsUrl" className="block text-sm font-medium text-gray-700">
                      Google Maps URL
                    </label>
                    <input
                      type="url"
                      name="googleMapsUrl"
                      id="googleMapsUrl"
                      value={salonInfo.googleMapsUrl}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                      placeholder="https://maps.google.com/..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 営業時間 */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  営業時間
                </h3>
                
                <div className="space-y-4">
                  {days.map((day) => (
                    <div key={day} className="flex items-center space-x-4">
                      <div className="w-12 text-sm font-medium text-gray-700">
                        {day}曜日
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="time"
                          value={salonInfo.businessHours[day]?.open === '休業日' ? '' : salonInfo.businessHours[day]?.open || ''}
                          onChange={(e) => handleBusinessHourChange(day, 'open', e.target.value)}
                          className="border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                          disabled={salonInfo.businessHours[day]?.open === '休業日'}
                        />
                        <span className="text-gray-500">〜</span>
                        <input
                          type="time"
                          value={salonInfo.businessHours[day]?.close === '休業日' ? '' : salonInfo.businessHours[day]?.close || ''}
                          onChange={(e) => handleBusinessHourChange(day, 'close', e.target.value)}
                          className="border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                          disabled={salonInfo.businessHours[day]?.close === '休業日'}
                        />
                        <label className="flex items-center ml-4">
                          <input
                            type="checkbox"
                            checked={salonInfo.businessHours[day]?.open === '休業日'}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleBusinessHourChange(day, 'open', '休業日')
                                handleBusinessHourChange(day, 'close', '休業日')
                              } else {
                                handleBusinessHourChange(day, 'open', '10:00')
                                handleBusinessHourChange(day, 'close', '20:00')
                              }
                            }}
                            className="h-4 w-4 text-ocean-blue-600 focus:ring-ocean-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">定休日</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* アクセス情報 */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    アクセス情報
                  </h3>
                  <button
                    type="button"
                    onClick={addAccessInfo}
                    className="bg-ocean-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-ocean-blue-700"
                  >
                    項目を追加
                  </button>
                </div>
                
                <div className="space-y-3">
                  {salonInfo.accessInfo.map((info, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={info}
                        onChange={(e) => handleAccessInfoChange(index, e.target.value)}
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                        placeholder="JR東京駅から徒歩5分"
                      />
                      <button
                        type="button"
                        onClick={() => removeAccessInfo(index)}
                        className="bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <label htmlFor="parkingInfo" className="block text-sm font-medium text-gray-700">
                    駐車場情報
                  </label>
                  <textarea
                    name="parkingInfo"
                    id="parkingInfo"
                    rows={3}
                    value={salonInfo.parkingInfo}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                    placeholder="提携駐車場あり（2時間まで無料）"
                  />
                </div>
              </div>
            </div>

            {/* ヒーロー画像設定 */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="mb-8">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    ヒーロー画像設定
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                    <div className="flex">
                      <svg className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">ヒーロー画像について</p>
                        <p className="mt-1">
                          PC用とスマホ用で異なる画像を設定できます。スマホ用画像が設定されていない場合は、PC用画像が使用されます。
                          5MB以上の画像は自動的に圧縮されます。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PC/スマホ画像管理を2列レイアウトで表示 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* PC用画像 */}
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center mb-4">
                      <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <h4 className="text-lg font-medium text-gray-900">PC・タブレット用</h4>
                    </div>
                    <ImageUploadManager
                      images={salonInfo.heroImages || []}
                      onChange={(images) => {
                        setSalonInfo(prev => prev ? ({ ...prev, heroImages: images }) : null)
                      }}
                      maxImages={3}
                      title=""
                      description="デスクトップ・タブレットで表示される画像（推奨サイズ: 1920x1080px）"
                      folder="hero/web"
                    />
                  </div>

                  {/* スマホ用画像 */}
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-green-200">
                    <div className="flex items-center mb-4">
                      <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
                      </svg>
                      <h4 className="text-lg font-medium text-gray-900">スマートフォン用</h4>
                    </div>
                    <ImageUploadManager
                      images={salonInfo.heroImagesMobile || []}
                      onChange={(images) => {
                        setSalonInfo(prev => prev ? ({ ...prev, heroImagesMobile: images }) : null)
                      }}
                      maxImages={3}
                      title=""
                      description="スマートフォンで表示される画像（推奨サイズ: 768x1024px）"
                      folder="hero/mobile"
                    />
                  </div>
                </div>

                {/* ヒーロータイトル・サブタイトル */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">テキスト設定</h4>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700">
                        ヒーロータイトル
                      </label>
                      <input
                        type="text"
                        name="heroTitle"
                        id="heroTitle"
                        value={salonInfo.heroTitle || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                        placeholder="NAGASE"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700">
                        ヒーローサブタイトル
                      </label>
                      <input
                        type="text"
                        name="heroSubtitle"
                        id="heroSubtitle"
                        value={salonInfo.heroSubtitle || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                        placeholder="Professional Hair Salon"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 保存ボタン */}
            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/dashboard"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue-500"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-ocean-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-ocean-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue-500 disabled:opacity-50"
              >
                {isSaving ? '保存中...' : 'サロン情報を保存'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}