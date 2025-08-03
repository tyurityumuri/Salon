'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
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

export default function HomeClient() {
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto mb-4"></div>
            <p className="text-primary-600 font-light tracking-wide">LOADING...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSlideshow salonData={salonData} />

      {/* Popular Stylists Section */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <ScrollAnimation animation="animate-slide-up" delay={200}>
            <div className="text-center mb-16">
              <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary-600 mb-4">PROFESSIONAL TEAM</p>
              <h2 className="heading-secondary mb-6">
                OUR STYLISTS
              </h2>
              <div className="divider"></div>
              <p className="text-body max-w-2xl mx-auto">
                経験豊富なプロフェッショナルが、あなたの魅力を引き出します
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {stylists.slice(0, 3).map((stylist, index) => (
              <ScrollAnimation key={stylist.id} animation="animate-scale-up" delay={400 + index * 200}>
                <Link href={`/stylists/${stylist.id}`}>
                  <div className="bg-white shadow-sm hover:shadow-md transition-all duration-500 group overflow-hidden">
                    <div className="relative h-80 overflow-hidden">
                      {stylist.image ? (
                        <Image
                          src={stylist.image}
                          alt={stylist.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={index < 3}
                        />
                      ) : null}
                      <div className={`absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center ${stylist.image ? 'hidden' : ''}`}>
                        <div className="w-20 h-20 bg-primary-300 rounded-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                        <h3 className="font-heading text-xl font-medium text-white tracking-wide">{stylist.name}</h3>
                        <p className="text-white/80 text-sm font-light tracking-wide uppercase">{stylist.position}</p>
                      </div>
                    </div>
                    <div className="p-6 bg-white">
                      <p className="text-primary-600 text-sm mb-4 leading-relaxed line-clamp-2">{stylist.bio}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-primary-500 tracking-wide uppercase">EXPERIENCE: {stylist.experience} YEARS</span>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-accent-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-primary-600 font-medium">{stylist.rating}</span>
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
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollAnimation animation="animate-slide-up" delay={200}>
            <div className="text-center mb-16">
              <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary-600 mb-4">SIGNATURE SERVICES</p>
              <h2 className="heading-secondary mb-6">
                POPULAR MENU
              </h2>
              <div className="divider"></div>
              <p className="text-body max-w-2xl mx-auto">
                特に人気の高いメニューをご紹介します
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {popularMenus.map((menu, index) => (
              <ScrollAnimation key={menu.id} animation="animate-scale-up" delay={400 + index * 200}>
                <div className="bg-white border border-primary-100 hover:shadow-lg transition-all duration-500 group">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <span className="px-4 py-1 bg-accent-50 text-accent-700 text-xs font-medium tracking-wide uppercase">
                        POPULAR
                      </span>
                      <span className="text-xs text-primary-500 bg-primary-50 px-3 py-1 tracking-wide uppercase">
                        {menu.category}
                      </span>
                    </div>
                    
                    <h3 className="font-heading text-xl font-medium text-primary-900 mb-4 tracking-wide">{menu.name}</h3>
                    <p className="text-primary-600 text-sm mb-6 leading-relaxed">{menu.description}</p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center text-sm text-primary-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="tracking-wide">{menu.duration} MIN</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-heading font-medium text-primary-900">
                          ¥{menu.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-primary-500 tracking-wide">TAX INCLUDED</div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-primary-100">
                      <Link 
                        href="/booking"
                        className="btn-accent w-full text-center"
                      >
                        予約する
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
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary-600 mb-4">LATEST UPDATES</p>
            <h2 className="heading-secondary mb-6">
              NEWS & EVENTS
            </h2>
            <div className="divider"></div>
            <p className="text-body max-w-2xl mx-auto">
              キャンペーン情報やサロンからのお知らせをお届けします
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.slice(0, 3).map((newsItem) => (
              <article key={newsItem.id} className="bg-white border border-primary-100 hover:shadow-lg transition-all duration-500 group">
                {newsItem.image && (
                  <div className="h-48 bg-primary-50 flex items-center justify-center">
                    <svg className="w-12 h-12 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className={`px-3 py-1 text-xs font-medium tracking-wide uppercase ${
                      newsItem.category === 'campaign' ? 'bg-accent-50 text-accent-700' :
                      newsItem.category === 'event' ? 'bg-secondary-100 text-secondary-700' :
                      'bg-primary-50 text-primary-700'
                    }`}>
                      {newsItem.category === 'campaign' ? 'CAMPAIGN' :
                       newsItem.category === 'event' ? 'EVENT' : 'NEWS'}
                    </span>
                    <span className="text-xs text-primary-500 ml-auto tracking-wide">
                      {new Date(newsItem.date).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-medium text-primary-900 mb-3 line-clamp-2 group-hover:text-accent-600 transition-colors duration-300">
                    {newsItem.title}
                  </h3>
                  <p className="text-primary-600 text-sm line-clamp-3 leading-relaxed">
                    {newsItem.content}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-900">
        <div className="container-custom text-center">
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-white/70 mb-4">BOOK YOUR TRANSFORMATION</p>
          <h2 className="font-heading text-3xl md:text-5xl font-light text-white mb-8 tracking-wide leading-tight">
            DISCOVER YOUR<br />
            NEW STYLE TODAY
          </h2>
          <div className="w-24 h-px bg-white/40 mx-auto mb-8"></div>
          <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            経験豊富なスタイリストがあなたの魅力を最大限に引き出します。<br className="hidden md:block" />
            お電話またはオンラインで簡単に予約できます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="tel:03-1234-5678"
              className="bg-white text-primary-900 px-10 py-4 font-medium tracking-wide uppercase text-sm hover:bg-white/90 transition-all duration-300 min-w-[200px]"
            >
              CALL FOR BOOKING
            </a>
            <a
              href="https://beauty.hotpepper.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-10 py-4 font-medium tracking-wide uppercase text-sm hover:bg-white hover:text-primary-900 transition-all duration-300 min-w-[200px]"
            >
              ONLINE BOOKING
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}