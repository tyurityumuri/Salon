import { Metadata } from 'next'

interface SeoConfig {
  title: string
  description: string
  keywords?: string[]
  path?: string
  image?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

export function generateSEO({
  title,
  description,
  keywords = [],
  path = '',
  image = '/images/og-image.jpg',
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
}: SeoConfig): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nagase-salon.vercel.app'
  const fullUrl = `${baseUrl}${path}`
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`

  return {
    title,
    description,
    keywords: [
      ...keywords,
      'ヘアサロン', '美容室', '東京', '大手町', '長瀬サロン',
      'カット', 'カラー', 'パーマ', 'メンズカット', 'スタイリスト'
    ],
    authors: author ? [{ name: author }] : [{ name: '長瀬サロン' }],
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: '長瀬サロン',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'ja_JP',
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
    },
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

// Structured Data generators
export interface BusinessStructuredData {
  name: string
  description: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  telephone: string
  email: string
  url: string
  openingHours: string[]
  geo?: {
    latitude: number
    longitude: number
  }
  image?: string[]
  priceRange?: string
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
}

export function generateBusinessStructuredData(business: BusinessStructuredData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: business.name,
    description: business.description,
    address: {
      '@type': 'PostalAddress',
      ...business.address,
    },
    telephone: business.telephone,
    email: business.email,
    url: business.url,
    openingHours: business.openingHours,
    ...(business.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: business.geo.latitude,
        longitude: business.geo.longitude,
      },
    }),
    ...(business.image && { image: business.image }),
    ...(business.priceRange && { priceRange: business.priceRange }),
    ...(business.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: business.aggregateRating.ratingValue,
        reviewCount: business.aggregateRating.reviewCount,
      },
    }),
    serviceType: ['ヘアカット', 'ヘアカラー', 'パーマ', 'トリートメント'],
    paymentAccepted: ['現金', 'クレジットカード'],
  }
}

export interface StylistStructuredData {
  name: string
  jobTitle: string
  description: string
  image?: string
  url: string
  worksFor: {
    name: string
    url: string
  }
  skills?: string[]
  experience?: string
  socialMedia?: {
    instagram?: string
    twitter?: string
    youtube?: string
  }
}

export function generateStylistStructuredData(stylist: StylistStructuredData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: stylist.name,
    jobTitle: stylist.jobTitle,
    description: stylist.description,
    ...(stylist.image && { image: stylist.image }),
    url: stylist.url,
    worksFor: {
      '@type': 'HairSalon',
      name: stylist.worksFor.name,
      url: stylist.worksFor.url,
    },
    ...(stylist.skills && { skills: stylist.skills }),
    ...(stylist.experience && { yearsOfExperience: stylist.experience }),
    ...(stylist.socialMedia && {
      sameAs: Object.values(stylist.socialMedia).filter(Boolean),
    }),
  }
}

export interface ServiceStructuredData {
  name: string
  description: string
  provider: {
    name: string
    url: string
  }
  offers: {
    price?: string
    priceCurrency: string
    availability: string
    validFrom?: string
    validThrough?: string
  }
  category: string
  duration?: string
}

export function generateServiceStructuredData(service: ServiceStructuredData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'HairSalon',
      name: service.provider.name,
      url: service.provider.url,
    },
    offers: {
      '@type': 'Offer',
      ...(service.offers.price && { price: service.offers.price }),
      priceCurrency: service.offers.priceCurrency,
      availability: service.offers.availability,
      ...(service.offers.validFrom && { validFrom: service.offers.validFrom }),
      ...(service.offers.validThrough && { validThrough: service.offers.validThrough }),
    },
    category: service.category,
    ...(service.duration && { duration: service.duration }),
  }
}

// Default business data for the salon
export const SALON_BUSINESS_DATA: BusinessStructuredData = {
  name: '長瀬サロン',
  description: '東京・大手町にある人気ヘアサロン。経験豊富なスタイリストが最新のトレンドスタイルをご提案。',
  address: {
    streetAddress: '大手町1-1-1',
    addressLocality: '千代田区',
    addressRegion: '東京都',
    postalCode: '100-0004',
    addressCountry: 'JP',
  },
  telephone: '03-1234-5678',
  email: 'info@nagase-salon.com',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://nagase-salon.vercel.app',
  openingHours: [
    'Mo 10:00-20:00',
    'Tu 10:00-20:00',
    'Th 10:00-20:00',
    'Fr 10:00-20:00',
    'Sa 09:00-19:00',
    'Su 09:00-19:00',
  ],
  priceRange: '¥¥',
  aggregateRating: {
    ratingValue: 4.8,
    reviewCount: 156,
  },
}

