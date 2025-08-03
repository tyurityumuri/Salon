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
    }, 5000) // 5秒ごとにスライド

    return () => clearInterval(interval)
  }, [heroImages.length])

  const hasImages = heroImages.length > 0

  return (
    <section className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden">
      {/* 背景画像 */}
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
          className="text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.3em] opacity-90"
          style={{
            fontFamily: "'Playfair Display', serif",
            textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
            letterSpacing: '0.2em'
          }}
        >
          NAGASE
        </h1>
      </div>

      {/* スライドインジケーター */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white opacity-100 scale-125'
                  : 'bg-white/50 opacity-70 hover:opacity-90'
              }`}
              aria-label={`スライド ${index + 1} に移動`}
            />
          ))}
        </div>
      )}
    </section>
  )
}