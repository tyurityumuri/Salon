# ヒーロー画像管理システム実装ガイド

## 📋 システム構成図

```
ヒーロー画像管理システム
├── データ管理
│   ├── salon.json (S3: data/salon.json)
│   │   ├── heroImages: PC用画像配列
│   │   └── heroImagesMobile: モバイル用画像配列
│   └── 実画像ファイル (S3: images/hero/*.jpg)
│
├── 管理画面 (画像設定・アップロード)
│   ├── /admin/salon/page.tsx
│   ├── ImageUploadManager.tsx
│   └── /api/upload/route.ts
│
├── 表示システム
│   ├── HeroSlideshow.tsx (メイン表示コンポーネント)
│   ├── HomeClient.tsx (データ取得・状態管理)
│   └── /api/salon/route.ts (データ取得API)
│
└── S3ストレージ
    ├── images/hero/ (統一画像フォルダ)
    └── data/salon.json (設定データ)
```

## 🗂️ 実装箇所詳細

### 1. データ構造定義

**型定義: `src/types/index.ts`**
```typescript
interface SalonData {
  name: string
  heroImages?: string[]        // PC用画像URL配列
  heroImagesMobile?: string[]  // モバイル用画像URL配列
  heroTitle?: string          // ヒーロータイトル
  heroSubtitle?: string       // サブタイトル
  // ... その他のサロン情報
}
```

### 2. 管理画面での設定

**メイン管理ページ: `src/app/admin/salon/page.tsx`**
- PC用・モバイル用画像を個別管理
- ImageUploadManager を使用
- folder="hero" でS3の適切なフォルダに保存
- PUT /api/salon でデータ保存

**画像アップロード管理: `src/components/admin/ImageUploadManager.tsx`**
- ドラッグ&ドロップ対応
- 5MB以上の画像自動圧縮
- ファイル拡張子保持機能
- プレビュー・並び替え機能

**アップロードAPI: `src/app/api/upload/route.ts`**
- FormData から画像ファイル取得
- MIME タイプから適切な拡張子推定
- S3 の images/hero/ フォルダに保存
- 公開URLを生成して返却

### 3. データ管理

**データ取得・保存API: `src/app/api/salon/route.ts`**
```typescript
// GET: サロン情報取得
export async function GET() {
  const dataManager = getS3DataManager()
  const salonData = await dataManager.getJsonData('salon.json')
  return NextResponse.json(salonData)
}

// PUT: サロン情報更新
export async function PUT(request: NextRequest) {
  const body = await request.json()
  await dataManager.saveJsonData('salon.json', body)
  return NextResponse.json({ message: 'Success' })
}
```

**S3データマネージャー: `src/lib/s3-data-manager.ts`**
- S3との読み書き処理
- ローカル開発環境対応
- エラーハンドリング

### 4. 表示システム

**メイン表示コンポーネント: `src/components/HeroSlideshow.tsx`**
```typescript
export default function HeroSlideshow({ salonData }: HeroSlideshowProps) {
  // PC用・モバイル用の独立したスライド状態
  const [currentPCSlide, setCurrentPCSlide] = useState(0)
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0)
  
  // 画像配列の準備
  const pcImages = useMemo(() => salonData?.heroImages || [], [salonData?.heroImages])
  const mobileImages = useMemo(() => salonData?.heroImagesMobile || [], [salonData?.heroImagesMobile])
  
  // CSS メディアクエリで確実な表示切り替え
  return (
    <>
      <style jsx>{`
        .hero-mobile { display: block !important; }
        .hero-pc { display: none !important; }
        @media (min-width: 768px) {
          .hero-mobile { display: none !important; }
          .hero-pc { display: block !important; }
        }
      `}</style>
      
      {/* PC用画像表示 */}
      <div className="absolute inset-0 hero-pc">
        {pcImages.map((image, index) => (
          <div className={`absolute inset-0 ${index === currentPCSlide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={image} alt={`Hero Background PC ${index + 1}`} />
          </div>
        ))}
      </div>
      
      {/* モバイル用画像表示 */}
      <div className="absolute inset-0 hero-mobile">
        {(hasMobileImages ? mobileImages : pcImages).map((image, index) => (
          <div className={`absolute inset-0 ${index === currentMobileSlide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={image} alt={`Hero Background Mobile ${index + 1}`} />
          </div>
        ))}
      </div>
    </>
  )
}
```

**データ取得・状態管理: `src/components/HomeClient.tsx`**
```typescript
export default function HomeClient() {
  const [salonData, setSalonData] = useState<SalonData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const salonRes = await fetch('/api/salon')
      if (salonRes.ok) {
        const data = await salonRes.json()
        setSalonData(data)
      }
    }
    fetchData()
  }, [])

  return (
    <Layout>
      <HeroSlideshow salonData={salonData} />
      {/* その他のコンテンツ */}
    </Layout>
  )
}
```

## 🔧 管理操作フロー

### 画像追加・変更の手順
1. **管理画面アクセス**: `/admin/salon`
2. **画像選択**: PC用・モバイル用それぞれで画像をドラッグ&ドロップ
3. **自動処理**: 
   - 5MB以上なら自動圧縮
   - 適切な拡張子で S3 に保存
   - プレビュー表示
4. **保存**: 「サロン情報を保存」ボタン
5. **API更新**: `PUT /api/salon` で salon.json 更新
6. **即時反映**: サイトで新しい画像が表示

### データの流れ
```
管理画面 → ImageUploadManager → /api/upload → S3 (images/hero/)
                                           ↓
管理画面 → 保存ボタン → /api/salon (PUT) → S3 (data/salon.json)
                                           ↓
トップページ → /api/salon (GET) → HeroSlideshow → 画像表示
```

## 📁 関連ファイル一覧

### コアファイル
- `src/components/HeroSlideshow.tsx` - メイン表示コンポーネント
- `src/components/HomeClient.tsx` - データ取得・管理
- `src/app/admin/salon/page.tsx` - 管理画面
- `src/components/admin/ImageUploadManager.tsx` - 画像アップロード

### API
- `src/app/api/salon/route.ts` - サロン情報API
- `src/app/api/upload/route.ts` - 画像アップロードAPI

### データ管理
- `src/lib/s3-data-manager.ts` - S3データ操作
- `src/data/salon.json` - ローカル開発用データ

### ユーティリティスクリプト
- `scripts/check-hero-images.ts` - 現在の設定確認
- `scripts/update-hero-with-s3-images.ts` - データ更新
- `scripts/migrate-pc-images-to-hero.ts` - フォルダ移行

## 🎯 重要ポイント

1. **レスポンシブ対応**: CSS メディアクエリで確実な表示切り替え
2. **統一管理**: PC・モバイル両方 `/images/hero/` フォルダ
3. **自動最適化**: 大きな画像の自動圧縮
4. **拡張性**: 個別にPC・モバイル画像設定可能
5. **フォールバック**: モバイル画像未設定時はPC画像を使用