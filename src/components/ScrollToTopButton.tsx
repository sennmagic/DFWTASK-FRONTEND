import { useEffect, useState } from 'react'

interface ScrollToTopButtonProps {
  threshold?: number
}

export function ScrollToTopButton({ threshold = 400 }: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={[
        'fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/90 px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-indigo-950/30 backdrop-blur transition-all duration-300',
        'hover:-translate-y-1 hover:bg-indigo-400/90',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
        isVisible ? 'pointer-events-auto opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-4',
      ].join(' ')}
      aria-label="Scroll back to top"
      title="Back to top"
    >
      <svg
        className="size-4 rounded-full bg-indigo-400/30 p-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
      Top
    </button>
  )
}

