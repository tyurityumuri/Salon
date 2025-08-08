'use client'

import CompressedImageUpload from './common/CompressedImageUpload'

interface ImageUploadProps {
  category: 'stylists' | 'styles' | 'news'
  onUploadComplete: (imageUrl: string) => void
  onUploadError?: (error: string) => void
  currentImage?: string
  className?: string
}

export default function ImageUpload({ 
  category, 
  onUploadComplete, 
  onUploadError,
  currentImage,
  className = ''
}: ImageUploadProps) {
  return (
    <CompressedImageUpload
      category={category}
      onUploadComplete={onUploadComplete}
      onUploadError={onUploadError}
      currentImage={currentImage}
      className={className}
      label="画像をアップロード"
      description="画像は自動的に圧縮され、最適化されます"
    />
  )
}