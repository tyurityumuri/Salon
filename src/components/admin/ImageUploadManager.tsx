'use client'

import { useState, useCallback } from 'react'
import imageCompression from 'browser-image-compression'

interface ImageItem {
  id: string
  url: string
  file?: File
  isUploading?: boolean
}

interface ImageUploadManagerProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  title: string
  description?: string
  acceptedTypes?: string[]
}

export default function ImageUploadManager({
  images,
  onChange,
  maxImages = 3,
  title,
  description,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}: ImageUploadManagerProps) {
  const [imageItems, setImageItems] = useState<ImageItem[]>(() => 
    images.map((url, index) => ({ id: `existing-${index}`, url }))
  )
  const [dragOver, setDragOver] = useState(false)
  const [messages, setMessages] = useState<{ type: 'success' | 'error' | 'info', text: string }[]>([])

  const addMessage = useCallback((type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now()
    setMessages(prev => [...prev, { type, text }])
    setTimeout(() => {
      setMessages(prev => prev.filter((_, i) => prev[i] !== prev.find(m => m.text === text)))
    }, 5000)
  }, [])

  const compressImage = useCallback(async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: file.type
    }

    try {
      const compressedFile = await imageCompression(file, options)
      
      // 5MB以上だった場合の通知
      if (file.size > 5 * 1024 * 1024) {
        addMessage('info', '画像ファイルを圧縮して5MB以下に調整しました')
      }
      
      return compressedFile
    } catch (error) {
      console.error('Image compression failed:', error)
      throw new Error('画像の圧縮に失敗しました')
    }
  }, [addMessage])

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'hero')

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'アップロードに失敗しました')
    }

    const data = await response.json()
    return data.url
  }

  const handleFileSelect = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const remainingSlots = maxImages - imageItems.length

    if (fileArray.length > remainingSlots) {
      addMessage('error', `最大${maxImages}枚まで追加できます`)
      return
    }

    for (const file of fileArray) {
      // ファイルタイプチェック
      if (!acceptedTypes.includes(file.type)) {
        addMessage('error', `${file.name}: サポートされていないファイル形式です`)
        continue
      }

      // 仮のアイテムを追加（アップロード中表示用）
      const tempId = `temp-${Date.now()}-${Math.random()}`
      const tempItem: ImageItem = {
        id: tempId,
        url: URL.createObjectURL(file),
        file,
        isUploading: true
      }

      setImageItems(prev => [...prev, tempItem])

      try {
        // 画像圧縮
        const compressedFile = await compressImage(file)
        
        // アップロード
        const uploadedUrl = await uploadImage(compressedFile)
        
        // 成功時の更新
        setImageItems(prev => prev.map(item => 
          item.id === tempId 
            ? { ...item, url: uploadedUrl, isUploading: false }
            : item
        ))
        
        addMessage('success', '画像をアップロードしました')
      } catch (error) {
        console.error('Upload failed:', error)
        addMessage('error', `${file.name}: ${error instanceof Error ? error.message : 'アップロードに失敗しました'}`)
        
        // エラー時はアイテムを削除
        setImageItems(prev => prev.filter(item => item.id !== tempId))
      }
    }
  }, [imageItems.length, maxImages, acceptedTypes, addMessage, compressImage])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const removeImage = useCallback((id: string) => {
    setImageItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const moveImage = useCallback((fromIndex: number, toIndex: number) => {
    setImageItems(prev => {
      const newItems = [...prev]
      const [movedItem] = newItems.splice(fromIndex, 1)
      newItems.splice(toIndex, 0, movedItem)
      return newItems
    })
  }, [])

  // 外部への変更通知
  const currentUrls = imageItems.filter(item => !item.isUploading).map(item => item.url)
  if (JSON.stringify(currentUrls) !== JSON.stringify(images)) {
    onChange(currentUrls)
  }

  return (
    <div className="space-y-4">
      {/* タイトルと説明 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        )}
      </div>

      {/* メッセージ表示 */}
      {messages.length > 0 && (
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-md text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : message.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
      )}

      {/* 画像一覧 */}
      {imageItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {imageItems.map((item, index) => (
            <div
              key={item.id}
              className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-video"
            >
              {item.isUploading ? (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    <span className="text-sm text-gray-600">アップロード中...</span>
                  </div>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={`画像 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              
              {!item.isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => removeImage(item.id)}
                      className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors duration-200"
                      title="削除"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* 順序変更ボタン */}
                  <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                    {index > 0 && (
                      <button
                        onClick={() => moveImage(index, index - 1)}
                        className="bg-primary-600 text-white p-1 rounded hover:bg-primary-700 transition-colors duration-200"
                        title="前に移動"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    {index < imageItems.length - 1 && (
                      <button
                        onClick={() => moveImage(index, index + 1)}
                        className="bg-primary-600 text-white p-1 rounded hover:bg-primary-700 transition-colors duration-200"
                        title="後に移動"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* アップロードエリア */}
      {imageItems.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            dragOver
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400'
          }`}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                画像をドラッグ&ドロップ または クリックして選択
              </p>
              <p className="text-sm text-gray-500 mb-4">
                JPEG, PNG, WebP形式対応 / 最大{maxImages}枚 / 5MB以上の画像は自動圧縮されます
              </p>
              
              <label className="inline-block">
                <input
                  type="file"
                  multiple
                  accept={acceptedTypes.join(',')}
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                  className="hidden"
                />
                <span className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200 cursor-pointer inline-block">
                  ファイルを選択
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
      
      {imageItems.length >= maxImages && (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            最大{maxImages}枚の画像が設定済みです。追加するには既存の画像を削除してください。
          </p>
        </div>
      )}
    </div>
  )
}