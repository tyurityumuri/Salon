'use client'

import React, { useState, useEffect } from 'react'
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

interface WebVitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  description: string
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<WebVitalMetric[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const collectMetrics = async () => {
      const collectedMetrics: WebVitalMetric[] = []

      // Core Web Vitals
      onCLS((metric) => {
        collectedMetrics.push({
          name: 'CLS',
          value: metric.value,
          rating: metric.rating,
          description: 'Cumulative Layout Shift - ページの視覚的安定性',
        })
        setMetrics([...collectedMetrics])
      })

      onINP((metric) => {
        collectedMetrics.push({
          name: 'INP',
          value: metric.value,
          rating: metric.rating,
          description: 'Interaction to Next Paint - インタラクション遅延',
        })
        setMetrics([...collectedMetrics])
      })

      onLCP((metric) => {
        collectedMetrics.push({
          name: 'LCP',
          value: metric.value,
          rating: metric.rating,
          description: 'Largest Contentful Paint - 最大コンテンツ描画',
        })
        setMetrics([...collectedMetrics])
      })

      // その他のメトリクス
      onFCP((metric) => {
        collectedMetrics.push({
          name: 'FCP',
          value: metric.value,
          rating: metric.rating,
          description: 'First Contentful Paint - 最初のコンテンツ描画',
        })
        setMetrics([...collectedMetrics])
      })

      onTTFB((metric) => {
        collectedMetrics.push({
          name: 'TTFB',
          value: metric.value,
          rating: metric.rating,
          description: 'Time to First Byte - 最初のバイトまでの時間',
        })
        setMetrics([...collectedMetrics])
      })

      // 初期ローディング状態を解除
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    }

    collectMetrics()
  }, [])

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-600 bg-green-100'
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-100'
      case 'poor':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatValue = (name: string, value: number) => {
    switch (name) {
      case 'CLS':
        return value.toFixed(3)
      case 'INP':
        return `${Math.round(value)}ms`
      case 'LCP':
      case 'FCP':
      case 'TTFB':
        return `${Math.round(value)}ms`
      default:
        return value.toString()
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">パフォーマンス指標</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">メトリクス収集中...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Web Vitals パフォーマンス指標</h3>
      
      {metrics.length === 0 ? (
        <p className="text-gray-600">メトリクスの収集中です。ページを操作して指標を生成してください。</p>
      ) : (
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{metric.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(metric.rating)}`}>
                    {metric.rating}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{metric.description}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">
                  {formatValue(metric.name, metric.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* パフォーマンス改善のヒント */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">パフォーマンス改善のヒント</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 画像を最適化し、WebP形式を使用する</li>
          <li>• 使用していないJavaScriptとCSSを削除する</li>
          <li>• レスポンシブ画像とlazy loadingを実装する</li>
          <li>• CDNを活用してリソースの配信を高速化する</li>
        </ul>
      </div>
    </div>
  )
}