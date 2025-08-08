import { NextRequest, NextResponse } from 'next/server'
import { getS3DataManager } from '@/lib/s3-data-manager'

export async function GET() {
  try {
    console.log('🔄 === GET /api/salon リクエスト ===')
    console.log('⏰ リクエスト時刻:', new Date().toLocaleString('ja-JP'))
    
    const dataManager = getS3DataManager()
    const salonData = await dataManager.getJsonData('salon.json') as any
    
    console.log('💾 S3から取得したデータ:')
    console.log('  - name:', salonData.name)
    console.log('  - heroImages数:', salonData.heroImages?.length || 0)
    console.log('  - heroImagesMobile数:', salonData.heroImagesMobile?.length || 0)
    console.log('=====================')
    
    // キャッシュを無効化して常に最新データを取得
    return NextResponse.json(salonData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Error fetching salon data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch salon data' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const dataManager = getS3DataManager()
    const body = await request.json()
    
    // データの基本的な検証
    const requiredFields = ['name', 'address', 'phone', 'email', 'businessHours', 'closedDays', 'accessInfo', 'parkingInfo']
    for (const field of requiredFields) {
      if (!(field in body)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // 電話番号の基本的な検証
    const phoneRegex = /^[\d\-\(\)\+\s]+$/
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // メールアドレスの基本的な検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // 営業時間の検証
    if (typeof body.businessHours !== 'object') {
      return NextResponse.json(
        { error: 'Invalid business hours format' },
        { status: 400 }
      )
    }

    // アクセス情報の検証
    if (!Array.isArray(body.accessInfo)) {
      return NextResponse.json(
        { error: 'Access info must be an array' },
        { status: 400 }
      )
    }

    // データを保存
    await dataManager.saveJsonData('salon.json', body)
    
    return NextResponse.json({ message: 'Salon data updated successfully' })
  } catch (error) {
    console.error('Error updating salon data:', error)
    return NextResponse.json(
      { error: 'Failed to update salon data' },
      { status: 500 }
    )
  }
}