import { z } from 'zod'

// 共通のバリデーションルール
const phoneRegex = /^0\d{1,4}-?\d{1,4}-?\d{4}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// スタイリスト関連のスキーマ
export const stylistSchema = z.object({
  name: z.string().min(1, '名前は必須です').max(50, '名前は50文字以内で入力してください'),
  position: z.string().min(1, 'ポジションは必須です').max(50, 'ポジションは50文字以内で入力してください'),
  bio: z.string().min(1, '自己紹介は必須です').max(500, '自己紹介は500文字以内で入力してください'),
  experience: z.number().int().min(0, '経験年数は0以上の整数を入力してください').max(50, '経験年数は50年以内で入力してください'),
  rating: z.number().min(1, '評価は1以上5以下で入力してください').max(5, '評価は1以上5以下で入力してください'),
  reviewCount: z.number().int().min(0, 'レビュー数は0以上の整数を入力してください'),
  specialties: z.array(z.string()).min(1, '得意分野を少なくとも1つ入力してください'),
  social: z.object({
    instagram: z.string().optional(),
    twitter: z.string().optional(),
  }).optional(),
  image: z.string().nullable().optional(),
  skills: z.array(z.object({
    name: z.string(),
    level: z.number().min(0).max(100)
  })).optional(),
  portfolio: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    sideImage: z.string().optional(),
    backImage: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional()
  })).optional()
})

// メニュー関連のスキーマ
export const menuItemSchema = z.object({
  name: z.string().min(1, 'メニュー名は必須です').max(100, 'メニュー名は100文字以内で入力してください'),
  price: z.string().regex(/^¥[\d,]+(\s*~\s*¥[\d,]+)?$/, '価格は「¥1,000」または「¥1,000 ~ ¥2,000」の形式で入力してください'),
  duration: z.string().regex(/^\d+分$/, '所要時間は「60分」の形式で入力してください'),
  description: z.string().min(1, '説明は必須です').max(300, '説明は300文字以内で入力してください'),
  category: z.enum(['cut', 'color', 'perm', 'treatment', 'other'], {
    message: 'カテゴリーを選択してください'
  }),
  isPopular: z.boolean().optional()
})

// 予約フォームのスキーマ
export const bookingSchema = z.object({
  // お客様情報
  name: z.string().min(1, 'お名前は必須です').max(50, 'お名前は50文字以内で入力してください'),
  phone: z.string().regex(phoneRegex, '電話番号の形式が正しくありません'),
  email: z.string().email('メールアドレスの形式が正しくありません'),
  
  // 予約詳細
  menuId: z.string().min(1, 'メニューを選択してください'),
  stylistId: z.string().min(1, 'スタイリストを選択してください'),
  date: z.string().min(1, '予約日を選択してください'),
  time: z.string().min(1, '予約時間を選択してください'),
  
  // その他
  message: z.string().max(500, 'メッセージは500文字以内で入力してください').optional(),
  
  // セキュリティ（ハニーポット）
  website: z.string().max(0, 'このフィールドは空のままにしてください').optional()
})

// ニュース記事のスキーマ
export const newsSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100, 'タイトルは100文字以内で入力してください'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付はYYYY-MM-DD形式で入力してください'),
  content: z.string().min(1, '内容は必須です').max(1000, '内容は1000文字以内で入力してください'),
  category: z.enum(['news', 'campaign', 'holiday', 'other'], {
    message: 'カテゴリーを選択してください'
  })
})

// サロン情報のスキーマ
export const salonInfoSchema = z.object({
  name: z.string().min(1, 'サロン名は必須です').max(100, 'サロン名は100文字以内で入力してください'),
  description: z.string().min(1, '説明は必須です').max(500, '説明は500文字以内で入力してください'),
  address: z.string().min(1, '住所は必須です').max(200, '住所は200文字以内で入力してください'),
  phone: z.string().regex(phoneRegex, '電話番号の形式が正しくありません'),
  email: z.string().email('メールアドレスの形式が正しくありません'),
  hours: z.object({
    weekday: z.string(),
    weekend: z.string(),
    holiday: z.string()
  }),
  social: z.object({
    instagram: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
    twitter: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
    facebook: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
    line: z.string().optional()
  }).optional()
})

// XSS対策のためのサニタイゼーション関数
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // HTMLタグを除去
    .replace(/javascript:/gi, '') // JavaScriptプロトコルを除去
    .replace(/on\w+\s*=/gi, '') // イベントハンドラを除去
    .trim()
}

// エラーメッセージのフォーマット
export function formatZodError(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {}
  
  error.issues.forEach((issue) => {
    const path = issue.path.join('.')
    formatted[path] = issue.message
  })
  
  return formatted
}