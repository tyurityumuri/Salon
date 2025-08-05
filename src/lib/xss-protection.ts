/**
 * XSS (Cross-Site Scripting) 保護ライブラリ
 * 
 * - HTML サニタイゼーション
 * - URL サニタイゼーション
 * - CSS サニタイゼーション
 * - コンテンツセキュリティポリシー (CSP) 生成
 * - 出力エンコーディング
 */

import DOMPurify from 'isomorphic-dompurify'

// 危険なHTMLタグ・属性のブラックリスト
const DANGEROUS_TAGS = [
  'script', 'object', 'embed', 'link', 'style', 'meta',
  'form', 'input', 'textarea', 'button', 'select', 'option',
  'iframe', 'frame', 'frameset', 'noframes', 'noscript',
  'applet', 'base', 'basefont', 'bgsound', 'blink',
  'body', 'head', 'html', 'title', 'xml'
]

const DANGEROUS_ATTRIBUTES = [
  'onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout',
  'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter',
  'onmouseleave', 'onkeydown', 'onkeyup', 'onkeypress',
  'onfocus', 'onblur', 'onchange', 'onsubmit', 'onreset',
  'onselect', 'onabort', 'onunload', 'onresize', 'onscroll'
]

// JavaScript プロトコルのパターン
const JS_PROTOCOL_REGEX = /^[\s]*javascript:/i
const DATA_PROTOCOL_REGEX = /^[\s]*data:/i
const VBSCRIPT_PROTOCOL_REGEX = /^[\s]*vbscript:/i
const FILE_PROTOCOL_REGEX = /^[\s]*file:/i

/**
 * HTMLコンテンツをサニタイズ
 */
export function sanitizeHTML(
  input: string,
  options: {
    allowedTags?: string[]
    allowedAttributes?: string[]
    stripUnknownTags?: boolean
    allowDataAttributes?: boolean
  } = {}
): string {
  
  if (!input || typeof input !== 'string') {
    return ''
  }
  
  // DOMPurifyの設定
  const config: any = {
    ALLOWED_TAGS: options.allowedTags || [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'span', 'div',
      'a', 'img'
    ],
    ALLOWED_ATTR: options.allowedAttributes || [
      'href', 'src', 'alt', 'title', 'class', 'id', 'target'
    ],
    STRIP_UNKNOWN_TAGS: options.stripUnknownTags !== false,
    ALLOW_DATA_ATTR: options.allowDataAttributes || false,
    FORBID_TAGS: DANGEROUS_TAGS,
    FORBID_ATTR: DANGEROUS_ATTRIBUTES,
    
    // プロトコルのホワイトリスト
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    
    // HTMLエンティティのデコードを防ぐ
    KEEP_CONTENT: false,
    
    // SVGの無効化
    USE_PROFILES: { html: true, svg: false, svgFilters: false, mathMl: false }
  }
  
  try {
    return DOMPurify.sanitize(input, config) as unknown as string
  } catch (error) {
    console.error('HTML sanitization failed:', error)
    return ''
  }
}

/**
 * プレーンテキスト用のサニタイゼーション
 */
export function sanitizeText(input: string, maxLength?: number): string {
  if (!input || typeof input !== 'string') {
    return ''
  }
  
  let sanitized = input
    // HTMLタグを完全に削除
    .replace(/<[^>]*>/g, '')
    // HTMLエンティティをデコード後、再エンコード
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    // 特殊文字をエスケープ
    .replace(/[<>&"']/g, (match) => {
      const escapes: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;'
      }
      return escapes[match]
    })
    // 制御文字を削除
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    // 複数の空白を単一に
    .replace(/\s+/g, ' ')
    .trim()
  
  // 長さ制限
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength).trim() + '...'
  }
  
  return sanitized
}

/**
 * URLをサニタイズ
 */
