import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

import { getS3DataManager } from '../src/lib/s3-data-manager'

async function backupData() {
  const dataManager = getS3DataManager()
  const timestamp = new Date().toISOString().split('T')[0]
  
  console.log(`💾 Starting backup for ${timestamp}...`)
  
  const files = ['stylists.json', 'menu.json', 'news.json', 'styles.json', 'salon.json']
  let successCount = 0
  let failCount = 0
  
  for (const file of files) {
    try {
      console.log(`📤 Backing up ${file}...`)
      const data = await dataManager.getJsonData(file)
      await dataManager.saveJsonData(`backups/${timestamp}/${file}`, data)
      console.log(`✅ Backed up ${file}`)
      successCount++
    } catch (error) {
      console.error(`❌ Failed to backup ${file}:`, error)
      failCount++
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log(`📊 Backup Summary:`)
  console.log(`✅ Successful: ${successCount} files`)
  console.log(`❌ Failed: ${failCount} files`)
  
  if (failCount === 0) {
    console.log(`🎉 All files backed up successfully to backups/${timestamp}/`)
  } else {
    console.log(`⚠️  Backup completed with ${failCount} errors`)
  }
  
  return failCount === 0
}

// Add command line argument for custom backup name
const args = process.argv.slice(2)
const customName = args.find(arg => arg.startsWith('--name='))?.split('=')[1]

if (customName) {
  console.log(`📝 Using custom backup name: ${customName}`)
}

backupData().then((success) => {
  console.log('✨ Backup script completed!')
  process.exit(success ? 0 : 1)
}).catch((error) => {
  console.error('💥 Backup script failed:', error)
  process.exit(1)
})