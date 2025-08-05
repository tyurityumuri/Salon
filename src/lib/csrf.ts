import { NextRequest, NextResponse } from 'next/server'
import * as crypto from 'crypto'

// CSRF トークンの管理
const csrfTokens = new Map<string, { token: string; expires: number; used: boolean }>()

// 期限切れトークンを定期的にクリーンアップ（1時間ごと）
setInterval(() => {
  const now = Date.now()
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (data.expires < now || data.used) {
      csrfTokens.delete(sessionId)
    }
  }
}, 60 * 60 * 1000)

export interface CSRFConfig {
  tokenExpiry?: number // トークンの有効期限（ミリ秒）
  sessionIdHeader?: string // セッションIDのヘッダー名
  tokenHeader?: string // CSRFトークンのヘッダー名
}

const DEFAULT_CONFIG: Required<CSRFConfig> = {
  tokenExpiry: 60 * 60 * 1000, // 1時間
  sessionIdHeader: 'x-session-id',
  tokenHeader: 'x-csrf-token'
}

/**
 * CSRFトークンを生成
 */
export function generateCSRFToken(sessionId: string, config: CSRFConfig = {}): string {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  // セキュアなランダムトークンを生成
  const token = crypto.randomBytes(32).toString('hex')
  const expires = Date.now() + finalConfig.tokenExpiry
  
  // セッションIDとトークンを関連付けて保存
  csrfTokens.set(sessionId, {
    token,
    expires,
    used: false
  })
  
  return token
}

/**
 * CSRFトークンを検証
 */
export function verifyCSRFToken(
  sessionId: string, 
  token: string, 
  config: CSRFConfig = {}
): boolean {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  const storedData = csrfTokens.get(sessionId)
  
  if (!storedData) {
    return false // トークンが存在しない
  }
  
  if (storedData.expires < Date.now()) {
    csrfTokens.delete(sessionId)
    return false // トークンが期限切れ
  }
  
  if (storedData.used) {
    csrfTokens.delete(sessionId)
    return false // トークンが既に使用済み
  }
  
  if (storedData.token !== token) {
    return false // トークンが一致しない
  }
  
  // ワンタイムトークンとしてマーク（必要に応じて）
  storedData.used = true
  
  return true
}

/**
 * CSRF保護のミドルウェア関数
 */
export function csrfProtection(config: CSRFConfig = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  return async (request: NextRequest): Promise<NextResponse | null> => {
    // GETリクエストはCSRF攻撃の対象外
    if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'OPTIONS') {
      return null
    }
    
    const sessionId = request.headers.get(finalConfig.sessionIdHeader)
    const csrfToken = request.headers.get(finalConfig.tokenHeader)
    
    if (!sessionId || !csrfToken) {
      return NextResponse.json(
        { error: 'CSRF token missing' },
        { status: 403 }
      )
    }
    
    if (!verifyCSRFToken(sessionId, csrfToken, config)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }
    
    return null // リクエストを通す
  }
}

/**
 * セッションIDを生成（UUID v4）
 */
export function generateSessionId(): string {
  return crypto.randomUUID()
}

/**
 * セキュアなランダム文字列を生成
 */
export function generateSecureRandom(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * ハッシュ化関数（パスワードなどの機密情報用）
 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const finalSalt = salt || crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, finalSalt, 10000, 64, 'sha512').toString('hex')
  
  return { hash, salt: finalSalt }
}

/**
 * パスワード検証
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash))
}

/**
 * CSRFトークンAPIエンドポイント用のヘルパー
 */
export function createCSRFTokenResponse(sessionId?: string): NextResponse {
  const finalSessionId = sessionId || generateSessionId()
  const token = generateCSRFToken(finalSessionId)
  
  const response = NextResponse.json({
    sessionId: finalSessionId,
    csrfToken: token,
    expires: Date.now() + DEFAULT_CONFIG.tokenExpiry
  })
  
  // セキュアなCookie設定
  response.cookies.set('session-id', finalSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1週間
    path: '/'
  })
  
  return response
}