'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Stylist } from '@/types'

export default function AdminStylistsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchStylists()
    } else {
      router.push('/admin')
    }
  }, [router])

  const fetchStylists = async () => {
    try {
      const response = await fetch('/api/stylists')
      if (response.ok) {
        const data = await response.json()
        setStylists(data)
      } else {
        console.error('Failed to fetch stylists, falling back to local data')
      }
    } catch (error) {
      console.error('Error fetching stylists, falling back to local data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('このスタイリストを削除しますか？')) {
      try {
        const response = await fetch(`/api/stylists/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setStylists(stylists.filter(stylist => stylist.id !== id))
          alert('スタイリストが削除されました。')
        } else {
          const error = await response.json()
          alert(error.error || '削除に失敗しました')
        }
      } catch (error) {
        console.error('Error deleting stylist:', error)
        alert('削除中にエラーが発生しました')
      }
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
                <h1 className="text-3xl font-bold text-gray-900">スタイリスト管理</h1>
                <p className="text-gray-600">{stylists.length}名のスタイリストが登録されています</p>
              </div>
            </div>
            <Link
              href="/admin/stylists/new"
              className="bg-ocean-blue-600 text-white px-4 py-2 rounded-md hover:bg-ocean-blue-700 transition-colors"
            >
              新しいスタイリストを追加
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        スタイリスト
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        役職
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        経験年数
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        評価
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        専門分野
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stylists.map((stylist) => (
                      <tr key={stylist.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-ocean-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-ocean-blue-600 font-medium text-sm">
                                {stylist.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {stylist.name}
                              </div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {stylist.bio}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stylist.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stylist.experience}年
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">{stylist.rating}</span>
                            <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs text-gray-500 ml-1">({stylist.reviewCount})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {stylist.specialties.slice(0, 2).map((specialty, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-ocean-blue-100 text-ocean-blue-700 text-xs rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                            {stylist.specialties.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{stylist.specialties.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Link
                            href={`/admin/stylists/${stylist.id}/edit`}
                            className="text-ocean-blue-600 hover:text-ocean-blue-900"
                          >
                            編集
                          </Link>
                          <button
                            onClick={() => handleDelete(stylist.id)}
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
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}