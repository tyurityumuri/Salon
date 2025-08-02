# S3 + JSON データ管理システム

## 概要

長瀬サロンのWebサイトでは、データ管理にAWS S3上のJSONファイル、画像管理にS3を使用します。この方式により、低コストで運用でき、データベース不要のシンプルなアーキテクチャを実現します。

## アーキテクチャ

```
Next.js Application
└── AWS S3 (データ + 画像管理)
    ├── data/
    │   ├── stylists.json (スタイリスト情報)
    │   ├── menu.json (メニュー情報)
    │   ├── news.json (ニュース)
    │   ├── styles.json (スタイルギャラリー)
    │   └── salon.json (サロン基本情報)
    └── images/
        ├── stylists/ (スタイリスト画像)
        ├── styles/ (スタイル画像)
        └── news/ (ニュース画像)
```

## 1. AWS S3 設定

### 1.1 S3 バケット作成

1. AWS Management Console にログイン
2. S3 サービスに移動
3. 「バケットを作成」をクリック
4. バケット名を入力（例：nagase-salon-data）
5. リージョンを「アジアパシフィック（東京）ap-northeast-1」に設定
6. パブリック読み取りアクセスを許可（JSONファイル読み取りのため）

### 1.2 バケット構造設定

```
s3://nagase-salon-data/
├── data/
│   ├── stylists.json
│   ├── menu.json
│   ├── news.json
│   ├── styles.json
│   └── salon.json
└── images/
    ├── stylists/
    │   ├── 1234567890-abc123.jpg
    │   └── 1234567891-def456.jpg
    ├── styles/
    │   ├── 1234567892-ghi789.jpg
    │   └── 1234567893-jkl012.jpg
    └── news/
        ├── 1234567894-mno345.jpg
        └── 1234567895-pqr678.jpg
```

### 1.3 CORS 設定

S3 バケットの「アクセス許可」タブで CORS 設定を追加：

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE",
            "HEAD"
        ],
        "AllowedOrigins": [
            "http://localhost:3000",
            "http://localhost:3001",
            "https://yourdomain.com",
            "https://*.vercel.app"
        ],
        "ExposeHeaders": [
            "ETag",
            "x-amz-server-side-encryption",
            "x-amz-request-id",
            "x-amz-id-2"
        ]
    }
]
```

### 1.4 IAM ユーザー作成

1. IAM コンソールに移動
2. 「ユーザー」→「ユーザーを追加」
3. ユーザー名を入力（例：nagase-salon-s3-user）
4. 「プログラムによるアクセス」を選択
5. 「既存のポリシーを直接アタッチ」で以下のポリシーを作成・アタッチ：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::nagase-salon-data/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::nagase-salon-data"
        }
    ]
}
```

### 1.5 CloudFront 設定（推奨）

1. CloudFront ディストリビューションを作成
2. オリジンをS3バケットに設定
3. キャッシュ設定：
   - JSONファイル: TTL 60秒（頻繁に更新されるため）
   - 画像ファイル: TTL 1日（変更頻度が低いため）

## 2. 環境変数設定

`.env.local` ファイルを作成し、以下を設定：

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET_NAME=nagase-salon-data

