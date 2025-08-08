#!/usr/bin/env tsx

import { getS3DataManager } from '../src/lib/s3-data-manager'
import dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

async function migratePCImagesToHero() {
  console.log('Migrating PC hero images to /images/hero folder...')
  
  try {
    const dataManager = getS3DataManager()
    
    // 現在のデータを取得
    const currentData = await dataManager.getJsonData('salon.json') as any
    console.log('Current PC hero images:', currentData.heroImages)
    
    // 現在のPC画像URLs（/images/stylesフォルダのもの）
    const oldPCImages = currentData.heroImages || []
    
    // 管理画面でアップロードした最新のhero画像（既に/images/heroフォルダにある）
    const newHeroImages = [
      "https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/images/hero/1754608174306-dwvwzh.jpg", // .blobを.jpgに変更
      "https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/images/hero/1754614657902-qkttnz.jpg",
      "https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/images/hero/1754614977216-6w6kes.jpg"
    ]
    
    // データを更新（PC用画像も/images/heroフォルダで統一管理）
    const updatedData = {
      ...currentData,
      heroImages: newHeroImages,           // PC用: /images/hero
      heroImagesMobile: newHeroImages      // モバイル用: /images/hero（同じ画像）
    }
    
    // データを保存
    await dataManager.saveJsonData('salon.json', updatedData)
    console.log('✅ PC and Mobile hero images migrated to /images/hero successfully')
    
    // 結果を表示
    console.log('\n=== 統一後のヒーロー画像設定 ===')
    console.log('PC用 (heroImages):')
    newHeroImages.forEach((img, i) => {
      console.log(`  ${i+1}. ${img}`)
    })
    console.log('\\nモバイル用 (heroImagesMobile):')
    newHeroImages.forEach((img, i) => {
      console.log(`  ${i+1}. ${img}`)
    })
    
    console.log('\\n🎉 PC・モバイル両方のヒーロー画像が /images/hero で統一管理されました！')
    console.log('💡 今後は管理画面からPC・モバイル個別に設定することも可能です。')
    
  } catch (error) {
    console.error('❌ Error migrating hero images:', error)
    process.exit(1)
  }
}

// 実行
migratePCImagesToHero()