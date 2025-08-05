'use client'

import { useState } from 'react'

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
                    ? 'border-ocean-blue-500 text-ocean-blue-600'
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
            <div className="space-y-3">
              {/* URL入力 */}
              <div>
                <label htmlFor={`${angle.key}-url`} className="block text-sm font-medium text-gray-700">
                  {angle.label}画像URL
                </label>
                <input
                  type="url"
                  id={`${angle.key}-url`}
                  value={angle.value}
                  onChange={(e) => onChange(angle.key, e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                  placeholder={`https://example.com/${angle.key}-image.jpg`}
                />
              </div>

              {/* プレビュー */}
              {angle.value && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">プレビュー:</p>
                  <div className="relative w-full max-w-xs mx-auto">
                    <div className="aspect-w-3 aspect-h-4 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={angle.value}
                        alt={`${angle.label}プレビュー`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex items-center justify-center h-full">
                                <p class="text-sm text-gray-500">画像を読み込めませんでした</p>
                              </div>
                            `
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* クリアボタン */}
              {angle.value && (
                <button
                  type="button"
                  onClick={() => onChange(angle.key, '')}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  {angle.label}画像を削除
                </button>
              )}
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