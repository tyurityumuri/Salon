'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SalonData {
  name?: string
  heroImages?: string[]
  heroImagesMobile?: string[]
  heroTitle?: string
  heroSubtitle?: string
}

interface HeroSlideshowProps {
  salonData: SalonData | null
}

export default function HeroSlideshow({ salonData }: HeroSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // スマホかどうかを判定
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 画面サイズに応じて適切な画像配列を選択
  const heroImages = isMobile 
    ? (salonData?.heroImagesMobile || salonData?.heroImages || [])
    : (salonData?.heroImages || [])

  useEffect(() => {
    if (heroImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 6000) // 6秒ごとにスライド

    return () => clearInterval(interval)
  }, [heroImages.length])

  const hasImages = heroImages.length > 0

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* 背景画像 */}
      <div className="absolute inset-0">
        {hasImages ? (
          <>
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-2000 ease-in-out ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              >
                <img
                  src={image}
                  alt={`Hero Background ${index + 1}`}
                  className={`w-full h-full object-cover ${
                    isMobile ? 'object-center' : 'object-center'
                  }`}
                />
              </div>
            ))}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-100"></div>
        )}
        
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 text-center text-white px-4">
        <div className="max-w-4xl mx-auto">
          {/* サブタイトル */}
          <p className="text-sm md:text-base font-light tracking-[0.3em] uppercase mb-6 text-white/90">
            Professional Hair Salon
          </p>
          
          {/* メインタイトル */}
          <h1 className="heading-primary text-white mb-8 leading-tight">
            {salonData?.heroTitle || 'NAGASE'}
          </h1>
        
          
          
        </div>
      </div>

      {/* スライドインジケーター */}
      {hasImages && heroImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`スライド ${index + 1} を表示`}
            />
          ))}
        </div>
      )}

      {/* スクロールダウンインジケーター */}
      <div className="absolute bottom-8 right-8 text-white/70 animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}