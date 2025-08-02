import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

import { getS3DataManager } from '../src/lib/s3-data-manager'
import stylistsData from '../src/data/stylists.json'
import menuData from '../src/data/menu.json'
import newsData from '../src/data/news.json'
import stylesData from '../src/data/styles.json'
import salonData from '../src/data/salon.json'

async function setupS3Data() {
  console.log('🚀 Starting S3 data setup...')
  
  // Debug environment variables
  console.log('🔍 Environment variables check:')
  console.log(`AWS_REGION: ${process.env.AWS_REGION || 'NOT SET'}`)
  console.log(`AWS_S3_BUCKET_NAME: ${process.env.AWS_S3_BUCKET_NAME || 'NOT SET'}`)
  console.log(`AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'NOT SET'}`)
  console.log(`AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET'}`)
  console.log('')
  
  // Check if all required variables are set
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET_NAME) {
    console.error('❌ Missing required environment variables!')
    console.error('Please check your .env.local file contains:')
    console.error('- AWS_ACCESS_KEY_ID')
    console.error('- AWS_SECRET_ACCESS_KEY')
    console.error('- AWS_S3_BUCKET_NAME')
    process.exit(1)
  }
  
  const dataManager = getS3DataManager()
  
  try {
    // Upload stylists data
    console.log('📤 Uploading stylists data...')
    await dataManager.saveJsonData('stylists.json', stylistsData)
    console.log('✅ Stylists data uploaded successfully')
    
    // Upload menu data
    console.log('📤 Uploading menu data...')
    await dataManager.saveJsonData('menu.json', menuData)
    console.log('✅ Menu data uploaded successfully')
    
    // Upload news data
    console.log('📤 Uploading news data...')
    await dataManager.saveJsonData('news.json', newsData)
    console.log('✅ News data uploaded successfully')
    
    // Upload styles data
    console.log('📤 Uploading styles data...')
    await dataManager.saveJsonData('styles.json', stylesData)
    console.log('✅ Styles data uploaded successfully')
    
    // Upload salon data
    console.log('📤 Uploading salon data...')
    await dataManager.saveJsonData('salon.json', salonData)
    console.log('✅ Salon data uploaded successfully')
    
    console.log('🎉 All data uploaded successfully!')
    
    // Create initial backup
    console.log('💾 Creating initial backup...')
    await dataManager.createBackup()
    console.log('✅ Initial backup created')
    
    // Display data URLs
    console.log('\n📍 Data URLs:')
    console.log(`Stylists: ${dataManager.getDataUrl('stylists.json')}`)
    console.log(`Menu: ${dataManager.getDataUrl('menu.json')}`)
    console.log(`News: ${dataManager.getDataUrl('news.json')}`)
    console.log(`Styles: ${dataManager.getDataUrl('styles.json')}`)
    console.log(`Salon: ${dataManager.getDataUrl('salon.json')}`)
    
  } catch (error) {
    console.error('❌ Error during S3 setup:', error)
    process.exit(1)
  }
}

// Add command line argument handling
const args = process.argv.slice(2)
const force = args.includes('--force') || args.includes('-f')

if (force) {
  console.log('⚠️  Force mode: Will overwrite existing data')
}

setupS3Data().then(() => {
  console.log('✨ Setup completed successfully!')
  process.exit(0)
}).catch((error) => {
  console.error('💥 Setup failed:', error)
  process.exit(1)
})