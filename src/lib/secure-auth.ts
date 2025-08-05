/**
 * セキュアな認証システム
 * 既存の認証システムの脆弱性を修正し、セキュリティを強化
 */

import { createSession, validateSession, destroySession, setSessionCookie, clearSessionCookie } from './session-manager'
import { hashPassword, verifyPassword, generateSecureRandom } from './csrf'
import { NextRequest, NextResponse } from 'next/server'

// 認証試行の管理（ブルートフォース攻撃対策）
const loginAttempts = new Map<string, { attempts: number; lastAttempt: number; lockedUntil?: number }>()

// ログイン試行のクリーンアップ（1時間ごと）
setInterval(() => {
  const now = Date.now()
  for (const [ip, data] of loginAttempts.entries()) {
    if (data.lockedUntil && data.lockedUntil < now) {
      loginAttempts.delete(ip)
    } else if (now - data.lastAttempt > 60 * 60 * 1000) { // 1時間経過
      loginAttempts.delete(ip)
    }
  }
}, 60 * 60 * 1000)

export interface LoginConfig {
  maxAttempts: number // 最大試行回数
  lockoutDuration: number // ロックアウト期間（ミリ秒）
  attemptWindow: number // 試行回数リセット期間（ミリ秒）
}

const DEFAULT_LOGIN_CONFIG: LoginConfig = {
  maxAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15分
  attemptWindow: 60 * 60 * 1000 // 1時間
}

/**
 * IPアドレスを取得
 */
function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown'
}

/**
 * ログイン試行をチェック（ブルートフォース攻撃対策）
 */
function checkLoginAttempts(ip: string, config: LoginConfig = DEFAULT_LOGIN_CONFIG): { allowed: boolean; remainingAttempts?: number; lockedUntil?: number } {
  const now = Date.now()
  const attempts = loginAttempts.get(ip)
  
  if (!attempts) {
    return { allowed: true }
  }
  
  // ロックアウト中かチェック
  if (attempts.lockedUntil && attempts.lockedUntil > now) {
    return { 
      allowed: false, 
      lockedUntil: attempts.lockedUntil 
    }
  }
  
  // 試行回数をリセットするか判定
  if (now - attempts.lastAttempt > config.attemptWindow) {
    loginAttempts.delete(ip)
    return { allowed: true }
  }
  
  // 最大試行回数を超えているかチェック
  if (attempts.attempts >= config.maxAttempts) {
    const lockUntil = now + config.lockoutDuration
    attempts.lockedUntil = lockUntil
    return { 
      allowed: false, 
      lockedUntil: lockUntil 
    }
  }
  
  return { 
    allowed: true, 
    remainingAttempts: config.maxAttempts - attempts.attempts 
  }
}

/**
 * ログイン失敗を記録
 */
function recordFailedLogin(ip: string): void {
  const now = Date.now()
  const attempts = loginAttempts.get(ip)
  
  if (attempts) {
    attempts.attempts++
    attempts.lastAttempt = now
    if (attempts.lockedUntil && attempts.lockedUntil < now) {
      delete attempts.lockedUntil
    }
  } else {
    loginAttempts.set(ip, {
      attempts: 1,
      lastAttempt: now
    })
  }
}

/**
 * ログイン成功時にカウンターをリセット
 */
function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip)
}

/**
 * パスワード強度チェック
 */
export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('パスワードは8文字以上である必要があります')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('パスワードには大文字を含める必要があります')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('パスワードには小文字を含める必要があります')
  }
  
  if (!/\d/.test(password)) {
    errors.push('パスワードには数字を含める必要があります')
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('パスワードには特殊文字を含める必要があります')
  }
  
  // よく使われる危険なパスワードのチェック
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'root', 'user', 'test'
  ]
  
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('一般的なパスワードは使用できません')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * セキュアなログイン処理
 */
