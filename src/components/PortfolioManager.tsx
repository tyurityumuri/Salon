'use client'

import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'

interface PortfolioItem {
  id: string
  title: string
  description: string
  image: string
  sideImage?: string
  backImage?: string
  category?: string
  tags?: string[]
}

interface PortfolioManagerProps {
  portfolio: PortfolioItem[]
  onChange: (portfolio: PortfolioItem[]) => void
}

export default function PortfolioManager({ portfolio, onChange }: PortfolioManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)

  const addNewItem = () => {
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      image: '',
      sideImage: '',
      backImage: '',
      category: 'スタイル',
      tags: []
    }
    setEditingItem(newItem)
    setEditingIndex(portfolio.length)
  }

  const editItem = (index: number) => {
    setEditingIndex(index)
    setEditingItem({ ...portfolio[index] })
  }

  const saveItem = () => {
    if (editingItem && editingIndex !== null) {
      const newPortfolio = [...portfolio]
      if (editingIndex >= portfolio.length) {
        newPortfolio.push(editingItem)
      } else {
        newPortfolio[editingIndex] = editingItem
      }
      onChange(newPortfolio)
      setEditingIndex(null)
      setEditingItem(null)
    }
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditingItem(null)
  }

  const deleteItem = (index: number) => {
    if (confirm('この作品を削除しますか？')) {
      const newPortfolio = portfolio.filter((_, i) => i !== index)
      onChange(newPortfolio)
    }
  }

  const handleImageUpload = (imageUrl: string, imageType: 'main' | 'side' | 'back') => {
    if (editingItem) {
      const updatedItem = { ...editingItem }
      if (imageType === 'main') {
        updatedItem.image = imageUrl
      } else if (imageType === 'side') {
        updatedItem.sideImage = imageUrl
      } else if (imageType === 'back') {
        updatedItem.backImage = imageUrl
      }
      setEditingItem(updatedItem)
    }
  }

  const handleTagsChange = (tagsString: string) => {
    if (editingItem) {
      const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag)
      setEditingItem({ ...editingItem, tags })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">ポートフォリオ管理</h3>
        <button
          type="button"
          onClick={addNewItem}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          新しい作品を追加
        </button>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {portfolio.map((item, index) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-square relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="space-x-2">
                  <button
                    onClick={() => editItem(index)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteItem(index)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
              {item.tags && item.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingIndex !== null && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingIndex >= portfolio.length ? '新しい作品を追加' : '作品を編集'}
                </h3>
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      タイトル *
                    </label>
                    <input
                      type="text"
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="スタイル名を入力"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      カテゴリー
                    </label>
                    <select
                      value={editingItem.category || 'スタイル'}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="スタイル">スタイル</option>
                      <option value="カット">カット</option>
                      <option value="カラー">カラー</option>
                      <option value="パーマ">パーマ</option>
                      <option value="セット">セット</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    説明
                  </label>
                  <textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="スタイルの説明を入力"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    タグ (カンマ区切り)
                  </label>
                  <input
                    type="text"
                    value={editingItem.tags?.join(', ') || ''}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例: ショート, 前髪, ナチュラル"
                  />
                </div>

                {/* Image Uploads */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">スタイル画像</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Main Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        メイン画像 *
                      </label>
                      <ImageUpload
                        currentImage={editingItem.image}
                        onImageUpload={(url) => handleImageUpload(url, 'main')}
                        aspectRatio="1:1"
                      />
                    </div>

                    {/* Side Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        横からの画像
                      </label>
                      <ImageUpload
                        currentImage={editingItem.sideImage || ''}
                        onImageUpload={(url) => handleImageUpload(url, 'side')}
                        aspectRatio="1:1"
                      />
                    </div>

                    {/* Back Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        後ろからの画像
                      </label>
                      <ImageUpload
                        currentImage={editingItem.backImage || ''}
                        onImageUpload={(url) => handleImageUpload(url, 'back')}
                        aspectRatio="1:1"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    type="button"
                    onClick={saveItem}
                    disabled={!editingItem.title || !editingItem.image}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    保存
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}