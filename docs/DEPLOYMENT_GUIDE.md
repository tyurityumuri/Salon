# 🚀 デプロイガイド

## Vercelでのデプロイ（推奨）

### 前提条件
- GitHubアカウント
- Vercelアカウント（無料）
- AWS S3バケットの設定完了

### ステップ1: GitHubにプッシュ

```bash
# 現在の変更をコミット
git add .
git commit -m "準備デプロイ: Vercel設定追加"

# GitHubにプッシュ（リポジトリが存在する場合）
git push origin main

# または新しいリポジトリの作成
# 1. GitHub.comで新しいリポジトリを作成
# 2. 以下のコマンドを実行:
git remote add origin https://github.com/YOUR_USERNAME/salon001.git
git branch -M main
git push -u origin main
```

### ステップ2: Vercelアカウント作成・連携

1. **Vercelにアクセス**: https://vercel.com/
2. **GitHubでサインアップ**
3. **プロジェクトのインポート**
   - "New Project" をクリック
   - GitHubリポジトリを選択
   - `salon001` リポジトリを選択

### ステップ3: 環境変数の設定

Vercelのプロジェクト設定で以下の環境変数を追加：

```env
AWS_ACCESS_KEY_ID=xxxxxx
AWS_SECRET_ACCESS_KEY=exxxxxx
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET_NAME=xxxxxx
```

**設定手順**:
1. Vercelダッシュボード → プロジェクト選択
2. "Settings" → "Environment Variables"
3. 各変数を "Add" で追加

### ステップ4: デプロイ設定

Vercelは自動的に以下を検出します：
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### ステップ5: デプロイ実行

1. **"Deploy" ボタンをクリック**
2. **ビルド完了を待つ**（通常2-5分）
3. **デプロイURLを確認**（例: `https://salon001-xxx.vercel.app`）

---

## その他のデプロイオプション

### Option 2: Netlify

#### 手順概要:
1. **Netlify**: https://www.netlify.com/
2. **GitHubでサインアップ**
3. **"New site from Git"**
4. **ビルド設定**:
   ```
   Build command: npm run build && npm run export
   Publish directory: out
   ```
5. **環境変数設定** (Vercelと同じ)

#### 注意点:
- 静的エクスポートが必要
- `next.config.js`に`output: 'export'`を追加

### Option 3: Railway

#### 手順概要:
1. **Railway**: https://railway.app/
2. **GitHubでサインアップ**
3. **"Deploy from GitHub repo"**
4. **自動デプロイ設定**
5. **環境変数設定** (Vercelと同じ)

---

## デプロイ後の確認事項

### ✅ 機能テスト

1. **基本ページ**
   - [ ] ホームページ表示
   - [ ] スタイリスト一覧
   - [ ] メニューページ
   - [ ] スタイルギャラリー

2. **API機能**
   - [ ] データ取得（S3から）
   - [ ] 画像表示（S3から）

3. **管理画面**
   - [ ] ログイン機能
   - [ ] 画像アップロード
   - [ ] データ編集

### 🔧 トラブルシューティング

#### ビルドエラー
```bash
# ローカルでビルドテスト
npm run build

# 型チェック
npm run type-check

# Lint確認
npm run lint
```

#### 環境変数エラー
- Vercelの環境変数設定を再確認
- `NEXT_PUBLIC_`プレフィックスが必要な変数を確認

#### S3接続エラー
- AWS認証情報の確認
- S3バケットのCORS設定確認
- バケットポリシーの確認

---

## 本番環境用の追加設定

### セキュリティ強化

1. **CORS設定の本番用更新**
   ```json
   {
     "AllowedOrigins": ["https://your-production-domain.vercel.app"]
   }
   ```

2. **環境変数の分離**
   - 本番用とステージング用でAWSリソースを分離

3. **カスタムドメインの設定**
   - Vercel: Settings → Domains
   - 独自ドメインの設定可能

### パフォーマンス最適化

1. **画像最適化**
   - Next.js Image コンポーネントの活用
   - WebP形式での配信

2. **CDN活用**
   - CloudFrontの設定
   - 静的アセットのキャッシュ最適化

---

## コスト見積もり

### Vercel（無料枠）
- **帯域幅**: 100GB/月
- **ビルド時間**: 6,000分/月
- **サーバーレス関数**: 12秒/実行

### AWS S3コスト
- **ストレージ**: ~$0.023/GB/月
- **リクエスト**: GET $0.0004/1000回
- **データ転送**: 1GB/月まで無料

### 推定月額コスト
- **開発・テスト環境**: 無料
- **小規模本番環境**: $1-5/月
- **中規模本番環境**: $10-20/月

---

## 次のステップ

1. **デプロイ実行**
2. **機能テスト**
3. **CORS設定完了**
4. **カスタムドメイン設定**（オプション）
5. **SEO最適化**
6. **パフォーマンス監視**