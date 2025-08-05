/**
 * API セキュリティ強化ライブラリ
 * 
 * - API キー認証
 * - リクエスト署名検証
 * - ペイロード検証
 * - IPホワイトリスト
 * - APIバージョニング
 */

import { NextRequest, NextResponse } from 'next/server'
import * as crypto from 'crypto'
import { formatZodError } from './validation'
import { z } from 'zod'

// APIキーの管理（本番環境では外部KVストアを使用）
const apiKeys = new Map<string, {
  name: string
  permissions: string[]
  createdAt: number
  lastUsed: number
  ipWhitelist?: string[]
  rateLimit?: { requests: number; window: number }
}>()

// APIキーの使用状況追跡
const apiKeyUsage = new Map<string, { count: number; resetTime: number }>()

// IPホワイトリスト（管理者API用）
const adminIPWhitelist = new Set([
  '127.0.0.1',
  '::1',
  // 本番環境では実際の管理者IPアドレスを設定
])

/**
 * APIキーを生成
 */
export function generateAPIKey(): string {
  return `ngs_${crypto.randomBytes(24).toString('hex')}`
}

/**
 * APIキーを作成・登録
 */
export function createAPIKey(
  name: string,
  permissions: string[] = [],
  options: {
    ipWhitelist?: string[]
    rateLimit?: { requests: number; window: number }
  } = {}
): string {
  const apiKey = generateAPIKey()
  
  apiKeys.set(apiKey, {
    name,
    permissions,
    createdAt: Date.now(),
    lastUsed: 0,
    ipWhitelist: options.ipWhitelist,
    rateLimit: options.rateLimit
  })
  
  return apiKey
}

/**
 * APIキーを検証
 */
export function validateAPIKey(
  apiKey: string,
  requiredPermission?: string,
  clientIP?: string
): { valid: boolean; keyInfo?: any; error?: string } {
  
  const keyInfo = apiKeys.get(apiKey)
  
  if (!keyInfo) {
    return { valid: false, error: 'Invalid API key' }
  }
  
  // IPホワイトリストチェック
  if (keyInfo.ipWhitelist && clientIP) {
    if (!keyInfo.ipWhitelist.includes(clientIP)) {
      return { valid: false, error: 'IP address not whitelisted' }
    }
  }
  
  // 権限チェック
  if (requiredPermission && !keyInfo.permissions.includes(requiredPermission)) {
    return { valid: false, error: 'Insufficient permissions' }
  }
  
  // レート制限チェック
  if (keyInfo.rateLimit) {
    const now = Date.now()
    const usage = apiKeyUsage.get(apiKey)
    
    if (!usage || usage.resetTime < now) {
      apiKeyUsage.set(apiKey, {
        count: 1,
        resetTime: now + keyInfo.rateLimit.window
      })
    } else if (usage.count >= keyInfo.rateLimit.requests) {
      return { valid: false, error: 'Rate limit exceeded' }
    } else {
      usage.count++
    }
  }
  
  // 最終使用時間を更新
  keyInfo.lastUsed = Date.now()
  
  return { valid: true, keyInfo }
}

/**
 * リクエスト署名を生成
 */
export function generateRequestSignature(
  method: string,
  path: string,
  body: string,
  timestamp: string,
  secret: string
): string {
  const message = `${method}\n${path}\n${timestamp}\n${body}`
  return crypto.createHmac('sha256', secret).update(message).digest('hex')
}

/**
 * リクエスト署名を検証
 */
export function verifyRequestSignature(
  request: NextRequest,
  secret: string,
  maxAge: number = 300000 // 5分
): boolean {
  
  const signature = request.headers.get('x-signature')
  const timestamp = request.headers.get('x-timestamp')
  
  if (!signature || !timestamp) {
    return false
  }
  
  // タイムスタンプの検証（リプレイ攻撃対策）
  const now = Date.now()
  const requestTime = parseInt(timestamp)
  
  if (isNaN(requestTime) || now - requestTime > maxAge) {
    return false
  }
  
  // 署名の検証
  const method = request.method
  const path = request.nextUrl.pathname
  const body = '' // ここではボディを空として扱う（実際の実装では適切に取得）
  
  const expectedSignature = generateRequestSignature(method, path, body, timestamp, secret)
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  )
}

/**
 * IPアドレスホワイトリストチェック
 */
export function checkIPWhitelist(
  request: NextRequest,
  whitelist: Set<string>
): boolean {
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                  request.headers.get('x-real-ip') || 
                  'unknown'
  
  return whitelist.has(clientIP)
}

/**
 * APIバージョニング
 */
