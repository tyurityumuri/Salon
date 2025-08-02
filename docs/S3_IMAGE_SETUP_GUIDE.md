# S3画像表示設定ガイド

## 概要

ウェブサイトで画像が正しく表示されるようにするためのS3設定ガイドです。

## 問題の原因

ウェブサイトでS3の画像が表示されない主な原因：

1. **CORS設定不足** - ブラウザがS3からの画像読み込みをブロック
2. **IAM権限不足** - CORS設定を行う権限がない
3. **フロントエンドコード** - 画像URLが実際に使用されていない

## 解決済みの問題

### ✅ フロントエンドコードの修正

以下のページで実際の画像URLを表示するように修正しました：

- **ホームページ** (`src/app/page.tsx`) - スタイリスト画像表示
- **スタイリスト一覧** (`src/app/stylists/page.tsx`) - スタイリスト画像表示
- **スタイリスト詳細** (`src/app/stylists/[id]/page.tsx`) - プロフィール画像表示
- **スタイルギャラリー** (`src/components/MasonryGrid.tsx`) - スタイル画像表示

### 実装した機能

1. **画像表示ロジック**：
   - 画像URLが存在する場合は実際の画像を表示
   - 画像の読み込み失敗時はプレースホルダーを表示
   - エラーハンドリング実装

```tsx
{stylist.image ? (
  <img
    src={stylist.image}
    alt={stylist.name}
    className="w-full h-full object-cover"
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.style.display = 'none';
      target.nextElementSibling?.classList.remove('hidden');
    }}
  />
) : null}
<div className={`fallback-placeholder ${stylist.image ? 'hidden' : ''}`}>
  <!-- プレースホルダーSVG -->
</div>
```

## 対応が必要な問題

### ❗ S3 CORS設定

現在、IAMユーザーに`s3:PutBucketCORS`権限がないため、CORS設定ができません。

#### 対処法1: IAMポリシーに権限追加

IAMユーザー`salon`に以下の権限を追加：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutBucketCORS",
        "s3:GetBucketCORS"
      ],
      "Resource": "arn:aws:s3:::nagase-salon-data"
    }
  ]
}
```

#### 対処法2: AWS Consoleで手動設定

1. AWS S3コンソールにアクセス
2. `nagase-salon-data`バケットを選択
3. 「アクセス許可」タブ → 「CORS」セクション
4. 以下のCORS設定を追加：

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

#### 対処法3: AWS CLIで設定

```bash
aws s3api put-bucket-cors --bucket nagase-salon-data --cors-configuration file://s3-cors-config.json
```

### 🔧 CORS設定後の確認

設定完了後、以下のコマンドで確認：

```bash
npm run s3:cors  # 権限があれば自動設定
```

または手動でテスト：

```bash
curl -H "Origin: http://localhost:3000" -I "https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/images/stylists/sato.jpg"
```

## バケット内の画像確認

現在S3に以下の画像が保存されています：

- **スタイリスト画像**: `images/stylists/` フォルダ
  - `tanaka.jpg`, `sato.jpg`, `yamada.jpg` など
- **スタイル画像**: `images/styles/` フォルダ
  - `style-1.jpg`, `style-2.jpg` など

## テスト用コマンド

### 画像アクセステスト
```bash
# 直接アクセステスト
curl -I "https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/images/stylists/sato.jpg"

# CORS テスト
curl -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: GET" -X OPTIONS "https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/images/stylists/sato.jpg"
```

### データ確認
```bash
# スタイリストデータの画像URL確認
curl -s "https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/data/stylists.json" | grep -A2 -B2 "image"

# スタイルデータの画像URL確認
curl -s "https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/data/styles.json" | grep -A2 -B2 "src"
```

## 本番環境での設定

本番環境では、CORS設定の`AllowedOrigins`を本番ドメインに限定することをお勧めします：

```json
{
  "AllowedOrigins": ["https://your-production-domain.com"]
}
```

## トラブルシューティング

### 画像が表示されない場合

1. **ブラウザのデベロッパーツールを確認**
   - Networkタブで画像リクエストのステータス確認
   - CORSエラーの有無確認

2. **画像URLの確認**
   - S3データに正しい画像URLが含まれているか
   - 画像ファイルが実際に存在するか

3. **CORS設定の確認**
   - S3バケットのCORS設定状況
   - `Access-Control-Allow-Origin`ヘッダーの有無

### よくあるエラー

- **CORS policy error**: CORS設定が必要
- **403 Forbidden**: バケットまたはオブジェクトのアクセス権限問題
- **404 Not Found**: 画像ファイルが存在しない

## 次のステップ

1. CORS設定を適用
2. 本番環境でのテスト
3. 画像最適化とパフォーマンス調整
4. CDN（CloudFront）の検討