'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { MenuItem } from '@/types'



export default function MenuPage() {
  const [menuData, setMenuData] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/menu')
        if (response.ok) {
          const data = await response.json()
          setMenuData(data)
        }
      } catch (error) {
        console.error('Error fetching menu:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
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

  const categories = Array.from(new Set(menuData.map(item => item.category)))

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              メニュー・料金
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              豊富なメニューからお客様のご要望に合わせて最適なプランをご提案いたします。
              すべての料金は税込価格です。
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-12">
            {categories.map((category) => {
              const categoryItems = menuData.filter(item => item.category === category)
              
              return (
                <section key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Category Header */}
                  <div className="bg-ocean-blue-600 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">{category}</h2>
                  </div>

                  {/* Menu Items */}
                  <div className="p-6">
                    <div className="grid gap-6">
                      {categoryItems.map((item) => (
                        <div key={item.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-ocean-blue-300 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                              {item.isPopular && (
                                <span className="ml-3 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                  人気
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3">{item.description}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>約{item.duration}分</span>
                            </div>
                            
                            {/* Options */}
                            {item.options && item.options.length > 0 && (
                              <div className="mt-3">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">オプション:</h4>
                                <div className="space-y-1">
                                  {item.options.map((option, index) => (
                                    <div key={index} className="flex justify-between text-sm text-gray-600">
                                      <span>+ {option.name}</span>
                                      <span>+¥{option.additionalPrice.toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="ml-6 text-right">
                            <div className="text-2xl font-bold text-ocean-blue-600">
                              ¥{item.price.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">税込</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )
            })}
          </div>

          {/* Notes */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">ご利用にあたって</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">予約について</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• お電話またはオンラインでご予約を承っております</li>
                  <li>• スタイリスト指名の場合は追加料金はかかりません</li>
                  <li>• 当日キャンセルの場合はキャンセル料が発生する場合があります</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">お支払いについて</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 現金、各種クレジットカード、電子マネーがご利用いただけます</li>
                  <li>• 学生割引は学生証の提示が必要です</li>
                  <li>• 初回来店の方は10%割引いたします</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button className="btn-primary text-lg px-8 py-4 mr-4">
              電話で予約する
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              オンライン予約
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}