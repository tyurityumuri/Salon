export interface Stylist {
  id: string
  name: string
  position: string
  experience: number
  specialties: string[]
  image: string | null
  bio: string
  skills: string[]
  social: {
    instagram?: string
    twitter?: string
    youtube?: string
  }
  portfolio: PortfolioItem[]
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
  frontImage?: string
  sideImage?: string
  backImage?: string
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  image: string
  sideImage?: string
  backImage?: string
  category?: string
  tags?: string[]
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
}