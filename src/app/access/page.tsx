'use client'

import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'

interface SalonInfo {
  name: string
  address: string
  phone: string
  email: string
  businessHours: Record<string, { open: string; close: string }>
  closedDays: string[]
  googleMapsUrl: string
  accessInfo: string[]
  parkingInfo: string
}

export default function AccessPage() {
  const [salonData, setSalonData] = useState<SalonInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        const response = await fetch('/api/salon')
        if (response.ok) {
          const data = await response.json()
          setSalonData(data)
        }
      } catch (error) {
        console.error('Error fetching salon data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSalonData()
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

  if (!salonData) {
    return <Layout><div>Error loading salon data</div></Layout>
  }
  return (
    <Layout>
      <div className="section-padding">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              アクセス
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              東京駅からアクセス抜群の立地にあります。お気軽にお越しください。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Map */}
            <div>
              <div className="bg-gray-200 rounded-lg overflow-hidden h-96 mb-6">
                {/* Google Maps Placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600">Google Mapsを埋め込み予定</p>
                  </div>
                </div>
              </div>

              {/* Access Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">電車でのアクセス</h3>
                <div className="space-y-3">
                  {salonData?.accessInfo?.map((info, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-ocean-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{info}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">店舗情報</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-ocean-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900">住所</div>
                        <div className="text-gray-600">{salonData?.address}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-ocean-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900">電話番号</div>
                        <div className="text-gray-600">
                          <a href={`tel:${salonData?.phone}`} className="text-ocean-blue-600 hover:text-ocean-blue-700">
                            {salonData?.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-ocean-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900">メール</div>
                        <div className="text-gray-600">
                          <a href={`mailto:${salonData?.email}`} className="text-ocean-blue-600 hover:text-ocean-blue-700">
                            {salonData?.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">営業時間</h3>
                <div className="space-y-2">
                  {Object.entries(salonData?.businessHours || {}).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-900">{day}曜日</span>
                      <span className={`${hours.open === '休業日' ? 'text-red-600' : 'text-gray-600'}`}>
                        {hours.open === '休業日' ? '休業日' : `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-sm text-red-700 font-medium">
                      定休日: {salonData?.closedDays?.join('、')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Parking Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">駐車場情報</h3>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-ocean-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <div className="font-medium text-gray-900 mb-1">駐車場</div>
                    <div className="text-gray-600">{salonData?.parkingInfo}</div>
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="bg-ocean-blue-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">ご予約・お問い合わせ</h3>
                <div className="space-y-3">
                  <a
                    href={`tel:${salonData?.phone}`}
                    className="block btn-primary py-3"
                  >
                    電話で予約する
                  </a>
                  <button className="block w-full btn-secondary py-3">
                    オンライン予約
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  お気軽にお電話ください<br />
                  営業時間内にお電話いただければスムーズです
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}