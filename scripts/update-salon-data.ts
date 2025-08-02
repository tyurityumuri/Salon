import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

import { getS3DataManager } from '../src/lib/s3-data-manager'

async function updateSalonData() {
  console.log('🔄 Updating salon data with hero image fields...')
  
  try {
    const dataManager = getS3DataManager()
    
    // Read the temporary file
    const tempFilePath = path.join(process.cwd(), 'temp-salon.json')
    const updatedSalonData = JSON.parse(fs.readFileSync(tempFilePath, 'utf8'))
    
    // Save to S3
    await dataManager.saveJsonData('salon.json', updatedSalonData)
    
    console.log('✅ Salon data updated successfully!')
    console.log('📝 Added fields:')
    console.log('   - heroImage: null')
    console.log('   - heroTitle: "長瀬サロン"')
    console.log('   - heroSubtitle: "プロフェッショナルヘアサロン"')
    
    // Clean up temp file
    fs.unlinkSync(tempFilePath)
    console.log('🧹 Cleaned up temporary file')
    
  } catch (error) {
    console.error('❌ Failed to update salon data:', error)
    throw error
  }
}

// Run the update
updateSalonData().then(() => {
  console.log('🎉 Salon data update completed!')
  process.exit(0)
}).catch((error) => {
  console.error('💥 Update failed:', error)
  process.exit(1)
})