import { useCallback, useEffect, useRef, useState } from 'react'

interface Options extends IntersectionObserverInit {
  disabled?: boolean
}

type Callback = (entry: IntersectionObserverEntry) => void

export function useIntersectionObserver(callback: Callback, options?: Options) {
  const [target, setTarget] = useState<HTMLDivElement | null>(null)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const node = target
    const { disabled, ...observerOptions } = options ?? {}

    if (!node || disabled) {
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callbackRef.current(entry)
        }
      })
    }, observerOptions)

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [options, target])

  return useCallback((node: HTMLDivElement | null) => {
    setTarget(node)
  }, [])
}

