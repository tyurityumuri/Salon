'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initGA, trackPageView, trackWebVitals } from '@/lib/analytics'

export default function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    // Google Analytics初期化
    initGA()
    
    // Web Vitals追跡開始
    trackWebVitals()
  }, [])

  useEffect(() => {
    // ページ変更時のトラッキング
    if (pathname) {
      trackPageView(pathname)
    }
  }, [pathname])

  return null
}

// エラーバウンダリーでエラーを追跡するコンポーネント
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

export class AnalyticsErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error?: Error }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // エラーをGAに送信
    if (typeof window !== 'undefined') {
      import('@/lib/analytics').then(({ analytics }) => {
        analytics.error(error.message, window.location.pathname)
      })
    }
    console.error('Analytics Error Boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback
      if (FallbackComponent && this.state.error) {
        return <FallbackComponent 
          error={this.state.error} 
          reset={() => this.setState({ hasError: false, error: undefined })} 
        />
      }
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">何かエラーが発生しました</h2>
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              もう一度試す
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}