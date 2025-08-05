import { NextRequest } from 'next/server'
import { createCSRFTokenResponse } from '@/lib/csrf'
import { publicApiRateLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  // レート制限チェック
  const rateLimitResult = await publicApiRateLimit(request)
  if (rateLimitResult) return rateLimitResult
  
  try {
    // 既存のセッションIDがあるかチェック
    const existingSessionId = request.cookies.get('session-id')?.value
    
    return createCSRFTokenResponse(existingSessionId)
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}