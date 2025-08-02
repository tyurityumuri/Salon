# 長瀬サロン - 美容室ウェブサイト

Ocean Tokyo風デザインの美容室ウェブサイトです。Next.js 14、TypeScript、Tailwind CSS、Firebase、AWS S3を使用して構築されています。

## 機能

### フロントエンド
- レスポンシブデザイン（Ocean Tokyo風）
- スタイリスト紹介ページ
- メニュー・料金表示
- スタイルギャラリー（Masonry レイアウト）
- ニュース・お知らせ
- 予約システム（ホットペッパービューティー連携）

### 管理画面
- 簡易認証システム
- スタイリスト管理（CRUD）
- メニュー管理（CRUD）
- ニュース管理（CRUD）
- サロン情報管理
- スタイルギャラリー管理（CRUD）
- S3画像アップロード機能

### 技術スタック
- **フロントエンド**: Next.js 14, React, TypeScript, Tailwind CSS
- **データベース**: Firebase Firestore
- **画像ストレージ**: AWS S3
- **認証**: Firebase Authentication（準備中）
- **ホスティング**: Vercel（推奨）

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env.local` を作成し、各サービスの設定値を入力してください。

```bash
cp .env.example .env.local
```

### 3. Firebase プロジェクトの設定

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成
2. Firestore Database を有効化
3. プロジェクト設定から設定値を取得し、`.env.local` に設定

### 4. AWS S3 の設定

1. AWS コンソールで S3 バケットを作成
2. IAM ユーザーを作成し、S3 への読み書き権限を付与
3. アクセスキーとシークレットキーを `.env.local` に設定

#### S3 バケット CORS 設定例

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["http://localhost:3000", "http://localhost:3001", "https://yourdomain.com"],
        "ExposeHeaders": ["ETag"]
    }
]
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

## 管理画面

管理画面には以下のURLからアクセスできます：

- URL: `http://localhost:3001/admin`
- ユーザー名: `admin`
- パスワード: `salon123`

### 管理可能な項目

1. **スタイリスト管理**
   - 基本情報（名前、役職、経歴など）
   - プロフィール画像（S3アップロード）
   - SNS リンク

2. **メニュー管理**
   - カテゴリ別メニュー
   - 料金・時間設定
   - 人気メニュー設定

3. **ニュース管理**
   - カテゴリ別ニュース（キャンペーン・イベント・お知らせ）
   - 画像付きニュース対応

4. **スタイルギャラリー管理**
   - スタイル画像（S3アップロード）
   - カテゴリ・タグ管理
   - スタイリスト別管理

5. **サロン情報管理**
   - 基本情報・営業時間
   - アクセス情報

## API エンドポイント

### スタイリスト
- `GET /api/stylists` - 全スタイリスト取得
- `POST /api/stylists` - スタイリスト追加
- `GET /api/stylists/[id]` - 特定スタイリスト取得
- `PUT /api/stylists/[id]` - スタイリスト更新
- `DELETE /api/stylists/[id]` - スタイリスト削除

### メニュー
- `GET /api/menu` - 全メニュー取得
- `GET /api/menu?category=カット` - カテゴリ別取得
- `GET /api/menu?popular=true` - 人気メニュー取得
- `POST /api/menu` - メニュー追加

### ニュース
- `GET /api/news` - 全ニュース取得
- `GET /api/news?category=campaign` - カテゴリ別取得
- `GET /api/news?limit=3` - 最新n件取得
- `POST /api/news` - ニュース追加

### 画像アップロード
- `POST /api/upload` - S3署名付きURL生成

## デプロイ

### Vercel への デプロイ

1. GitHub にプッシュ
2. Vercel で GitHub リポジトリを連携
3. 環境変数を Vercel の設定画面で追加
4. デプロイ

### 環境変数（本番環境）

本番環境では以下の環境変数が必要です：

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET_NAME=
AWS_CLOUDFRONT_DOMAIN=
```

## カスタマイズ

### デザインのカスタマイズ

`tailwind.config.ts` でカラーパレットやアニメーションをカスタマイズできます。

### データの初期化

Firebase Firestore にサンプルデータを投入する場合は、`src/data/` フォルダの JSON ファイルを参考にしてください。

## トラブルシューティング

### よくある問題

1. **Firebase の接続エラー**
   - 環境変数が正しく設定されているか確認
   - Firebase プロジェクトの設定を確認

2. **S3 アップロードエラー**
   - CORS 設定を確認
   - IAM 権限を確認
   - バケット名が正しいか確認

3. **画像が表示されない**
   - S3 バケットのパブリック読み取り権限を確認
   - CloudFront 設定を確認（使用している場合）

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## サポート

技術的な質問や問題があれば、GitHub Issues で報告してください。