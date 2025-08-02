# S3 CORS設定ガイド

## 現在の問題

画像アップロード時に以下のCORSエラーが発生しています：

```
Access to fetch at 'https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/...' 
from origin 'http://localhost:3000' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 解決方法

### オプション1: AWS コンソールでCORS設定（推奨）

1. **AWS S3コンソールにアクセス**
   - https://s3.console.aws.amazon.com/s3/home
   - `nagase-salon-data` バケットを選択

2. **CORSの設定**
   - 「アクセス許可」タブをクリック
   - 「CORS」セクションまでスクロール
   - 「編集」ボタンをクリック

3. **CORS設定を入力**
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "HEAD", "PUT", "POST"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

4. **変更を保存**
   - 「変更を保存」ボタンをクリック

### オプション2: IAM権限追加後、自動設定

#### ステップ1: IAM権限の追加

1. **AWS IAMコンソールにアクセス**
   - https://console.aws.amazon.com/iam/
   - 「ユーザー」→ `salon` ユーザーを選択

2. **インラインポリシーを追加**
   - 「アクセス許可」タブ
   - 「インラインポリシーを追加」をクリック
   - 「JSON」タブを選択

3. **以下のポリシーを追加**
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

4. **ポリシー名を設定**
   - 名前: `S3-CORS-Policy`
   - 「ポリシーの作成」をクリック

#### ステップ2: 自動CORS設定の実行

権限追加後、以下のコマンドを実行：

```bash
npm run s3:cors
```

### オプション3: AWS CLI使用（要インストール）

1. **AWS CLIのインストール**
   ```bash
   # macOS
   brew install awscli
   
   # または
   pip install awscli
   ```

2. **AWS認証情報の設定**
   ```bash
   aws configure
   # Access Key ID: AKIAQKPIMALXOEESCJTP
   # Secret Access Key: [your-secret]
   # Default region: ap-northeast-1
   # Default output format: json
   ```

3. **CORS設定の適用**
   ```bash
   aws s3api put-bucket-cors --bucket nagase-salon-data --cors-configuration file://s3-cors-config.json
   ```

## 設定確認方法

### 1. ブラウザでのテスト

```javascript
// ブラウザのコンソールで実行
fetch('https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/data/salon.json', {
  method: 'HEAD'
}).then(response => {
  console.log('CORS Test Success:', response.status)
}).catch(error => {
  console.log('CORS Test Failed:', error)
})
```

### 2. curlでのテスト

```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: PUT" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     "https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/images/test.jpg"
```

成功した場合、以下のヘッダーが返されます：
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, PUT, POST
Access-Control-Allow-Headers: *
```

## 本番環境での推奨設定

本番環境では、セキュリティのためにオリジンを制限してください：

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD", "PUT", "POST"],
    "AllowedOrigins": ["https://your-production-domain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## トラブルシューティング

### よくあるエラー

1. **`AccessDenied`**: IAMユーザーにCORS設定権限がない
   → IAM権限を追加（オプション2参照）

2. **`CORS policy error`**: CORS設定が未適用または不正
   → CORS設定を確認・再適用

3. **`Failed to fetch`**: ネットワークまたはCORS問題
   → ブラウザのネットワークタブで詳細確認

### デバッグ手順

1. **ブラウザのデベロッパーツール**
   - ネットワークタブでリクエスト詳細確認
   - プリフライトリクエスト（OPTIONS）の確認

2. **S3バケットの設定確認**
   - AWS S3コンソールでCORS設定確認
   - バケットポリシーとの競合確認

3. **環境変数の確認**
   - `.env.local`の設定確認
   - バケット名・リージョンの確認

## 次のステップ

1. **CORS設定を適用**（オプション1が最も確実）
2. **画像アップロード機能のテスト**
3. **本番環境用のCORS設定準備**