'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import ScrollAnimation from '@/components/ScrollAnimation'
import HeroSlideshow from '@/components/HeroSlideshow'
import { MenuItem, Stylist } from '@/types'

interface NewsItem {
  id: string
  title: string
  content: string
  category: 'campaign' | 'event' | 'notice'
  date: string
  image?: string
}

interface SalonData {
  name: string
  heroImages?: string[]
  heroTitle?: string
  heroSubtitle?: string
}

export default function Home() {
  const [popularMenus, setPopularMenus] = useState<MenuItem[]>([])
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [salonData, setSalonData] = useState<SalonData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 並列でデータ取得
        const [menuRes, stylistsRes, newsRes, salonRes] = await Promise.all([
          fetch('/api/menu?popular=true'),
          fetch('/api/stylists'),
          fetch('/api/news?limit=3'),
          fetch('/api/salon')
        ])

        if (menuRes.ok) {
          const menuData = await menuRes.json()
          setPopularMenus(menuData.slice(0, 3))
        }

        if (stylistsRes.ok) {
          const stylistsData = await stylistsRes.json()
          setStylists(stylistsData)
        }

        if (newsRes.ok) {
          const newsData = await newsRes.json()
          setNews(newsData)
        }

        if (salonRes.ok) {
          const salonInfo = await salonRes.json()
          setSalonData(salonInfo)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSlideshow salonData={salonData} />

      {/* Introduction Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollAnimation animation="animate-fade-in" delay={200}>
            {/* <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                あなたの魅力を最大限に引き出す
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                長瀬サロンでは、経験豊富なスタイリストがお客様一人ひとりの個性と魅力を活かした
                最適なスタイルをご提案いたします。最新のトレンドと確かな技術で、
                あなたの理想のスタイルを実現します。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <ScrollAnimation animation="animate-bounce-in" delay={400}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-ocean-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:animate-float">
                      <svg className="w-8 h-8 text-ocean-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">豊富な経験</h3>
                    <p className="text-gray-600">経験豊富なスタイリストが技術とセンスでお応えします</p>
                  </div>
                </ScrollAnimation>
                <ScrollAnimation animation="animate-bounce-in" delay={600}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-ocean-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:animate-float">
                      <svg className="w-8 h-8 text-ocean-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">個性を重視</h3>
                    <p className="text-gray-600">お客様の個性と魅力を最大限に引き出すスタイルを提案</p>
                  </div>
                </ScrollAnimation>
                <ScrollAnimation animation="animate-bounce-in" delay={800}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-ocean-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:animate-float">
                      <svg className="w-8 h-8 text-ocean-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">最新技術</h3>
                    <p className="text-gray-600">最新のトレンドと技術で理想のスタイルを実現</p>
                  </div>
                </ScrollAnimation>
              </div> */}
            {/* </div> */}
          </ScrollAnimation>
        </div>
      </section>

      {/* Popular Stylists Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <ScrollAnimation animation="animate-slide-up" delay={200}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                人気スタイリスト
              </h2>
              <p className="text-lg text-gray-600">
                経験豊富なプロフェッショナルが、あなたの魅力を引き出します
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {stylists.slice(0, 3).map((stylist, index) => (
              <ScrollAnimation key={stylist.id} animation="animate-scale-up" delay={400 + index * 200}>
                <Link href={`/stylists/${stylist.id}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group hover:transform hover:scale-105">
                  <div className="relative h-64 overflow-hidden">
                    {stylist.image ? (
                      <img
                        src={stylist.image}
                        alt={stylist.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`absolute inset-0 bg-gradient-to-br from-ocean-blue-100 to-ocean-blue-200 flex items-center justify-center ${stylist.image ? 'hidden' : ''}`}>
                      <div className="w-20 h-20 bg-ocean-blue-300 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-ocean-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{stylist.name}</h3>
                      <span className="text-sm font-medium text-ocean-blue-600">{stylist.position}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{stylist.bio}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">経験 {stylist.experience}年</span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-600">{stylist.rating}</span>
                      </div>
                    </div>
                    </div>
                  </div>
                </Link>
              </ScrollAnimation>
            ))}
          </div>

          <div className="text-center">
            <Link href="/stylists" className="btn-secondary">
              全てのスタイリストを見る
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Menu Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <ScrollAnimation animation="animate-slide-up" delay={200}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                おすすめメニュー
              </h2>
              <p className="text-lg text-gray-600">
                特に人気の高いメニューをご紹介します
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {popularMenus.map((menu, index) => (
              <ScrollAnimation key={menu.id} animation="animate-scale-up" delay={400 + index * 200}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        人気
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {menu.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{menu.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{menu.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>約{menu.duration}分</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-ocean-blue-600">
                          ¥{menu.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">税込</div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <Link 
                        href="/booking"
                        className="block w-full text-center bg-ocean-blue-600 text-white py-2 px-4 rounded-md hover:bg-ocean-blue-700 transition-colors text-sm font-medium"
                      >
                        このメニューで予約
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>

          <div className="text-center">
            <Link href="/menu" className="btn-secondary">
              全てのメニューを見る
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              最新のお知らせ
            </h2>
            <p className="text-lg text-gray-600">
              キャンペーン情報やサロンからのお知らせをお届けします
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.slice(0, 3).map((newsItem) => (
              <article key={newsItem.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
                {newsItem.image && (
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      newsItem.category === 'campaign' ? 'bg-orange-100 text-orange-700' :
                      newsItem.category === 'event' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {newsItem.category === 'campaign' ? 'キャンペーン' :
                       newsItem.category === 'event' ? 'イベント' : 'お知らせ'}
                    </span>
                    <span className="text-sm text-gray-500 ml-auto">
                      {new Date(newsItem.date).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {newsItem.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {newsItem.content}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-ocean-blue-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            今すぐ予約して、新しい自分を発見しよう
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            経験豊富なスタイリストがあなたの魅力を最大限に引き出します。
            お電話またはオンラインで簡単に予約できます。
          </p>
          <div className="space-x-4">
            <a 
              href="tel:03-1234-5678"
              className="bg-white text-ocean-blue-600 px-8 py-4 rounded-md font-medium hover:bg-gray-100 transition-colors text-lg"
            >
              電話で予約
            </a>
            <a
              href="https://beauty.hotpepper.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-4 rounded-md font-medium hover:bg-white hover:text-ocean-blue-600 transition-colors text-lg"
            >
              オンライン予約
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}