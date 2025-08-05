'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { StyleImage } from '@/types'

interface StyleGalleryModalProps {
  style: StyleImage
  isOpen: boolean
  onClose: () => void
}

export default function StyleGalleryModal({ style, isOpen, onClose }: StyleGalleryModalProps) {
  const [selectedView, setSelectedView] = useState<'front' | 'side' | 'back'>('front')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const getImageUrl = () => {
    switch (selectedView) {
      case 'front':
        return style.frontImage || style.url
      case 'side':
        return style.sideImage || style.url
      case 'back':
        return style.backImage || style.url
      default:
        return style.url
    }
  }

  const hasMultipleViews = style.frontImage || style.sideImage || style.backImage

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* View Toggle */}
        {hasMultipleViews && (
          <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-1 flex gap-1">
            {style.frontImage && (
              <button
                onClick={() => setSelectedView('front')}
                className={`px-4 py-2 text-xs font-medium transition-colors ${
                  selectedView === 'front'
                    ? 'bg-primary-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                正面
              </button>
            )}
            {style.sideImage && (
              <button
                onClick={() => setSelectedView('side')}
                className={`px-4 py-2 text-xs font-medium transition-colors ${
                  selectedView === 'side'
                    ? 'bg-primary-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                横
              </button>
            )}
            {style.backImage && (
              <button
                onClick={() => setSelectedView('back')}
                className={`px-4 py-2 text-xs font-medium transition-colors ${
                  selectedView === 'back'
                    ? 'bg-primary-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                後ろ
              </button>
            )}
          </div>
        )}

        {/* Image Container */}
        <div className="relative w-full h-full max-h-[80vh]">
          <Image
            src={getImageUrl()}
            alt={style.alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
            priority
          />
        </div>

        {/* Info Section */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <div className="text-white">
            <h3 className="text-xl font-medium mb-2">{style.alt}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm text-xs rounded-full">
                {style.category}
              </span>
              {style.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}