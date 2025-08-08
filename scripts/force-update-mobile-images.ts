#!/usr/bin/env tsx

import { getS3DataManager } from '../src/lib/s3-data-manager'
import dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

async function forceUpdateMobileImages() {
  console.log('Force updating mobile hero images...')
  
  try {
    const dataManager = getS3DataManager()
    
    // 現在のデータを取得
    const currentData = await dataManager.getJsonData('salon.json') as any
    console.log('Current data loaded')
    
    // 最新の画像URLで強制上書き（管理画面で設定したものがあれば反映）
    const updatedData = {
      ...currentData,
      heroImagesMobile: [
        // 実際にS3に保存された画像があればここに設定
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=768&q=80",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=768&q=80",
        "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=768&q=80"
      ]
    }
    
    // データを強制保存
    await dataManager.saveJsonData('salon.json', updatedData)
    console.log('✅ Mobile hero images force updated successfully')
    
    // 結果を表示
    console.log('\n=== Updated Mobile Images ===')
    updatedData.heroImagesMobile.forEach((img: string, i: number) => {
      console.log(`${i+1}. ${img}`)
    })
    
  } catch (error) {
    console.error('❌ Error force updating mobile images:', error)
    process.exit(1)
  }
}

// 実行
forceUpdateMobileImages()