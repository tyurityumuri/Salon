import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

export class S3DataManager {
  private s3Client: S3Client
  private bucketName: string

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'ap-northeast-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
    
    this.bucketName = process.env.AWS_S3_BUCKET_NAME!
  }

  // JSONファイルを取得
  async getJsonData<T>(filename: string): Promise<T> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: `data/${filename}`,
      })

      const response = await this.s3Client.send(command)
      const body = await response.Body?.transformToString()
      
      if (!body) {
        throw new Error(`No data received from ${filename}`)
      }

      return JSON.parse(body)
    } catch (error) {
      console.error(`Error getting ${filename} from S3:`, error)
      throw new Error(`Failed to get data from ${filename}`)
    }
  }

  // JSONファイルを保存
  async saveJsonData<T>(filename: string, data: T): Promise<void> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: `data/${filename}`,
        Body: JSON.stringify(data, null, 2),
        ContentType: 'application/json',
      })

      await this.s3Client.send(command)
      console.log(`Successfully saved ${filename} to S3`)
    } catch (error) {
      console.error(`Error saving ${filename} to S3:`, error)
      throw new Error(`Failed to save ${filename}`)
    }
  }

  // 現在のデータを取得して安全に更新
  async updateJsonData<T>(
    filename: string, 
    updateFn: (currentData: T) => T
  ): Promise<T> {
    try {
      // 現在のデータを取得
      const currentData = await this.getJsonData<T>(filename)
      
      // 更新処理を実行
      const updatedData = updateFn(currentData)
      
      // S3に保存
      await this.saveJsonData(filename, updatedData)
      
      return updatedData
    } catch (error) {
      console.error(`Error updating ${filename}:`, error)
      throw error
    }
  }

  // 公開URLを生成
  getPublicUrl(key: string): string {
    const cloudFrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN
    
    if (cloudFrontDomain) {
      return `https://${cloudFrontDomain}/${key}`
    }
    
    return `https://${this.bucketName}.s3.${process.env.AWS_REGION || 'ap-northeast-1'}.amazonaws.com/${key}`
  }

  // JSONデータの公開URLを取得
  getDataUrl(filename: string): string {
    return this.getPublicUrl(`data/${filename}`)
  }

  // バックアップを作成
  async createBackup(): Promise<void> {
    const timestamp = new Date().toISOString().split('T')[0]
    const files = ['stylists.json', 'menu.json', 'news.json', 'styles.json', 'salon.json']
    
    for (const file of files) {
      try {
        const data = await this.getJsonData(file)
        await this.saveJsonData(`backups/${timestamp}/${file}`, data)
        console.log(`✓ Backed up ${file}`)
      } catch (error) {
        console.error(`✗ Failed to backup ${file}:`, error)
      }
    }
  }

  // データの整合性チェック
  async validateData<T>(filename: string, validator: (data: any) => data is T): Promise<boolean> {
    try {
      const data = await this.getJsonData(filename)
      
      if (Array.isArray(data)) {
        return data.every(item => validator(item))
      } else {
        return validator(data)
      }
    } catch (error) {
      console.error(`Error validating ${filename}:`, error)
      return false
    }
  }
}

// シングルトンインスタンス
let dataManagerInstance: S3DataManager | null = null

export function getS3DataManager(): S3DataManager {
  if (!dataManagerInstance) {
    dataManagerInstance = new S3DataManager()
  }
  return dataManagerInstance
}