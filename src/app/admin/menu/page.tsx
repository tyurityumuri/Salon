'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MenuItem } from '@/types'
import menuData from '@/data/menu.json'

export default function AdminMenuPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchMenu()
    } else {
      router.push('/admin')
    }
  }, [router])

  const fetchMenu = async () => {
    try {
      const response = await fetch('/api/menu')
      if (response.ok) {
        const data = await response.json()
        setMenu(data)
      } else {
        console.error('Failed to fetch menu, falling back to local data')
        setMenu(menuData as MenuItem[])
      }
    } catch (error) {
      console.error('Error fetching menu, falling back to local data:', error)
      setMenu(menuData as MenuItem[])
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...Array.from(new Set(menu.map(item => item.category)))]
  const filteredMenu = selectedCategory === 'all' 
    ? menu 
    : menu.filter(item => item.category === selectedCategory)

  const handleDelete = async (id: string) => {
    if (confirm('このメニューを削除しますか？')) {
      try {
        const response = await fetch(`/api/menu/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setMenu(menu.filter(item => item.id !== id))
          alert('メニューが削除されました。')
        } else {
          const error = await response.json()
          alert(error.error || '削除に失敗しました')
        }
      } catch (error) {
        console.error('Error deleting menu:', error)
        alert('削除中にエラーが発生しました')
      }
    }
  }

  const togglePopular = async (id: string) => {
    try {
      const currentItem = menu.find(item => item.id === id)
      if (!currentItem) return

      const response = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPopular: !currentItem.isPopular }),
      })

      if (response.ok) {
        setMenu(menu.map(item => 
          item.id === id ? { ...item, isPopular: !item.isPopular } : item
        ))
        alert('人気メニューの設定が更新されました。')
      } else {
        const error = await response.json()
        alert(error.error || '更新に失敗しました')
      }
    } catch (error) {
      console.error('Error toggling popular:', error)
      alert('更新中にエラーが発生しました')
    }
  }

  if (!isAuthenticated || loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="text-ocean-blue-600 hover:text-ocean-blue-700 mr-4">
                ← ダッシュボード
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">メニュー管理</h1>
                <p className="text-gray-600">{menu.length}件のメニューが登録されています</p>
              </div>
            </div>
            <Link
              href="/admin/menu/new"
              className="bg-ocean-blue-600 text-white px-4 py-2 rounded-md hover:bg-ocean-blue-700 transition-colors"
            >
              新しいメニューを追加
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedCategory === category
                      ? 'bg-ocean-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category === 'all' ? 'すべて' : category}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        メニュー
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        カテゴリ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        料金
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        時間
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        人気
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMenu.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs">
                              {item.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ¥{item.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.duration}分
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => togglePopular(item.id)}
                            className={`px-2 py-1 text-xs rounded-full ${
                              item.isPopular
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {item.isPopular ? '人気' : '通常'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Link
                            href={`/admin/menu/${item.id}/edit`}
                            className="text-ocean-blue-600 hover:text-ocean-blue-900"
                          >
                            編集
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            削除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredMenu.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">該当するメニューがありません</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}