# S3 JSONデータ管理システム セットアップガイド

このガイドでは、長瀬サロンのWebサイトでS3 JSONデータ管理システムを設定する手順を説明します。

## 1. 事前準備

### 必要なもの
- AWSアカウント
- AWS CLI（オプション、手動設定の場合は不要）
- 環境変数の設定

### AWS アカウント設定

1. **S3バケットの作成**
   ```bash
   # AWS Management Consoleでバケットを作成
   # バケット名例: nagase-salon-data
   # リージョン: ap-northeast-1 (東京)
   ```

2. **IAMユーザーの作成**
   - プログラムによるアクセスを有効化
   - 以下のポリシーをアタッチ:
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
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       },
       {
         "Effect": "Allow",
         "Action": ["s3:ListBucket"],
         "Resource": "arn:aws:s3:::your-bucket-name"
       }
     ]
   }
   ```

## 2. 環境変数の設定

`.env.local` ファイルを作成し、以下を設定：

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET_NAME=nagase-salon-data

# CloudFront (オプション)
AWS_CLOUDFRONT_DOMAIN=d1234567890123.cloudfront.net
AWS_CLOUDFRONT_DISTRIBUTION_ID=E1234567890123
```

## 3. 初期データのセットアップ

### 自動セットアップ（推奨）

```bash
# 初期データをS3にアップロード
npm run s3:setup

# 強制上書きする場合
npm run s3:setup -- --force
```

### 手動セットアップ（AWS CLI使用）

```bash
# AWS CLIの設定
aws configure

# 初期データのアップロード
aws s3 cp src/data/stylists.json s3://nagase-salon-data/data/stylists.json --acl public-read
aws s3 cp src/data/menu.json s3://nagase-salon-data/data/menu.json --acl public-read
aws s3 cp src/data/news.json s3://nagase-salon-data/data/news.json --acl public-read
aws s3 cp src/data/styles.json s3://nagase-salon-data/data/styles.json --acl public-read
aws s3 cp src/data/salon.json s3://nagase-salon-data/data/salon.json --acl public-read
```

## 4. データの検証

```bash
# S3上のデータの整合性をチェック
npm run s3:validate
```

成功すると以下のような出力が表示されます：
```
🔍 Starting S3 data validation...

👥 Validating stylists data...
✅ 3 stylists validated successfully

🍽️  Validating menu data...
✅ 8 menu items validated successfully

📰 Validating news data...
✅ 5 news items validated successfully

💇 Validating styles data...
✅ 12 style items validated successfully

🏢 Validating salon data...
✅ Salon info validated successfully

🎉 All data validation passed!
```

## 5. バックアップの作成

```bash
# データのバックアップを作成
npm run s3:backup

# カスタム名でバックアップ
npm run s3:backup -- --name=before-major-update
```

## 6. 運用手順

### 日常的な運用

1. **管理画面からのデータ更新**
   - 管理画面でデータを更新すると自動的にS3に保存されます

2. **定期バックアップ**
   ```bash
   # 週に1回実行を推奨
   npm run s3:backup
   ```

3. **データ検証**
   ```bash
   # 重要な変更後に実行
   npm run s3:validate
   ```

### トラブルシューティング

#### 1. 認証エラー
```
Error: The AWS Access Key Id you provided does not exist in our records
```
**解決方法:**
- `.env.local`のAWSクレデンシャルを確認
- IAMユーザーのアクセスキーが正しいか確認

#### 2. 権限エラー
```
Error: Access Denied
```
**解決方法:**
- IAMポリシーを確認
- S3バケットのアクセス許可を確認

#### 3. データが表示されない
```
Failed to fetch data from S3
```
**解決方法:**
1. データが正しくアップロードされているか確認:
   ```bash
   npm run s3:validate
   ```
2. バケット名とリージョンが正しいか確認
3. ネットワーク接続を確認

## 7. パフォーマンス最適化

### CloudFrontの設定（推奨）

1. **ディストリビューションの作成**
   - オリジン: S3バケット
   - キャッシュポリシー: JSONファイルは短時間（60秒）、画像は長時間（1日）

2. **環境変数の追加**
   ```bash
   AWS_CLOUDFRONT_DOMAIN=d1234567890123.cloudfront.net
   AWS_CLOUDFRONT_DISTRIBUTION_ID=E1234567890123
   ```

## 8. 監視とメンテナンス

### コスト監視
- S3の使用量とリクエスト数を定期的に確認
- CloudWatchアラームの設定を検討

### データ整合性
- 月に1回は完全な検証を実行
- 重要な更新前後でバックアップを作成

## 9. セキュリティ

### アクセス制御
- JSONファイル: パブリック読み取り可（サイト表示のため）
- 管理画面: 認証済みユーザーのみ書き込み可能
- IAMポリシー: 最小権限の原則

### データ保護
- 定期バックアップの自動化
- 機密情報の暗号化
- アクセスログの監視

## 10. 料金目安

| 項目 | 使用量 | 月間コスト |
|------|--------|------------|
| S3 ストレージ | 100MB | 約3円 |
| S3 リクエスト | 10,000回 | 約5円 |
| CloudFront 転送 | 10GB | 約120円 |
| **合計** | | **約130円** |

このシステムにより、月間数百円の低コストで運用できる美容室サイトが実現できます。