export async function secureLogin(
  email: string, 
  password: string, 
  request: NextRequest
): Promise<{ success: boolean; sessionId?: string; error?: string; lockoutInfo?: any }> {
  
  const ip = getClientIP(request)
  
  // ブルートフォース攻撃チェック
  const attemptCheck = checkLoginAttempts(ip)
  if (!attemptCheck.allowed) {
    return {
      success: false,
      error: 'Too many failed attempts. Please try again later.',
      lockoutInfo: {
        lockedUntil: attemptCheck.lockedUntil,
        message: `アカウントが一時的にロックされています。${new Date(attemptCheck.lockedUntil!).toLocaleString()}まで待ってからもう一度お試しください。`
      }
    }
  }
  
  // 入力値検証
  if (!email || !password) {
    recordFailedLogin(ip)
    return {
      success: false,
      error: 'Email and password are required'
    }
  }
  
  // メールアドレス形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    recordFailedLogin(ip)
    return {
      success: false,
      error: 'Invalid email format'
    }
  }
  
  // デモ認証（本番環境では削除）
  if (process.env.NODE_ENV === 'development') {
    const demoUsers = [
      { email: 'admin@nagase-salon.com', password: 'Salon123!@#', role: 'admin' }
    ]
    
    const demoUser = demoUsers.find(u => u.email === email)
    if (demoUser) {
      // デモ環境でもパスワードハッシュ化を使用
      const { hash: expectedHash, salt } = hashPassword('Salon123!@#')
      const isValidPassword = verifyPassword(password, expectedHash, salt)
      
      if (isValidPassword) {
        resetLoginAttempts(ip)
        const sessionId = createSession('demo-user', email, demoUser.role, request)
        return {
          success: true,
          sessionId
        }
      }
    }
  }
  
  // 実際の認証ロジック（Firebase等との連携）
  // ここでは Firebase Authentication を使用する想定
  try {
    // Firebase認証は別途実装
    // const user = await authenticateWithFirebase(email, password)
    
    // 認証失敗をシミュレート（実際の実装では Firebase のエラーハンドリング）
    recordFailedLogin(ip)
    return {
      success: false,
      error: 'Invalid credentials'
    }
    
  } catch (error) {
    recordFailedLogin(ip)
    return {
      success: false,
      error: 'Authentication failed'
    }
  }
}

/**
 * セキュアなログアウト処理
 */
export async function secureLogout(sessionId: string): Promise<{ success: boolean }> {
  const destroyed = destroySession(sessionId)
  return { success: destroyed }
}

/**
 * セッション検証ミドルウェア
 */
export function authenticationMiddleware(requiredRole?: 'admin' | 'staff' | 'user') {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const sessionId = request.cookies.get('session-id')?.value
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Authentication required' },
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
    
    // 役割ベースのアクセス制御
    if (requiredRole && validation.session.role !== requiredRole) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    // セッション更新が必要な場合
    if (validation.needsRenewal) {
      const response = NextResponse.next()
      // セッション更新ロジックは session-manager.ts で処理
      response.headers.set('X-Session-Renewed', 'true')
      return response
    }
    
    return null // 認証成功、リクエストを通す
  }
}

/**
 * 管理者専用認証ミドルウェア
 */
export const adminAuthMiddleware = authenticationMiddleware('admin')

/**
 * パスワード変更
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  
  // 新しいパスワードの強度チェック
  const strengthCheck = validatePasswordStrength(newPassword)
  if (!strengthCheck.valid) {
    return {
      success: false,
      error: strengthCheck.errors.join(', ')
    }
  }
  
  // 現在のパスワードと同じかチェック
  if (currentPassword === newPassword) {
    return {
      success: false,
      error: '新しいパスワードは現在のパスワードと異なる必要があります'
    }
  }
  
  try {
    // 実際のパスワード変更処理（Firebase等）
    // await updatePasswordInDatabase(userId, newPassword)
    
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update password'
    }
  }
}

/**
 * セキュリティ監査ログ
 */
export function logSecurityEvent(
  event: 'login_success' | 'login_failure' | 'logout' | 'password_change' | 'session_expired',
  userId: string | null,
  ip: string,
  userAgent: string,
  details?: any
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    userId,
    ip,
    userAgent: userAgent.substring(0, 200), // User-Agent を制限
    details: details || {}
  }
  
  // 本番環境では外部ログサービス（CloudWatch等）に送信
  console.log('SECURITY_EVENT:', JSON.stringify(logEntry))
}