# CloudFront Distribution Domain (推奨)
AWS_CLOUDFRONT_DOMAIN=d1234567890123.cloudfront.net
```

## 3. データ構造

### 3.1 JSONファイル構造

**stylists.json**
```json
[
  {
    "id": "stylist1",
    "name": "田中 太郎",
    "position": "チーフスタイリスト",
    "bio": "経験豊富なスタイリストです...",
    "experience": 8,
    "rating": 4.8,
    "reviewCount": 150,
    "specialties": ["カット", "カラー"],
    "social": {
      "instagram": "https://instagram.com/tanaka"
    },
    "image": "https://d1234567890123.cloudfront.net/images/stylists/1234567890-abc123.jpg"
  }
]
```

**menu.json**
```json
[
  {
    "id": "menu1",
    "name": "カット",
    "category": "カット",
    "description": "お客様の髪質や顔型に合わせたカット",
    "price": 5000,
    "duration": 60,
    "isPopular": true,
    "options": [
      {
        "name": "シャンプー",
        "additionalPrice": 500
      }
    ]
  }
]
```

**news.json**
```json
[
  {
    "id": "news1",
    "title": "春のキャンペーン開始",
    "content": "新メニューを特別価格で提供...",
    "category": "campaign",
    "date": "2024-03-01",
    "image": "https://d1234567890123.cloudfront.net/images/news/1234567890-abc123.jpg"
  }
]
```

**styles.json**
```json
[
  {
    "id": "style1",
    "src": "https://d1234567890123.cloudfront.net/images/styles/1234567890-abc123.jpg",
    "alt": "ナチュラルマッシュボブ",
    "category": "ボブ",
    "tags": ["ナチュラル", "小顔"],
    "stylistName": "田中 太郎",
    "height": 400
  }
]
```

**salon.json**
```json
{
  "name": "長瀬サロン",
  "address": "〒100-0004 東京都千代田区大手町1-1-1",
  "phone": "03-1234-5678",
  "email": "info@nagase-salon.com",
  "businessHours": {
    "月": { "open": "10:00", "close": "20:00" },
    "火": { "open": "10:00", "close": "20:00" },
    "水": { "open": "休業日", "close": "休業日" },
    "木": { "open": "10:00", "close": "20:00" },
    "金": { "open": "10:00", "close": "20:00" },
    "土": { "open": "09:00", "close": "19:00" },
    "日": { "open": "09:00", "close": "19:00" }
  },
  "closedDays": ["水曜日"],
  "googleMapsUrl": "https://maps.google.com/",
  "accessInfo": [
    "JR東京駅から徒歩5分",
    "地下鉄大手町駅A1出口から徒歩3分"
  ],
  "parkingInfo": "提携駐車場あり（2時間まで無料）"
}
```

## 4. データ管理フロー

### 4.1 データ読み取りフロー

```mermaid
sequenceDiagram
    participant Client as フロントエンド
    participant API as Next.js API
    participant S3 as AWS S3
    participant CDN as CloudFront

    Client->>API: データ要求
    API->>CDN: JSONファイル取得
    CDN->>S3: キャッシュミス時
    S3-->>CDN: JSONファイル
    CDN-->>API: JSONファイル
    API-->>Client: JSONデータ
```

### 4.2 データ更新フロー

```mermaid
sequenceDiagram
    participant Admin as 管理画面
    participant API as Next.js API
    participant S3 as AWS S3
    participant CDN as CloudFront

    Admin->>API: データ更新要求
    API->>S3: 現在のJSONファイル取得
    S3-->>API: 現在のJSONファイル
    API->>API: データ更新処理
    API->>S3: 更新されたJSONファイル保存
    API->>CDN: キャッシュ無効化
    API-->>Admin: 更新完了
```

## 5. API実装

### 5.1 S3データ管理クラス

```typescript
// lib/s3-data-manager.ts
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront'

export class S3DataManager {
  private s3Client: S3Client
  private cloudFrontClient: CloudFrontClient
  private bucketName: string
  private cloudFrontDistributionId?: string

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
    
