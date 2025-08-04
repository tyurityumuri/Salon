'use client'

import { useEffect, useState } from 'react'
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth'
import { auth, isFirebaseEnabled } from '@/lib/firebase'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  role?: 'admin' | 'staff' | 'user'
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isFirebaseEnabled) {
      // Firebase未設定時はデモ認証を使用
      const demoAuth = localStorage.getItem('adminAuth')
      if (demoAuth === 'true') {
        setUser({
          uid: 'demo-user',
          email: 'admin@nagase-salon.com',
          displayName: 'Demo Admin',
          role: 'admin',
        })
      } else {
        setUser(null)
      }
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: 'admin', // デフォルトで管理者権限（実際は Firestore から取得）
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<UserCredential | any> => {
    try {
      setError(null)
      setLoading(true)
      
      if (!isFirebaseEnabled) {
        // Firebase未設定時はデモ認証を使用
        if (email === 'admin@nagase-salon.com' && password === 'salon123') {
          localStorage.setItem('adminAuth', 'true')
          setUser({
            uid: 'demo-user',
            email: 'admin@nagase-salon.com',
            displayName: 'Demo Admin',
            role: 'admin',
          })
          return { user: { email } } // Firebaseの戻り値を模擬
        } else {
          throw new Error('メールアドレスまたはパスワードが間違っています')
        }
      }
      
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setError(null)
      
      if (!isFirebaseEnabled) {
        // Firebase未設定時はlocalStorageをクリア
        localStorage.removeItem('adminAuth')
        setUser(null)
        return
      }
      
      await signOut(auth)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  }
}