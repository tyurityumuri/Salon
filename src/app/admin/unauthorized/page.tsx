import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 text-red-500 mb-6">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-primary-900 mb-4">
            アクセス権限がありません
          </h1>
          
          <p className="text-primary-600 mb-8">
            このページにアクセスするには管理者権限が必要です。<br />
            適切な権限を持つアカウントでログインしてください。
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/admin/login" className="block w-full bg-primary-900 text-white py-3 px-6 rounded-md font-medium hover:bg-primary-800 transition-colors duration-300">
            ログインページに戻る
          </Link>
          
          <Link href="/" className="block w-full border-2 border-primary-200 text-primary-700 py-3 px-6 rounded-md font-medium hover:bg-primary-50 transition-colors duration-300">
            サイトトップに戻る
          </Link>
        </div>

        <div className="text-sm text-primary-500">
          <p>権限に関するお問い合わせは、システム管理者にご連絡ください。</p>
        </div>
      </div>
    </div>
  )
}