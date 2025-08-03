export interface Stylist {
  id: string
  name: string
  position: string
  experience: number
  specialties: string[]
  image: string
  bio: string
  skills: string[]
  social: {
    instagram?: string
    twitter?: string
    youtube?: string
  }
  portfolio: StyleImage[]
  rating: number
  reviewCount: number
}

export interface StyleImage {
  id: string
  url: string
  alt: string
  category: string
  stylistId: string
  tags: string[]
  width?: number
  height?: number
}

export interface MenuItem {
  id: string
  category: string
  name: string
  description: string
  price: number
  duration: number
  isPopular?: boolean
  options?: {
    name: string
    additionalPrice: number
  }[]
}

export interface NewsItem {
  id: string
  title: string
  content: string
  date: string
  category: 'info' | 'campaign' | 'event'
  image?: string
}

export interface SalonInfo {
  name: string
  address: string
  phone: string
  email: string
  businessHours: {
    [key: string]: {
      open: string
      close: string
    }
  }
  closedDays: string[]
  googleMapsUrl: string
  accessInfo: string[]
  parkingInfo: string
  heroImages?: string[]
  heroTitle?: string
  heroSubtitle?: string
}