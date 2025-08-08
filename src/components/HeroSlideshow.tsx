'use client'

import { useState, useEffect, useMemo } from 'react'
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
  const [currentPCSlide, setCurrentPCSlide] = useState(0)
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0)
  const [isClient, setIsClient] = useState(false)
  
  // クライアントサイドでのマウント確認
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // 画像配列を準備
  const pcImages = useMemo(() => salonData?.heroImages || [], [salonData?.heroImages])
  const mobileImages = useMemo(() => salonData?.heroImagesMobile || [], [salonData?.heroImagesMobile])
  const hasMobileImages = useMemo(() => mobileImages.length > 0, [mobileImages.length])
  
  // デバッグログ
  useEffect(() => {
    if (isClient) {
      console.log('🖼️ HeroSlideshow Debug:')
      console.log('📱 Mobile Detection: CSS media query based')
      console.log('💻 PC Images:', pcImages)
      console.log('📱 Mobile Images:', mobileImages)
      console.log('✅ Has Mobile Images:', hasMobileImages)
      console.log('🔄 Current PC Slide:', currentPCSlide)
      console.log('🔄 Current Mobile Slide:', currentMobileSlide)
      console.log('🎯 Using Images for Mobile:', hasMobileImages ? mobileImages : pcImages)
    }
  }, [isClient, pcImages, mobileImages, hasMobileImages, currentPCSlide, currentMobileSlide])

  // PC用画像のスライドショー
  useEffect(() => {
    if (pcImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentPCSlide((prev) => (prev + 1) % pcImages.length)
    }, 6000) // 6秒ごとにスライド

    return () => clearInterval(interval)
  }, [pcImages.length])

  // モバイル用画像のスライドショー
  useEffect(() => {
    const images = hasMobileImages ? mobileImages : pcImages
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentMobileSlide((prev) => (prev + 1) % images.length)
    }, 6000) // 6秒ごとにスライド

    return () => clearInterval(interval)
  }, [hasMobileImages, mobileImages, pcImages])

  return (
    <>
      <style jsx>{`
        .hero-mobile {
          display: block !important;
        }
        .hero-pc {
          display: none !important;
        }
        @media (min-width: 768px) {
          .hero-mobile {
            display: none !important;
          }
          .hero-pc {
            display: block !important;
          }
        }
      `}</style>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* 背景画像 */}
      <div className="absolute inset-0">
        {(pcImages.length > 0 || mobileImages.length > 0) ? (
          <>
            {/* PC用画像（デスクトップで表示） */}
            {pcImages.length > 0 && (
              <div className="absolute inset-0 hero-pc">
                {pcImages.map((image, index) => (
                  <div
                    key={`pc-${index}`}
                    className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
                      index === currentPCSlide ? 'opacity-100 z-10' : 'opacity-0 z-5'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Hero Background PC ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* モバイル用画像（モバイルで表示） */}
            <div className="absolute inset-0 hero-mobile">
              {(hasMobileImages ? mobileImages : pcImages).map((image, index) => {
                const isActive = index === currentMobileSlide
                return (
                  <div
                    key={`mobile-${index}`}
                    className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
                      isActive ? 'opacity-100 z-20' : 'opacity-0 z-10'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Hero Background Mobile ${index + 1}`}
                      className="w-full h-full object-cover object-center"
                      loading="eager"
                      onLoad={() => console.log(`Mobile image ${index + 1} loaded:`, image)}
                      onError={(e) => console.error(`Mobile image ${index + 1} failed to load:`, image, e)}
                    />
                  </div>
                )
              })}
            </div>
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
      {((pcImages.length > 1) || (mobileImages.length > 1)) && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          {/* PC用インジケーター */}
          <div className="hidden md:flex space-x-3">
            {pcImages.map((_, index) => (
              <button
                key={`pc-indicator-${index}`}
                onClick={() => setCurrentPCSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentPCSlide 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`スライド ${index + 1} を表示`}
              />
            ))}
          </div>
          
          {/* モバイル用インジケーター */}
          <div className="flex md:hidden space-x-3">
            {(hasMobileImages ? mobileImages : pcImages).map((_, index) => (
              <button
                key={`mobile-indicator-${index}`}
                onClick={() => setCurrentMobileSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentMobileSlide 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`スライド ${index + 1} を表示`}
              />
            ))}
          </div>
        </div>
      )}

      {/* スクロールダウンインジケーター */}
      <div className="absolute bottom-8 right-8 text-white/70 animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
    </>
  )
}