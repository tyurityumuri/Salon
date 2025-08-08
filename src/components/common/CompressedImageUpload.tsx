'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import imageCompression from 'browser-image-compression'

interface CompressedImageUploadProps {
  category: 'stylists' | 'styles' | 'news' | 'salon' | 'general'
  onUploadComplete: (imageUrl: string) => void
  onUploadError?: (error: string) => void
  currentImage?: string
  className?: string
  folder?: string
  label?: string
  description?: string
  acceptedTypes?: string[]
  maxSizeMB?: number
  maxWidthOrHeight?: number
  quality?: number
}

export default function CompressedImageUpload({ 
  category, 
  onUploadComplete, 
  onUploadError,
  currentImage,
  className = '',
  folder,
  label = '画像をアップロード',
  description,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxSizeMB = 5,
  maxWidthOrHeight = 1920,
  quality = 0.8
}: CompressedImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [messages, setMessages] = useState<{ type: 'success' | 'error' | 'info', text: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // currentImageプロパティが変更された際にプレビューを更新
  useEffect(() => {
    console.log('currentImage prop changed:', currentImage)
    setPreview(currentImage || null)
  }, [currentImage])

  const addMessage = useCallback((type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now()
    setMessages(prev => [...prev, { type, text }])
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.text !== text))
    }, 5000)
  }, [])

  const compressImage = useCallback(async (file: File): Promise<File> => {
    // 元のファイル情報を保存
    const originalName = file.name
    const originalType = file.type
    const fileExtension = originalName.split('.').pop()?.toLowerCase() || 'jpg'
    
    // ファイルサイズが小さい場合は圧縮をスキップ
    if (file.size <= maxSizeMB * 1024 * 1024 * 0.8) { // 80%未満の場合はスキップ
      console.log('Skipping compression for small file:', file.size)
      return file
    }
    
    const options = {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker: false, // CSPエラー回避のためWeb Workerを無効化
      fileType: originalType, // 元のファイルタイプを保持
      initialQuality: quality // 品質を調整
    }

    try {
      console.log('Starting compression with options:', options)
      const compressedFile = await imageCompression(file, options)
      
      // 元のファイル情報を保持して新しいFileオブジェクトを作成
      const renamedFile = new File([compressedFile], originalName, {
        type: originalType, // 元のタイプを使用
        lastModified: Date.now()
      })
      
      // 圧縮が行われた場合の通知
      if (file.size > compressedFile.size) {
        const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2)
        const compressedSizeMB = (compressedFile.size / (1024 * 1024)).toFixed(2)
        addMessage('info', `画像を圧縮しました: ${originalSizeMB}MB → ${compressedSizeMB}MB`)
      }
      
      console.log('Compressed file details:', {
        originalName,
        originalType,
        fileExtension,
        originalSize: file.size,
        compressedSize: renamedFile.size,
        compressedType: renamedFile.type
      })
      
      return renamedFile
    } catch (error) {
      console.error('Image compression failed:', error)
      // 圧縮に失敗した場合は元のファイルを返す（フォールバック）
      console.log('Using original file as fallback due to compression error')
      addMessage('info', '画像圧縮に失敗しましたが、元の画像を使用してアップロードを続行します')
      return file
    }
  }, [addMessage, maxSizeMB, maxWidthOrHeight, quality])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('File selected:', {
      name: file.name,
      type: file.type,
      size: file.size,
      acceptedTypes
    })

    // ファイルタイプの検証
    if (!acceptedTypes.includes(file.type)) {
      const errorMessage = `サポートされていないファイル形式です。${acceptedTypes.join(', ')} のみサポートされています。`
      console.error('File type validation failed:', errorMessage)
      onUploadError?.(errorMessage)
      addMessage('error', errorMessage)
      return
    }

    let localPreview: string | null = null

    try {
      setIsUploading(true)

      // プレビュー用のLocal URLを生成
      localPreview = URL.createObjectURL(file)
      setPreview(localPreview)
      console.log('Local preview created:', localPreview)

      // 画像を圧縮
      console.log('Starting image compression...')
      const compressedFile = await compressImage(file)
      console.log('Image compression completed:', {
        originalSize: file.size,
        compressedSize: compressedFile.size
      })

      // アップロード処理
      const formData = new FormData()
      formData.append('file', compressedFile)
      formData.append('folder', folder || category)

      console.log('Starting upload to S3...', {
        folder: folder || category,
        fileName: compressedFile.name
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const responseData = await response.json()
      console.log('Upload response:', {
        status: response.status,
        data: responseData
      })

      if (!response.ok) {
        throw new Error(responseData.error || 'アップロードに失敗しました')
      }

      const { url: publicUrl } = responseData

      // 親コンポーネントに通知
      onUploadComplete(publicUrl)
      addMessage('success', '画像のアップロードが完了しました')

      // プレビューURLをクリーンアップしてS3のURLに置き換え
      if (localPreview) {
        URL.revokeObjectURL(localPreview)
        localPreview = null
      }
      setPreview(publicUrl)
      console.log('Upload completed successfully:', publicUrl)

    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'アップロードに失敗しました'
      onUploadError?.(errorMessage)
      addMessage('error', errorMessage)
      
      // エラー時のクリーンアップ
      if (localPreview) {
        URL.revokeObjectURL(localPreview)
      }
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
    addMessage('info', '画像を削除しました')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (files?.[0]) {
      // ファイル入力をシミュレート
      if (fileInputRef.current) {
        const dt = new DataTransfer()
        dt.items.add(files[0])
        fileInputRef.current.files = dt.files
        handleFileSelect({ target: { files: dt.files } } as any)
      }
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}

      {/* Messages */}
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-3 rounded-md text-sm ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : message.type === 'error'
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}
        >
          {message.text}
        </div>
      ))}

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
            <span className="ml-2 text-sm text-gray-600">アップロード中...</span>
          </div>
        ) : preview ? (
          <div className="space-y-4">
            <div className="relative max-w-xs mx-auto">
              <img
                src={preview}
                alt="プレビュー"
                className="max-w-full max-h-48 mx-auto rounded-lg shadow"
                style={{ display: 'block' }}
                onLoad={(e) => {
                  console.log('Preview image loaded successfully:', preview)
                }}
                onError={(e) => {
                  console.error('Preview image failed to load:', preview)
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    // エラー時の表示を作成
                    const errorDiv = document.createElement('div')
                    errorDiv.className = 'w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center'
                    errorDiv.innerHTML = `
                      <div class="text-center text-gray-500">
                        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p class="text-sm">画像を読み込めませんでした</p>
                      </div>
                    `
                    parent.appendChild(errorDiv)
                  }
                }}
              />
            </div>
            <div className="flex justify-center space-x-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
              >
                変更
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveImage()
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
              >
                削除
              </button>
            </div>
          </div>
        ) : (
          <div>
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-primary-600 hover:text-primary-500">クリック</span>
                または画像をドラッグ&ドロップ
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} - 最大{maxSizeMB}MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}