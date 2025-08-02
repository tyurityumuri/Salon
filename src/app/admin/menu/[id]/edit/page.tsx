'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MenuItem } from '@/types'

export default function EditMenuPage({ params }: { params: { id: string } }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    duration: '',
    isPopular: false,
    options: [{ name: '', additionalPrice: '' }]
  })

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchMenu()
    } else {
      router.push('/admin')
    }
  }, [router, params.id])

  const fetchMenu = async () => {
    try {
      const response = await fetch(`/api/menu/${params.id}`)
      if (response.ok) {
        const menu: MenuItem = await response.json()
        setFormData({
          name: menu.name,
          category: menu.category,
          description: menu.description,
          price: menu.price.toString(),
          duration: menu.duration.toString(),
          isPopular: menu.isPopular || false,
          options: menu.options && menu.options.length > 0 
            ? menu.options.map(opt => ({ name: opt.name, additionalPrice: opt.additionalPrice.toString() }))
            : [{ name: '', additionalPrice: '' }]
        })
      } else {
        alert('メニューが見つかりません')
        router.push('/admin/menu')
      }
    } catch (error) {
      console.error('Error fetching menu:', error)
      alert('データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const updateData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: parseInt(formData.price),
        duration: parseInt(formData.duration),
        isPopular: formData.isPopular,
        options: formData.options
          .filter(option => option.name && option.additionalPrice)
          .map(option => ({
            name: option.name,
            additionalPrice: parseInt(option.additionalPrice)
          }))
      }

      const response = await fetch(`/api/menu/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'メニューの更新に失敗しました')
      }

      alert('メニューが更新されました。')
      router.push('/admin/menu')
    } catch (error) {
      console.error('Error updating menu:', error)
      alert(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleOptionChange = (index: number, field: 'name' | 'additionalPrice', value: string) => {
    const updatedOptions = [...formData.options]
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value
    }
    setFormData({
      ...formData,
      options: updatedOptions
    })
  }

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { name: '', additionalPrice: '' }]
    })
  }

  const removeOption = (index: number) => {
    const updatedOptions = formData.options.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      options: updatedOptions
    })
  }

  if (!isAuthenticated || loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/admin/menu" className="text-ocean-blue-600 hover:text-ocean-blue-700 mr-4">
              ← メニュー一覧
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">メニューを編集</h1>
              <p className="text-gray-600">メニュー情報を更新してください</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  基本情報
                </h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      メニュー名 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      カテゴリ *
                    </label>
                    <select
                      name="category"
                      id="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                    >
                      <option value="">選択してください</option>
                      <option value="カット">カット</option>
                      <option value="カラー">カラー</option>
                      <option value="パーマ">パーマ</option>
                      <option value="縮毛矯正">縮毛矯正</option>
                      <option value="ヘッドスパ">ヘッドスパ</option>
                      <option value="セット">セット</option>
                      <option value="その他">その他</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      料金（円）*
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      required
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                      所要時間（分）*
                    </label>
                    <input
                      type="number"
                      name="duration"
                      id="duration"
                      required
                      min="10"
                      max="480"
                      value={formData.duration}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      説明 *
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      required
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isPopular"
                        id="isPopular"
                        checked={formData.isPopular}
                        onChange={handleChange}
                        className="h-4 w-4 text-ocean-blue-600 focus:ring-ocean-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isPopular" className="ml-2 block text-sm text-gray-900">
                        人気メニューとして表示する
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* オプション */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    オプション（任意）
                  </h3>
                  <button
                    type="button"
                    onClick={addOption}
                    className="bg-ocean-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-ocean-blue-700"
                  >
                    オプションを追加
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                          オプション名
                        </label>
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                          placeholder="トリートメント"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                          追加料金（円）
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={option.additionalPrice}
                          onChange={(e) => handleOptionChange(index, 'additionalPrice', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ocean-blue-500 focus:border-ocean-blue-500 sm:text-sm"
                          placeholder="1000"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/menu"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue-500"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-ocean-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-ocean-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? '更新中...' : 'メニューを更新'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}