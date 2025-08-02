import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

import { getS3DataManager } from '../src/lib/s3-data-manager'
import { Stylist, MenuItem } from '../src/types'

interface NewsItem {
  id: string
  title: string
  content: string
  category: 'campaign' | 'event' | 'notice'
  date: string
  image?: string
}

interface StyleItem {
  id: string
  src: string
  alt: string
  category: string
  tags: string[]
  stylistName: string
  height: number
}

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

// Validation functions
function validateStylist(data: any): data is Stylist {
  return (
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.position === 'string' &&
    typeof data.bio === 'string' &&
    typeof data.experience === 'number' &&
    typeof data.rating === 'number' &&
    typeof data.reviewCount === 'number' &&
    Array.isArray(data.specialties) &&
    data.rating >= 1 && data.rating <= 5 &&
    data.experience >= 0
  )
}

function validateMenuItem(data: any): data is MenuItem {
  return (
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.category === 'string' &&
    typeof data.description === 'string' &&
    typeof data.price === 'number' &&
    typeof data.duration === 'number' &&
    typeof data.isPopular === 'boolean' &&
    data.price >= 0 &&
    data.duration > 0
  )
}

function validateNewsItem(data: any): data is NewsItem {
  return (
    typeof data.id === 'string' &&
    typeof data.title === 'string' &&
    typeof data.content === 'string' &&
    ['campaign', 'event', 'notice'].includes(data.category) &&
    typeof data.date === 'string' &&
    !isNaN(new Date(data.date).getTime())
  )
}

function validateStyleItem(data: any): data is StyleItem {
  return (
    typeof data.id === 'string' &&
    typeof data.src === 'string' &&
    typeof data.alt === 'string' &&
    typeof data.category === 'string' &&
    Array.isArray(data.tags) &&
    typeof data.stylistName === 'string' &&
    typeof data.height === 'number' &&
    data.height >= 200 && data.height <= 800
  )
}

function validateSalonInfo(data: any): data is SalonInfo {
  return (
    typeof data.name === 'string' &&
    typeof data.address === 'string' &&
    typeof data.phone === 'string' &&
    typeof data.email === 'string' &&
    typeof data.businessHours === 'object' &&
    Array.isArray(data.closedDays) &&
    typeof data.googleMapsUrl === 'string' &&
    Array.isArray(data.accessInfo) &&
    typeof data.parkingInfo === 'string'
  )
}

async function validateS3Data() {
  const dataManager = getS3DataManager()
  let totalErrors = 0
  
  console.log('🔍 Starting S3 data validation...\n')
  
  // Validate stylists
  console.log('👥 Validating stylists data...')
  try {
    const stylists = await dataManager.getJsonData<Stylist[]>('stylists.json')
    const stylistErrors = stylists.filter(stylist => !validateStylist(stylist))
    
    if (stylistErrors.length === 0) {
      console.log(`✅ ${stylists.length} stylists validated successfully`)
    } else {
      console.log(`❌ ${stylistErrors.length} stylists failed validation:`)
      stylistErrors.forEach((stylist: any) => {
        console.log(`   - ID: ${stylist.id || 'unknown'} - ${stylist.name || 'unknown name'}`)
      })
      totalErrors += stylistErrors.length
    }
  } catch (error) {
    console.log('❌ Failed to load stylists data:', error)
    totalErrors++
  }
  
  // Validate menu
  console.log('\n🍽️  Validating menu data...')
  try {
    const menu = await dataManager.getJsonData<MenuItem[]>('menu.json')
    const menuErrors = menu.filter(item => !validateMenuItem(item))
    
    if (menuErrors.length === 0) {
      console.log(`✅ ${menu.length} menu items validated successfully`)
    } else {
      console.log(`❌ ${menuErrors.length} menu items failed validation:`)
      menuErrors.forEach((item: any) => {
        console.log(`   - ID: ${item.id || 'unknown'} - ${item.name || 'unknown name'}`)
      })
      totalErrors += menuErrors.length
    }
  } catch (error) {
    console.log('❌ Failed to load menu data:', error)
    totalErrors++
  }
  
  // Validate news
  console.log('\n📰 Validating news data...')
  try {
    const news = await dataManager.getJsonData<NewsItem[]>('news.json')
    const newsErrors = news.filter(item => !validateNewsItem(item))
    
    if (newsErrors.length === 0) {
      console.log(`✅ ${news.length} news items validated successfully`)
    } else {
      console.log(`❌ ${newsErrors.length} news items failed validation:`)
      newsErrors.forEach((item: any) => {
        console.log(`   - ID: ${item.id || 'unknown'} - ${item.title || 'unknown title'}`)
      })
      totalErrors += newsErrors.length
    }
  } catch (error) {
    console.log('❌ Failed to load news data:', error)
    totalErrors++
  }
  
  // Validate styles
  console.log('\n💇 Validating styles data...')
  try {
    const styles = await dataManager.getJsonData<StyleItem[]>('styles.json')
    const styleErrors = styles.filter(item => !validateStyleItem(item))
    
    if (styleErrors.length === 0) {
      console.log(`✅ ${styles.length} style items validated successfully`)
    } else {
      console.log(`❌ ${styleErrors.length} style items failed validation:`)
      styleErrors.forEach((item: any) => {
        console.log(`   - ID: ${item.id || 'unknown'} - ${item.alt || 'unknown alt'}`)
      })
      totalErrors += styleErrors.length
    }
  } catch (error) {
    console.log('❌ Failed to load styles data:', error)
    totalErrors++
  }
  
  // Validate salon info
  console.log('\n🏢 Validating salon data...')
  try {
    const salon = await dataManager.getJsonData<SalonInfo>('salon.json')
    
    if (validateSalonInfo(salon)) {
      console.log('✅ Salon info validated successfully')
    } else {
      console.log('❌ Salon info failed validation')
      totalErrors++
    }
  } catch (error) {
    console.log('❌ Failed to load salon data:', error)
    totalErrors++
  }
  
  // Summary
  console.log('\n' + '='.repeat(50))
  if (totalErrors === 0) {
    console.log('🎉 All data validation passed!')
    return true
  } else {
    console.log(`💥 Validation failed with ${totalErrors} errors`)
    return false
  }
}

// Run validation
validateS3Data().then((success) => {
  process.exit(success ? 0 : 1)
}).catch((error) => {
  console.error('💥 Validation script failed:', error)
  process.exit(1)
})