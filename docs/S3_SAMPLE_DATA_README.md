# S3 サンプルデータ仕様書

## 概要
長瀬サロンのS3にアップロードするサンプルデータの仕様書です。すべてのデータはJSON形式で、S3バケットの`data/`フォルダに配置されます。

## データ構成

### 1. stylists.json - スタイリスト情報
```json
{
  "id": "1",
  "name": "田中 雄介",
  "position": "ディレクター",
  "experience": 12,
  "specialties": ["メンズカット", "フェードカット", "ビジネススタイル"],
  "image": "https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/images/stylists/tanaka.jpg",
  "bio": "12年の経験を持つベテランスタイリスト。メンズカットを得意とし、ビジネスシーンに最適なスタイルを提案します。",
  "skills": ["カット", "カラー", "パーマ", "ヘッドスパ"],
  "social": {
    "instagram": "https://instagram.com/tanaka_stylist",
    "twitter": "https://twitter.com/tanaka_hair"
  },
  "portfolio": [],
  "rating": 4.8,
  "reviewCount": 156
}
```

**サンプルデータ**: 5名のスタイリスト
- 田中 雄介（ディレクター）
- 佐藤 美香（シニアスタイリスト）
- 山田 健太（スタイリスト）
- 鈴木 麗子（スタイリスト）
- 高橋 翔太（ジュニアスタイリスト）

### 2. menu.json - メニュー情報
```json
{
  "id": "cut-1",
  "category": "カット",
  "name": "メンズカット",
  "description": "スタイリストによるプロフェッショナルなメンズカット",
  "price": 4500,
  "duration": 60,
  "isPopular": true
}
```

**カテゴリー別サンプル**:
- カット: メンズカット、レディースカット、学生カット
- カラー: ワンカラー、ハイライト、グラデーションカラー
- パーマ: デジタルパーマ、エアウェーブ
- トリートメント: ヘッドスパ、髪質改善トリートメント
- セット・その他: ヘアセット、眉カット

### 3. news.json - ニュース情報
```json
{
  "id": "1",
  "title": "夏季限定キャンペーン開始！",
  "content": "8月末まで、カット+カラーセットが通常価格より20%OFFでご利用いただけます。",
  "date": "2025-08-01",
  "category": "campaign",
  "image": "https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/images/news/summer-campaign.jpg"
}
```

**カテゴリー**: 
- `campaign`: キャンペーン情報
- `event`: イベント情報
- `notice`: お知らせ

**サンプルデータ**: 5件のニュース（最新のものから順）

### 4. styles.json - スタイルギャラリー
```json
{
  "id": "1",
  "src": "https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com/images/styles/style-1.jpg",
  "alt": "モダンメンズショート",
  "category": "メンズカット",
  "stylistName": "田中 雄介",
  "tags": ["ショート", "ビジネス", "クール"],
  "height": 600
}
```

**カテゴリー**:
- メンズカット
- レディースカット
- カラーリング
- パーマ
- ヘアアレンジ

**サンプルデータ**: 12件のスタイル写真

### 5. salon.json - サロン基本情報
```json
{
  "name": "長瀬サロン",
  "address": "〒100-0004 東京都千代田区大手町1-1-1（仮住所）",
  "phone": "03-1234-5678",
  "email": "info@nagase-salon.com",
  "businessHours": {
    "月": { "open": "10:00", "close": "20:00" },
    "火": { "open": "10:00", "close": "20:00" },
    "水": { "open": "休業日", "close": "休業日" },
    "木": { "open": "10:00", "close": "20:00" },
    "金": { "open": "10:00", "close": "20:00" },
    "土": { "open": "09:00", "close": "19:00" },
    "日": { "open": "09:00", "close": "19:00" }
  },
  "closedDays": ["水曜日"],
  "googleMapsUrl": "https://maps.google.com/",
  "accessInfo": [
    "JR東京駅から徒歩5分",
    "地下鉄大手町駅A1出口から徒歩3分",
    "丸の内線大手町駅直結"
  ],
  "parkingInfo": "提携駐車場あり（2時間まで無料）"
}
```

## 画像ファイル構成

S3バケットの`images/`フォルダに以下の画像を配置する必要があります：

### スタイリスト画像 (`images/stylists/`)
- tanaka.jpg
- sato.jpg
- yamada.jpg
- suzuki.jpg
- takahashi.jpg

### スタイルギャラリー画像 (`images/styles/`)
- style-1.jpg から style-12.jpg

### ニュース画像 (`images/news/`)
- summer-campaign.jpg
- hair-care-event.jpg

## アップロード手順

1. **AWS CLIを使用する場合**:
```bash
# JSONファイルのアップロード
aws s3 cp src/data/stylists.json s3://nagase-salon-data/data/stylists.json --acl public-read
aws s3 cp src/data/menu.json s3://nagase-salon-data/data/menu.json --acl public-read
aws s3 cp src/data/news.json s3://nagase-salon-data/data/news.json --acl public-read
aws s3 cp src/data/styles.json s3://nagase-salon-data/data/styles.json --acl public-read
aws s3 cp src/data/salon.json s3://nagase-salon-data/data/salon.json --acl public-read
```

2. **npm scriptを使用する場合**:
```bash
npm run s3:setup
```

## 注意事項

1. **画像URL**: 実際の画像ファイルは別途S3にアップロードする必要があります
2. **パブリック読み取り**: JSONファイルはWebサイトから直接アクセスするため、パブリック読み取り権限が必要です
3. **データ検証**: アップロード後は`npm run s3:validate`でデータの整合性を確認してください

## データ更新

管理画面から更新したデータは自動的にS3に保存されます。手動で更新する場合は、管理画面のAPIエンドポイントを使用してください。