export function sanitizeURL(url: string): string {
  if (!url || typeof url !== 'string') {
    return ''
  }
  
  const trimmedUrl = url.trim()
  
  // 危険なプロトコルをチェック
  if (
    JS_PROTOCOL_REGEX.test(trimmedUrl) ||
    VBSCRIPT_PROTOCOL_REGEX.test(trimmedUrl) ||
    FILE_PROTOCOL_REGEX.test(trimmedUrl)
  ) {
    return ''
  }
  
  // data: URLは画像のみ許可
  if (DATA_PROTOCOL_REGEX.test(trimmedUrl)) {
    if (!trimmedUrl.match(/^data:image\/(png|jpg|jpeg|gif|webp|svg\+xml);base64,/i)) {
      return ''
    }
  }
  
  try {
    // URLの形式をチェック
    const parsedUrl = new URL(trimmedUrl, 'https://example.com')
    
    // 許可されたプロトコルのみ
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:', 'ftp:']
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return ''
    }
    
    return parsedUrl.toString()
  } catch {
    // 相対URLまたは無効なURLの場合
    if (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('./') || trimmedUrl.startsWith('../')) {
      return trimmedUrl.replace(/[<>&"']/g, (match) => {
        const escapes: Record<string, string> = {
          '<': '%3C',
          '>': '%3E',
          '&': '%26',
          '"': '%22',
          "'": '%27'
        }
        return escapes[match]
      })
    }
    return ''
  }
}

/**
 * CSSをサニタイズ
 */
