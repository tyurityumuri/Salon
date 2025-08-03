'use client'

import { useEffect, useState } from 'react'

interface SalonData {
  name: string
  heroImages?: string[]
  heroTitle?: string
  heroSubtitle?: string
}

interface HeroSlideshowProps {
  salonData: SalonData | null
}

export default function HeroSlideshow({ salonData }: HeroSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const heroImages = salonData?.heroImages || []

  useEffect(() => {
    if (heroImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 4000) // 4秒ごとにスライド

    return () => clearInterval(interval)
  }, [heroImages.length])

  const hasImages = heroImages.length > 0

  return (
    <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
      {/* 背景画像またはフォールバック */}
      <div className="absolute inset-0">
        {hasImages ? (
          <>
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={image}
                  alt={`Hero Background ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
            ))}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
        )}
      </div>

      {/* NAGASEテキスト - 左上に配置 */}
      <div className="absolute top-8 left-8 z-20">
        <h1 
          className="text-white text-6xl md:text-8xl font-thin tracking-[0.2em] opacity-90"
          style={{
            fontFamily: "'Cinzel', 'Times New Roman', serif",
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          NAGASE
        </h1>
      </div>

      {/* スライドインジケーター */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white opacity-100 scale-110'
                  : 'bg-white/50 opacity-70 hover:opacity-90'
              }`}
              aria-label={`スライド ${index + 1} に移動`}
            />
          ))}
        </div>
      )}

      {/* スクロールダウンインジケーター */}
      <div className="absolute bottom-8 right-8 z-20 animate-float">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse-slow"></div>
        </div>
      </div>
    </section>
  )
}