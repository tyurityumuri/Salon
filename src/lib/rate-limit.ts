import { NextRequest, NextResponse } from 'next/server'

// メモリ内でIPアドレスごとのリクエスト回数を管理
const requestCounts = new Map<string, { count: number; resetTime: number }>()

// レート制限の設定
export interface RateLimitConfig {
  windowMs: number  // 時間枠（ミリ秒）
  max: number       // 最大リクエスト数
  message?: string  // エラーメッセージ
}

// デフォルトの設定
const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000,  // 1分
  max: 60,              // 1分あたり60リクエスト
  message: 'リクエストが多すぎます。しばらくしてからもう一度お試しください。'
}

// 定期的にメモリをクリーンアップ（1時間ごと）
setInterval(() => {
  const now = Date.now()
  for (const [ip, data] of requestCounts.entries()) {
    if (data.resetTime < now) {
      requestCounts.delete(ip)
    }
  }
}, 60 * 60 * 1000)

export function rateLimit(config: Partial<RateLimitConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  return async (request: NextRequest): Promise<NextResponse | null> => {
    // IPアドレスの取得（プロキシ経由の場合も考慮）
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'

    const now = Date.now()
    const data = requestCounts.get(ip)

    if (!data || data.resetTime < now) {
      // 新しい時間枠の開始
      requestCounts.set(ip, {
        count: 1,
        resetTime: now + finalConfig.windowMs
      })
      return null // リクエストを通す
    }

    if (data.count >= finalConfig.max) {
      // レート制限に達した場合
      return NextResponse.json(
        { error: finalConfig.message },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((data.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': finalConfig.max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(data.resetTime).toISOString()
          }
        }
      )
    }

    // カウントをインクリメント
    data.count++
    return null // リクエストを通す
  }
}

// 管理画面API用の厳しいレート制限
export const adminApiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15分
  max: 100,                   // 15分あたり100リクエスト
  message: '管理画面へのアクセスが制限されています。15分後にもう一度お試しください。'
})

// 一般API用の標準的なレート制限
export const publicApiRateLimit = rateLimit({
  windowMs: 60 * 1000,        // 1分
  max: 30,                    // 1分あたり30リクエスト
  message: 'APIリクエストが多すぎます。1分後にもう一度お試しください。'
})

// 予約フォーム用のレート制限（スパム対策）
export const bookingRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,   // 1時間
  max: 5,                     // 1時間あたり5回
  message: '予約リクエストが多すぎます。1時間後にもう一度お試しください。'
})