    this.cloudFrontClient = new CloudFrontClient({
      region: 'us-east-1', // CloudFrontは常にus-east-1
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
    
    this.bucketName = process.env.AWS_S3_BUCKET_NAME!
    this.cloudFrontDistributionId = process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID
  }

  // JSONファイルを取得
  async getJsonData<T>(filename: string): Promise<T> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: `data/${filename}`,
    })

    const response = await this.s3Client.send(command)
    const body = await response.Body?.transformToString()
    
    if (!body) {
      throw new Error(`Failed to get data from ${filename}`)
    }

    return JSON.parse(body)
  }

  // JSONファイルを保存
  async saveJsonData<T>(filename: string, data: T): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: `data/${filename}`,
      Body: JSON.stringify(data, null, 2),
      ContentType: 'application/json',
    })

    await this.s3Client.send(command)
    
    // CloudFrontキャッシュを無効化
    await this.invalidateCache([`/data/${filename}`])
  }

  // CloudFrontキャッシュ無効化
  private async invalidateCache(paths: string[]): Promise<void> {
    if (!this.cloudFrontDistributionId) return

    const command = new CreateInvalidationCommand({
      DistributionId: this.cloudFrontDistributionId,
      InvalidationBatch: {
        Paths: {
          Quantity: paths.length,
          Items: paths,
        },
        CallerReference: Date.now().toString(),
      },
    })

    await this.cloudFrontClient.send(command)
  }

  // 公開URLを生成
  getPublicUrl(key: string): string {
    const cloudFrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN
    
    if (cloudFrontDomain) {
      return `https://${cloudFrontDomain}/${key}`
    }
    
    return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
  }
}
```

### 5.2 スタイリスト管理API

```typescript
// app/api/stylists/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { S3DataManager } from '@/lib/s3-data-manager'
import { Stylist } from '@/types'

const dataManager = new S3DataManager()

