'use client'

import { useState } from 'react'
import CompressedImageUpload from '@/components/common/CompressedImageUpload'

interface MultiAngleImageUploadProps {
  frontImage?: string
  sideImage?: string
  backImage?: string
  onChange: (angle: 'front' | 'side' | 'back', url: string) => void
}

export default function MultiAngleImageUpload({
  frontImage = '',
  sideImage = '',
  backImage = '',
  onChange
}: MultiAngleImageUploadProps) {
  const [activeTab, setActiveTab] = useState<'front' | 'side' | 'back'>('front')

  const angles = [
    { key: 'front' as const, label: '正面', value: frontImage },
    { key: 'side' as const, label: '横', value: sideImage },
    { key: 'back' as const, label: '後ろ', value: backImage }
  ]

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          マルチアングル画像（オプション）
        </label>
        
        {/* タブ */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            {angles.map((angle) => (
              <button
                key={angle.key}
                type="button"
                onClick={() => setActiveTab(angle.key)}
                className={`
                  py-2 px-4 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === angle.key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {angle.label}
                {angle.value && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    設定済み
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* コンテンツ */}
        {angles.map((angle) => (
          <div
            key={angle.key}
            className={activeTab === angle.key ? 'block' : 'hidden'}
          >
            <CompressedImageUpload
              category="styles"
              folder={`styles/${angle.key}`}
              onUploadComplete={(url) => onChange(angle.key, url)}
              onUploadError={(error) => console.error(`${angle.label}画像のアップロードエラー:`, error)}
              currentImage={angle.value}
              label={`${angle.label}画像`}
              description={`${angle.label}からのアングルの画像をアップロードしてください。画像は自動的に圧縮されます。`}
              className="mt-4"
            />
            
            {/* 手動URL入力（後方互換性） */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <label htmlFor={`${angle.key}-manual-url`} className="block text-sm font-medium text-gray-700 mb-2">
                または画像URLを直接入力
              </label>
              <input
                type="url"
                id={`${angle.key}-manual-url`}
                value={angle.value}
                onChange={(e) => onChange(angle.key, e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder={`https://example.com/${angle.key}-image.jpg`}
              />
              <p className="mt-1 text-xs text-gray-500">
                外部URLを使用する場合は、こちらに直接入力することもできます
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium">マルチアングル画像について</p>
            <p className="mt-1">
              正面・横・後ろの3つの角度から撮影した画像を設定できます。
              設定された画像は、スタイル一覧ページで画像をクリックした際に切り替えて表示されます。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}