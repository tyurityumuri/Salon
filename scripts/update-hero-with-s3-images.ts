#!/usr/bin/env tsx

import { getS3DataManager } from '../src/lib/s3-data-manager'
import dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

async function updateHeroWithS3Images() {
  console.log('Updating hero images with actual S3 images...')
  
  try {
    const dataManager = getS3DataManager()
    
    // 現在のデータを取得
    const currentData = await dataManager.getJsonData('salon.json') as any
    console.log('Current data loaded')
    
    // S3に保存された実際のhero画像URLs
    const s3HeroImages = [
      "https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/images/hero/1754608174306-dwvwzh.blob",
      "https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/images/hero/1754614657902-qkttnz.blob",
      "https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/images/hero/1754614977216-6w6kes.blob"
    ]
    
    // PCとモバイル両方にS3画像を設定
    const updatedData = {
      ...currentData,
      heroImages: s3HeroImages,           // PC用も S3 画像に統一
      heroImagesMobile: s3HeroImages      // モバイル用も S3 画像
    }
    
    // データを保存
    await dataManager.saveJsonData('salon.json', updatedData)
    console.log('✅ Hero images updated with S3 URLs successfully')
    
    // 結果を表示
    console.log('\n=== Updated Hero Images (PC & Mobile) ===')
    s3HeroImages.forEach((img: string, i: number) => {
      console.log(`${i+1}. ${img}`)
    })
    
    console.log('\n🚀 Now both PC and mobile should show your S3 uploaded images!')
    
  } catch (error) {
    console.error('❌ Error updating hero images:', error)
    process.exit(1)
  }
}

// 実行
updateHeroWithS3Images()