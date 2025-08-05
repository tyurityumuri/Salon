/**
 * セキュリティログ機能
 * 
 * - セキュリティイベントの記録
 * - 異常検知とアラート
 * - ログの分析と可視化
 * - インシデント追跡
 */

import { NextRequest } from 'next/server'

// セキュリティイベントの種類
export type SecurityEventType = 
  | 'login_success'
  | 'login_failure' 
  | 'login_blocked'
  | 'logout'
  | 'session_expired'
  | 'session_hijack_attempt'
  | 'csrf_token_invalid'
  | 'rate_limit_exceeded'
  | 'unauthorized_api_access'
  | 'xss_attempt'
  | 'sql_injection_attempt'
  | 'file_upload_blocked'
  | 'admin_access'
  | 'data_access'
  | 'configuration_change'
  | 'suspicious_activity'
  | 'system_error'

// リスクレベル
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

// セキュリティイベントのインターface
export interface SecurityEvent {
  id: string
  timestamp: string
  type: SecurityEventType
  level: RiskLevel
  userId?: string
  email?: string
  ipAddress: string
  userAgent: string
  path: string
  method: string
  details: Record<string, any>
  location?: {
    country?: string
    city?: string
    latitude?: number
    longitude?: number
  }
  resolved: boolean
  resolutionNotes?: string
}

// メモリ内ログストレージ（本番環境では外部ストレージを使用）
const securityLogs: SecurityEvent[] = []
const MAX_LOGS = 10000 // メモリ使用量制限

// 異常なアクティビティの追跡
const suspiciousActivities = new Map<string, {
  count: number
  firstSeen: number
  lastSeen: number
  events: SecurityEventType[]
}>()

// アラートの管理
const activeAlerts = new Map<string, {
  type: SecurityEventType
  count: number
  startTime: number
  lastAlert: number
}>()

/**
 * セキュリティイベントをログに記録
 */
export function logSecurityEvent(
  type: SecurityEventType,
  request: NextRequest,
  details: Record<string, any> = {},
  userId?: string,
  email?: string
): string {
  
  const eventId = generateEventId()
  const ipAddress = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  const event: SecurityEvent = {
    id: eventId,
    timestamp: new Date().toISOString(),
    type,
    level: determineRiskLevel(type, details),
    userId,
    email,
    ipAddress,
    userAgent: userAgent.substring(0, 500), // User-Agent の長さ制限
    path: request.nextUrl.pathname,
    method: request.method,
    details: sanitizeDetails(details),
    resolved: false
  }
  
  // GeoIPルックアップ（本番環境では外部サービスを使用）
  if (process.env.NODE_ENV === 'production') {
    // event.location = await lookupGeoIP(ipAddress)
  }
  
  // ログに追加
  securityLogs.push(event)
  
  // ログサイズ制限
  if (securityLogs.length > MAX_LOGS) {
    securityLogs.shift() // 古いログを削除
  }
  
  // 異常検知
  detectAnomalousActivity(event)
  
  // アラートチェック
  checkForAlerts(event)
  
  // 外部ログサービスに送信（本番環境）
  if (process.env.NODE_ENV === 'production') {
    sendToExternalLogger(event)
  } else {
    // 開発環境ではコンソール出力
    console.log(`[SECURITY] ${event.level.toUpperCase()}: ${type}`, {
      ip: ipAddress,
      user: userId || 'anonymous',
      path: event.path,
      details: event.details
    })
  }
  
  return eventId
}

/**
 * クライアントIPアドレスを取得
 */
function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         request.headers.get('x-real-ip') ||
         request.headers.get('cf-connecting-ip') || // Cloudflare
         'unknown'
}

/**
 * イベントIDを生成
 */
