import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // レスポンスヘッダーを設定
  const response = NextResponse.next()
  
  // セキュリティヘッダーの設定
  const headers = {
    // XSS保護
    'X-XSS-Protection': '1; mode=block',
    // コンテンツタイプのスニッフィング防止
    'X-Content-Type-Options': 'nosniff',
    // クリックジャッキング対策
    'X-Frame-Options': 'DENY',
    // リファラーポリシー
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // HTTPS強制
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    // 権限ポリシー（旧Feature Policy）
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    
    // Content Security Policy (CSP)
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://maps.googleapis.com https://www.google-analytics.com https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com https://firebaseapp.com https://*.firebaseio.com wss://*.firebaseio.com",
      "frame-src https://maps.google.com https://www.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  }

  // 各ヘッダーを設定
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // 管理画面へのアクセスに追加のセキュリティヘッダーを設定
  if (request.nextUrl.pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    // 管理画面専用の厳格なCSP
    response.headers.set('Content-Security-Policy', [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'", // 管理画面では外部スクリプトを制限
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://nagase-salon-data.s3.ap-northeast-1.amazonaws.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ].join('; '))
  }
  
  // セキュアなCookie設定の強制
  const cookies = request.cookies.getAll()
  for (const cookie of cookies) {
    if (cookie.name.includes('session') || cookie.name.includes('auth')) {
      // セッション関連Cookieのセキュリティ設定を強制
      response.cookies.set(cookie.name, cookie.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: cookie.name.includes('admin') ? 8 * 60 * 60 : 24 * 60 * 60 // 管理者は8時間、一般は24時間
      })
    }
  }

  return response
}

// Middleware を適用するパスの設定
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}