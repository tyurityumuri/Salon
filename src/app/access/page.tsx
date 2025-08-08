'use client'

import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'

interface SalonInfo {
  name: string
  address: string
  phone: string
  email: string
  businessHours: Record<string, { open: string; close: string }>
  closedDays: string[]
  googleMapsUrl: string
  accessInfo: string[]
  parkingInfo: string
}



export default function AccessPage() {
  const [salonData, setSalonData] = useState<SalonInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        const response = await fetch('/api/salon')
        if (response.ok) {
          const data = await response.json()
          setSalonData(data)
        }
      } catch (error) {
        console.error('Error fetching salon data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSalonData()
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

  if (!salonData) {
    return <Layout><div>Error loading salon data</div></Layout>
  }
  return (
    <Layout>
      <div className="section-padding bg-secondary-50">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-20">
            {/* <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary-600 mb-4">LOCATION & ACCESS</p> */}
            <h1 className="heading-primary mb-8">
              ACCESS
            </h1>
            <div className="divider mb-8"></div>
            <p className="text-body max-w-3xl mx-auto">
              武州長瀬駅からアクセス抜群の立地にあります。<br className="hidden md:block" />
              お気軽にお越しください。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Map */}
            <div>
              <div className="bg-primary-50 border border-primary-100 overflow-hidden h-96 mb-6">
                {/* Google Maps Embed */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.8280665444595!2d139.7634!3d35.6812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bfbd89f700b%3A0x277c49ba34ed38!2z5aSn5omL55S6!5e0!3m2!1sja!2sjp!4v1641234567890!5m2!1sja!2sjp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="長瀬サロンの場所"
                  className="w-full h-full"
                />
              </div>

              {/* Access Info */}
              <div className="bg-white border border-primary-100 p-8">
                <h3 className="font-heading text-lg font-medium text-primary-900 mb-6 tracking-wide uppercase">Train Access</h3>
                <div className="space-y-4">
                  {salonData?.accessInfo?.map((info, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-4 h-4 text-accent-600 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-primary-600 text-sm leading-relaxed">{info}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white border border-primary-100 p-8">
                <h3 className="font-heading text-lg font-medium text-primary-900 mb-6 tracking-wide uppercase">Salon Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-start">
                      <svg className="w-4 h-4 text-accent-600 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <div className="font-heading font-medium text-primary-900 text-sm tracking-wide uppercase">Address</div>
                        <div className="text-primary-600 text-sm leading-relaxed">{salonData?.address}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start">
                      <svg className="w-4 h-4 text-accent-600 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <div className="font-heading font-medium text-primary-900 text-sm tracking-wide uppercase">Phone</div>
                        <div className="text-primary-600">
                          <a href={`tel:${salonData?.phone}`} className="text-accent-600 hover:text-accent-700 transition-colors duration-300 text-sm">
                            {salonData?.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start">
                      <svg className="w-4 h-4 text-accent-600 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <div className="font-heading font-medium text-primary-900 text-sm tracking-wide uppercase">Email</div>
                        <div className="text-primary-600">
                          <a href={`mailto:${salonData?.email}`} className="text-accent-600 hover:text-accent-700 transition-colors duration-300 text-sm">
                            {salonData?.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white border border-primary-100 p-8">
                <h3 className="font-heading text-lg font-medium text-primary-900 mb-6 tracking-wide uppercase">Business Hours</h3>
                <div className="space-y-2">
                  {Object.entries(salonData?.businessHours || {}).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center py-3 border-b border-primary-100 last:border-b-0">
                      <span className="font-heading font-medium text-primary-900 text-sm tracking-wide uppercase">{day}</span>
                      <span className={`text-sm tracking-wide ${hours.open === '休業日' ? 'text-red-600 uppercase' : 'text-primary-600'}`}>
                        {hours.open === '休業日' ? 'CLOSED' : `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-red-50 border border-red-100">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-xs text-red-700 font-medium tracking-wide uppercase">
                      CLOSED: {salonData?.closedDays?.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Parking Info */}
              <div className="bg-white border border-primary-100 p-8">
                <h3 className="font-heading text-lg font-medium text-primary-900 mb-6 tracking-wide uppercase">Parking Information</h3>
                <div className="flex items-start">
                  <svg className="w-4 h-4 text-accent-600 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <div className="font-heading font-medium text-primary-900 mb-2 text-sm tracking-wide uppercase">Parking</div>
                    <div className="text-primary-600 text-sm leading-relaxed">{salonData?.parkingInfo}</div>
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="bg-white border border-primary-100 p-8 text-center">
                <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary-600 mb-3">CONTACT US</p>
                <h3 className="font-heading text-lg font-medium text-primary-900 mb-6 tracking-wide">ご予約・お問い合わせ</h3>
                <div className="space-y-4">
                  <a
                    href={`tel:${salonData?.phone}`}
                    className="block btn-primary py-3"
                  >
                    CALL FOR BOOKING
                  </a>
                  <a
                    href="https://beauty.hotpepper.jp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block btn-secondary py-3"
                  >
                    ONLINE BOOKING
                  </a>
                </div>
                <p className="text-xs text-primary-500 mt-4 tracking-wide">
                  お気軽にお電話ください<br />
                  営業時間内にお電話いただければスムーズです
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}