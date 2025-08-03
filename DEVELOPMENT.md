# 開発ガイド

## 🔄 Gitワークフロー

### ブランチ構成
```
main           # 本番環境 (Vercel自動デプロイ)
├── develop    # 開発統合ブランチ (Vercelプレビュー)
│   ├── feature/機能名
│   ├── bugfix/修正名
│   └── hotfix/緊急修正
```

### 開発フロー

#### 1. 新機能開発
```bash
# 開発ブランチから機能ブランチを作成
git checkout develop
git pull origin develop
git checkout -b feature/新機能名

# 開発作業
npm run dev
# コーディング...

# コミット・プッシュ
git add .
git commit -m "feat: 新機能を追加"
git push origin feature/新機能名

# GitHub でプルリクエスト作成
# develop ← feature/新機能名
```

#### 2. 本番リリース
```bash
# developから本番リリース
git checkout main
git pull origin main
git merge develop
git push origin main

# または main ← develop のプルリクエスト
```

### コミットメッセージ規約
```
feat: 新機能
fix: バグ修正
docs: ドキュメント
style: フォーマット
refactor: リファクタリング
test: テスト
chore: その他
```

## 🚀 Vercel設定

### 推奨設定
- **Production Branch**: `main`
- **Preview Branch**: `develop` + プルリクエスト
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 環境変数
```
Production:  本番用AWS認証情報
Preview:     開発用AWS認証情報
Development: ローカル開発用
```

## 📱 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 型チェック
npm run type-check

# Lint
npm run lint

# S3セットアップ
npm run s3:setup
```

## 🛡️ セキュリティ

- **.env**ファイルはコミット禁止
- **AWS認証情報**は環境変数で管理
- **本番・開発でS3バケットを分離**推奨

## 🚀 本番デプロイ手順

### 事前確認チェックリスト
```bash
# 1. ローカルでビルドテスト
npm run build

# 2. 型チェック
npm run type-check

# 3. Lint確認
npm run lint

# 4. 開発サーバー動作確認
npm run dev
```

### デプロイフロー（推奨）

#### Step 1: developブランチへマージ
```bash
# 1. developブランチに切り替え
git checkout develop
git pull origin develop

# 2. featureブランチをマージ
git merge feature/機能名

# 3. developブランチにプッシュ
git push origin develop
```

#### Step 2: プレビュー環境で確認
- Vercelが自動的にプレビューデプロイを実行
- プレビューURLで動作確認
- 問題があれば修正してStep 1を繰り返し

#### Step 3: 本番デプロイ
```bash
# 1. mainブランチに切り替え
git checkout main
git pull origin main

# 2. developをmainにマージ
git merge develop

# 3. 本番環境にデプロイ
git push origin main
```

### GitHub プルリクエスト経由（推奨）

#### Step 1: feature → develop PR
1. GitHub で `develop ← feature/機能名` のPR作成
2. コードレビュー・確認
3. PR マージ
4. Vercel プレビューで動作確認

#### Step 2: develop → main PR
1. GitHub で `main ← develop` のPR作成
2. 最終確認・動作テスト
3. PR マージ → 本番自動デプロイ

### 緊急時（Hotfix）
```bash
# 1. mainブランチから直接hotfixブランチ作成
git checkout main
git pull origin main
git checkout -b hotfix/緊急修正名

# 2. 修正・テスト
npm run build
npm run type-check

# 3. mainに直接マージ
git checkout main
git merge hotfix/緊急修正名
git push origin main

# 4. developにも反映
git checkout develop
git merge main
git push origin develop
```

### Vercel設定確認

#### 必須設定
- **Production Branch**: `main`
- **Preview Deployment**: Enabled
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node.js Version**: 18.x

#### 環境変数設定
```
Production環境:
- AWS_ACCESS_KEY_ID=本番用
- AWS_SECRET_ACCESS_KEY=本番用
- AWS_REGION=ap-northeast-1
- AWS_BUCKET_NAME=本番用バケット名

Preview環境:
- AWS_ACCESS_KEY_ID=開発用
- AWS_SECRET_ACCESS_KEY=開発用
- AWS_REGION=ap-northeast-1
- AWS_BUCKET_NAME=開発用バケット名
```

### デプロイ後確認事項

#### 必須チェック
- [ ] サイトが正常に表示される
- [ ] 全ページの動作確認
- [ ] 画像が正しく表示される
- [ ] フォームが正常に動作する
- [ ] S3画像アップロードが動作する
- [ ] レスポンシブデザインの確認

#### パフォーマンス確認
- [ ] ページ読み込み速度
- [ ] Lighthouse スコア確認
- [ ] Core Web Vitals確認

### ロールバック手順
```bash
# 1. 前回の正常なコミットを確認
git log --oneline -10

# 2. 該当コミットに戻す
git checkout main
git reset --hard [正常なコミットハッシュ]

# 3. 強制プッシュ（緊急時のみ）
git push origin main --force
```

### 📋 デプロイチェックリスト

#### 開発完了時
- [ ] ローカルでビルド成功
- [ ] 型エラーなし
- [ ] Lint警告なし
- [ ] 機能テスト完了

#### プレビュー確認時
- [ ] プレビューURLでの動作確認
- [ ] 各ページの表示確認
- [ ] フォーム動作確認
- [ ] レスポンシブ確認

#### 本番デプロイ時
- [ ] 環境変数設定済み
- [ ] S3 CORS設定済み
- [ ] DNS設定確認済み
- [ ] SSL証明書有効
- [ ] 本番データバックアップ完了