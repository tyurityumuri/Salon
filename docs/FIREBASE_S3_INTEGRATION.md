# Firebase + S3 連携ドキュメント

## 概要

長瀬サロンのWebサイトでは、データ管理にFirebase Firestore、画像管理にAWS S3を使用しています。この文書では、両サービスの連携方法と設定手順を詳しく説明します。

## アーキテクチャ

```
Next.js Application
├── Firebase Firestore (データ管理)
│   ├── stylists (スタイリスト情報)
│   ├── menu (メニュー情報)
│   ├── news (ニュース)
│   ├── styles (スタイルギャラリー)
│   └── salon (サロン基本情報)
└── AWS S3 (画像管理)
    ├── images/stylists/ (スタイリスト画像)
    ├── images/styles/ (スタイル画像)
    └── images/news/ (ニュース画像)
```

## 1. Firebase 設定

### 1.1 プロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例：nagase-salon）
4. Google Analytics は任意で設定

### 1.2 Firestore Database 設定

1. Firebase Console でプロジェクトを選択
2. 左メニューから「Firestore Database」を選択
3. 「データベースの作成」をクリック
4. セキュリティルールを「テストモードで開始」を選択
5. ロケーションを「asia-northeast1 (Tokyo)」に設定

### 1.3 プロジェクト設定の取得

1. プロジェクト設定（歯車アイコン）をクリック
2. 「全般」タブの「マイアプリ」セクションで「ウェブアプリを追加」
3. アプリ名を入力して登録
4. 設定オブジェクトの値を `.env.local` に設定

```javascript
// Firebase 設定例
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "nagase-salon.firebaseapp.com",
  projectId: "nagase-salon",
  storageBucket: "nagase-salon.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

### 1.4 セキュリティルール（本番用）

開発完了後、以下のルールに変更することを推奨：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 管理画面からの書き込みのみ許可
    match /{document=**} {
      allow read: if true; // 全ユーザーが読み取り可能
      allow write: if request.auth != null; // 認証ユーザーのみ書き込み可能
    }
  }
}
```

## 2. AWS S3 設定

### 2.1 S3 バケット作成

1. AWS Management Console にログイン
2. S3 サービスに移動
3. 「バケットを作成」をクリック
4. バケット名を入力（例：nagase-salon-images）
5. リージョンを「アジアパシフィック（東京）ap-northeast-1」に設定
6. パブリック読み取りアクセスを許可（画像表示のため）

### 2.2 CORS 設定

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

### 2.3 IAM ユーザー作成

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
            "Resource": "arn:aws:s3:::nagase-salon-images/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::nagase-salon-images"
        }
    ]
}
```

6. アクセスキーとシークレットアクセスキーを保存

## 3. 環境変数設定

`.env.local` ファイルを作成し、以下を設定：

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nagase-salon.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nagase-salon
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nagase-salon.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET_NAME=nagase-salon-images

# Optional: CloudFront Distribution Domain
AWS_CLOUDFRONT_DOMAIN=d1234567890123.cloudfront.net
```

## 4. データ構造

### 4.1 Firestore コレクション構造

```
firestore/
├── stylists/
│   └── {stylistId}
│       ├── name: string
│       ├── position: string
│       ├── bio: string
│       ├── experience: number
│       ├── rating: number
│       ├── reviewCount: number
│       ├── specialties: string[]
│       ├── social: object
│       └── image: string (S3 URL)
├── menu/
│   └── {menuId}
│       ├── name: string
│       ├── category: string
│       ├── description: string
│       ├── price: number
│       ├── duration: number
│       ├── isPopular: boolean
│       └── options: array
├── news/
│   └── {newsId}
│       ├── title: string
│       ├── content: string
│       ├── category: string
│       ├── date: string
│       └── image?: string (S3 URL)
├── styles/
│   └── {styleId}
│       ├── src: string (S3 URL)
│       ├── alt: string
│       ├── category: string
│       ├── tags: string[]
│       ├── stylistName: string
│       └── height: number
└── salon/
    └── info
        ├── name: string
        ├── address: string
        ├── phone: string
        ├── email: string
        ├── businessHours: object
        ├── closedDays: string[]
        ├── googleMapsUrl: string
        ├── accessInfo: string[]
        └── parkingInfo: string
```

### 4.2 S3 ディレクトリ構造

```
s3://nagase-salon-images/
├── images/
│   ├── stylists/
│   │   ├── 1234567890-abc123.jpg
│   │   └── 1234567891-def456.jpg
│   ├── styles/
│   │   ├── 1234567892-ghi789.jpg
│   │   └── 1234567893-jkl012.jpg
│   └── news/
│       ├── 1234567894-mno345.jpg
│       └── 1234567895-pqr678.jpg
```

