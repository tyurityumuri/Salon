# 長瀬サロン Webサイト開発プロジェクト

## プロジェクト概要
- **プロジェクト名**: 長瀬サロン公式Webサイト
- **参考サイト**: https://www.oceantokyo.com/
- **技術スタック**: Next.js 14, TypeScript, Tailwind CSS, AWS S3, Vercel
- **開発期間**: 長期プロジェクト

## 現在の開発状況

### 🔄 進行中のタスク
- **外部サービス導入検討**: LINE・ホットペッパー等の戦略策定完了、実装サポート待ち
- **Firebase環境変数設定**: 設定手順書提供済み、ユーザー設定作業待ち

### ⏳ 未着手のタスク
- **リアルタイム予約システムの実装** (優先度: 低) - 現在はホットペッパー連携で十分機能
- **外部サービス実装サポート** (必要に応じて):
  - Google マイビジネス設定支援
  - Instagram ビジネスアカウント構築
  - LINE公式アカウント技術連携
  - ホットペッパー掲載サポート

### ✅ 完了したタスク
- プロジェクト管理ドキュメント（CLAUDE.md）の作成
- Next.js 14プロジェクトの初期セットアップ（TypeScript, Tailwind CSS, ESLint, Prettier）
- プロジェクト構造とフォルダ構成の作成
- 基本レイアウトコンポーネントの作成（Header, Footer, Layout）
- トップページのヒーローセクション実装
- ナビゲーションメニューの実装（STYLISTS, STYLES, MENU, ACCESS, BOOKING）
- スタイリスト関連のデータ構造設計（JSON）
- スタイリスト一覧ページの実装
- スタイリスト詳細ページの実装
- スタイル写真集ページの実装（Masonry レイアウト、検索・フィルタ機能付き）
- メニュー・料金ページの実装
- アクセスページの実装（Google Maps統合予定）
- 予約ページ（BOOKING）の実装（完全な予約フォーム）
- トップページにスタイリスト紹介セクションとニュースセクションを追加
- Ocean Tokyoスタイルのアニメーション実装（スクロールアニメーション、ホバー効果）
- レスポンシブデザインの基本調整
- ESLintとTypeScriptタイプチェックの修正
- ヒーロー画像の縦幅調整（70vh/80vh）
- STYLISTページのエラー修正（型安全性改善）
- 予約をホットペッパー経由に変更（既存フォームは詳細予約として保持）
- トップページにおすすめメニュー3つを追加（人気メニューの表示）
- 管理サイトの設計・実装（完全なCRUD操作対応）
- S3画像管理システムの実装（アップロード・最適化機能）
- SEO対策の実装（メタタグ、構造化データ、sitemap、robots.txt）
- 画像最適化とパフォーマンス調整（Next.js Image、WebP/AVIF対応）
- Google Maps APIの統合（アクセスページ）
- 404ページなどのエラーページ作成
- 美容院らしいプロフェッショナルデザインへの全面リニューアル
- developブランチの作成と開発環境整備
- Vercelデプロイ設定とブランチ別デプロイ
- UI改善（ヘッダー視認性向上、CTA削除、日本語ローカライゼーション）
- プロジェクトドキュメント整備（DEVELOPMENT_LESSONS.md、README.md更新）
- **Firebase認証システムの本格実装** - デモモード対応、管理画面セキュリティ強化
- **管理画面のアクセス制御強化** - AuthGuard実装、ロール基盤制御
- **ユニットテスト・E2Eテストの導入** - Jest + React Testing Library + Playwright完全実装
- **コンポーネントテストの追加実装** - Header/Footer/Layout/SEOテスト完備
- **パフォーマンス監視とアナリティクス実装** - Google Analytics 4 + Web Vitals完全統合
- **PWA対応** - Service Worker、Manifest、Install Prompt完全実装
- **外部サービス導入分析** - LINE・ホットペッパー等の詳細分析レポート作成
- **コスト分析レポート** - 全実装機能の投資対効果分析（ROI: 無限大）
- **セキュリティ対策の実装** - セキュリティヘッダー、APIレート制限、入力値検証（Zod）実装完了
- **バグ修正・UI改善**:
  - スタイリスト詳細ページのナビゲーションバグ修正
  - スタイル詳細ポップアップモーダルの実装（StyleDetailModal.tsx）
  - 管理画面でのマルチアングル画像管理機能追加（PortfolioManager.tsx）
  - 予約ページのテキスト重なり問題修正

## セットアップ手順（Claude再起動時用）

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 開発サーバーの起動
```bash
npm run dev
```

### 3. ビルドとテスト
```bash
npm run build
npm run lint
npm run type-check
npm test
npm run test:e2e
```

