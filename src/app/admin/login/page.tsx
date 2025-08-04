'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthContext()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      router.push('/admin/dashboard')
    } catch (err: any) {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="font-heading text-3xl font-light tracking-[0.2em] text-primary-900 hover:text-accent-600 transition-colors duration-300">
            NAGASE
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-primary-900">
            管理画面ログイン
          </h2>
          <p className="mt-2 text-sm text-primary-600">
            管理者アカウントでログインしてください
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-2">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full px-3 py-3 border border-primary-200 placeholder-primary-400 text-primary-900 rounded-md focus:outline-none focus:ring-accent-600 focus:border-accent-600 focus:z-10 sm:text-sm"
                placeholder="admin@nagase-salon.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary-700 mb-2">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-3 py-3 border border-primary-200 placeholder-primary-400 text-primary-900 rounded-md focus:outline-none focus:ring-accent-600 focus:border-accent-600 focus:z-10 sm:text-sm"
                placeholder="パスワードを入力"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-900 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ログイン中...
                </div>
              ) : (
                'ログイン'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-primary-600 hover:text-primary-900 transition-colors duration-300">
              サイトトップに戻る
            </Link>
          </div>
        </form>

        <div className="mt-8 p-4 bg-accent-50 rounded-md">
          <h3 className="text-sm font-medium text-accent-800 mb-2">デモアカウント</h3>
          <p className="text-xs text-accent-700">
            Email: admin@nagase-salon.com<br />
            Password: salon123
          </p>
        </div>
      </div>
    </div>
  )
}