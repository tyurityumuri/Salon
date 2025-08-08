#!/usr/bin/env tsx

import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

async function checkS3HeroImages() {
  console.log('Checking S3 hero images...')
  
  try {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'ap-northeast-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
    
    const bucketName = process.env.AWS_S3_BUCKET_NAME!
    
    // hero画像フォルダの確認
    console.log('\n🔍 Checking /images/hero/ folder...')
    const heroCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: 'images/hero/',
    })
    
    const heroResponse = await s3Client.send(heroCommand)
    
    if (heroResponse.Contents && heroResponse.Contents.length > 0) {
      console.log('✅ Found hero images:')
      heroResponse.Contents.forEach((obj, index) => {
        const url = `https://${bucketName}.s3.${process.env.AWS_REGION || 'ap-northeast-1'}.amazonaws.com/${obj.Key}`
        console.log(`  ${index + 1}. ${obj.Key} -> ${url}`)
      })
    } else {
      console.log('❌ No images found in /images/hero/')
    }
    
    // styles画像フォルダも確認（古い場所）
    console.log('\n🔍 Checking /images/styles/ folder (old location)...')
    const stylesCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: 'images/styles/',
    })
    
    const stylesResponse = await s3Client.send(stylesCommand)
    
    if (stylesResponse.Contents && stylesResponse.Contents.length > 0) {
      console.log('✅ Found images in old styles folder:')
      stylesResponse.Contents.forEach((obj, index) => {
        const url = `https://${bucketName}.s3.${process.env.AWS_REGION || 'ap-northeast-1'}.amazonaws.com/${obj.Key}`
        console.log(`  ${index + 1}. ${obj.Key} -> ${url}`)
      })
    } else {
      console.log('❌ No images found in /images/styles/')
    }
    
    console.log('\n💡 管理画面で新しい画像をアップロードした場合は、/images/hero/フォルダに保存されるはずです')
    
  } catch (error) {
    console.error('❌ Error checking S3:', error)
  }
}

// 実行
checkS3HeroImages()