export function validateAPIVersion(
  request: NextRequest,
  supportedVersions: string[] = ['v1']
): { valid: boolean; version?: string; error?: string } {
  
  const versionHeader = request.headers.get('x-api-version') || 
                       request.headers.get('accept-version')
  
  // URLパスからバージョンを抽出
  const pathMatch = request.nextUrl.pathname.match(/\/api\/(v\d+)\//)
  const pathVersion = pathMatch?.[1]
  
  const version = versionHeader || pathVersion || 'v1'
  
  if (!supportedVersions.includes(version)) {
    return {
      valid: false,
      error: `Unsupported API version: ${version}. Supported versions: ${supportedVersions.join(', ')}`
    }
  }
  
  return { valid: true, version }
}

/**
 * ペイロード検証
 */
export function validatePayload<T>(
  data: any,
  schema: z.ZodSchema<T>,
  options: {
    sanitize?: boolean
    maxSize?: number
  } = {}
): { valid: boolean; data?: T; errors?: Record<string, string> } {
  
  try {
    // サイズチェック
    if (options.maxSize) {
      const jsonSize = JSON.stringify(data).length
      if (jsonSize > options.maxSize) {
        return {
          valid: false,
          errors: { _size: `Payload too large: ${jsonSize} bytes (max: ${options.maxSize})` }
        }
      }
    }
    
    // サニタイゼーション（オプション）
    if (options.sanitize && typeof data === 'object') {
      data = sanitizeObject(data)
    }
    
    const result = schema.safeParse(data)
    
    if (!result.success) {
      return {
        valid: false,
        errors: formatZodError(result.error)
      }
    }
    
    return {
      valid: true,
      data: result.data
    }
    
  } catch (error) {
    return {
      valid: false,
      errors: { _parse: 'Invalid JSON format' }
    }
  }
}

/**
 * オブジェクトのサニタイゼーション
 */
function sanitizeObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }
  
  const sanitized: any = {}
  
  for (const [key, value] of Object.entries(obj)) {
    // 危険なキーを除外
    if (key.startsWith('__') || key.includes('prototype')) {
      continue
    }
    
    if (typeof value === 'string') {
      // 文字列のサニタイゼーション
      sanitized[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim()
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value)
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}

/**
 * API セキュリティミドルウェア
 */
export function apiSecurityMiddleware(options: {
  requireAPIKey?: boolean
  requiredPermission?: string
  requireSignature?: boolean
  checkIPWhitelist?: boolean
  maxPayloadSize?: number
  supportedVersions?: string[]
} = {}) {
  
  return async (request: NextRequest): Promise<NextResponse | null> => {
    
    // APIバージョンチェック
    if (options.supportedVersions) {
      const versionCheck = validateAPIVersion(request, options.supportedVersions)
      if (!versionCheck.valid) {
        return NextResponse.json(
          { error: versionCheck.error },
          { status: 400 }
        )
      }
    }
    
    // IPホワイトリストチェック
    if (options.checkIPWhitelist) {
      if (!checkIPWhitelist(request, adminIPWhitelist)) {
        return NextResponse.json(
          { error: 'Access denied from this IP address' },
          { status: 403 }
        )
      }
    }
    
    // APIキー認証
    if (options.requireAPIKey) {
      const apiKey = request.headers.get('x-api-key')
      
      if (!apiKey) {
        return NextResponse.json(
          { error: 'API key required' },
          { status: 401 }
        )
      }
      
      const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip')
      
      const validation = validateAPIKey(apiKey, options.requiredPermission, clientIP || undefined)
      
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 403 }
        )
      }
    }
    
    // リクエスト署名検証
    if (options.requireSignature) {
      const secret = process.env.API_SIGNATURE_SECRET
      if (!secret) {
        return NextResponse.json(
          { error: 'Signature verification not configured' },
          { status: 500 }
        )
      }
      
      if (!verifyRequestSignature(request, secret)) {
        return NextResponse.json(
          { error: 'Invalid request signature' },
          { status: 403 }
        )
      }
    }
    
    return null // セキュリティチェック通過
  }
}

/**
 * 管理者API用の厳格なセキュリティミドルウェア
 */
export const adminAPISecurityMiddleware = apiSecurityMiddleware({
  requireAPIKey: true,
  requiredPermission: 'admin',
  checkIPWhitelist: true,
  maxPayloadSize: 1024 * 1024, // 1MB
  supportedVersions: ['v1']
})

/**
 * 公開API用の基本的なセキュリティミドルウェア
 */
export const publicAPISecurityMiddleware = apiSecurityMiddleware({
  requireAPIKey: false,
  maxPayloadSize: 100 * 1024, // 100KB
  supportedVersions: ['v1']
})

// デフォルトのAPIキーを作成（開発用）
if (process.env.NODE_ENV === 'development') {
  const devAPIKey = createAPIKey('development', ['read', 'write', 'admin'])
  console.log('Development API Key:', devAPIKey)
}