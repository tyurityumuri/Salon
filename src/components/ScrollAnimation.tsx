'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollAnimationProps {
  children: React.ReactNode
  animation?: string
  delay?: number
  threshold?: number
  className?: string
}

const ScrollAnimation = ({ 
  children, 
  animation = 'animate-fade-in', 
  delay = 0,
  threshold = 0.1,
  className = ''
}: ScrollAnimationProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentRef = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold }
    )

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [delay, threshold])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? animation : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default ScrollAnimation