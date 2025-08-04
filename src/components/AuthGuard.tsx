'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'

interface AuthGuardProps {
  children: ReactNode
  requireAdmin?: boolean
  fallback?: ReactNode
}

export default function AuthGuard({ children, requireAdmin = false, fallback }: AuthGuardProps) {
  const { user, loading, isAuthenticated, isAdmin } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/admin/login')
        return
      }
      
      if (requireAdmin && !isAdmin) {
        router.push('/admin/unauthorized')
        return
      }
    }
  }, [isAuthenticated, isAdmin, loading, router, requireAdmin])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto mb-4"></div>
          <p className="text-primary-600 font-light tracking-wide">認証確認中...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-900 mb-4">認証が必要です</h2>
          <p className="text-primary-600">ログインしてください</p>
        </div>
      </div>
    )
  }

  if (requireAdmin && !isAdmin) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-900 mb-4">アクセス権限がありません</h2>
          <p className="text-primary-600">管理者権限が必要です</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}