export function sanitizeCSS(css: string): string {
  if (!css || typeof css !== 'string') {
    return ''
  }
  
  return css
    // JavaScript実行を防ぐ
    .replace(/javascript\s*:/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/@import/gi, '')
    .replace(/-moz-binding/gi, '')
    .replace(/behavior\s*:/gi, '')
    
    // 危険なCSS関数を削除
    .replace(/url\s*\(\s*javascript:/gi, 'url(')
    .replace(/url\s*\(\s*data:/gi, 'url(')
    
    // 制御文字を削除
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    
    .trim()
}

/**
 * JSONをサニタイズ
 */
export function sanitizeJSON(obj: any, options: {
  maxDepth?: number
  maxKeys?: number
  allowedKeys?: string[]
  blockedKeys?: string[]
} = {}): any {
  
  const { maxDepth = 10, maxKeys = 100, allowedKeys, blockedKeys } = options
  let keyCount = 0
  
  function sanitizeValue(value: any, depth: number): any {
    // 深度制限
    if (depth > maxDepth) {
      return null
    }
    
    // プリミティブ型の処理
    if (value === null || typeof value !== 'object') {
      if (typeof value === 'string') {
        return sanitizeText(value, 1000) // 文字列は1000文字制限
      }
      return value
    }
    
    // 配列の処理
    if (Array.isArray(value)) {
      return value.slice(0, 100).map(item => sanitizeValue(item, depth + 1))
    }
    
    // オブジェクトの処理
    const sanitized: any = {}
    
    for (const [key, val] of Object.entries(value)) {
      // キー数制限
      if (keyCount++ > maxKeys) {
        break
      }
      
      // 危険なキーをスキップ
      if (key.startsWith('__') || key.includes('prototype') || key.includes('constructor')) {
        continue
      }
      
      // ブロックリストチェック
      if (blockedKeys && blockedKeys.includes(key)) {
        continue
      }
      
      // 許可リストチェック
      if (allowedKeys && !allowedKeys.includes(key)) {
        continue
      }
      
      const sanitizedKey = sanitizeText(key, 100)
      if (sanitizedKey) {
        sanitized[sanitizedKey] = sanitizeValue(val, depth + 1)
      }
    }
    
    return sanitized
  }
  
  return sanitizeValue(obj, 0)
}

/**
 * ファイル名をサニタイズ
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName || typeof fileName !== 'string') {
    return ''
  }
  
  return fileName
    // 危険な文字を削除
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    // ドット始まりを防ぐ
    .replace(/^\.+/, '')
    // 複数のドットを単一に
    .replace(/\.{2,}/g, '.')
    // 空白の正規化
    .replace(/\s+/g, ' ')
    .trim()
    // Windows予約語を回避
    .replace(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, '$1_')
    // 長さ制限
    .substring(0, 255)
}

/**
 * Content Security Policy (CSP) を生成
 */
export function generateCSP(options: {
  allowInlineScripts?: boolean
  allowInlineStyles?: boolean
  allowEval?: boolean
  scriptSources?: string[]
  styleSources?: string[]
  imageSources?: string[]
  connectSources?: string[]
  fontSources?: string[]
  reportUri?: string
} = {}): string {
  
  const {
    allowInlineScripts = false,
    allowInlineStyles = false,
    allowEval = false,
    scriptSources = [],
    styleSources = [],
    imageSources = [],
    connectSources = [],
    fontSources = [],
    reportUri
  } = options
  
  const directives: string[] = []
  
  // デフォルトソース
  directives.push("default-src 'self'")
  
  // スクリプトソース
  let scriptSrc = "'self'"
  if (allowInlineScripts) scriptSrc += " 'unsafe-inline'"
  if (allowEval) scriptSrc += " 'unsafe-eval'"
  if (scriptSources.length > 0) scriptSrc += ' ' + scriptSources.join(' ')
  directives.push(`script-src ${scriptSrc}`)
  
  // スタイルソース
  let styleSrc = "'self'"
  if (allowInlineStyles) styleSrc += " 'unsafe-inline'"
  if (styleSources.length > 0) styleSrc += ' ' + styleSources.join(' ')
  directives.push(`style-src ${styleSrc}`)
  
  // 画像ソース
  let imgSrc = "'self' data: https:"
  if (imageSources.length > 0) imgSrc += ' ' + imageSources.join(' ')
  directives.push(`img-src ${imgSrc}`)
  
  // 接続ソース
  let connectSrc = "'self'"
  if (connectSources.length > 0) connectSrc += ' ' + connectSources.join(' ')
  directives.push(`connect-src ${connectSrc}`)
  
  // フォントソース
  let fontSrc = "'self'"
  if (fontSources.length > 0) fontSrc += ' ' + fontSources.join(' ')
  directives.push(`font-src ${fontSrc}`)
  
  // その他の重要なディレクティブ
  directives.push("object-src 'none'")
  directives.push("base-uri 'self'")
  directives.push("form-action 'self'")
  directives.push("frame-ancestors 'none'")
  directives.push("upgrade-insecure-requests")
  
  // レポートURI
  if (reportUri) {
    directives.push(`report-uri ${reportUri}`)
  }
  
  return directives.join('; ')
}

/**
 * React Component Props のサニタイゼーション
 */
export function sanitizeProps(props: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(props)) {
    // 危険な prop を除外
    if (key.startsWith('on') || key === 'dangerouslySetInnerHTML') {
      continue
    }
    
    if (typeof value === 'string') {
      // className, id などの場合
      if (key === 'className' || key === 'id') {
        sanitized[key] = value.replace(/[^a-zA-Z0-9\-_\s]/g, '')
      }
      // href, src などのURL系の場合
      else if (key === 'href' || key === 'src') {
        sanitized[key] = sanitizeURL(value)
      }
      // その他の文字列
      else {
        sanitized[key] = sanitizeText(value)
      }
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeJSON(value)
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}

/**
 * XSS攻撃パターンを検出
 */
export function detectXSSPatterns(input: string): {
  detected: boolean
  patterns: string[]
  risk: 'low' | 'medium' | 'high'
} {
  
  if (!input || typeof input !== 'string') {
    return { detected: false, patterns: [], risk: 'low' }
  }
  
  const patterns = [
    { pattern: /<script[\s\S]*?>[\s\S]*?<\/script>/gi, name: 'script-tag', risk: 'high' },
    { pattern: /javascript:/gi, name: 'javascript-protocol', risk: 'high' },
    { pattern: /on\w+\s*=/gi, name: 'event-handler', risk: 'high' },
    { pattern: /<iframe/gi, name: 'iframe-tag', risk: 'medium' },
    { pattern: /<object/gi, name: 'object-tag', risk: 'medium' },
    { pattern: /<embed/gi, name: 'embed-tag', risk: 'medium' },
    { pattern: /expression\s*\(/gi, name: 'css-expression', risk: 'medium' },
    { pattern: /vbscript:/gi, name: 'vbscript-protocol', risk: 'medium' },
    { pattern: /data:\s*text\/html/gi, name: 'data-html', risk: 'medium' },
    { pattern: /&#x/gi, name: 'hex-entity', risk: 'low' },
    { pattern: /&\w+;/g, name: 'html-entity', risk: 'low' }
  ]
  
  const detectedPatterns: string[] = []
  let maxRisk: 'low' | 'medium' | 'high' = 'low'
  
  patterns.forEach(({ pattern, name, risk }) => {
    if (pattern.test(input)) {
      detectedPatterns.push(name)
      if (risk === 'high' || (risk === 'medium' && maxRisk === 'low')) {
        maxRisk = risk
      }
    }
  })
  
  return {
    detected: detectedPatterns.length > 0,
    patterns: detectedPatterns,
    risk: maxRisk
  }
}