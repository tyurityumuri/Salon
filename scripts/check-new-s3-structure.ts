#!/usr/bin/env tsx

import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

async function checkNewS3Structure() {
  console.log('Checking new S3 hero image folder structure...')
  
  try {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'ap-northeast-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
    
    const bucketName = process.env.AWS_S3_BUCKET_NAME!
    
    // PC用（web）フォルダの確認
    console.log('\n🖥️  Checking /images/hero/web/ folder...')
    const webCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: 'images/hero/web/',
    })
    
    const webResponse = await s3Client.send(webCommand)
    
    if (webResponse.Contents && webResponse.Contents.length > 0) {
      console.log('✅ Found images in hero/web:')
      webResponse.Contents.forEach((obj, index) => {
        const url = `https://${bucketName}.s3.${process.env.AWS_REGION || 'ap-northeast-1'}.amazonaws.com/${obj.Key}`
        console.log(`  ${index + 1}. ${obj.Key} -> ${url}`)
      })
    } else {
      console.log('❌ No images found in /images/hero/web/')
    }
    
    // モバイル用フォルダの確認
    console.log('\n📱 Checking /images/hero/mobile/ folder...')
    const mobileCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: 'images/hero/mobile/',
    })
    
    const mobileResponse = await s3Client.send(mobileCommand)
    
    if (mobileResponse.Contents && mobileResponse.Contents.length > 0) {
      console.log('✅ Found images in hero/mobile:')
      mobileResponse.Contents.forEach((obj, index) => {
        const url = `https://${bucketName}.s3.${process.env.AWS_REGION || 'ap-northeast-1'}.amazonaws.com/${obj.Key}`
        console.log(`  ${index + 1}. ${obj.Key} -> ${url}`)
      })
    } else {
      console.log('❌ No images found in /images/hero/mobile/')
    }
    
    // 既存のheroフォルダ（移行元）の確認
    console.log('\n🔍 Checking existing /images/hero/ folder (root level)...')
    const existingCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: 'images/hero/',
    })
    
    const existingResponse = await s3Client.send(existingCommand)
    
    if (existingResponse.Contents && existingResponse.Contents.length > 0) {
      const rootLevelImages = existingResponse.Contents.filter(obj => {
        // web/やmobile/のサブフォルダを除外
        const key = obj.Key || ''
        return !key.includes('/web/') && !key.includes('/mobile/') && key !== 'images/hero/'
      })
      
      if (rootLevelImages.length > 0) {
        console.log('✅ Found images in existing hero folder (to be migrated):')
        rootLevelImages.forEach((obj, index) => {
          const url = `https://${bucketName}.s3.${process.env.AWS_REGION || 'ap-northeast-1'}.amazonaws.com/${obj.Key}`
          console.log(`  ${index + 1}. ${obj.Key} -> ${url}`)
        })
      }
    }
    
    console.log('\n💡 新しいフォルダ構造:')
    console.log('  - PC用: /images/hero/web/')
    console.log('  - モバイル用: /images/hero/mobile/')
    
  } catch (error) {
    console.error('❌ Error checking S3:', error)
  }
}

// 実行
checkNewS3Structure()