function generateEventId(): string {
  return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * リスクレベルを判定
 */
function determineRiskLevel(type: SecurityEventType, details: Record<string, any>): RiskLevel {
  const highRiskEvents: SecurityEventType[] = [
    'session_hijack_attempt',
    'sql_injection_attempt', 
    'unauthorized_api_access',
    'configuration_change'
  ]
  
  const mediumRiskEvents: SecurityEventType[] = [
    'login_blocked',
    'csrf_token_invalid',
    'xss_attempt',
    'file_upload_blocked',
    'suspicious_activity'
  ]
  
  if (highRiskEvents.includes(type)) {
    return 'critical'
  }
  
  if (mediumRiskEvents.includes(type)) {
    return 'high'
  }
  
  if (type === 'login_failure' && details.consecutiveFailures > 5) {
    return 'high'
  }
  
  if (type === 'rate_limit_exceeded' && details.attempts > 100) {
    return 'medium'
  }
  
  return 'low'
}

/**
 * 詳細情報をサニタイズ
 */
function sanitizeDetails(details: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(details)) {
    // 機密情報を除外
    if (key.toLowerCase().includes('password') || 
        key.toLowerCase().includes('token') ||
        key.toLowerCase().includes('secret')) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof value === 'string' && value.length > 1000) {
      sanitized[key] = value.substring(0, 1000) + '...[TRUNCATED]'
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}

/**
 * 異常なアクティビティを検知
 */
function detectAnomalousActivity(event: SecurityEvent): void {
  const key = event.ipAddress
  const now = Date.now()
  
  const activity = suspiciousActivities.get(key)
  
  if (activity) {
    activity.count++
    activity.lastSeen = now
    activity.events.push(event.type)
    
    // 短時間内に多数のセキュリティイベント
    if (activity.count > 10 && now - activity.firstSeen < 60 * 1000) {
      logSecurityEvent('suspicious_activity', 
        { nextUrl: { pathname: event.path }, method: event.method, headers: new Headers() } as NextRequest,
        {
          reason: 'High frequency security events',
          eventCount: activity.count,
          timeWindow: now - activity.firstSeen,
          eventTypes: [...new Set(activity.events)]
        },
        event.userId,
        event.email
      )
    }
  } else {
    suspiciousActivities.set(key, {
      count: 1,
      firstSeen: now,
      lastSeen: now,
      events: [event.type]
    })
  }
  
  // 古いエントリをクリーンアップ
  cleanupSuspiciousActivities()
}

/**
 * アラートをチェック
 */
function checkForAlerts(event: SecurityEvent): void {
  const alertKey = `${event.type}_${event.ipAddress}`
  const now = Date.now()
  
  const alert = activeAlerts.get(alertKey)
  
  if (alert) {
    alert.count++
    alert.lastAlert = now
  } else {
    activeAlerts.set(alertKey, {
      type: event.type,
      count: 1,
      startTime: now,
      lastAlert: now
    })
  }
  
  // アラート条件をチェック
  const currentAlert = activeAlerts.get(alertKey)!
  
  if (shouldTriggerAlert(event.type, currentAlert)) {
    triggerAlert(event, currentAlert)
  }
}

/**
 * アラートをトリガーするかどうか判定
 */
function shouldTriggerAlert(type: SecurityEventType, alert: any): boolean {
  const thresholds: Record<SecurityEventType, { count: number; timeWindow: number }> = {
    'login_failure': { count: 5, timeWindow: 300000 }, // 5分間に5回
    'rate_limit_exceeded': { count: 3, timeWindow: 600000 }, // 10分間に3回
    'csrf_token_invalid': { count: 3, timeWindow: 300000 }, // 5分間に3回
    'unauthorized_api_access': { count: 1, timeWindow: 0 }, // 即座に
    'xss_attempt': { count: 1, timeWindow: 0 }, // 即座に
    'sql_injection_attempt': { count: 1, timeWindow: 0 }, // 即座に
    'session_hijack_attempt': { count: 1, timeWindow: 0 }, // 即座に
    // その他のイベントタイプにもデフォルト値を設定
    'login_success': { count: 100, timeWindow: 3600000 }, // 1時間に100回
    'login_blocked': { count: 10, timeWindow: 300000 }, // 5分間に10回
    'logout': { count: 50, timeWindow: 3600000 }, // 1時間に50回
    'session_expired': { count: 20, timeWindow: 3600000 }, // 1時間に20回
    'file_upload_blocked': { count: 5, timeWindow: 300000 }, // 5分間に5回
    'admin_access': { count: 10, timeWindow: 3600000 }, // 1時間に10回
    'data_access': { count: 100, timeWindow: 3600000 }, // 1時間に100回
    'configuration_change': { count: 5, timeWindow: 3600000 }, // 1時間に5回
    'suspicious_activity': { count: 1, timeWindow: 0 }, // 即座に
    'system_error': { count: 10, timeWindow: 300000 } // 5分間に10回
  }
  
  const threshold = thresholds[type]
  if (!threshold) return false
  
  const now = Date.now()
  
  return alert.count >= threshold.count && 
         (threshold.timeWindow === 0 || now - alert.startTime <= threshold.timeWindow)
}

/**
 * アラートをトリガー
 */
function triggerAlert(event: SecurityEvent, alert: any): void {
  const alertMessage = {
    severity: event.level,
    title: `Security Alert: ${event.type}`,
    description: `Multiple ${event.type} events detected from ${event.ipAddress}`,
    count: alert.count,
    timeWindow: Date.now() - alert.startTime,
    firstOccurrence: new Date(alert.startTime).toISOString(),
    lastOccurrence: event.timestamp,
    affectedUser: event.userId || 'unknown',
    sourceIP: event.ipAddress,
    userAgent: event.userAgent,
    details: event.details
  }
  
  // 本番環境では外部アラートシステムに送信
  if (process.env.NODE_ENV === 'production') {
    // sendToAlertManager(alertMessage)
    // sendSlackNotification(alertMessage)
    // sendEmailAlert(alertMessage)
  }
  
  console.warn('[SECURITY ALERT]', alertMessage)
}

/**
 * 外部ログサービスに送信
 */
function sendToExternalLogger(event: SecurityEvent): void {
  // CloudWatch Logs, Elasticsearch, Splunk等への送信
  // 実装例:
  // await cloudWatchLogs.putLogEvents({
  //   logGroupName: '/aws/lambda/security-logs',
  //   logStreamName: 'security-events',
  //   logEvents: [{
  //     timestamp: Date.now(),
  //     message: JSON.stringify(event)
  //   }]
  // }).promise()
}

/**
 * 古い疑わしいアクティビティエントリをクリーンアップ
 */
function cleanupSuspiciousActivities(): void {
  const now = Date.now()
  const maxAge = 24 * 60 * 60 * 1000 // 24時間
  
  for (const [key, activity] of suspiciousActivities.entries()) {
    if (now - activity.lastSeen > maxAge) {
      suspiciousActivities.delete(key)
    }
  }
}

/**
 * セキュリティレポートを生成
 */
export function generateSecurityReport(
  startDate: Date,
  endDate: Date
): {
  summary: Record<SecurityEventType, number>
  topIPs: Array<{ ip: string; count: number }>
  riskDistribution: Record<RiskLevel, number>
  timeline: Array<{ date: string; count: number }>
  recommendations: string[]
} {
  
  const filteredLogs = securityLogs.filter(log => {
    const logDate = new Date(log.timestamp)
    return logDate >= startDate && logDate <= endDate
  })
  
  // イベントタイプ別の集計
  const summary: Record<SecurityEventType, number> = {} as Record<SecurityEventType, number>
  const ipCounts: Record<string, number> = {}
  const riskDistribution: Record<RiskLevel, number> = { low: 0, medium: 0, high: 0, critical: 0 }
  
  filteredLogs.forEach(log => {
    summary[log.type] = (summary[log.type] || 0) + 1
    ipCounts[log.ipAddress] = (ipCounts[log.ipAddress] || 0) + 1
    riskDistribution[log.level]++
  })
  
  // トップIP（不審なアクティビティが多い順）
  const topIPs = Object.entries(ipCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([ip, count]) => ({ ip, count }))
  
  // タイムライン（日別）
  const timelineMap: Record<string, number> = {}
  filteredLogs.forEach(log => {
    const date = log.timestamp.split('T')[0]
    timelineMap[date] = (timelineMap[date] || 0) + 1
  })
  
  const timeline = Object.entries(timelineMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }))
  
  // 推奨事項を生成
  const recommendations = generateRecommendations(summary, riskDistribution, topIPs)
  
  return {
    summary,
    topIPs,
    riskDistribution,
    timeline,
    recommendations
  }
}

