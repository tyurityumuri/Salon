# 長瀬サロン 公式Webサイト

> モダンで洗練された美容院のWebサイト

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)

## 🌟 プロジェクト概要

長瀬サロンの公式Webサイトは、[Ocean Tokyo](https://www.oceantokyo.com/)をインスピレーションとした、プロフェッショナルで洗練された美容院向けWebアプリケーションです。

### ✨ 主な特徴

- 🎨 **モダンなデザイン**: プロフェッショナルで美容院らしい洗練されたUI
- 📱 **完全レスポンシブ**: モバイルファーストアプローチ
- ⚡ **高パフォーマンス**: Next.js 14とTypeScriptによる最適化
- 🔍 **SEO最適化**: 構造化データと適切なメタタグ実装
- 🎭 **リッチアニメーション**: スムーズなスクロールアニメーション
- 📊 **管理システム**: Firebase認証付きコンテンツ管理
- 📱 **PWA対応**: オフライン動作・アプリインストール可能
- 📈 **アナリティクス**: Google Analytics 4 & Web Vitals監視
- 🧪 **テスト完備**: Jest単体テスト & Playwright E2Eテスト

## 🛠️ 技術スタック

| 技術 | バージョン | 用途 |
|------|------------|------|
| **Next.js** | 14.2.31 | React フレームワーク |
| **TypeScript** | 5.0+ | 型安全な開発 |
| **Tailwind CSS** | 3.0+ | ユーティリティファーストCSS |
| **Firebase** | 12.0+ | 認証・データベース |
| **Google Analytics 4** | Latest | ユーザー行動分析 |
| **Jest** | 30.0+ | 単体テスト |
| **Playwright** | 1.54+ | E2Eテスト |
| **PWA** | - | プログレッシブWebアプリ |
| **Vercel** | Latest | ホスティング・デプロイ |
| **AWS S3** | - | 画像ストレージ |

## 🚀 クイックスタート

### 必要要件

- Node.js 18.0.0 以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/tyurityumuri/Salon.git
cd Salon

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### 環境変数

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET_NAME=nagase-salon-data
```

## 📁 プロジェクト構造

```
salon001/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (pages)/      # ページルート
│   │   ├── admin/        # 管理画面
│   │   └── api/          # APIルート
│   ├── components/       # Reactコンポーネント
│   ├── data/            # JSONデータファイル
│   ├── types/           # TypeScript型定義
│   └── utils/           # ユーティリティ関数
├── public/
│   ├── images/          # 画像ファイル
│   └── icons/           # アイコンファイル
├── docs/                # プロジェクトドキュメント
└── CLAUDE.md           # プロジェクト管理文書
```

## 📖 ドキュメント

### 🔗 ドキュメント一覧

| ドキュメント | 説明 | リンク |
|-------------|------|--------|
| **プロジェクト管理** | 開発状況・タスク管理・技術仕様 | [CLAUDE.md](./CLAUDE.md) |
| **開発過程の知見** | 問題・解決策・獲得ナレッジ | [DEVELOPMENT_LESSONS.md](./docs/DEVELOPMENT_LESSONS.md) |
| **コスト分析レポート** | 実装機能のコスト・ROI分析 | [COST_ANALYSIS.md](./docs/COST_ANALYSIS.md) |
| **API仕様** | APIエンドポイント仕様書 | 📊 [API一覧](#-api-エンドポイント) |
| **コンポーネントガイド** | 再利用可能コンポーネント | 🎨 [デザインシステム](#-デザインシステム) |
| **デプロイメントガイド** | 本番環境設定・デプロイ手順 | 🚀 [デプロイメント](#-デプロイメント) |

### 📋 主要ページ

| ページ | パス | 説明 |
|--------|------|------|
| **トップページ** | `/` | ヒーローセクション・スタイリスト紹介・ニュース |
| **スタイリスト一覧** | `/stylists` | 全スタイリストの紹介 |
| **スタイリスト詳細** | `/stylists/[id]` | 個別スタイリストの詳細情報 |
| **スタイル写真集** | `/styles` | ヘアスタイル写真・検索機能 |
| **メニュー・料金** | `/menu` | サービスメニューと料金 |
| **アクセス** | `/access` | 店舗情報・地図・アクセス方法 |
| **予約** | `/booking` | 予約フォーム・ホットペッパー連携 |
| **管理画面** | `/admin` | コンテンツ管理システム |

## 🎨 デザインシステム

### カラーパレット

- **Primary**: モダンなグレースケール (#171717 - #fafafa)
- **Accent**: 温かみのあるゴールド (#78350f - #fffbeb)
- **Secondary**: 上品なベージュ (#5a4a3a - #fdfcfb)

### フォント

- **Sans**: Inter + 日本語フォント
- **Serif**: Playfair Display
- **Heading**: Montserrat

## 🚀 npm スクリプト

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# ビルド結果をローカルで確認
npm run start

# ESLintによるコード検証
npm run lint

# TypeScript型チェック
npm run type-check

# 単体テスト実行
npm test

# 単体テスト（ウォッチモード）
npm run test:watch

# テストカバレッジ確認
npm run test:coverage

# E2Eテスト実行
npm run test:e2e

# E2EテストUI実行
npm run test:e2e:ui
```

## 🏗️ アーキテクチャ

### フロントエンド

- **Next.js 14 App Router**: Server/Client Componentの適切な分離
- **TypeScript**: 型安全な開発環境
- **Tailwind CSS**: ユーティリティファーストによる効率的なスタイリング

### バックエンド

- **Next.js API Routes**: RESTful API実装
- **JSON File System**: 軽量なデータ管理
- **AWS S3**: 画像ストレージ

### インフラ

- **Vercel**: 自動デプロイとホスティング
- **GitHub**: バージョン管理
- **AWS S3**: 静的アセット管理

## 🛠️ 管理機能

### 管理画面アクセス

- **URL**: `/admin`
- **ユーザー名**: `admin`
- **パスワード**: `salon123`

### 管理可能な項目

1. **スタイリスト管理** - 基本情報・プロフィール画像・SNSリンク
2. **メニュー管理** - カテゴリ別メニュー・料金設定・人気メニュー
3. **ニュース管理** - カテゴリ別ニュース・画像付きニュース
4. **スタイルギャラリー管理** - スタイル画像・カテゴリ・タグ管理
5. **サロン情報管理** - 基本情報・営業時間・アクセス情報

## 📈 パフォーマンス

- **Lighthouse スコア**: 90+
- **Core Web Vitals**: 良好
- **画像最適化**: WebP/AVIF自動変換
- **コード分割**: 自動チャンク分割

## 🔐 セキュリティ

- **CSP**: Content Security Policy実装
- **環境変数**: 機密情報の適切な管理
- **Input Validation**: フォーム入力の検証
- **XSS Protection**: クロスサイトスクリプティング対策

## 🌐 SEO対策

- **構造化データ**: Schema.org準拠のJSON-LD
- **メタタグ**: 適切なOGP・Twitter Cards
- **サイトマップ**: 自動生成されるXMLサイトマップ
- **robots.txt**: 検索エンジン向け最適化

## 🧪 品質管理

- **TypeScript**: 型安全性の確保
- **ESLint**: コード品質の維持
- **Prettier**: コードフォーマットの統一
- **ビルドテスト**: 継続的な動作確認

## 🚀 デプロイメント

### 環境

- **本番環境**: [Vercel](https://vercel.com) (main ブランチ)
- **プレビュー環境**: Vercel (develop ブランチ)

### Git Flow

```
main (本番) ← develop (開発) ← feature/* (機能開発)
```

## 📊 API エンドポイント

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

## 🤝 貢献

このプロジェクトへの貢献を歓迎します！

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

## 👥 開発チーム

- **開発者**: Claude Code (Anthropic)
- **プロジェクトオーナー**: [tyurityumuri](https://github.com/tyurityumuri)

## 📞 サポート

ご質問やサポートが必要な場合は、以下の方法でお問い合わせください：

- **GitHub Issues**: [プロジェクトのIssues](https://github.com/tyurityumuri/Salon/issues)
- **Email**: info@nagase-salon.com (サンプル)

---

**🎉 長瀬サロンWebサイトプロジェクトへようこそ！**

最終更新: 2025-08-03