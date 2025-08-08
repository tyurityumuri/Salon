'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { Stylist } from '@/types'



export default function StylistsPage() {
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const response = await fetch('/api/stylists')
        if (response.ok) {
          const data = await response.json()
          setStylists(data)
        }
      } catch (error) {
        console.error('Error fetching stylists:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStylists()
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto mb-4"></div>
            <p className="text-primary-600 font-light tracking-wide">LOADING...</p>
          </div>
        </div>
      </Layout>
    )
  }
  return (
    <Layout>
      <div className="section-padding bg-secondary-50">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-20">
            {/* <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary-600 mb-4">PROFESSIONAL TEAM</p> */}
            <h1 className="heading-primary mb-8">
              STYLISTS
            </h1>
            <div className="divider mb-8"></div>
            <p className="text-body max-w-3xl mx-auto">
              経験豊富なプロフェッショナルなスタイリストが、あなたの魅力を最大限に引き出します。<br className="hidden md:block" />
              それぞれの専門分野を活かし、お客様に最適なスタイルをご提案いたします。
            </p>
          </div>

          {/* Stylists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stylists.map((stylist) => (
              <Link href={`/stylists/${stylist.id}`} key={stylist.id}>
                <div className="bg-white shadow-sm hover:shadow-lg transition-all duration-500 group overflow-hidden border border-primary-100">
                  {/* Stylist Image */}
                  <div className="relative h-96 overflow-hidden">
                    {stylist.image ? (
                      <>
                        <Image
                          src={stylist.image}
                          alt={stylist.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center" style={{ display: 'none' }}>
                          <div className="w-24 h-24 bg-primary-300 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <div className="w-24 h-24 bg-primary-300 rounded-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                      <h3 className="font-heading text-xl font-medium text-white tracking-wide mb-1">{stylist.name}</h3>
                      <p className="text-white/80 text-sm font-light tracking-wide uppercase">{stylist.position}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 bg-white">
                    <p className="text-primary-600 text-sm mb-4 leading-relaxed line-clamp-2">{stylist.bio}</p>
                    
                    {/* Experience & Rating */}
                    <div className="flex items-center justify-between mb-4 text-xs">
                      <span className="text-primary-500 tracking-wide uppercase">EXPERIENCE: {stylist.experience} YEARS</span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-accent-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-primary-600 font-medium">{stylist.rating} ({stylist.reviewCount})</span>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {stylist.specialties.slice(0, 3).map((specialty, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-50 text-primary-700 text-xs tracking-wide uppercase border border-primary-100"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    {/* Social Links */}
                    {stylist.social && (Object.keys(stylist.social).filter(key => stylist.social[key as keyof typeof stylist.social]).length > 0) && (
                      <div className="flex space-x-4 pt-4 border-t border-primary-100">
                        {stylist.social.instagram && (
                          <a
                            href={stylist.social.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-400 hover:text-pink-500 transition-colors duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </a>
                        )}
                        {stylist.social.twitter && (
                          <a
                            href={stylist.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-400 hover:text-blue-500 transition-colors duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </a>
                        )}
                        {stylist.social.youtube && (
                          <a
                            href={stylist.social.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-400 hover:text-red-500 transition-colors duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}