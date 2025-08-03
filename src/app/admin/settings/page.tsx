'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import ImageUpload from '@/components/ImageUpload'

interface SalonSettings {
  name: string
  address: string
  phone: string
  email: string
  businessHours: Record<string, { open: string; close: string }>
  closedDays: string[]
  googleMapsUrl: string
  accessInfo: string[]
  parkingInfo: string
  heroImages?: string[]
  heroTitle?: string
  heroSubtitle?: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SalonSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/salon')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/salon', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setMessage('設定を保存しました')
        setTimeout(() => setMessage(''), 3000)
      } else {
        throw new Error('保存に失敗しました')
      }
    } catch (error) {
      setMessage('保存に失敗しました')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">設定データを読み込めませんでした</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">サロン設定</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? '保存中...' : '設定を保存'}
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-md ${message.includes('失敗') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ヒーロー画像設定 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">ヒーロー画像設定</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ヒーロー画像（複数設定可能）
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  複数の画像を設定すると自動でスライドショーになります。画像は4秒ごとに切り替わります。
                </p>
                
                {/* 既存の画像一覧 */}
                {settings.heroImages && settings.heroImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {settings.heroImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`ヒーロー画像 ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = settings.heroImages!.filter((_, i) => i !== index)
                            setSettings(prev => prev ? { ...prev, heroImages: newImages } : null)
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          title="削除"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* 新しい画像をアップロード */}
                <ImageUpload
                  category="styles"
                  onUploadComplete={(imageUrl) => {
                    setSettings(prev => prev ? { 
                      ...prev, 
                      heroImages: [...(prev.heroImages || []), imageUrl] 
                    } : null)
                  }}
                  onUploadError={(error) => {
                    setMessage(error)
                    setTimeout(() => setMessage(''), 3000)
                  }}
                />
              </div>

              <div>
                <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700">
                  ヒーローセクション タイトル
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  現在は「NAGASE」が固定で表示されます。デザイン変更により、このフィールドは参考用です。
                </p>
                <input
                  type="text"
                  id="heroTitle"
                  value={settings.heroTitle || ''}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, heroTitle: e.target.value } : null)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  placeholder="NAGASE（固定表示）"
                  disabled
                />
              </div>

              <div>
                <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700">
                  ヒーローセクション サブタイトル
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  現在のデザインではサブタイトルは表示されません。
                </p>
                <input
                  type="text"
                  id="heroSubtitle"
                  value={settings.heroSubtitle || ''}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, heroSubtitle: e.target.value } : null)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  placeholder="（現在非表示）"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">基本情報</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  サロン名
                </label>
                <input
                  type="text"
                  id="name"
                  value={settings.name}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  住所
                </label>
                <input
                  type="text"
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, address: e.target.value } : null)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  電話番号
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, phone: e.target.value } : null)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="email"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, email: e.target.value } : null)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="googleMapsUrl" className="block text-sm font-medium text-gray-700">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  id="googleMapsUrl"
                  value={settings.googleMapsUrl}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, googleMapsUrl: e.target.value } : null)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="parkingInfo" className="block text-sm font-medium text-gray-700">
                  駐車場情報
                </label>
                <textarea
                  id="parkingInfo"
                  rows={3}
                  value={settings.parkingInfo}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, parkingInfo: e.target.value } : null)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 営業時間設定 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">営業時間</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(settings.businessHours).map(([day, hours]) => (
              <div key={day} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {day}曜日
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={hours.open === '休業日' ? '' : hours.open}
                    onChange={(e) => {
                      const newHours = e.target.value ? { open: e.target.value, close: hours.close === '休業日' ? '18:00' : hours.close } : { open: '休業日', close: '休業日' }
                      setSettings(prev => prev ? {
                        ...prev,
                        businessHours: { ...prev.businessHours, [day]: newHours }
                      } : null)
                    }}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={hours.open === '休業日'}
                  />
                  <input
                    type="time"
                    value={hours.close === '休業日' ? '' : hours.close}
                    onChange={(e) => {
                      const newHours = e.target.value ? { open: hours.open === '休業日' ? '10:00' : hours.open, close: e.target.value } : { open: '休業日', close: '休業日' }
                      setSettings(prev => prev ? {
                        ...prev,
                        businessHours: { ...prev.businessHours, [day]: newHours }
                      } : null)
                    }}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={hours.close === '休業日'}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const isRestDay = hours.open === '休業日'
                    const newHours = isRestDay 
                      ? { open: '10:00', close: '18:00' }
                      : { open: '休業日', close: '休業日' }
                    setSettings(prev => prev ? {
                      ...prev,
                      businessHours: { ...prev.businessHours, [day]: newHours }
                    } : null)
                  }}
                  className={`w-full text-xs py-1 px-2 rounded ${
                    hours.open === '休業日' 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {hours.open === '休業日' ? '営業日にする' : '休業日にする'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* アクセス情報 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">アクセス情報</h2>
          
          <div className="space-y-2">
            {settings.accessInfo.map((info, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={info}
                  onChange={(e) => {
                    const newAccessInfo = [...settings.accessInfo]
                    newAccessInfo[index] = e.target.value
                    setSettings(prev => prev ? { ...prev, accessInfo: newAccessInfo } : null)
                  }}
                  className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="アクセス情報を入力"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newAccessInfo = settings.accessInfo.filter((_, i) => i !== index)
                    setSettings(prev => prev ? { ...prev, accessInfo: newAccessInfo } : null)
                  }}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  削除
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setSettings(prev => prev ? { ...prev, accessInfo: [...prev.accessInfo, ''] } : null)
              }}
              className="mt-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md text-sm"
            >
              + アクセス情報を追加
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}