import { S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

// S3クライアントの初期化
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!

export class S3Service {
  // 署名付きアップロードURLを生成
  static async getUploadUrl(key: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    })

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1時間有効
  }

  // 署名付きダウンロードURLを生成
  static async getDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  }

  // ファイルをアップロード
  static async uploadFile(key: string, buffer: Buffer, contentType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })

    await s3Client.send(command)
  }

  // ファイルを削除
  static async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await s3Client.send(command)
  }

  // 公開URLを生成（CloudFront使用想定）
  static getPublicUrl(key: string): string {
    const cloudFrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN
    
    if (cloudFrontDomain) {
      return `https://${cloudFrontDomain}/${key}`
    }
    
    // CloudFrontが設定されていない場合はS3の直接URL
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-northeast-1'}.amazonaws.com/${key}`
  }

  // 画像ファイル用のキーを生成
  static generateImageKey(category: 'stylists' | 'styles' | 'news', filename: string): string {
    const timestamp = Date.now()
    const extension = filename.split('.').pop()
    return `images/${category}/${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
  }
}

export default s3Client