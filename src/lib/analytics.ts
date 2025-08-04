import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

// Google Analytics 4の設定
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ''

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

// Google Analytics初期化
export const initGA = () => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return

  // Google Analytics スクリプトを動的に読み込み
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
  document.head.appendChild(script1)

  const script2 = document.createElement('script')
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_TRACKING_ID}', {
      page_title: document.title,
      page_location: window.location.href,
    });
  `
  document.head.appendChild(script2)
}

// ページビュー追跡
export const trackPageView = (url: string) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return

  window.gtag?.('config', GA_TRACKING_ID, {
    page_path: url,
    page_title: document.title,
    page_location: window.location.origin + url,
  })
}

// イベント追跡
export const trackEvent = (action: string, category: string = 'general', label?: string, value?: number) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return

  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Web Vitalsの追跡
export const trackWebVitals = () => {
  if (!GA_TRACKING_ID) return

  // Core Web Vitals
  onCLS((metric) => {
    trackEvent('CLS', 'web_vitals', 'CLS', Math.round(metric.value * 1000))
  })

  onINP((metric) => {
    trackEvent('INP', 'web_vitals', 'INP', Math.round(metric.value))
  })

  onLCP((metric) => {
    trackEvent('LCP', 'web_vitals', 'LCP', Math.round(metric.value))
  })

  // その他のメトリクス
  onFCP((metric) => {
    trackEvent('FCP', 'web_vitals', 'FCP', Math.round(metric.value))
  })

  onTTFB((metric) => {
    trackEvent('TTFB', 'web_vitals', 'TTFB', Math.round(metric.value))
  })
}

// カスタムイベント追跡関数
export const analytics = {
  // 予約関連
  bookingStarted: () => trackEvent('booking_started', 'booking'),
  bookingCompleted: (method: string) => trackEvent('booking_completed', 'booking', method),
  
  // ナビゲーション
  navigationClick: (destination: string) => trackEvent('navigation_click', 'navigation', destination),
  
  // スタイリスト関連
  stylistView: (stylistId: string) => trackEvent('stylist_view', 'stylist', stylistId),
  stylistContact: (stylistId: string) => trackEvent('stylist_contact', 'stylist', stylistId),
  
  // コンテンツエンゲージメント
  imageView: (category: string) => trackEvent('image_view', 'content', category),
  menuView: (category: string) => trackEvent('menu_view', 'content', category),
  
  // ソーシャル
  socialClick: (platform: string) => trackEvent('social_click', 'social', platform),
  
  // エラー追跡
  error: (errorMessage: string, errorPage: string) => 
    trackEvent('error', 'error', `${errorPage}: ${errorMessage}`),
}