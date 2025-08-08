'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { StyleImage } from '@/types'

interface MasonryItem extends Omit<StyleImage, 'width' | 'height'> {
  stylistName: string
  width: number
  height: number
  description: string
}

interface MasonryGridProps {
  items: MasonryItem[]
  columns?: number
  onItemClick?: (item: MasonryItem) => void
}

const MasonryGrid = ({ items, columns = 3, onItemClick }: MasonryGridProps) => {
  const [columnHeights, setColumnHeights] = useState<number[]>([])
  const [positionedItems, setPositionedItems] = useState<Array<MasonryItem & { x: number; y: number; column: number }>>([])
  const [imageLoadStates, setImageLoadStates] = useState<Record<string, 'loading' | 'loaded' | 'error'>>({})
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize loading states for all items
  useEffect(() => {
    const initialStates: Record<string, 'loading' | 'loaded' | 'error'> = {}
    items.forEach(item => {
      initialStates[item.id] = 'loading'
    })
    setImageLoadStates(initialStates)
  }, [items])

  useEffect(() => {
    const calculateLayout = () => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const gap = 16 // gap-4 = 16px
      const columnWidth = (containerWidth - gap * (columns - 1)) / columns

      const heights = new Array(columns).fill(0)
      const positioned = items.map((item) => {
        // Find column with minimum height
        const minHeightIndex = heights.indexOf(Math.min(...heights))
        
        // Calculate aspect ratio and height
        const aspectRatio = item.height / item.width
        const calculatedHeight = columnWidth * aspectRatio

        // Position the item
        const x = minHeightIndex * (columnWidth + gap)
        const y = heights[minHeightIndex]

        // Update column height
        heights[minHeightIndex] += calculatedHeight + gap

        return {
          ...item,
          x,
          y,
          column: minHeightIndex
        }
      })

      setColumnHeights(heights)
      setPositionedItems(positioned)
    }

    calculateLayout()
    window.addEventListener('resize', calculateLayout)
    return () => window.removeEventListener('resize', calculateLayout)
  }, [items, columns])

  const handleImageLoad = (itemId: string) => {
    setImageLoadStates(prev => ({ ...prev, [itemId]: 'loaded' }))
  }

  const handleImageError = (itemId: string) => {
    setImageLoadStates(prev => ({ ...prev, [itemId]: 'error' }))
  }

  const retryImageLoad = (itemId: string) => {
    setImageLoadStates(prev => ({ ...prev, [itemId]: 'loading' }))
    // Force image reload by adding timestamp
    const img = document.querySelector(`[data-image-id="${itemId}"]`) as HTMLImageElement
    if (img) {
      const originalSrc = img.src.split('?')[0]
      img.src = `${originalSrc}?retry=${Date.now()}`
    }
  }

  const maxHeight = Math.max(...columnHeights)

  return (
    <div 
      ref={containerRef} 
      className="relative w-full"
      style={{ height: maxHeight || 'auto' }}
    >
      {positionedItems.map((item) => {
        const loadState = imageLoadStates[item.id] || 'loading'
        
        return (
          <div
            key={item.id}
            className="absolute transition-all duration-300 hover:scale-105 hover:z-10"
            style={{
              left: item.x,
              top: item.y,
              width: `calc((100% - ${16 * (columns - 1)}px) / ${columns})`
            }}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              {/* Style Image */}
              <div 
                className="relative overflow-hidden cursor-pointer"
                style={{ aspectRatio: `${item.width}/${item.height}` }}
                onClick={() => onItemClick?.(item)}
              >
                {/* Loading State */}
                {loadState === 'loading' && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Image */}
                {item.url && (
                  <img
                    data-image-id={item.id}
                    src={item.url}
                    alt={item.alt}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      loadState === 'loaded' ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => handleImageLoad(item.id)}
                    onError={() => handleImageError(item.id)}
                    loading="lazy"
                  />
                )}

                {/* Error State */}
                {loadState === 'error' && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        retryImageLoad(item.id)
                      }}
                      className="text-xs text-gray-600 hover:text-primary-600 underline"
                    >
                      再読み込み
                    </button>
                  </div>
                )}

                {/* No URL State */}
                {!item.url && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center text-white">
                    <h3 className="text-lg font-semibold mb-1">{item.alt}</h3>
                    <p className="text-sm">{item.category}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                  <Link 
                    href={`/stylists/${item.stylistId}`}
                    className="text-xs text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    {item.stylistName}
                  </Link>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{item.alt}</h3>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MasonryGrid