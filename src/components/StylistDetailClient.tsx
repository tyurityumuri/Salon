'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import { Stylist } from '@/types'
import StyleDetailModal from '@/components/StyleDetailModal'

interface Props {
  params: {
    id: string
  }
}

interface StyleDetail {
  id: string
  title: string
  description: string
  category: string
  images: {
    front: string
    side: string
    back: string
  }
  stylist: string
  tags: string[]
}

export default function StylistDetailClient({ params }: Props) {
  const [stylist, setStylist] = useState<Stylist | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStyle, setSelectedStyle] = useState<StyleDetail | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchStylist = async () => {
      try {
        const response = await fetch(`/api/stylists/${params.id}`)
        if (response.ok) {
          const stylist = await response.json()
          setStylist(stylist)
        } else if (response.status === 404) {
          console.error('Stylist not found for id:', params.id)
          setStylist(null)
        } else {
          console.error('Failed to fetch stylist:', response.status, response.statusText)
          setStylist(null)
        }
      } catch (error) {
        console.error('Error fetching stylist:', error)
        setStylist(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStylist()
  }, [params.id, router])

  const handleStyleClick = (portfolio: any) => {
    const styleDetail: StyleDetail = {
      id: portfolio.id,
      title: portfolio.title,
      description: portfolio.description || `${stylist?.name}による${portfolio.title}のスタイルです。`,
      category: portfolio.category || 'スタイル',
      images: {
        front: portfolio.image,
        side: portfolio.sideImage || '',
        back: portfolio.backImage || ''
      },
      stylist: stylist?.name || '',
      tags: portfolio.tags || []
    }
    setSelectedStyle(styleDetail)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedStyle(null)
  }

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
    return (
      <Layout>
        <div className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">スタイリストが見つかりません</h1>
              <p className="text-gray-600 mb-8">お探しのスタイリストは存在しないか、現在利用できません。</p>
              <Link 
                href="/stylists" 
                className="btn-primary"
              >
                スタイリスト一覧に戻る
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="section-padding bg-white">
        <div className="container-custom">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link 
              href="/stylists" 
              className="inline-flex items-center text-ocean-blue-600 hover:text-ocean-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              スタイリスト一覧に戻る
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Stylist Image */}
            <div className="space-y-6">
              <div className="relative h-96 lg:h-[600px] rounded-lg overflow-hidden shadow-lg">
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
                <div className={`absolute inset-0 bg-gradient-to-br from-ocean-blue-100 to-ocean-blue-200 flex items-center justify-center ${stylist.image ? 'hidden' : ''}`}>
                  <div className="w-32 h-32 bg-ocean-blue-300 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-ocean-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {stylist.social && (
                <div className="flex space-x-4">
                  {stylist.social.instagram && (
                    <a
                      href={stylist.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                  {stylist.social.twitter && (
                    <a
                      href={stylist.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  )}
                  {stylist.social.youtube && (
                    <a
                      href={stylist.social.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Stylist Details */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-4xl font-bold text-gray-900">{stylist.name}</h1>
                  <span className="px-4 py-2 bg-ocean-blue-100 text-ocean-blue-700 rounded-full text-sm font-medium">
                    {stylist.position}
                  </span>
                </div>
                
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-lg font-semibold text-gray-900">{stylist.rating}</span>
                    <span className="text-gray-500 ml-1">({stylist.reviewCount}件)</span>
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">経験年数:</span> {stylist.experience}年
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">プロフィール</h2>
                <p className="text-gray-700 leading-relaxed">{stylist.bio}</p>
              </div>

              {/* Specialties */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">専門分野</h2>
                <div className="flex flex-wrap gap-3">
                  {stylist.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Portfolio */}
              {stylist.portfolio && stylist.portfolio.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">ポートフォリオ</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {stylist.portfolio.map((portfolio, index) => (
                      <button
                        key={index}
                        onClick={() => handleStyleClick(portfolio)}
                        className="group relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <img
                          src={portfolio.image}
                          alt={portfolio.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                          <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                            <div className="w-8 h-8 mx-auto mb-2">
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </div>
                            <p className="text-sm font-medium">{portfolio.title}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="bg-ocean-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {stylist.name}に予約する
                </h3>
                <p className="text-gray-600 mb-4">
                  経験豊富な{stylist.name}があなたの理想のスタイルを実現します。
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:03-1234-5678"
                    className="block w-full text-center bg-ocean-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-ocean-blue-700 transition-colors"
                  >
                    電話で予約: 03-1234-5678
                  </a>
                  <a
                    href="https://beauty.hotpepper.jp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center border-2 border-ocean-blue-600 text-ocean-blue-600 py-3 px-6 rounded-md font-medium hover:bg-ocean-blue-600 hover:text-white transition-colors"
                  >
                    オンライン予約
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Style Detail Modal */}
        <StyleDetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          style={selectedStyle}
        />
      </div>
    </Layout>
  )
}