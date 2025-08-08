#!/usr/bin/env tsx

import { getS3DataManager } from '../src/lib/s3-data-manager'
import dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

async function debugSalonDataFlow() {
  console.log('🔍 === salon.json データフローのデバッグ ===\n')
  
  try {
    const dataManager = getS3DataManager()
    
    console.log('1️⃣ S3から直接データ取得テスト')
    console.log('⏰ 実行時刻:', new Date().toLocaleString('ja-JP'))
    
    const startTime = Date.now()
    const salonData = await dataManager.getJsonData('salon.json') as any
    const endTime = Date.now()
    
    console.log(`⏱️  取得時間: ${endTime - startTime}ms`)
    console.log('\n📋 取得したデータの概要:')
    console.log('  - name:', salonData.name)
    console.log('  - address:', salonData.address)
    console.log('  - heroImages:', salonData.heroImages)
    console.log('  - heroImagesMobile:', salonData.heroImagesMobile)
    
    console.log('\n2️⃣ データの詳細分析')
    console.log('🖥️  PC用画像 (heroImages):')
    if (salonData.heroImages && Array.isArray(salonData.heroImages)) {
      salonData.heroImages.forEach((img: string, i: number) => {
        console.log(`  ${i+1}. ${img}`)
        // URLのパスを分析
        const url = new URL(img)
        console.log(`     - パス: ${url.pathname}`)
      })
    } else {
      console.log('  設定なし')
    }
    
    console.log('\n📱 モバイル用画像 (heroImagesMobile):')
    if (salonData.heroImagesMobile && Array.isArray(salonData.heroImagesMobile)) {
      salonData.heroImagesMobile.forEach((img: string, i: number) => {
        console.log(`  ${i+1}. ${img}`)
        // URLのパスを分析
        try {
          const url = new URL(img)
          console.log(`     - パス: ${url.pathname}`)
        } catch (e) {
          console.log(`     - 相対パスまたは無効なURL`)
        }
      })
    } else {
      console.log('  設定なし')
    }
    
    console.log('\n3️⃣ データ取得フローのタイミング')
    console.log('📌 salon.jsonが取得されるタイミング:')
    console.log('  1. トップページ読み込み時 (HomeClient.tsx の useEffect)')
    console.log('  2. 管理画面のサロン情報ページ読み込み時')
    console.log('  3. アクセスページ読み込み時')
    console.log('  4. 予約ページ読み込み時')
    
    console.log('\n📌 データ更新のタイミング:')
    console.log('  1. 管理画面でサロン情報を保存した時 (PUT /api/salon)')
    console.log('  2. スクリプトで直接 dataManager.saveJsonData() を実行した時')
    
    console.log('\n4️⃣ キャッシュの影響')
    console.log('🔄 Vercelのキャッシュ:')
    console.log('  - APIレスポンスはキャッシュヘッダーで制御')
    console.log('  - no-cache設定で常に最新データを取得')
    console.log('🔄 ブラウザのキャッシュ:')
    console.log('  - 強制更新 (Ctrl+Shift+R) で確実にクリア')
    
  } catch (error) {
    console.error('❌ デバッグ中にエラー発生:', error)
  }
}

// 実行
debugSalonDataFlow()