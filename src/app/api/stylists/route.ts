import { NextRequest, NextResponse } from 'next/server'
import { getS3DataManager } from '@/lib/s3-data-manager'
import { Stylist } from '@/types'
import { publicApiRateLimit, adminApiRateLimit } from '@/lib/rate-limit'
import { stylistSchema, formatZodError } from '@/lib/validation'

const dataManager = getS3DataManager()

export async function GET(request: NextRequest) {
  // GETリクエストはレート制限をスキップ（読み取り専用のため）
  try {
    const stylists = await dataManager.getJsonData<Stylist[]>('stylists.json')
    return NextResponse.json(stylists)
  } catch (error) {
    console.error('Error fetching stylists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stylists' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // 管理画面API用のレート制限チェック
  const rateLimitResult = await adminApiRateLimit(request)
  if (rateLimitResult) return rateLimitResult
  
  try {
    const body = await request.json()
    
    // Zodスキーマによるバリデーション
    const validationResult = stylistSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: formatZodError(validationResult.error)
        },
        { status: 400 }
      )
    }
    
    const stylistData = validationResult.data
    
    const updatedStylists = await dataManager.updateJsonData<Stylist[]>(
      'stylists.json',
      (currentStylists) => {
        const newStylist: Stylist = {
          id: Date.now().toString(),
          ...stylistData,
          image: stylistData.image || null,
          social: stylistData.social || {},
          portfolio: stylistData.portfolio || [],
          skills: stylistData.skills?.map(skill => skill.name) || []
        }
        return [...currentStylists, newStylist]
      }
    )
    
    const newStylist = updatedStylists[updatedStylists.length - 1]
    
    return NextResponse.json({
      id: newStylist.id,
      message: 'Stylist created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating stylist:', error)
    return NextResponse.json(
      { error: 'Failed to create stylist' },
      { status: 500 }
    )
  }
}