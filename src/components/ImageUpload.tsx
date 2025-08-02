'use client'

import { useState, useRef } from 'react'

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
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // ファイルタイプの検証
    if (!file.type.startsWith('image/')) {
      onUploadError?.('画像ファイルを選択してください')
      return
    }

    // ファイルサイズの検証（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      onUploadError?.('ファイルサイズは5MB以下にしてください')
      return
    }

    try {
      setIsUploading(true)

      // プレビュー用のLocal URLを生成
      const localPreview = URL.createObjectURL(file)
      setPreview(localPreview)

      // API経由で署名付きURLを取得
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          category: category
        })
      })

      if (!response.ok) {
        throw new Error('アップロードURL取得に失敗しました')
      }

      const { uploadUrl, publicUrl } = await response.json()

      // S3にファイルをアップロード
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })

      if (!uploadResponse.ok) {
        throw new Error('アップロードに失敗しました')
      }

      // 親コンポーネントに通知
      onUploadComplete(publicUrl)

      // プレビューURLをクリーンアップ
      URL.revokeObjectURL(localPreview)

    } catch (error) {
      console.error('Upload error:', error)
      onUploadError?.(error instanceof Error ? error.message : 'アップロードに失敗しました')
      setPreview(currentImage || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onUploadComplete('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-center w-full">
        <label 
          htmlFor="image-upload" 
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
            isUploading ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          {preview ? (
            <div className="relative w-full h-full">
              <img
                src={preview}
                alt="プレビュー"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <p className="text-white text-sm">クリックして変更</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">クリックしてアップロード</span>
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF (最大5MB)</p>
            </div>
          )}
          <input 
            id="image-upload" 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            ref={fileInputRef}
          />
        </label>
      </div>

      {isUploading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-ocean-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">アップロード中...</span>
        </div>
      )}

      {preview && !isUploading && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleRemoveImage}
            className="px-4 py-2 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
          >
            画像を削除
          </button>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>• 対応フォーマット: JPEG, PNG, GIF</p>
        <p>• 最大ファイルサイズ: 5MB</p>
        <p>• 推奨解像度: 1200×800px以上</p>
      </div>
    </div>
  )
}