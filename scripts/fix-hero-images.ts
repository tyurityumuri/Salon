#!/usr/bin/env tsx

import { getS3DataManager } from '../src/lib/s3-data-manager'
import dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

async function fixHeroImages() {
  console.log('Fixing hero images in salon.json...')
  
  try {
    const dataManager = getS3DataManager()
    
    // 現在のデータを取得
    const currentData = await dataManager.getJsonData('salon.json') as any
    console.log('Current heroImages:', currentData.heroImages)
    console.log('Current heroImagesMobile:', currentData.heroImagesMobile)
    
    // モバイル画像が設定されていない場合、サンプル画像を設定
    if (!currentData.heroImagesMobile || currentData.heroImagesMobile.length === 0) {
      const updatedData = {
        ...currentData,
        heroImagesMobile: [
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=768&q=80",
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=768&q=80",
          "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=768&q=80"
        ]
      }
      
      // データを保存
      await dataManager.saveJsonData('salon.json', updatedData)
      console.log('Successfully updated salon.json with mobile hero images')
    } else {
      console.log('Mobile hero images already exist')
    }
    
  } catch (error) {
    console.error('Error fixing hero images:', error)
    process.exit(1)
  }
}

// 実行
fixHeroImages()