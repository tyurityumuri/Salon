import { NextRequest, NextResponse } from 'next/server'
import * as crypto from 'crypto'

// セッション情報の管理
interface SessionData {
  userId: string
  email: string
  role: string
  createdAt: number
  lastActivity: number
  ipAddress: string
  userAgent: string
  csrfToken?: string
}

// メモリ内セッションストア（本番環境では Redis 等を使用推奨）
const sessions = new Map<string, SessionData>()

// セッション設定
export interface SessionConfig {
  maxAge: number // セッションの最大有効時間（ミリ秒）
  idleTimeout: number // アイドルタイムアウト（ミリ秒）
  renewalThreshold: number // セッション更新の閾値（ミリ秒）
  secureOnly: boolean // HTTPS必須
  sameSite: 'strict' | 'lax' | 'none' // SameSite設定
}

const DEFAULT_SESSION_CONFIG: SessionConfig = {
  maxAge: 24 * 60 * 60 * 1000, // 24時間
  idleTimeout: 2 * 60 * 60 * 1000, // 2時間
  renewalThreshold: 30 * 60 * 1000, // 30分
  secureOnly: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
}

// 管理者セッション用の厳格な設定
const ADMIN_SESSION_CONFIG: SessionConfig = {
  maxAge: 8 * 60 * 60 * 1000, // 8時間
  idleTimeout: 30 * 60 * 1000, // 30分
  renewalThreshold: 15 * 60 * 1000, // 15分
  secureOnly: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
}

/**
 * セッションの定期クリーンアップ（5分ごと）
 */
setInterval(() => {
  const now = Date.now()
  const entries = Array.from(sessions.entries())
  for (const [sessionId, data] of entries) {
    const config = data.role === 'admin' ? ADMIN_SESSION_CONFIG : DEFAULT_SESSION_CONFIG
    
    // セッション期限切れまたはアイドルタイムアウトをチェック
    if (
      now - data.createdAt > config.maxAge ||
      now - data.lastActivity > config.idleTimeout
    ) {
      sessions.delete(sessionId)
    }
  }
}, 5 * 60 * 1000)

/**
 * セキュアなセッションIDを生成
 */
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * 新しいセッションを作成
 */
export function createSession(
  userId: string,
  email: string,
  role: string,
  request: NextRequest
): string {
  const sessionId = generateSessionId()
  const now = Date.now()
  
  // IPアドレスとUser-Agentを取得
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                   request.headers.get('x-real-ip') || 
                   'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  const sessionData: SessionData = {
    userId,
    email,
    role,
    createdAt: now,
    lastActivity: now,
    ipAddress,
    userAgent
  }
  
  sessions.set(sessionId, sessionData)
  return sessionId
}

/**
 * セッションを検証・更新
 */
export function validateSession(
  sessionId: string,
  request: NextRequest
): { valid: boolean; session?: SessionData; needsRenewal?: boolean } {
  const session = sessions.get(sessionId)
  
  if (!session) {
    return { valid: false }
  }
  
  const now = Date.now()
  const config = session.role === 'admin' ? ADMIN_SESSION_CONFIG : DEFAULT_SESSION_CONFIG
  
  // セッション期限切れチェック
  if (now - session.createdAt > config.maxAge) {
    sessions.delete(sessionId)
    return { valid: false }
  }
  
  // アイドルタイムアウトチェック
  if (now - session.lastActivity > config.idleTimeout) {
    sessions.delete(sessionId)
    return { valid: false }
  }
  
  // IPアドレスとUser-Agentの検証（セッションハイジャック対策）
  const currentIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                   request.headers.get('x-real-ip') || 
                   'unknown'
  const currentUserAgent = request.headers.get('user-agent') || 'unknown'
  
  if (session.ipAddress !== currentIp || session.userAgent !== currentUserAgent) {
    sessions.delete(sessionId)
    return { valid: false }
  }
  
  // セッション更新が必要かチェック
  const needsRenewal = now - session.lastActivity > config.renewalThreshold
  
  // 最終アクティビティ時間を更新
  session.lastActivity = now
  
  return { valid: true, session, needsRenewal }
}

/**
 * セッションを破棄
 */
export function destroySession(sessionId: string): boolean {
  return sessions.delete(sessionId)
}

/**
 * ユーザーの全セッションを無効化
 */
export function destroyAllUserSessions(userId: string): number {
  let count = 0
  const entries = Array.from(sessions.entries())
  for (const [sessionId, data] of entries) {
    if (data.userId === userId) {
      sessions.delete(sessionId)
      count++
    }
  }
  return count
}

/**
 * セッション情報を取得
 */
export function getSession(sessionId: string): SessionData | undefined {
  return sessions.get(sessionId)
}

/**
 * アクティブセッション数を取得
 */
export function getActiveSessionCount(): number {
  return sessions.size
}

/**
 * ユーザーのアクティブセッション数を取得
 */
export function getUserActiveSessionCount(userId: string): number {
  let count = 0
  const values = Array.from(sessions.values())
  for (const data of values) {
    if (data.userId === userId) {
      count++
    }
  }
  return count
}

/**
 * セッションCookieを設定
 */
export function setSessionCookie(
  response: NextResponse,
  sessionId: string,
  role: string = 'user'
): void {
  const config = role === 'admin' ? ADMIN_SESSION_CONFIG : DEFAULT_SESSION_CONFIG
  
  response.cookies.set('session-id', sessionId, {
    httpOnly: true,
    secure: config.secureOnly,
    sameSite: config.sameSite,
    maxAge: Math.floor(config.maxAge / 1000), // 秒単位
    path: '/',
    // 管理者セッションの場合はより厳格な設定
    ...(role === 'admin' && {
      domain: undefined, // サブドメインでの使用を制限
    })
  })
}

/**
 * セッションCookieを削除
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set('session-id', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  })
}

/**
 * セッション保護のミドルウェア
 */
export function sessionProtection(requiredRole?: string) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const sessionId = request.cookies.get('session-id')?.value
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      )
    }
    
    const validation = validateSession(sessionId, request)
    
    if (!validation.valid || !validation.session) {
      const response = NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      )
      clearSessionCookie(response)
      return response
    }
    
    // 必要な役割がある場合はチェック
    if (requiredRole && validation.session.role !== requiredRole) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    // セッション更新が必要な場合は新しいセッションIDを発行
    if (validation.needsRenewal) {
      const newSessionId = generateSessionId()
      sessions.set(newSessionId, validation.session)
      sessions.delete(sessionId)
      
      // レスポンスヘッダーに新しいセッションIDを設定
      const response = NextResponse.next()
      setSessionCookie(response, newSessionId, validation.session.role)
      response.headers.set('X-Session-Renewed', 'true')
      return response
    }
    
    return null // リクエストを通す
  }
}