export async function GET() {
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
  try {
    const body = await request.json()
    
    // 現在のスタイリストデータを取得
    const stylists = await dataManager.getJsonData<Stylist[]>('stylists.json')
    
    // 新しいスタイリストを追加
    const newStylist: Stylist = {
      id: Date.now().toString(),
      ...body
    }
    
    stylists.push(newStylist)
    
    // S3に保存
    await dataManager.saveJsonData('stylists.json', stylists)
    
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
```

## 6. 初期データセットアップ

### 6.1 AWS CLI を使用したセットアップ

```bash
# AWS CLI設定
aws configure
# Access Key ID: AKIAXXXXXXXXXXXXXXXX
# Secret Access Key: your_secret_access_key
# Default region: ap-northeast-1
# Default output format: json

# 初期JSONファイルをアップロード
aws s3 cp src/data/stylists.json s3://nagase-salon-data/data/stylists.json
aws s3 cp src/data/menu.json s3://nagase-salon-data/data/menu.json
aws s3 cp src/data/news.json s3://nagase-salon-data/data/news.json
aws s3 cp src/data/styles.json s3://nagase-salon-data/data/styles.json
aws s3 cp src/data/salon.json s3://nagase-salon-data/data/salon.json

# パブリック読み取り権限を設定
aws s3api put-object-acl --bucket nagase-salon-data --key data/stylists.json --acl public-read
aws s3api put-object-acl --bucket nagase-salon-data --key data/menu.json --acl public-read
aws s3api put-object-acl --bucket nagase-salon-data --key data/news.json --acl public-read
aws s3api put-object-acl --bucket nagase-salon-data --key data/styles.json --acl public-read
aws s3api put-object-acl --bucket nagase-salon-data --key data/salon.json --acl public-read
```

### 6.2 Node.js スクリプトでのセットアップ

```typescript
// scripts/setup-s3-data.ts
import { S3DataManager } from '../src/lib/s3-data-manager'
import stylistsData from '../src/data/stylists.json'
import menuData from '../src/data/menu.json'
import newsData from '../src/data/news.json'
import stylesData from '../src/data/styles.json'
import salonData from '../src/data/salon.json'

async function setupS3Data() {
  const dataManager = new S3DataManager()
  
  try {
    console.log('Uploading initial data to S3...')
    
    await dataManager.saveJsonData('stylists.json', stylistsData)
    console.log('✓ Stylists data uploaded')
    
    await dataManager.saveJsonData('menu.json', menuData)
    console.log('✓ Menu data uploaded')
    
    await dataManager.saveJsonData('news.json', newsData)
    console.log('✓ News data uploaded')
    
    await dataManager.saveJsonData('styles.json', stylesData)
    console.log('✓ Styles data uploaded')
    
    await dataManager.saveJsonData('salon.json', salonData)
    console.log('✓ Salon data uploaded')
    
    console.log('All data uploaded successfully!')
  } catch (error) {
    console.error('Error uploading data:', error)
  }
}

setupS3Data()
```

## 7. バックアップ戦略

### 7.1 自動バックアップ

```typescript
// scripts/backup-s3-data.ts
import { S3DataManager } from '../src/lib/s3-data-manager'

async function backupData() {
  const dataManager = new S3DataManager()
  const timestamp = new Date().toISOString().split('T')[0]
  
  const files = ['stylists.json', 'menu.json', 'news.json', 'styles.json', 'salon.json']
  
  for (const file of files) {
    try {
      const data = await dataManager.getJsonData(file)
      await dataManager.saveJsonData(`backups/${timestamp}/${file}`, data)
      console.log(`✓ Backed up ${file}`)
    } catch (error) {
      console.error(`✗ Failed to backup ${file}:`, error)
    }
  }
}

// 毎日実行するcronジョブとして設定
backupData()
```

### 7.2 復元スクリプト

```typescript
// scripts/restore-s3-data.ts
async function restoreData(backupDate: string) {
  const dataManager = new S3DataManager()
  
  const files = ['stylists.json', 'menu.json', 'news.json', 'styles.json', 'salon.json']
  
  for (const file of files) {
    try {
      const backupData = await dataManager.getJsonData(`backups/${backupDate}/${file}`)
      await dataManager.saveJsonData(file, backupData)
      console.log(`✓ Restored ${file}`)
    } catch (error) {
      console.error(`✗ Failed to restore ${file}:`, error)
    }
  }
}
```

## 8. セキュリティ考慮事項

### 8.1 アクセス制御

- JSONファイル: パブリック読み取り可（サイト表示のため）
- 管理画面からの書き込み: 認証済みユーザーのみ
- IAMポリシーによる最小権限設定

### 8.2 データ検証

```typescript
// lib/data-validator.ts
export function validateStylistData(data: any): data is Stylist {
  return (
    typeof data.name === 'string' &&
    typeof data.position === 'string' &&
    typeof data.bio === 'string' &&
    typeof data.experience === 'number' &&
    typeof data.rating === 'number' &&
    typeof data.reviewCount === 'number' &&
    Array.isArray(data.specialties)
  )
}
```

## 9. パフォーマンス最適化

### 9.1 キャッシュ戦略

- **CloudFront**: JSONファイルは60秒、画像は1日
- **ブラウザキャッシュ**: APIレスポンスに適切なCache-Controlヘッダー
- **メモリキャッシュ**: Next.jsのインメモリキャッシュ

### 9.2 監視

```typescript
// lib/performance-monitor.ts
export class PerformanceMonitor {
  static async logDataAccess(operation: string, filename: string, duration: number) {
    console.log(`S3 ${operation} ${filename}: ${duration}ms`)
    
    // CloudWatch メトリクスに送信（本番環境）
    if (process.env.NODE_ENV === 'production') {
      // CloudWatch SDK implementation
    }
  }
}
```

## 10. 運用コスト

### 10.1 コスト試算（月間）

| 項目 | 使用量 | 月間コスト |
|------|--------|------------|
| S3 ストレージ | 100MB | 3円 |
| S3 リクエスト | 10,000回 | 5円 |
| CloudFront 転送 | 10GB | 120円 |
| **合計** | | **約130円** |

### 10.2 コスト最適化

- 古いバックアップファイルの自動削除
- CloudFrontキャッシュ期間の最適化
- 不要なリクエストの削減

このS3 + JSON管理システムにより、月間数百円の低コストで運用できる美容室サイトが実現できます。