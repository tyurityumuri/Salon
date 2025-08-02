import dotenv from 'dotenv'
import path from 'path'
import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3'
import fs from 'fs'

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

async function setupS3CORS() {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-northeast-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })

  const bucketName = process.env.AWS_S3_BUCKET_NAME!

  console.log(`🔧 Setting up CORS for bucket: ${bucketName}`)

  try {
    // Read CORS configuration
    const corsConfigPath = path.join(process.cwd(), 's3-cors-config.json')
    const corsConfig = JSON.parse(fs.readFileSync(corsConfigPath, 'utf8'))

    // Apply CORS configuration
    const command = new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: corsConfig
    })

    await s3Client.send(command)
    
    console.log('✅ CORS configuration applied successfully!')
    console.log('📝 CORS Rules:')
    corsConfig.CORSRules.forEach((rule: any, index: number) => {
      console.log(`   Rule ${index + 1}:`)
      console.log(`     - Methods: ${rule.AllowedMethods.join(', ')}`)
      console.log(`     - Origins: ${rule.AllowedOrigins.join(', ')}`)
      console.log(`     - Headers: ${rule.AllowedHeaders.join(', ')}`)
    })

  } catch (error) {
    console.error('❌ Failed to set up CORS:', error)
    throw error
  }
}

// Run the setup
setupS3CORS().then(() => {
  console.log('🎉 S3 CORS setup completed!')
  process.exit(0)
}).catch((error) => {
  console.error('💥 CORS setup failed:', error)
  process.exit(1)
})