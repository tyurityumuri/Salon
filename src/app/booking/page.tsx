'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import BookingForm from '@/components/BookingForm'

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

export default function BookingPage() {
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
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ご予約
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ホットペッパービューティーまたはお電話でご予約いただけます。
              詳細なご要望がある場合は詳細予約フォームもご利用ください。
            </p>
          </div>

          {/* Main Booking Options */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* HotPepper Booking */}
              <div className="bg-white rounded-lg shadow-lg p-8 text-center border-2 border-orange-200">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">ホットペッパービューティー</h3>
                <p className="text-gray-600 mb-6">
                  24時間いつでも簡単予約！<br />
                  スタイリスト指名・クーポン利用も可能
                </p>
                <a
                  href="https://beauty.hotpepper.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-orange-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors"
                >
                  ホットペッパーで予約
                </a>
                <div className="mt-4 text-sm text-gray-500">
                  ※外部サイトに移動します
                </div>
              </div>

              {/* Phone Booking */}
              <div className="bg-white rounded-lg shadow-lg p-8 text-center border-2 border-ocean-blue-200">
                <div className="w-16 h-16 bg-ocean-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-ocean-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">お電話で予約</h3>
                <p className="text-gray-600 mb-6">
                  詳しいご相談をしながら<br />
                  最適な施術プランをご提案
                </p>
                <a
                  href={`tel:${salonData?.phone}`}
                  className="inline-block bg-ocean-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-ocean-blue-700 transition-colors"
                >
                  {salonData?.phone}
                </a>
                <div className="mt-4 text-sm text-gray-500">
                  営業時間: 10:00 - 20:00（水曜定休）
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Booking Form Toggle */}
          <div className="text-center mb-8">
            <button
              id="advanced-form-toggle"
              className="text-ocean-blue-600 hover:text-ocean-blue-700 underline"
              onClick={() => {
                const form = document.getElementById('advanced-booking-form');
                const toggle = document.getElementById('advanced-form-toggle');
                if (form && toggle) {
                  if (form.style.display === 'none' || form.style.display === '') {
                    form.style.display = 'block';
                    toggle.textContent = '詳細予約フォームを閉じる';
                  } else {
                    form.style.display = 'none';
                    toggle.textContent = '詳細なご要望がある方はこちら（詳細予約フォーム）';
                  }
                }
              }}
            >
              詳細なご要望がある方はこちら（詳細予約フォーム）
            </button>
          </div>

          {/* Advanced Booking Form (Hidden by default) */}
          <div id="advanced-booking-form" style={{ display: 'none' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">詳細予約フォーム</h2>
              <p className="text-gray-600">
                詳細なご要望やメニューの組み合わせをご希望の場合にご利用ください
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <div className="lg:col-span-2">
                <BookingForm />
              </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">お電話でのご予約</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-ocean-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${salonData?.phone}`} className="text-ocean-blue-600 hover:text-ocean-blue-700 font-medium">
                      {salonData?.phone}
                    </a>
                  </div>
                  <div className="text-sm text-gray-600">
                    お電話でのご予約はより確実です。ご質問もお気軽にどうぞ。
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">営業時間</h3>
                <div className="space-y-2">
                  {Object.entries(salonData?.businessHours || {}).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-gray-700">{day}曜日</span>
                      <span className={hours.open === '休業日' ? 'text-red-600' : 'text-gray-900'}>
                        {hours.open === '休業日' ? '休業日' : `${hours.open}-${hours.close}`}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div className="text-sm text-yellow-800">
                      <div className="font-medium">定休日: {salonData?.closedDays?.join('、')}</div>
                      <div className="mt-1">営業時間外のご予約はオンラインフォームをご利用ください</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">ご予約について</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-ocean-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>オンライン予約は24時間受付可能です</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-ocean-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>スタイリスト指名料は無料です</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-ocean-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>初回ご来店の方は10%割引いたします</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>当日キャンセルの場合、キャンセル料が発生する場合があります</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>ご予約の変更・キャンセルは前日までにご連絡ください</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">お支払い方法</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>現金</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>各種クレジットカード</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>電子マネー</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>QRコード決済</span>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}