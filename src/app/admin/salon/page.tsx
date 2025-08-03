'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
      // 実際の実装では、ここでAPIを呼び出してJSONファイルを更新
      console.log('更新されたサロン情報:', salonInfo)
      
      // 模擬的な保存処理
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('サロン情報が更新されました。\n※実際の実装では自動でJSONファイルが更新されます。')
    } catch (error) {
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