/**
 * 推奨事項を生成
 */
function generateRecommendations(
  summary: Record<SecurityEventType, number>,
  riskDistribution: Record<RiskLevel, number>,
  topIPs: Array<{ ip: string; count: number }>
): string[] {
  
  const recommendations: string[] = []
  
  // ログイン失敗が多い場合
  if ((summary.login_failure || 0) > 100) {
    recommendations.push('ログイン失敗が多発しています。パスワードポリシーの強化を検討してください。')
  }
  
  // 高リスクイベントが多い場合
  if (riskDistribution.critical > 5 || riskDistribution.high > 20) {
    recommendations.push('高リスクのセキュリティイベントが検出されています。緊急対応が必要です。')
  }
  
  // 特定IPからの大量アクセス
  if (topIPs.length > 0 && topIPs[0].count > 1000) {
    recommendations.push(`IP ${topIPs[0].ip} からの異常なアクセスが検出されています。IPブロックを検討してください。`)
  }
  
  // CSRF攻撃の疑い
  if ((summary.csrf_token_invalid || 0) > 50) {
    recommendations.push('CSRF攻撃の疑いがあります。トークン検証の強化を検討してください。')
  }
  
  // レート制限超過
  if ((summary.rate_limit_exceeded || 0) > 100) {
    recommendations.push('レート制限を超過するリクエストが多発しています。制限値の見直しを検討してください。')
  }
  
  return recommendations
}

