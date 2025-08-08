#!/usr/bin/env tsx

import { getS3DataManager } from '../src/lib/s3-data-manager'
import dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

async function checkHeroImages() {
  console.log('Checking current hero images in salon.json...')
  
  try {
    const dataManager = getS3DataManager()
    
    // 現在のデータを取得
    const salonData = await dataManager.getJsonData('salon.json') as any
    
    console.log('\n=== 現在のヒーロー画像設定 ===')
    console.log('\nPC用画像 (heroImages):')
    if (salonData.heroImages) {
      salonData.heroImages.forEach((img: string, i: number) => {
        console.log(`  ${i+1}. ${img}`)
      })
    } else {
      console.log('  設定されていません')
    }
    
    console.log('\nモバイル用画像 (heroImagesMobile):')
    if (salonData.heroImagesMobile) {
      salonData.heroImagesMobile.forEach((img: string, i: number) => {
        console.log(`  ${i+1}. ${img}`)
      })
    } else {
      console.log('  設定されていません')
    }
    
    console.log('\n=== 画像の設定場所 ===')
    console.log('1. 管理画面: https://salon-rouge.vercel.app/admin/salon')
    console.log('2. S3データ: data/salon.json')
    console.log('3. ローカルファイル: src/data/salon.json (開発環境)')
    
  } catch (error) {
    console.error('Error checking hero images:', error)
  }
}

// 実行
checkHeroImages()