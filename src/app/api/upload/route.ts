import { NextRequest, NextResponse } from 'next/server'
import { S3Service } from '@/lib/s3'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filename, contentType, category } = body

    // パラメータの検証
    if (!filename || !contentType || !category) {
      return NextResponse.json(
        { error: 'filename, contentType, category are required' },
        { status: 400 }
      )
    }

    // カテゴリの検証
    const validCategories = ['stylists', 'styles', 'news']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // コンテンツタイプの検証
    if (!contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // S3アップロード用のキーを生成
    const imageKey = S3Service.generateImageKey(category as 'stylists' | 'styles' | 'news', filename)
    
    // 署名付きアップロードURLを生成
    const uploadUrl = await S3Service.getUploadUrl(imageKey, contentType)
    
    // 公開URLを生成
    const publicUrl = S3Service.getPublicUrl(imageKey)

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      imageKey
    })

  } catch (error) {
    console.error('Upload URL generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}