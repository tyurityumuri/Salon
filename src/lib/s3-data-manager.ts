import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'

export class S3DataManager {
  private s3Client: S3Client | null
  private bucketName: string | null
  private useLocal: boolean

  constructor() {
    // 環境変数の存在チェック
    const hasS3Config = !!(
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_S3_BUCKET_NAME
    )

    this.useLocal = !hasS3Config

    if (hasS3Config) {
      this.s3Client = new S3Client({
        region: process.env.AWS_REGION || 'ap-northeast-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      })
      this.bucketName = process.env.AWS_S3_BUCKET_NAME!
    } else {
      this.s3Client = null
      this.bucketName = null
      console.log('S3 configuration not found, using local files')
    }
  }

  // ローカルファイルから読み込み
  private async getLocalJsonData<T>(filename: string): Promise<T> {
    try {
      const filePath = path.join(process.cwd(), 'src', 'data', filename)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(fileContent)
    } catch (error) {
      console.error(`Error reading local file ${filename}:`, error)
      throw new Error(`Failed to read local file ${filename}`)
    }
  }

  // ローカルファイルに保存
  private async saveLocalJsonData<T>(filename: string, data: T): Promise<void> {
    try {
      const filePath = path.join(process.cwd(), 'src', 'data', filename)
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
      console.log(`Successfully saved ${filename} locally`)
    } catch (error) {
      console.error(`Error saving local file ${filename}:`, error)
      throw new Error(`Failed to save local file ${filename}`)
    }
  }

  // JSONファイルを取得
  async getJsonData<T>(filename: string): Promise<T> {
    console.log('=== S3DataManager.getJsonData ===')
    console.log(`[FILE] ${filename}`)
    console.log(`[SOURCE] ${this.useLocal ? 'LOCAL' : 'S3'}`)
    
    if (this.useLocal) {
      console.log('[LOCAL] Loading from local file')
      return this.getLocalJsonData<T>(filename)
    }

    try {
      const s3Key = `data/${filename}`
      console.log(`[S3 KEY] ${s3Key}`)
      console.log(`[BUCKET] ${this.bucketName}`)
      
      const command = new GetObjectCommand({
        Bucket: this.bucketName!,
        Key: s3Key,
      })

      const response = await this.s3Client!.send(command)
      const body = await response.Body?.transformToString()
      
      if (!body) {
        throw new Error(`No data received from ${filename}`)
      }

      const data = JSON.parse(body)
      console.log('[SUCCESS] Data loaded from S3')
      console.log(`[SIZE] ${body.length} bytes`)
      console.log('=====================')
      
      return data
    } catch (error) {
      console.error(`[ERROR] Failed to get ${filename} from S3:`, error)
      // S3で失敗した場合、ローカルファイルにフォールバック
      console.log(`[FALLBACK] Using local file for ${filename}`)
      return this.getLocalJsonData<T>(filename)
    }
  }

  // JSONファイルを保存
  async saveJsonData<T>(filename: string, data: T): Promise<void> {
    if (this.useLocal) {
      return this.saveLocalJsonData(filename, data)
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName!,
        Key: `data/${filename}`,
        Body: JSON.stringify(data, null, 2),
        ContentType: 'application/json',
      })

      await this.s3Client!.send(command)
      console.log(`Successfully saved ${filename} to S3`)
    } catch (error) {
      console.error(`Error saving ${filename} to S3:`, error)
      // S3で失敗した場合、ローカルファイルにフォールバック
      console.log(`Falling back to local file for ${filename}`)
      return this.saveLocalJsonData(filename, data)
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
      
      // 保存
      await this.saveJsonData(filename, updatedData)
      
      return updatedData
    } catch (error) {
      console.error(`Error updating ${filename}:`, error)
      throw error
    }
  }

  // 公開URLを生成
  getPublicUrl(key: string): string {
    if (this.useLocal) {
      // ローカル環境では相対パスを返す
      return `/data/${key}`
    }

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
    if (this.useLocal) {
      console.log('Backup not supported in local mode')
      return
    }

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