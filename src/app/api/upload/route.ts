import { NextRequest, NextResponse } from 'next/server'
import { S3Service } from '@/lib/s3'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'general'

    // ファイルの検証
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // ファイルタイプの検証
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // ファイルサイズの検証（50MBまで）
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 50MB allowed.' },
        { status: 400 }
      )
    }

    // S3アップロード用のキーを生成
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop() || 'jpg'
    const imageKey = `images/${folder}/${timestamp}-${randomString}.${extension}`
    
    // ファイルをBufferに変換
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // S3にアップロード
    await S3Service.uploadFile(imageKey, buffer, file.type)
    
    // 公開URLを生成
    const publicUrl = S3Service.getPublicUrl(imageKey)

    return NextResponse.json({
      url: publicUrl,
      key: imageKey,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}