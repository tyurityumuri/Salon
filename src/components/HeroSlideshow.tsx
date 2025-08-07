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
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  // スマホかどうかを判定（User-Agentとウィンドウサイズの両方を考慮）
  useEffect(() => {
    const checkMobile = () => {
      // User-Agentによる判定
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
      
      // 画面幅による判定
      const isMobileWidth = window.innerWidth < 768
      
      // タッチデバイスかどうかの判定
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // いずれかの条件を満たせばモバイルと判定
      setIsMobile(isMobileUA || (isMobileWidth && isTouchDevice))
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 画面サイズに応じて適切な画像配列を選択
  // 初期状態（null）の場合は両方の画像を準備
  const pcImages = salonData?.heroImages || []
  const mobileImages = salonData?.heroImagesMobile || []
  const hasMobileImages = mobileImages.length > 0
  
  // デバッグ情報（開発環境のみ）
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Mobile detection:', {
        isMobile,
        hasMobileImages,
        mobileImagesCount: mobileImages.length,
        pcImagesCount: pcImages.length
      })
    }
  }, [isMobile, hasMobileImages, mobileImages.length, pcImages.length])

  // モバイル判定が完了するまではPC画像を使用（フォールバック）
  const heroImages = isMobile === null 
    ? pcImages // 初期状態
    : isMobile && hasMobileImages 
      ? mobileImages 
      : pcImages

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
        {(pcImages.length > 0 || mobileImages.length > 0) ? (
          <>
            {/* PC用画像（デスクトップで表示） */}
            {pcImages.length > 0 && (
              <div className="hidden md:block absolute inset-0">
                {pcImages.map((image, index) => (
                  <div
                    key={`pc-${index}`}
                    className={`absolute inset-0 transition-all duration-2000 ease-in-out ${
                      index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
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
            {hasMobileImages ? (
              <div className="md:hidden absolute inset-0">
                {mobileImages.map((image, index) => (
                  <div
                    key={`mobile-${index}`}
                    className={`absolute inset-0 transition-all duration-2000 ease-in-out ${
                      index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Hero Background Mobile ${index + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            ) : (
              // モバイル画像がない場合はPC画像を表示
              <div className="md:hidden absolute inset-0">
                {pcImages.map((image, index) => (
                  <div
                    key={`pc-mobile-${index}`}
                    className={`absolute inset-0 transition-all duration-2000 ease-in-out ${
                      index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Hero Background ${index + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            )}
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
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {/* PC用インジケーター */}
          <div className="hidden md:flex space-x-3">
            {pcImages.map((_, index) => (
              <button
                key={`pc-indicator-${index}`}
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
          
          {/* モバイル用インジケーター */}
          <div className="flex md:hidden space-x-3">
            {(hasMobileImages ? mobileImages : pcImages).map((_, index) => (
              <button
                key={`mobile-indicator-${index}`}
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