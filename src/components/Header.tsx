'use client'

import { useState } from 'react'
import Link from 'next/link'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { name: 'STYLISTS', href: '/stylists' },
    { name: 'STYLES', href: '/styles' },
    { name: 'MENU', href: '/menu' },
    { name: 'ACCESS', href: '/access' },

  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-white/20">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="font-heading text-2xl lg:text-3xl font-light tracking-[0.2em] text-primary-900 hover:text-accent-600 transition-colors duration-300">
            NAGASE
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-12">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs font-medium tracking-[0.15em] text-primary-700 hover:text-primary-900 transition-colors duration-300 relative group uppercase"
              >
                {item.name}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-accent-600 transition-all duration-500 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Booking CTA - Desktop */}
          <div className="hidden lg:block">
            <Link
              href="https://beauty.hotpepper.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-accent-600 to-accent-700 text-white px-6 py-3 rounded-full font-medium text-sm tracking-wider hover:from-accent-700 hover:to-accent-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              WEB予約
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-primary-700 hover:text-primary-900 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="メニューを開く"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-primary-100">
            <nav className="container-custom py-8">
              <div className="flex flex-col space-y-6">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-base font-medium text-primary-700 hover:text-primary-900 transition-colors duration-300 uppercase border-b border-primary-100 pb-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="https://beauty.hotpepper.jp/" target="_blank" rel="noopener noreferrer"
                  className="btn-primary mt-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  BOOK NOW
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header