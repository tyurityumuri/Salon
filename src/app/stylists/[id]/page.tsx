'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import { Stylist } from '@/types'

interface Props {
  params: {
    id: string
  }
}

export default function StylistDetailPage({ params }: Props) {
  const [stylist, setStylist] = useState<Stylist | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchStylist = async () => {
      try {
        const response = await fetch('/api/stylists')
        if (response.ok) {
          const stylists = await response.json()
          const foundStylist = stylists.find((s: Stylist) => s.id === params.id)
          
          if (foundStylist) {
            setStylist(foundStylist)
          } else {
            notFound()
          }
        }
      } catch (error) {
        console.error('Error fetching stylist:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStylist()
  }, [params.id])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!stylist) {
    notFound()
    return null
  }

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-custom">
          {/* Breadcrumb */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li>
                <Link href="/" className="text-gray-500 hover:text-ocean-blue-600">
                  ホーム
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link href="/stylists" className="ml-1 text-gray-500 hover:text-ocean-blue-600">
                    スタイリスト
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-gray-700">{stylist.name}</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Image and Basic Info */}
            <div className="lg:col-span-1">
              {/* Profile Image */}
              <div className="rounded-lg overflow-hidden mb-6 aspect-square">
                {stylist.image ? (
                  <img
                    src={stylist.image}
                    alt={stylist.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full bg-gradient-to-br from-ocean-blue-100 to-ocean-blue-200 flex items-center justify-center ${stylist.image ? 'hidden' : ''}`}>
                  <div className="w-32 h-32 bg-ocean-blue-300 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-ocean-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Basic Info Card */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">基本情報</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">役職</span>
                    <span className="font-medium text-ocean-blue-600">{stylist.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">経験年数</span>
                    <span className="font-medium">{stylist.experience}年</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">評価</span>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium">{stylist.rating} ({stylist.reviewCount}件)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Button */}
              <button className="w-full btn-primary text-lg py-4 mb-6">
                {stylist.name}を指名予約
              </button>

              {/* Social Links */}
              {Object.keys(stylist.social).length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">SNS</h3>
                  <div className="space-y-3">
                    {stylist.social.instagram && (
                      <a
                        href={stylist.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                      >
                        <svg className="w-6 h-6 text-pink-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span className="font-medium text-gray-900">Instagram</span>
                      </a>
                    )}
                    {stylist.social.twitter && (
                      <a
                        href={stylist.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <svg className="w-6 h-6 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        <span className="font-medium text-gray-900">Twitter</span>
                      </a>
                    )}
                    {stylist.social.youtube && (
                      <a
                        href={stylist.social.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span className="font-medium text-gray-900">YouTube</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2">
              {/* Name and Title */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{stylist.name}</h1>
                <p className="text-xl text-ocean-blue-600 font-medium">{stylist.position}</p>
              </div>

              {/* Bio */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">プロフィール</h2>
                <p className="text-gray-700 leading-relaxed">{stylist.bio}</p>
              </div>

              {/* Specialties */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">得意分野</h2>
                <div className="flex flex-wrap gap-3">
                  {stylist.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-ocean-blue-100 text-ocean-blue-700 rounded-full font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">対応メニュー</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stylist.skills.map((skill, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-ocean-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-ocean-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio Section (Placeholder) */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">スタイルギャラリー</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  ))}
                </div>
                <p className="text-center text-gray-500 mt-4">
                  スタイル写真は準備中です
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}