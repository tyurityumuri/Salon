'use client'

import { useState, useCallback } from 'react'
import CompressedImageUpload from '@/components/common/CompressedImageUpload'

interface ImageUploadManagerProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  title: string
  description?: string
  acceptedTypes?: string[]
  folder?: string
}

export default function ImageUploadManager({
  images,
  onChange,
  maxImages = 3,
  title,
  description,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  folder = 'general'
}: ImageUploadManagerProps) {
  const [currentImages, setCurrentImages] = useState<string[]>(images)

  const handleImageUpload = useCallback((index: number) => (url: string) => {
    const newImages = [...currentImages]
    
    if (url) {
      // 新しい画像を追加または既存の画像を更新
      if (index < newImages.length) {
        newImages[index] = url
      } else {
        newImages.push(url)
      }
    } else {
      // 画像を削除
      newImages.splice(index, 1)
    }
    
    setCurrentImages(newImages)
    onChange(newImages)
  }, [currentImages, onChange])

  const handleRemoveImage = useCallback((index: number) => {
    const newImages = currentImages.filter((_, i) => i !== index)
    setCurrentImages(newImages)
    onChange(newImages)
  }, [currentImages, onChange])

  // 空のスロット数を計算
  const emptySlots = Math.max(0, maxImages - currentImages.length)
  const canAddMore = currentImages.length < maxImages

  return (
    <div className="space-y-6">
      {/* タイトルと説明 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
        <div className="mt-2 text-sm text-gray-500">
          現在の画像数: {currentImages.length} / {maxImages}
        </div>
      </div>

      {/* 既存の画像 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentImages.map((imageUrl, index) => (
          <div key={index} className="relative">
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                画像 {index + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                削除
              </button>
            </div>
            <CompressedImageUpload
              category="salon"
              folder={folder}
              onUploadComplete={handleImageUpload(index)}
              currentImage={imageUrl}
              acceptedTypes={acceptedTypes}
              label={`画像 ${index + 1} を変更`}
              description="画像を変更するにはクリックしてください"
            />
          </div>
        ))}

        {/* 新しい画像を追加するためのスロット */}
        {canAddMore && Array.from({ length: Math.min(emptySlots, 1) }, (_, index) => (
          <div key={`new-${index}`}>
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">
                新しい画像を追加
              </span>
            </div>
            <CompressedImageUpload
              category="salon"
              folder={folder}
              onUploadComplete={handleImageUpload(currentImages.length)}
              acceptedTypes={acceptedTypes}
              label="画像を追加"
              description="新しい画像をアップロードしてください"
            />
          </div>
        ))}
      </div>

      {/* 情報メッセージ */}
      {currentImages.length >= maxImages && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="text-sm text-yellow-800">
              <p className="font-medium">最大画像数に達しました</p>
              <p className="mt-1">
                現在{maxImages}枚の画像がアップロードされています。追加で画像をアップロードするには、まず既存の画像を削除してください。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 使用方法の説明 */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium">画像アップロードについて</p>
            <ul className="mt-1 space-y-1">
              <li>• 対応形式: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}</li>
              <li>• 画像は自動的に圧縮され、最適化されます</li>
              <li>• ドラッグ&ドロップでもアップロード可能です</li>
              <li>• 最大{maxImages}枚まで設定可能です</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}