### 4. Firebase環境変数設定（オプション）
```bash
# .env.local ファイル作成
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## プロジェクト構造
```
salon001/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React コンポーネント
│   ├── data/            # JSON データファイル
│   ├── types/           # TypeScript 型定義
│   └── utils/           # ユーティリティ関数
├── public/
│   ├── images/          # 画像ファイル
│   └── icons/           # アイコンファイル
└── docs/                # ドキュメント
```

## 設計方針

### デザインガイドライン
- **参考サイト**: Ocean Tokyo (https://www.oceantokyo.com/), sand-hair.com
- **カラーパレット**: 
  - Primary: モダンなグレースケール (#171717 - #fafafa)
  - Accent: 温かみのあるゴールド (#78350f - #fffbeb)  
  - Secondary: 上品なベージュ (#5a4a3a - #fdfcfb)
- **フォント**: Inter, Playfair Display, Montserrat + 日本語フォント
- **デザイン特徴**: プロフェッショナル、洗練、美容院らしい上品さ
- **レスポンシブ**: モバイルファースト

### データ管理
- スタイリスト情報: `src/data/stylists.json`
- お知らせ: `src/data/news.json`
- メニュー・料金: `src/data/menu.json`
- 店舗情報: `src/data/salon.json`

### ページ構成
1. **トップページ** (`/`)
2. **スタイリスト一覧** (`/stylists`)
3. **スタイリスト詳細** (`/stylists/[id]`)
4. **スタイル写真集** (`/styles`)
5. **メニュー・料金** (`/menu`)
6. **アクセス** (`/access`)
7. **予約ページ** (`/booking`)
8. **管理画面** (`/admin/*`) - ダッシュボード、各種CRUD機能
9. **APIエンドポイント** (`/api/*`) - RESTful API

## 開発メモ

### 次回開発時の優先事項
1. **外部サービス実装サポート**（必要に応じて）:
   - Google マイビジネス設定・最適化サポート
   - Instagram ビジネスアカウント構築支援
   - LINE公式アカウント技術連携実装
   - ホットペッパービューティー掲載サポート
2. **Firebase環境変数設定のサポート**（設定手順書提供済み）
3. **リアルタイム予約システム実装**（優先度低・必要に応じて）

### 確認が必要な項目
- [ ] スタイリスト5名の具体的な情報
- [ ] メニューと料金の詳細
- [ ] 具体的なブランドカラーコード
- [ ] ロゴや画像素材
- [ ] 店舗の正確な住所と連絡先
- [ ] ホットペッパービューティーの実際のURL

### 最新の変更点 (2025-08-05)
- **セキュリティ強化**: 
  - middleware.tsによるセキュリティヘッダー実装（CSP、X-Frame-Options等）
  - APIレート制限の実装（一般API、管理API、予約フォーム別）
  - Zodによる入力値検証の強化
  - .env.exampleファイルの作成
  - セキュリティドキュメント（SECURITY.md）の作成
- **バグ修正・UI改善**:
  - スタイリスト詳細ページでスタイル画像クリック時のポップアップモーダル実装
  - マルチアングル画像対応（正面・横・後ろ）のStyleDetailModal.tsx作成
  - 管理画面でのポートフォリオ画像管理機能（PortfolioManager.tsx）
  - 予約ページのテキスト重なり問題を解決（適切なスペーシング調整）

### 過去の変更点 (2025-08-03)
- **UI改善**: ヘッダー背景を白透明に変更、視認性向上
- **ローカライゼーション**: フッターの英語テキストを日本語に変更
- **コンテンツ**: CTA Sectionを削除、シンプルなデザインに
- **ドキュメント**: 開発過程の知見をDEVELOPMENT_LESSONS.mdに文書化
- **プロジェクト管理**: README.mdを包括的な内容に更新

### 技術的な懸念事項
- Firebase認証のセキュリティ強化
- 大量画像アップロード時のS3パフォーマンス
- 管理画面のアクセス制御
- モバイル表示での画像読み込み最適化

## コマンド履歴
```bash
# プロジェクトセットアップ
npm install

# 開発サーバー起動
npm run dev

# 利用可能なポート: http://localhost:3000
```

## 開発済みページ
- ✅ トップページ（`/`）- ヒーロー、紹介、スタイリスト、ニュース + スクロールアニメーション
- ✅ スタイリスト一覧（`/stylists`）- カード型レイアウト、SNSリンク
- ✅ スタイリスト詳細（`/stylists/[id]`）- 詳細プロフィール、スキル、ポートフォリオ
- ✅ スタイル写真集（`/styles`）- Masonryレイアウト、検索・フィルタ機能
- ✅ メニュー・料金（`/menu`）- カテゴリー別表示、詳細料金
- ✅ アクセス（`/access`）- 店舗情報、営業時間、交通アクセス
- ✅ 予約ページ（`/booking`）- 完全な予約フォーム、バリデーション
- ✅ 管理画面（`/admin/*`）- ダッシュボード、スタイリスト・メニュー・ニュース・スタイル・サロン情報管理
- ✅ APIエンドポイント（`/api/*`）- RESTful API、S3アップロード機能
- ✅ SEO最適化 - 構造化データ、メタタグ、sitemap.xml、robots.txt
- ✅ エラーページ - 404ページ（not-found.tsx）

## 環境変数設定

### 必要な環境変数
```env
# サイト設定
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# AWS S3設定
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key  
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET_NAME=nagase-salon-data

# Firebase設定（オプション）
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
```

---
最終更新: 2025-08-05