## 5. APIエンドポイント詳細

### 5.1 スタイリスト API

**GET /api/stylists**
```javascript
// レスポンス例
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

**POST /api/stylists**
```javascript
// リクエストボディ例
{
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
```

### 5.2 画像アップロード API

**POST /api/upload**
```javascript
// リクエストボディ
{
  "filename": "profile.jpg",
  "contentType": "image/jpeg",
  "category": "stylists"
}

// レスポンス
{
  "uploadUrl": "https://nagase-salon-images.s3.ap-northeast-1.amazonaws.com/...",
  "publicUrl": "https://d1234567890123.cloudfront.net/images/stylists/1234567890-abc123.jpg",
  "imageKey": "images/stylists/1234567890-abc123.jpg"
}
```

## 6. 画像アップロードフロー

### 6.1 フロントエンド（ImageUpload コンポーネント）

1. ユーザーが画像を選択
2. `POST /api/upload` で署名付きURLを取得
3. 署名付きURLに直接画像をアップロード
4. アップロード完了後、公開URLを取得
5. 公開URLをフォームデータに設定

### 6.2 バックエンド処理

```javascript
// 署名付きURL生成
const command = new PutObjectCommand({
  Bucket: BUCKET_NAME,
  Key: imageKey,
  ContentType: contentType,
});
const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

// 公開URL生成
const publicUrl = cloudFrontDomain 
  ? `https://${cloudFrontDomain}/${imageKey}`
  : `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${imageKey}`;
```

## 7. セキュリティ考慮事項

### 7.1 Firebase セキュリティ

- 本番環境ではFirebase Authenticationを実装
- Firestoreのセキュリティルールで書き込み制限
- APIキーの適切な管理

### 7.2 S3 セキュリティ

- IAMユーザーの最小権限設定
- 署名付きURLの有効期限設定（1時間）
- CORS設定による適切なオリジン制限

### 7.3 Next.js セキュリティ

- 環境変数の適切な管理（NEXT_PUBLIC_ プレフィックス注意）
- API ルートでの入力値検証
- CSRFトークンの実装（必要に応じて）

## 8. パフォーマンス最適化

### 8.1 CloudFront 設定（推奨）

1. CloudFront ディストリビューションを作成
2. オリジンをS3バケットに設定
3. キャッシュ設定を画像に最適化
4. `AWS_CLOUDFRONT_DOMAIN` 環境変数に設定

### 8.2 画像最適化

```javascript
// Next.js Image コンポーネントの活用
import Image from 'next/image'

<Image
  src={stylist.image}
  alt={stylist.name}
  width={300}
  height={300}
  className="rounded-full"
  loading="lazy"
/>
```

## 9. 監視・ログ

### 9.1 Firebase 監視

- Firebase Console の使用量監視
- Firestoreの読み書き回数チェック
- エラーログの確認

### 9.2 S3 監視

- CloudWatch でリクエスト数監視
- S3のストレージ使用量確認
- データ転送量の監視

## 10. バックアップ戦略

### 10.1 Firestore バックアップ

```bash
# Firebase CLI でエクスポート
firebase firestore:export gs://nagase-salon-backup/firestore/$(date +%Y%m%d)
```

### 10.2 S3 バックアップ

- S3のバージョニング機能を有効化
- 別リージョンへのクロスリージョンレプリケーション
- 定期的なフルバックアップの実施

## 11. トラブルシューティング

### 11.1 よくあるエラー

**Firebase接続エラー**
```
Error: Firebase: No Firebase App '[DEFAULT]' has been created
```
- 環境変数の確認
- Firebase初期化コードの確認

**S3 CORS エラー**
```
Access to fetch at 'https://...' from origin 'http://localhost:3000' has been blocked by CORS policy
```
- S3バケットのCORS設定確認
- オリジンの設定確認

**アップロード権限エラー**
```
AccessDenied: Access Denied
```
- IAMユーザーの権限確認
- バケットポリシーの確認

### 11.2 デバッグ方法

1. ブラウザの開発者ツールでネットワークタブを確認
2. サーバーログでエラー詳細を確認
3. Firebase Console / AWS Console でリソース状態を確認

## 12. 本番デプロイ時の注意点

1. 環境変数をプロダクション環境に設定
2. Firestoreセキュリティルールを本番用に変更
3. S3バケットの公開設定を確認
4. CloudFrontの設定（推奨）
5. ドメインのCORS設定を更新

このドキュメントに従って設定することで、Firebase + S3の完全な連携システムが構築できます。