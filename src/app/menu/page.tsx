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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto mb-4"></div>
            <p className="text-primary-600 font-light tracking-wide">LOADING...</p>
          </div>
        </div>
      </Layout>
    )
  }

  const categories = Array.from(new Set(menuData.map(item => item.category)))

  return (
    <Layout>
      <div className="section-padding bg-secondary-50">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-20">
            {/* <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary-600 mb-4">SERVICE MENU</p> */}
            <h1 className="heading-primary mb-8">
              MENU & PRICE
            </h1>
            <div className="divider mb-8"></div>
            <p className="text-body max-w-3xl mx-auto">
              豊富なメニューからお客様のご要望に合わせて最適なプランをご提案いたします。<br className="hidden md:block" />
              すべての料金は税込価格です。経験豊富なスタイリストが最高品質のサービスを提供いたします。
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-12">
            {categories.map((category) => {
              const categoryItems = menuData.filter(item => item.category === category)
              
              return (
                <section key={category} className="bg-white border border-primary-100 shadow-sm hover:shadow-md transition-shadow duration-500">
                  {/* Category Header */}
                  <div className="bg-primary-900 px-8 py-6">
                    <h2 className="font-heading text-xl font-medium text-white tracking-wide uppercase">{category}</h2>
                  </div>

                  {/* Menu Items */}
                  <div className="p-8">
                    <div className="space-y-6">
                      {categoryItems.map((item) => (
                        <div key={item.id} className="flex items-start justify-between p-6 border border-primary-100 hover:border-accent-300 hover:shadow-sm transition-all duration-300 group">
                          <div className="flex-1">
                            <div className="flex items-center mb-3">
                              <h3 className="font-heading text-lg font-medium text-primary-900 group-hover:text-accent-600 transition-colors duration-300">{item.name}</h3>
                              {item.isPopular && (
                                <span className="ml-4 px-3 py-1 bg-accent-50 text-accent-700 text-xs font-medium tracking-wide uppercase">
                                  POPULAR
                                </span>
                              )}
                            </div>
                            <p className="text-primary-600 mb-4 leading-relaxed">{item.description}</p>
                            <div className="flex items-center text-sm text-primary-500">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="tracking-wide">{item.duration} MIN</span>
                            </div>
                            
                            {/* Options */}
                            {item.options && item.options.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-primary-100">
                                <h4 className="text-xs font-medium text-primary-700 mb-3 tracking-wide uppercase">Options:</h4>
                                <div className="space-y-2">
                                  {item.options.map((option, index) => (
                                    <div key={index} className="flex justify-between text-sm text-primary-600">
                                      <span>+ {option.name}</span>
                                      <span className="font-medium">+¥{option.additionalPrice.toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="ml-8 text-right">
                            <div className="text-2xl font-heading font-medium text-primary-900">
                              ¥{item.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-primary-500 tracking-wide">TAX INCLUDED</div>
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
          <div className="mt-20 bg-white border border-primary-100 p-10">
            <div className="text-center mb-8">
              <h3 className="font-heading text-xl font-medium text-primary-900 tracking-wide uppercase">Terms & Conditions</h3>
              <div className="w-16 h-px bg-accent-600 mx-auto mt-4"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h4 className="font-heading font-medium text-primary-900 mb-4 tracking-wide uppercase text-sm">Reservations</h4>
                <ul className="text-sm text-primary-600 space-y-3 leading-relaxed">
                  <li>• お電話またはオンラインでご予約を承っております</li>
                  <li>• スタイリスト指名の場合は追加料金はかかりません</li>
                  <li>• 当日キャンセルの場合はキャンセル料が発生する場合があります</li>
                </ul>
              </div>
              <div>
                <h4 className="font-heading font-medium text-primary-900 mb-4 tracking-wide uppercase text-sm">Payment</h4>
                <ul className="text-sm text-primary-600 space-y-3 leading-relaxed">
                  <li>• 現金、各種クレジットカード、電子マネーがご利用いただけます</li>
                  <li>• 学生割引は学生証の提示が必要です</li>
                  <li>• 初回来店の方は10%割引いたします</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="tel:03-1234-5678"
                className="btn-primary min-w-[200px]"
              >
                CALL FOR BOOKING
              </a>
              <a
                href="https://beauty.hotpepper.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary min-w-[200px]"
              >
                ONLINE BOOKING
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}