'use client'

import { useState, useEffect } from 'react'
import { Stylist, MenuItem } from '@/types'

interface BookingFormData {
  name: string
  email: string
  phone: string
  date: string
  time: string
  stylistId: string
  menuIds: string[]
  message: string
}

const BookingForm = () => {
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [menuData, setMenuData] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    stylistId: '',
    menuIds: [],
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stylistsRes, menuRes] = await Promise.all([
          fetch('/api/stylists'),
          fetch('/api/menu')
        ])

        if (stylistsRes.ok) {
          const stylistsData = await stylistsRes.json()
          setStylists(stylistsData)
        }

        if (menuRes.ok) {
          const menuDataRes = await menuRes.json()
          setMenuData(menuDataRes)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('予約リクエストを受け付けました。担当者より48時間以内にご連絡いたします。')
      setIsSubmitting(false)
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        stylistId: '',
        menuIds: [],
        message: ''
      })
    }, 2000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMenuChange = (menuId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      menuIds: checked 
        ? [...prev.menuIds, menuId]
        : prev.menuIds.filter(id => id !== menuId)
    }))
  }

  const selectedMenus = menuData.filter(menu => formData.menuIds.includes(menu.id))
  const totalPrice = selectedMenus.reduce((sum, menu) => sum + menu.price, 0)
  const totalDuration = selectedMenus.reduce((sum, menu) => sum + menu.duration, 0)

  if (submitMessage) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="text-lg font-semibold text-green-900 mb-2">予約リクエスト完了</h3>
        <p className="text-green-800">{submitMessage}</p>
        <button
          onClick={() => setSubmitMessage('')}
          className="mt-4 btn-primary"
        >
          新しい予約をする
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">お客様情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              電話番号 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Date and Time */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">ご希望日時</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              ご希望日 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              ご希望時間 <span className="text-red-500">*</span>
            </label>
            <select
              id="time"
              name="time"
              required
              value={formData.time}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-blue-500 focus:border-transparent"
            >
              <option value="">時間を選択してください</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stylist Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">スタイリスト指名</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-300 rounded-md p-3">
            <input
              type="radio"
              id="stylist-none"
              name="stylistId"
              value=""
              checked={formData.stylistId === ''}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="stylist-none" className="text-sm font-medium">指名なし</label>
          </div>
          {stylists.map(stylist => (
            <div key={stylist.id} className="border border-gray-300 rounded-md p-3">
              <input
                type="radio"
                id={`stylist-${stylist.id}`}
                name="stylistId"
                value={stylist.id}
                checked={formData.stylistId === stylist.id}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor={`stylist-${stylist.id}`} className="text-sm">
                <div className="font-medium">{stylist.name}</div>
                <div className="text-gray-500 text-xs">{stylist.position}</div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">メニュー選択</h3>
        <div className="space-y-3">
          {menuData.map(menu => (
            <div key={menu.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`menu-${menu.id}`}
                  checked={formData.menuIds.includes(menu.id)}
                  onChange={(e) => handleMenuChange(menu.id, e.target.checked)}
                  className="mr-3"
                />
                <label htmlFor={`menu-${menu.id}`} className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{menu.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {menu.category}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{menu.description}</div>
                  <div className="text-xs text-gray-500 mt-1">約{menu.duration}分</div>
                </label>
              </div>
              <div className="text-right">
                <div className="font-semibold text-ocean-blue-600">¥{menu.price.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        {selectedMenus.length > 0 && (
          <div className="mt-4 p-4 bg-ocean-blue-50 rounded-md">
            <h4 className="font-medium text-gray-900 mb-2">選択されたメニュー</h4>
            <div className="space-y-1 text-sm">
              {selectedMenus.map(menu => (
                <div key={menu.id} className="flex justify-between">
                  <span>{menu.name}</span>
                  <span>¥{menu.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-ocean-blue-200 mt-2 pt-2 flex justify-between font-semibold">
              <span>合計 (約{totalDuration}分)</span>
              <span>¥{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Message */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">ご要望・メッセージ</h3>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleInputChange}
          placeholder="ご要望やご質問がございましたらお聞かせください"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-blue-500 focus:border-transparent"
        />
      </div>

      {/* Submit */}
      <div className="text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary px-12 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '送信中...' : '予約リクエストを送信'}
        </button>
        <p className="text-sm text-gray-600 mt-2">
          ※こちらは予約リクエストです。担当者より確認のご連絡をいたします。
        </p>
      </div>
    </form>
  )
}

export default BookingForm