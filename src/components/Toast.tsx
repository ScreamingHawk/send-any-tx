import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  onClose: () => void
  duration?: number
}

export const Toast = ({ message, onClose, duration = 2000 }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger fade-in after mount using requestAnimationFrame
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onClose()
      }, 200) // Wait for fade-out transition
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className="bg-retro-surface border-4 border-retro-secondary text-retro-secondary px-6 py-3 font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(78,205,196,0.5)]">
        {message}
      </div>
    </div>
  )
}
