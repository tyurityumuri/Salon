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

## 📋 デプロイチェックリスト

- [ ] ローカルでビルド成功
- [ ] 型エラーなし
- [ ] Lint警告なし
- [ ] 環境変数設定済み
- [ ] S3 CORS設定済み
- [ ] プレビューで動作確認