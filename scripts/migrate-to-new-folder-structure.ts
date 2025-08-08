#!/usr/bin/env tsx

import { getS3DataManager } from '../src/lib/s3-data-manager'
import dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

async function migrateToNewFolderStructure() {
  console.log('Migrating hero images to new folder structure...')
  
  try {
    const dataManager = getS3DataManager()
    
    // 現在のデータを取得
    const currentData = await dataManager.getJsonData('salon.json') as any
    console.log('Current hero images configuration:')
    console.log('PC (heroImages):', currentData.heroImages)
    console.log('Mobile (heroImagesMobile):', currentData.heroImagesMobile)
    
    // 現在のPC画像URL（/images/styles/から参照されているもの）
    const currentPCImages = [
      "https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/images/styles/1754148225756-bczx7p.jpeg",
      "https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/images/styles/1754148293674-qf0os.jpeg"
    ]
    
    // モバイル用のサンプル画像（仮に設定）
    // 実際の画像をアップロードするまでの暫定的な設定
    const mobileImages = [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=768&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=768&q=80",
      "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=768&q=80"
    ]
    
    // 新しいフォルダ構造に合わせてデータを更新
    const updatedData = {
      ...currentData,
      heroImages: currentPCImages,        // PC用: 現在の/images/styles/の画像を維持
      heroImagesMobile: mobileImages      // モバイル用: 暫定的なサンプル画像
    }
    
    // データを保存
    await dataManager.saveJsonData('salon.json', updatedData)
    console.log('✅ Hero images configuration updated')
    
    // 結果を表示
    console.log('\n=== 更新後のヒーロー画像設定 ===')
    console.log('\n🖥️  PC用 (heroImages) - /images/styles/ から参照:')
    currentPCImages.forEach((img, i) => {
      console.log(`  ${i+1}. ${img}`)
    })
    
    console.log('\n📱 モバイル用 (heroImagesMobile) - 暫定サンプル画像:')
    mobileImages.forEach((img, i) => {
      console.log(`  ${i+1}. ${img}`)
    })
    
    console.log('\n💡 今後の手順:')
    console.log('1. 管理画面から PC用画像をアップロード → /images/hero/web/ に保存されます')
    console.log('2. 管理画面から モバイル用画像をアップロード → /images/hero/mobile/ に保存されます')
    console.log('3. アップロード後、自動的に新しいフォルダ構造の画像が使用されます')
    
  } catch (error) {
    console.error('❌ Error migrating hero images:', error)
    process.exit(1)
  }
}

// 実行
migrateToNewFolderStructure()