/**
 * セキュリティダッシュボード用のデータを取得
 */
export function getSecurityDashboardData(): {
  recentEvents: SecurityEvent[]
  alertCount: number
  suspiciousIPs: string[]
  systemHealth: 'good' | 'warning' | 'critical'
} {
  
  const recentEvents = securityLogs
    .slice(-50) // 最新50件
    .reverse()
  
  const alertCount = activeAlerts.size
  
  const suspiciousIPs = Array.from(suspiciousActivities.keys())
    .filter(ip => {
      const activity = suspiciousActivities.get(ip)!
      return activity.count > 5 || Date.now() - activity.lastSeen < 3600000 // 1時間以内
    })
  
  // システムヘルス判定
  let systemHealth: 'good' | 'warning' | 'critical' = 'good'
  
  const recentCriticalEvents = recentEvents.filter(e => 
    e.level === 'critical' && Date.now() - new Date(e.timestamp).getTime() < 3600000
  ).length
  
  if (recentCriticalEvents > 5) {
    systemHealth = 'critical'
  } else if (recentCriticalEvents > 0 || alertCount > 10) {
    systemHealth = 'warning'
  }
  
  return {
    recentEvents,
    alertCount,
    suspiciousIPs,
    systemHealth
  }
}

/**
 * セキュリティイベントを検索
 */
export function searchSecurityEvents(filters: {
  type?: SecurityEventType
  level?: RiskLevel
  userId?: string
  ipAddress?: string
  startDate?: Date
  endDate?: Date
  limit?: number
}): SecurityEvent[] {
  
  let filtered = securityLogs
  
  if (filters.type) {
    filtered = filtered.filter(log => log.type === filters.type)
  }
  
  if (filters.level) {
    filtered = filtered.filter(log => log.level === filters.level)
  }
  
  if (filters.userId) {
    filtered = filtered.filter(log => log.userId === filters.userId)
  }
  
  if (filters.ipAddress) {
    filtered = filtered.filter(log => log.ipAddress === filters.ipAddress)
  }
  
  if (filters.startDate) {
    filtered = filtered.filter(log => new Date(log.timestamp) >= filters.startDate!)
  }
  
  if (filters.endDate) {
    filtered = filtered.filter(log => new Date(log.timestamp) <= filters.endDate!)
  }
  
  // 最新順にソート
  filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  
  if (filters.limit) {
    filtered = filtered.slice(0, filters.limit)
  }
  
  return filtered
}